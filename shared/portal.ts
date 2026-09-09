/**
 * The contract between the portal node and the browser.
 *
 * The browser never sees a panel payload. The node fetches from the panel,
 * validates and normalises, and hands back only the view models below. That
 * keeps panel field names — which we do not control — out of every screen, and
 * means a panel change is a one-file fix in `server/src/normalize.ts`.
 */

/* ======================================================== panel vocabulary */

/**
 * The sections `/api/v1/portal/data` accepts. Cross-customer lookup is
 * deliberately absent from the panel's list; do not add anything here that the
 * panel does not itself allow.
 */
export const SECTIONS = [
  'customer',
  'unpaidInvoices',
  'currentInvoice',
  'invoice',
  'invoiceItems',
  'paymentOf',
  'payments',
  'usageByMonth',
  'liveSession',
  'offerablePackages',
  'pendingUpgrade',
  'tickets',
  'networkNotices',
  'paymentMethods',
  'paymentOutlets',
] as const;

export type Section = (typeof SECTIONS)[number];

/** Panel-side caps on numeric arguments, mirrored so the node clamps too. */
export const MAX_LIMIT = 100;
export const MAX_MONTHS = 24;

/* ============================================================ view models */

export interface Customer {
  name: string;
  initials: string;
  /** Customer ID as shown to the customer, e.g. WN-1180-4472. */
  id: string;
  email: string;
  phone: string;
  /** Masked for the OTP screens, e.g. 0812•••4472. */
  phoneMasked: string;
  memberSince: string;
  address: string;
  installAddress: string;
  village: string;
  city: string;
  postcode: string;
  odp: string;
  ont: string;
  ontSerial: string;
  router: string;
  ssid: string;
  connectedDevices: number;
  installedOn: string;
  status: string;
}

export interface Plan {
  speed: number;
  unit: string;
  price: string;
  quotaUsed: string;
  quotaTotal: string;
  /** 0–1, drives the usage rings. Null when the plan is unmetered. */
  usedFraction: number | null;
}

export type InvoiceStatus = 'Lunas' | 'Pending' | 'Expired';

export interface Invoice {
  no: string;
  period: string;
  amount: string;
  due: string;
  dueShort: string;
  paid: boolean;
  /** Panel-side id, needed to request `invoiceItems` / `paymentOf`. */
  ref: string;
}

export interface PaymentRecord {
  inv: string;
  amount: string;
  date: string;
  pkg: string;
  status: InvoiceStatus;
}

export type PaymentMethodKind =
  | 'qris'
  | 'va'
  | 'ewallet'
  | 'transfer'
  | 'card'
  | 'outlet';

export interface PaymentMethod {
  /** Stable key for selection state. */
  id: string;
  name: string;
  note: string;
  kind: PaymentMethodKind;
}

export interface UsageMonth {
  /** e.g. "2026-09". */
  month: string;
  label: string;
  downGb: number;
  upGb: number;
  totalGb: number;
}

export interface LiveSession {
  online: boolean;
  speedMbps: number;
  uptime: string;
  latencyMs: number | null;
  packetLoss: number | null;
  ip: string;
  devices: number | null;
}

export interface PackageTier {
  /** Stable key, and what `/tulis/upgrade` is called with. */
  id: string;
  speed: number;
  price: string;
  note: string;
  current: boolean;
  popular: boolean;
}

export interface PendingUpgrade {
  toSpeed: number;
  requestedOn: string;
  status: string;
}

export type TicketStatus = 'Terbuka' | 'Diproses' | 'Selesai';

export interface Ticket {
  id: string;
  cat: string;
  subject: string;
  date: string;
  status: TicketStatus;
}

export type NoticeSeverity = 'info' | 'warning' | 'outage';

export interface NetworkNotice {
  id: string;
  title: string;
  body: string;
  severity: NoticeSeverity;
  /** Affected area, e.g. ODP-BDG-042. */
  area: string | null;
  /** Estimated restoration, already formatted. */
  eta: string | null;
  time: string;
}

/** Login-screen branding. Served without a session token. */
export interface PortalSettings {
  companyName: string;
  tagline: string;
  logoUrl: string | null;
  supportPhone: string | null;
  supportEmail: string | null;
}

/* ======================================================= section payloads */

/** Maps each section to the view model the node returns for it. */
export interface SectionData {
  customer: { customer: Customer; plan: Plan };
  unpaidInvoices: Invoice[];
  currentInvoice: Invoice | null;
  invoice: Invoice | null;
  invoiceItems: { label: string; amount: string }[];
  paymentOf: PaymentRecord | null;
  payments: PaymentRecord[];
  usageByMonth: UsageMonth[];
  liveSession: LiveSession | null;
  offerablePackages: PackageTier[];
  pendingUpgrade: PendingUpgrade | null;
  tickets: Ticket[];
  networkNotices: NetworkNotice[];
  paymentMethods: PaymentMethod[];
  paymentOutlets: PaymentMethod[];
}

/* =============================================================== requests */

export interface DataRequest {
  bagian: Section[];
  /** Clamped to MAX_LIMIT by the node before it reaches the panel. */
  limit?: number;
  /** Clamped to MAX_MONTHS by the node. */
  months?: number;
  /** Panel-side invoice ref, for `invoice` / `invoiceItems` / `paymentOf`. */
  invoiceRef?: string;
}

export type DataResponse = Partial<SectionData>;

export interface OtpSendRequest {
  /** Customer ID, e-mail or phone number, as typed. */
  identifier: string;
}

export interface OtpSendResult {
  /** Masked destination the panel says it sent to. */
  sentTo: string;
  /** Seconds before another send is allowed. */
  retryAfter: number;
}

export interface OtpVerifyRequest {
  identifier: string;
  code: string;
  /** Issues a remember-me token alongside the session. */
  ingatSaya?: boolean;
}

export interface SessionState {
  authenticated: boolean;
  /** True when the session came back from a remember-me token. */
  restored?: boolean;
}

export interface LaporRequest {
  kategori: string;
  keterangan: string;
}

export interface UpgradeRequest {
  paketId: string;
}

export interface SpeedtestRequest {
  downloadMbps: number;
  uploadMbps: number;
  latencyMs?: number;
}

/* ================================================================= errors */

export interface ApiError {
  error: string;
  /** Present on 429 so the UI can say how long to wait. */
  retryAfter?: number;
}
