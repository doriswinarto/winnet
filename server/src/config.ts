/**
 * Environment. Read once at boot and validated, so a misconfigured deployment
 * fails immediately rather than at the first customer request.
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `${name} is not set. The portal node cannot start without it — ` +
        `see server/.env.example.`,
    );
  }
  return v;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const config = {
  port: Number(optional('PORT', '8787')),

  /**
   * Portal API key. Server-side only — it must never be sent to the browser,
   * bundled, or logged. The panel additionally binds it to this machine's IP
   * (Daftar IP), so a copy taken from here is useless from anywhere else.
   */
  apiKey: required('WINNET_PORTAL_API_KEY'),

  panelBaseUrl: optional(
    'WINNET_PANEL_BASE_URL',
    'https://registrasi.winartha.net.id',
  ),

  /** Upstream timeout, ms. Keeps a slow panel from pinning our sockets. */
  panelTimeoutMs: Number(optional('WINNET_PANEL_TIMEOUT_MS', '10000')),

  /** Directory of the built SPA, served same-origin so cookies just work. */
  staticDir: optional('WINNET_STATIC_DIR', '../app/dist'),

  isProduction: process.env.NODE_ENV === 'production',

  /**
   * Set false only when terminating TLS elsewhere in a way that makes Secure
   * cookies undeliverable in development. Never false in production.
   */
  secureCookies: optional('WINNET_SECURE_COOKIES', 'true') !== 'false',

  /** Session cookie lifetime, seconds. */
  sessionTtl: Number(optional('WINNET_SESSION_TTL', String(60 * 60 * 12))),

  /** Remember-me cookie lifetime, seconds. */
  rememberTtl: Number(optional('WINNET_REMEMBER_TTL', String(60 * 60 * 24 * 30))),

  /** OTP sends allowed per identifier per window. WhatsApp costs money. */
  otpMaxPerWindow: Number(optional('WINNET_OTP_MAX', '3')),
  otpWindowSec: Number(optional('WINNET_OTP_WINDOW_SEC', '900')),

  /**
   * OTP sends allowed per source IP per window. Deliberately much looser than
   * the per-identifier limit: mobile carriers here put many customers behind
   * one CGNAT address, so a tight IP limit locks out real people who happen to
   * share an exit node. It still bounds enumeration by a single caller.
   */
  otpMaxPerIp: Number(optional('WINNET_OTP_MAX_IP', '30')),

  /** Trust N proxy hops for client IP. 0 when the node is directly exposed. */
  trustProxy: Number(optional('WINNET_TRUST_PROXY', '0')),
};

export type Config = typeof config;
