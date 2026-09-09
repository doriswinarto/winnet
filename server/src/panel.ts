import { config } from './config.js';

/**
 * The only place that talks to the panel, and the only place that knows the
 * API key. Nothing here is reachable from the browser except through the
 * routes, which validate first.
 */

export const PANEL_PATHS = {
  data: '/api/v1/portal/data',
  pengaturan: '/api/v1/portal/pengaturan',
  otpKirim: '/api/v1/portal/otp/kirim',
  otpPeriksa: '/api/v1/portal/otp/periksa',
  ingatTerbitkan: '/api/v1/portal/ingat/terbitkan',
  ingatPulihkan: '/api/v1/portal/ingat/pulihkan',
  ingatCabut: '/api/v1/portal/ingat/cabut',
  tulisLapor: '/api/v1/portal/tulis/lapor',
  tulisUpgrade: '/api/v1/portal/tulis/upgrade',
  tulisSpeedtest: '/api/v1/portal/tulis/speedtest',
} as const;

export class PanelError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly retryAfter?: number,
  ) {
    super(message);
    this.name = 'PanelError';
  }

  /**
   * What the browser is allowed to see. Upstream text may name internal hosts
   * or reveal whether an identifier exists, so only the shape is passed on.
   */
  get publicMessage(): string {
    if (this.status === 401 || this.status === 403) return 'Sesi tidak valid.';
    if (this.status === 404) return 'Data tidak ditemukan.';
    if (this.status === 429) return 'Terlalu banyak permintaan.';
    if (this.status >= 500) return 'Layanan sedang bermasalah.';
    return 'Permintaan tidak dapat diproses.';
  }
}

/**
 * A leaked key is only useful from an allowlisted IP, so the panel rejects
 * calls from anywhere else. That is the point of the Daftar IP requirement:
 * this process is the single place the key is ever presented from.
 */
export async function callPanel<T = unknown>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.panelTimeoutMs);

  let res: Response;
  try {
    res = await fetch(config.panelBaseUrl + path, {
      method: 'POST',
      headers: {
        'X-API-Key': config.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    throw new PanelError(504, aborted ? 'panel timeout' : 'panel unreachable');
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new PanelError(502, 'panel returned non-JSON');
    }
  }

  if (!res.ok) {
    const retryHeader = Number(res.headers.get('Retry-After'));
    const detail =
      parsed && typeof parsed === 'object' && 'error' in parsed
        ? String((parsed as { error: unknown }).error)
        : res.statusText;
    throw new PanelError(
      res.status,
      detail,
      Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader : undefined,
    );
  }

  return parsed as T;
}
