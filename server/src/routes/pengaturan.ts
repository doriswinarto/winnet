import { Router } from 'express';
import { callPanel, PANEL_PATHS } from '../panel.js';
import { normalizeSettings } from '../normalize.js';
import { sendPanelError } from './errors.js';

export const pengaturanRouter = Router();

const CACHE_MS = 5 * 60 * 1000;
let cached: { at: number; value: unknown } | null = null;

/**
 * Branding for the login screen. Called without a session token — it is what
 * the app shows before anyone has logged in.
 *
 * The panel deliberately answers with a whitelist of settings rather than the
 * settings table, because that table also holds the WhatsApp token and payment
 * gateway credentials. We pass on only the normalised fields for the same
 * reason: if the panel's whitelist ever widens by accident, nothing extra
 * reaches the browser from here.
 */
pengaturanRouter.post('/pengaturan', async (_req, res) => {
  if (cached && Date.now() - cached.at < CACHE_MS) {
    res.json(cached.value);
    return;
  }

  try {
    const payload = await callPanel(PANEL_PATHS.pengaturan, {});
    const value = normalizeSettings(payload);
    cached = { at: Date.now(), value };
    res.json(value);
  } catch (err) {
    // Branding is not worth blocking a login over; serve the last good copy.
    if (cached) {
      res.json(cached.value);
      return;
    }
    sendPanelError(res, err);
  }
});
