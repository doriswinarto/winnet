import type {
  DataRequest,
  DataResponse,
  LaporRequest,
  OtpSendRequest,
  OtpSendResult,
  OtpVerifyRequest,
  PortalSettings,
  SessionState,
  SpeedtestRequest,
  UpgradeRequest,
} from '@shared/portal';

/**
 * Client for the portal node.
 *
 * There is no API key here and there never should be: the panel key is bound
 * to the node's IP, and anything in this file ships to every visitor's
 * browser. The session lives in an httpOnly cookie the browser attaches on its
 * own, which is why nothing below handles a token.
 */

const BASE = '/bff';

export class BffError extends Error {
  readonly status: number;
  readonly retryAfter?: number;

  constructor(status: number, message: string, retryAfter?: number) {
    super(message);
    this.name = 'BffError';
    this.status = status;
    this.retryAfter = retryAfter;
  }

  /** The session expired and the customer has to log in again. */
  get isUnauthenticated(): boolean {
    return this.status === 401;
  }
}

async function request<T>(
  path: string,
  body?: unknown,
  init?: { method?: string; signal?: AbortSignal },
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method: init?.method ?? 'POST',
      // Same origin in production; the dev server proxies /bff so the cookie
      // is first-party either way.
      credentials: 'same-origin',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: init?.signal,
    });
  } catch {
    throw new BffError(0, 'Tidak dapat menghubungi server.');
  }

  const text = await res.text();
  const parsed: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const detail =
      parsed && typeof parsed === 'object' && 'error' in parsed
        ? String((parsed as { error: unknown }).error)
        : 'Permintaan gagal.';
    const retry =
      parsed && typeof parsed === 'object' && 'retryAfter' in parsed
        ? Number((parsed as { retryAfter: unknown }).retryAfter)
        : undefined;
    throw new BffError(res.status, detail, retry);
  }

  return parsed as T;
}

/* ============================================================== branding */

export function fetchSettings(signal?: AbortSignal): Promise<PortalSettings> {
  return request<PortalSettings>('/pengaturan', {}, { signal });
}

/* ================================================================== auth */

export function sendOtp(body: OtpSendRequest): Promise<OtpSendResult> {
  return request<OtpSendResult>('/otp/kirim', body);
}

export function verifyOtp(body: OtpVerifyRequest): Promise<SessionState> {
  return request<SessionState>('/otp/periksa', body);
}

/** Turns a stored "ingat saya" token back into a session, if there is one. */
export function restoreSession(signal?: AbortSignal): Promise<SessionState> {
  return request<SessionState>('/sesi/pulihkan', {}, { signal });
}

export function logout(): Promise<SessionState> {
  return request<SessionState>('/keluar', {});
}

/* ================================================================== data */

export function fetchData(
  body: DataRequest,
  signal?: AbortSignal,
): Promise<DataResponse> {
  return request<DataResponse>('/data', body, { signal });
}

/* ================================================================ writes */

export function reportFault(body: LaporRequest): Promise<{ ok: true }> {
  return request<{ ok: true }>('/lapor', body);
}

export function requestUpgrade(body: UpgradeRequest): Promise<{ ok: true }> {
  return request<{ ok: true }>('/upgrade', body);
}

/**
 * `/tulis/speedtest` is wired end to end, but the design has no speed-test
 * screen — the Service Status gauge is a passive reading, not a test the
 * customer runs. Kept so the client covers the documented API surface.
 */
export function saveSpeedtest(body: SpeedtestRequest): Promise<{ ok: true }> {
  return request<{ ok: true }>('/speedtest', body);
}
