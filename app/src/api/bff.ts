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
import { isNative, platform } from './platform';

/**
 * Client for the portal node.
 *
 * There is no API key here and there never should be: the panel key is bound
 * to the node's IP, and anything in this file ships to every visitor's
 * browser. The session lives in an httpOnly cookie the browser attaches on its
 * own, which is why nothing below handles a token.
 */

/**
 * Where the portal node lives.
 *
 * In a browser the app is served by the node itself, so a relative path keeps
 * everything same-origin. In the Android build the WebView serves the bundle
 * from `https://localhost`, where `/bff` would resolve inside the APK — so the
 * native build needs the node's absolute public origin.
 *
 * `VITE_PORTAL_ORIGIN` is a public URL, not a secret. The panel API key is
 * still server-side only and must never appear in this package.
 */
const NATIVE_ORIGIN = (import.meta.env.VITE_PORTAL_ORIGIN ?? '').replace(
  /\/+$/,
  '',
);

const BASE = isNative() ? `${NATIVE_ORIGIN}/bff` : '/bff';

if (isNative() && !NATIVE_ORIGIN) {
  // Fail loudly at boot rather than with a confusing 404 on first request.
  throw new Error(
    'VITE_PORTAL_ORIGIN must be set for the native build — it is the public ' +
      'https origin of the portal node.',
  );
}

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
      // Browser: same-origin (the node serves the bundle, and the dev server
      // proxies /bff), so the cookie is first-party. Native: CapacitorHttp
      // sends this through Android's HTTP stack and its cookie jar, which
      // needs 'include' since the origin differs from the WebView's.
      credentials: isNative() ? 'include' : 'same-origin',
      headers: {
        ...(body === undefined
          ? {}
          : { 'Content-Type': 'application/json' }),
        // Tells the node this is the app, not a browser tab, so it issues a
        // cookie Android's CookieManager will send back. A web page cannot
        // forge this: a custom header cross-origin needs a CORS preflight,
        // and the node grants no CORS.
        ...(isNative() ? { 'X-WinNet-Client': platform() } : {}),
      },
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
