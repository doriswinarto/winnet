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

function baseOptions(maxAgeSec: number) {
  return {
    httpOnly: true,
    secure: config.secureCookies,
    // The SPA is served by this same node, so the cookie is never needed on a
    // cross-site request; Strict costs nothing here and blocks CSRF outright.
    sameSite: 'strict' as const,
    path: '/',
    maxAge: maxAgeSec * 1000,
  };
}

export function setSessionToken(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, baseOptions(config.sessionTtl));
}

export function getSessionToken(req: Request): string | undefined {
  const v = req.cookies?.[SESSION_COOKIE];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

export function setRememberToken(res: Response, token: string): void {
  res.cookie(REMEMBER_COOKIE, token, {
    ...baseOptions(config.rememberTtl),
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
