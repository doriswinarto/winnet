import { Router } from 'express';
import type { OtpSendResult, SessionState } from '../../../shared/portal.js';
import { config } from '../config.js';
import { asRecord, pick } from '../fields.js';
import { samarkanNomor } from '../format.js';
import { otpSendSchema, otpVerifySchema } from '../guard.js';
import { callPanel, PANEL_PATHS, PanelError } from '../panel.js';
import {
  OTP_DESTINATION_KEYS,
  PANEL_FIELDS,
  REMEMBER_TOKEN_KEYS,
  RETRY_AFTER_KEYS,
  SESSION_TOKEN_KEYS,
} from '../panelFields.js';
import { consume } from '../ratelimit.js';
import {
  clearSession,
  getRememberToken,
  getSessionToken,
  setRememberToken,
  setSessionToken,
} from '../session.js';
import { sendPanelError } from './errors.js';

export const authRouter = Router();

function tokenFrom(payload: unknown, keys: string[]): string | null {
  const r = asRecord(payload);
  const v = pick(r, keys);
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function clientIp(req: { ip?: string }): string {
  return req.ip || 'unknown';
}

/* ------------------------------------------------------------- send OTP */

authRouter.post('/otp/kirim', async (req, res) => {
  const parsed = otpSendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Nomor atau ID pelanggan tidak valid.' });
    return;
  }
  const { identifier } = parsed.data;

  // Two limits with different jobs: the per-identifier one stops a single
  // customer's phone being flooded, the looser per-IP one stops one caller
  // walking a list of identifiers without punishing everyone behind a carrier
  // NAT for the first person through it.
  const limits: [string, number][] = [
    [`otp:id:${identifier}`, config.otpMaxPerWindow],
    [`otp:ip:${clientIp(req)}`, config.otpMaxPerIp],
  ];
  for (const [key, max] of limits) {
    const { allowed, retryAfter } = consume(key, max, config.otpWindowSec);
    if (!allowed) {
      res.status(429).json({
        error: 'Terlalu sering meminta kode. Coba lagi nanti.',
        retryAfter,
      });
      return;
    }
  }

  try {
    const payload = await callPanel(PANEL_PATHS.otpKirim, {
      [PANEL_FIELDS.otpIdentifier]: identifier,
    });
    const r = asRecord(payload);
    const dest = pick(r, OTP_DESTINATION_KEYS);
    const retry = pick(r, RETRY_AFTER_KEYS);
    const result: OtpSendResult = {
      // Masked again on our side even if the panel returned it in full — this
      // response is shown before anyone has proved who they are.
      sentTo: typeof dest === 'string' ? samarkanNomor(dest) : '•••',
      retryAfter: Number(retry) > 0 ? Number(retry) : 60,
    };
    res.json(result);
  } catch (err) {
    // A wrong identifier must look exactly like a right one, or this endpoint
    // becomes a way to test whether someone is a customer.
    if (err instanceof PanelError && err.status === 404) {
      res.json({ sentTo: '•••', retryAfter: 60 } satisfies OtpSendResult);
      return;
    }
    sendPanelError(res, err);
  }
});

/* ----------------------------------------------------------- verify OTP */

authRouter.post('/otp/periksa', async (req, res) => {
  const parsed = otpVerifySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Kode OTP tidak valid.' });
    return;
  }
  const { identifier, code, ingatSaya } = parsed.data;

  const { allowed, retryAfter } = consume(
    `otpcheck:${identifier}`,
    10,
    config.otpWindowSec,
  );
  if (!allowed) {
    res.status(429).json({ error: 'Terlalu banyak percobaan.', retryAfter });
    return;
  }

  try {
    const payload = await callPanel(PANEL_PATHS.otpPeriksa, {
      [PANEL_FIELDS.otpIdentifier]: identifier,
      [PANEL_FIELDS.otpCode]: code,
    });
    const token = tokenFrom(payload, SESSION_TOKEN_KEYS);
    if (!token) {
      console.error(
        '[panel] otp/periksa returned no recognisable session token; ' +
          `tried: ${SESSION_TOKEN_KEYS.join(', ')}`,
      );
      res.status(502).json({ error: 'Layanan sedang bermasalah.' });
      return;
    }

    setSessionToken(res, token);

    if (ingatSaya) {
      // Best effort: failing to issue a remember token must not fail the login
      // the customer just completed.
      try {
        const remembered = await callPanel(PANEL_PATHS.ingatTerbitkan, { token });
        const rt = tokenFrom(remembered, REMEMBER_TOKEN_KEYS);
        if (rt) setRememberToken(res, rt);
      } catch (err) {
        console.error('[panel] ingat/terbitkan failed', err);
      }
    }

    res.json({ authenticated: true } satisfies SessionState);
  } catch (err) {
    if (err instanceof PanelError && (err.status === 400 || err.status === 401)) {
      res.status(401).json({ error: 'Kode OTP salah atau kedaluwarsa.' });
      return;
    }
    sendPanelError(res, err);
  }
});

/* ------------------------------------------------------- restore session */

authRouter.post('/sesi/pulihkan', async (req, res) => {
  if (getSessionToken(req)) {
    res.json({ authenticated: true } satisfies SessionState);
    return;
  }

  const remember = getRememberToken(req);
  if (!remember) {
    res.json({ authenticated: false } satisfies SessionState);
    return;
  }

  try {
    const payload = await callPanel(PANEL_PATHS.ingatPulihkan, {
      [PANEL_FIELDS.rememberToken]: remember,
    });
    const token = tokenFrom(payload, SESSION_TOKEN_KEYS);
    if (!token) {
      clearSession(res);
      res.json({ authenticated: false } satisfies SessionState);
      return;
    }
    setSessionToken(res, token);
    // A panel that rotates the remember token on use hands back a new one.
    const rotated = tokenFrom(payload, REMEMBER_TOKEN_KEYS);
    if (rotated && rotated !== token) setRememberToken(res, rotated);

    res.json({ authenticated: true, restored: true } satisfies SessionState);
  } catch (err) {
    // An expired or revoked remember token is a normal state, not an error.
    if (err instanceof PanelError && err.status < 500) {
      clearSession(res);
      res.json({ authenticated: false } satisfies SessionState);
      return;
    }
    sendPanelError(res, err);
  }
});

/* ----------------------------------------------------------------- state */

authRouter.get('/sesi', (req, res) => {
  res.json({ authenticated: !!getSessionToken(req) } satisfies SessionState);
});

/* ---------------------------------------------------------------- logout */

authRouter.post('/keluar', async (req, res) => {
  const remember = getRememberToken(req);
  // Clear our cookies first: the customer is logged out of this browser even
  // if the panel call fails.
  clearSession(res);

  if (remember) {
    try {
      await callPanel(PANEL_PATHS.ingatCabut, {
        [PANEL_FIELDS.rememberToken]: remember,
      });
    } catch (err) {
      console.error('[panel] ingat/cabut failed', err);
    }
  }

  res.json({ authenticated: false } satisfies SessionState);
});
