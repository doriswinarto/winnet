import type { Response } from 'express';
import { PanelError } from '../panel.js';

/**
 * Turns an upstream failure into something safe to show a customer. Upstream
 * text can name internal hosts or say whether an identifier exists, so only
 * the shape crosses the boundary; the detail goes to our log instead.
 */
export function sendPanelError(res: Response, err: unknown): void {
  if (err instanceof PanelError) {
    console.error(`[panel] ${err.status} ${err.message}`);
    // A rejected session token is the customer's problem to fix by logging in
    // again; anything else upstream is ours, and is reported as a bad gateway
    // rather than passed through as though the browser did something wrong.
    const status =
      err.status === 401 || err.status === 403
        ? 401
        : err.status === 404
          ? 404
          : err.status === 429
            ? 429
            : 502;
    const body: { error: string; retryAfter?: number } = {
      error: err.publicMessage,
    };
    if (err.retryAfter) body.retryAfter = err.retryAfter;
    res.status(status).json(body);
    return;
  }

  console.error('[bff] unexpected error', err);
  res.status(500).json({ error: 'Terjadi kesalahan.' });
}
