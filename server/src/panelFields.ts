/**
 * Request and response field names for the endpoints whose payload shape the
 * brief did not spell out. `/data` is exact — it documents `token` and
 * `bagian` — everything below is a best guess.
 *
 * Each one is overridable by environment variable so a mismatch found in
 * staging is a config change, not a redeploy. Response readers additionally
 * try a list of candidates before giving up.
 */

const env = (name: string, fallback: string) => process.env[name] || fallback;

export const PANEL_FIELDS = {
  /** Body key naming the customer on `/otp/kirim` and `/otp/periksa`. */
  otpIdentifier: env('WINNET_FIELD_OTP_IDENTIFIER', 'identifier'),
  /** Body key carrying the typed OTP on `/otp/periksa`. */
  otpCode: env('WINNET_FIELD_OTP_CODE', 'kode'),
  /** Body key carrying a remember-me token on `/ingat/pulihkan` & `/cabut`. */
  rememberToken: env('WINNET_FIELD_REMEMBER_TOKEN', 'token'),
  /** Body keys for `/tulis/lapor`. */
  laporKategori: env('WINNET_FIELD_LAPOR_KATEGORI', 'kategori'),
  laporKeterangan: env('WINNET_FIELD_LAPOR_KETERANGAN', 'keterangan'),
  /** Body key for `/tulis/upgrade`. */
  upgradePaket: env('WINNET_FIELD_UPGRADE_PAKET', 'paket_id'),
  /** Body keys for `/tulis/speedtest`. */
  speedDown: env('WINNET_FIELD_SPEED_DOWN', 'download'),
  speedUp: env('WINNET_FIELD_SPEED_UP', 'upload'),
  speedLatency: env('WINNET_FIELD_SPEED_LATENCY', 'latency'),
} as const;

/** Response keys a session token might arrive under. */
export const SESSION_TOKEN_KEYS = [
  'token',
  'session_token',
  'sesi',
  'access_token',
  'token_sesi',
];

/** Response keys a remember-me token might arrive under. */
export const REMEMBER_TOKEN_KEYS = [
  'token',
  'remember_token',
  'token_ingat',
  'ingat',
];

/** Response keys naming where an OTP was delivered. */
export const OTP_DESTINATION_KEYS = [
  'tujuan',
  'nomor',
  'destination',
  'sent_to',
  'whatsapp',
  'no_hp',
];

/** Response keys carrying a cooldown in seconds. */
export const RETRY_AFTER_KEYS = [
  'retry_after',
  'retryAfter',
  'tunggu',
  'cooldown',
];
