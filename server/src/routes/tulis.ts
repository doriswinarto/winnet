import { Router } from 'express';
import { laporSchema, speedtestSchema, upgradeSchema } from '../guard.js';
import { callPanel, PANEL_PATHS } from '../panel.js';
import { PANEL_FIELDS } from '../panelFields.js';
import { consume } from '../ratelimit.js';
import { requireSession } from '../session.js';
import { sendPanelError } from './errors.js';

export const tulisRouter = Router();

/** Writes create real records — a ticket, an upgrade request — so each one is
 *  capped per session to stop a stuck client filling the panel with rows. */
function limited(res: Parameters<typeof sendPanelError>[0], key: string, max: number) {
  const { allowed, retryAfter } = consume(key, max, 3600);
  if (!allowed) {
    res.status(429).json({ error: 'Terlalu banyak pengajuan.', retryAfter });
    return false;
  }
  return true;
}

/** A session token is opaque; hashing keeps it out of the limiter's key space. */
function sessionKey(token: string): string {
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) | 0;
  return String(h);
}

tulisRouter.post('/lapor', async (req, res) => {
  const token = requireSession(req, res);
  if (!token) return;

  const parsed = laporSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Laporan tidak lengkap.' });
    return;
  }
  if (!limited(res, `lapor:${sessionKey(token)}`, 5)) return;

  try {
    const result = await callPanel(PANEL_PATHS.tulisLapor, {
      token,
      [PANEL_FIELDS.laporKategori]: parsed.data.kategori,
      [PANEL_FIELDS.laporKeterangan]: parsed.data.keterangan,
    });
    res.json({ ok: true, result });
  } catch (err) {
    sendPanelError(res, err);
  }
});

tulisRouter.post('/upgrade', async (req, res) => {
  const token = requireSession(req, res);
  if (!token) return;

  const parsed = upgradeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Paket tidak dikenali.' });
    return;
  }
  if (!limited(res, `upgrade:${sessionKey(token)}`, 5)) return;

  try {
    const result = await callPanel(PANEL_PATHS.tulisUpgrade, {
      token,
      [PANEL_FIELDS.upgradePaket]: parsed.data.paketId,
    });
    res.json({ ok: true, result });
  } catch (err) {
    sendPanelError(res, err);
  }
});

tulisRouter.post('/speedtest', async (req, res) => {
  const token = requireSession(req, res);
  if (!token) return;

  const parsed = speedtestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Hasil uji tidak valid.' });
    return;
  }
  if (!limited(res, `speedtest:${sessionKey(token)}`, 20)) return;

  const body: Record<string, unknown> = {
    token,
    [PANEL_FIELDS.speedDown]: parsed.data.downloadMbps,
    [PANEL_FIELDS.speedUp]: parsed.data.uploadMbps,
  };
  if (parsed.data.latencyMs !== undefined) {
    body[PANEL_FIELDS.speedLatency] = parsed.data.latencyMs;
  }

  try {
    await callPanel(PANEL_PATHS.tulisSpeedtest, body);
    res.json({ ok: true });
  } catch (err) {
    sendPanelError(res, err);
  }
});
