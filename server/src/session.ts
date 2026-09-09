import type { Request, Response } from 'express';
import { config } from './config.js';

/**
 * Session and remember-me tokens live in httpOnly cookies, never in a JSON
 * response and never in localStorage. Script on the page cannot read them, so
 * an XSS bug cannot walk off with a customer's session; it also means the
 * browser attaches them automatically and no screen has to handle a token.
 */

const SESSION_COOKIE = 'winnet_sesi';
const REMEMBER_COOKIE = 'winnet_ingat';

/** Header the Android build sends so we can tell it apart from a browser. */
export const NATIVE_CLIENT_HEADER = 'x-winnet-client';

/**
 * The Android WebView serves the bundle from `https://localhost`, so from
 * Android's CookieManager the portal node is a *different* site and a
 * `SameSite=Strict` cookie would never be sent back.
 *
 * Rather than relax the cookie for everyone, the native build identifies
 * itself with a custom header and only those responses get `SameSite=None`.
 * A browser cannot forge that: a custom header on a cross-origin request
 * requires a CORS preflight, and this node grants no CORS at all — so a
 * hostile page cannot cause a `None` cookie to be issued, and browser
 * sessions keep Strict's free CSRF protection.
 */
function isNativeClient(req: Request): boolean {
  const v = req.headers[NATIVE_CLIENT_HEADER];
  return typeof v === 'string' && v.length > 0;
}

function baseOptions(req: Request, maxAgeSec: number) {
  const native = isNativeClient(req);
  return {
    httpOnly: true,
    // SameSite=None is only valid on a Secure cookie, and the native build
    // talks to the node over TLS regardless of this setting.
    secure: native ? true : config.secureCookies,
    sameSite: native ? ('none' as const) : ('strict' as const),
    path: '/',
    maxAge: maxAgeSec * 1000,
  };
}

export function setSessionToken(
  req: Request,
  res: Response,
  token: string,
): void {
  res.cookie(SESSION_COOKIE, token, baseOptions(req, config.sessionTtl));
}

export function getSessionToken(req: Request): string | undefined {
  const v = req.cookies?.[SESSION_COOKIE];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

export function setRememberToken(
  req: Request,
  res: Response,
  token: string,
): void {
  res.cookie(REMEMBER_COOKIE, token, {
    ...baseOptions(req, config.rememberTtl),
    // Only ever replayed against the restore endpoint.
    path: '/bff/sesi',
  });
}

export function getRememberToken(req: Request): string | undefined {
  const v = req.cookies?.[REMEMBER_COOKIE];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

export function clearSession(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.clearCookie(REMEMBER_COOKIE, { path: '/bff/sesi' });
}

/** Reads the session token or ends the request with 401. */
export function requireSession(req: Request, res: Response): string | null {
  const token = getSessionToken(req);
  if (!token) {
    res.status(401).json({ error: 'Sesi berakhir. Silakan masuk kembali.' });
    return null;
  }
  return token;
}
