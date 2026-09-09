import type {
  Customer,
  Invoice,
  LiveSession,
  NetworkNotice,
  PackageTier,
  PaymentMethod,
  PaymentRecord,
  PendingUpgrade,
  Plan,
  PortalSettings,
  Ticket,
  UsageMonth,
} from '@shared/portal';

/**
 * The design's content, in the same view-model shapes the portal node returns.
 *
 * This is what the app renders when the node is unreachable or nobody has
 * logged in — the screens cannot tell the difference, so there is exactly one
 * rendering path to get right. It is also what the design was drawn against,
 * which keeps the mock useful as a visual reference.
 */

export interface PortalSnapshot {
  customer: Customer;
  plan: Plan;
  currentInvoice: Invoice | null;
  payments: PaymentRecord[];
  usage: UsageMonth[];
  live: LiveSession | null;
  packages: PackageTier[];
  pendingUpgrade: PendingUpgrade | null;
  tickets: Ticket[];
  notices: NetworkNotice[];
  methods: PaymentMethod[];
  outlets: PaymentMethod[];
}

const customer: Customer = {
  name: 'Budi Santoso',
  initials: 'BS',
  id: 'WN-1180-4472',
  email: 'budi.santoso@gmail.com',
  phone: '0812 3456 4472',
  phoneMasked: '0812•••4472',
  memberSince: '14 Maret 2023',
  address: 'Jl. Cihampelas No. 118, Bandung',
  installAddress: 'Jl. Cihampelas No. 118, Bandung',
  village: 'Cipaganti',
  city: 'Bandung, Jawa Barat',
  postcode: '40131',
  odp: 'ODP-BDG-042',
  ont: 'ZTE F670L',
  ontSerial: 'ZTEG1180C4472',
  router: 'WinNet Mesh AX1800',
  ssid: 'WinNet-Budi',
  connectedDevices: 6,
  installedOn: '14 Maret 2023',
  status: 'Aktif',
};

const plan: Plan = {
  speed: 50,
  unit: 'Mbps',
  price: 'Rp165.000',
  quotaUsed: '12.5 GB',
  quotaTotal: '50 GB',
  usedFraction: 0.25,
};

const currentInvoice: Invoice = {
  no: 'INV/2026/09/4472',
  period: 'September 2026',
  amount: 'Rp165.000',
  due: '15 September 2026',
  dueShort: '15 Sep 2026',
  paid: false,
  ref: 'INV/2026/09/4472',
};

const payments: PaymentRecord[] = [
  {
    inv: 'INV/2026/08/4472',
    amount: 'Rp165.000',
    date: '12 Agu 2026',
    pkg: '50 Mbps',
    status: 'Lunas',
  },
  {
    inv: 'INV/2026/07/4472',
    amount: 'Rp165.000',
    date: '11 Jul 2026',
    pkg: '50 Mbps',
    status: 'Lunas',
  },
  {
    inv: 'INV/2026/06/4472',
    amount: 'Rp150.000',
    date: '14 Jun 2026',
    pkg: '30 Mbps',
    status: 'Pending',
  },
  {
    inv: 'INV/2026/05/4472',
    amount: 'Rp150.000',
    date: '13 Mei 2026',
    pkg: '30 Mbps',
    status: 'Expired',
  },
];

/**
 * The design charts seven days, but the panel only exposes `usageByMonth` —
 * there is no daily section — so the chart is monthly and the mock matches
 * what live data actually looks like. The bar component is unchanged; it draws
 * whatever series it is handed. The most recent entry is the current period
 * and must agree with `plan.quotaUsed`, since the breakdown tiles split it.
 */
const usage: UsageMonth[] = [
  { month: '2026-04', label: 'Apr', downGb: 5.9, upGb: 2.4, totalGb: 8.3 },
  { month: '2026-05', label: 'Mei', downGb: 6.8, upGb: 2.7, totalGb: 9.5 },
  { month: '2026-06', label: 'Jun', downGb: 7.2, upGb: 3.1, totalGb: 10.3 },
  { month: '2026-07', label: 'Jul', downGb: 6.1, upGb: 2.9, totalGb: 9.0 },
  { month: '2026-08', label: 'Agu', downGb: 7.4, upGb: 3.2, totalGb: 10.6 },
  { month: '2026-09', label: 'Sep', downGb: 8.4, upGb: 4.1, totalGb: 12.5 },
];

const live: LiveSession = {
  online: true,
  speedMbps: 48.2,
  uptime: '12j 24m',
  latencyMs: 12,
  packetLoss: 0,
  ip: '103.94.12.88',
  devices: 6,
};

const packages: PackageTier[] = [
  {
    id: 'p20',
    speed: 20,
    price: 'Rp110.000',
    note: 'Cocok 1–2 perangkat, browsing & sosmed',
    current: false,
    popular: false,
  },
  {
    id: 'p30',
    speed: 30,
    price: 'Rp150.000',
    note: 'Streaming HD lancar untuk keluarga kecil',
    current: false,
    popular: false,
  },
  {
    id: 'p50',
    speed: 50,
    price: 'Rp165.000',
    note: 'Paket aktif Anda · streaming 4K + WFH',
    current: true,
    popular: false,
  },
  {
    id: 'p100',
    speed: 100,
    price: 'Rp225.000',
    note: 'Gaming, WFH, dan 4K bersamaan',
    current: false,
    popular: true,
  },
  {
    id: 'p200',
    speed: 200,
    price: 'Rp290.000',
    note: 'Rumah besar, 15+ perangkat aktif',
    current: false,
    popular: false,
  },
];

const tickets: Ticket[] = [
  {
    id: 'TKT-2026-0912',
    cat: 'Internet Gangguan',
    subject: 'Internet putus sejak pagi',
    date: '12 Sep 2026, 08:14',
    status: 'Diproses',
  },
  {
    id: 'TKT-2026-0905',
    cat: 'Lambat',
    subject: 'Kecepatan turun di jam malam',
    date: '5 Sep 2026, 20:41',
    status: 'Terbuka',
  },
  {
    id: 'TKT-2026-0822',
    cat: 'Billing',
    subject: 'Tagihan tidak sesuai paket',
    date: '22 Agu 2026, 10:03',
    status: 'Selesai',
  },
];

const notices: NetworkNotice[] = [
  {
    id: 'n-odp-042',
    title: 'Sedang terjadi gangguan jaringan',
    body: 'Tim teknis kami sedang melakukan perbaikan di area ODP-BDG-042.',
    severity: 'outage',
    area: 'ODP-BDG-042',
    eta: '14:30 WIB',
    time: '12 Sep 2026, 08:00',
  },
  {
    id: 'n-maint-cipaganti',
    title: 'Jadwal maintenance jaringan area Cipaganti',
    body: 'Maintenance terjadwal 14 Sep 01:00–03:00 WIB.',
    severity: 'warning',
    area: 'Cipaganti',
    eta: null,
    time: 'Kemarin, 18:30',
  },
];

/**
 * Payment destinations are deliberately empty here.
 *
 * Every other field in this file is the design's content standing in for live
 * data, which is harmless. An account number is not: a customer who transfers
 * to a number this app invented has lost real money. So the mock carries no
 * bank, no account number and no QR, and the payment screen refuses to show a
 * destination it did not get from the panel.
 */
const NO_DESTINATION = {
  bank: null,
  accountNumber: null,
  accountName: null,
  qr: null,
};

const methods: PaymentMethod[] = [
  {
    id: 'qris',
    name: 'QRIS',
    note: 'Scan sekali, semua e-wallet',
    kind: 'qris',
    ...NO_DESTINATION,
  },
  {
    id: 'va',
    name: 'Virtual Account',
    note: 'BCA · Mandiri · BNI · BRI',
    kind: 'va',
    ...NO_DESTINATION,
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    note: 'GoPay, OVO, DANA, ShopeePay',
    kind: 'ewallet',
    ...NO_DESTINATION,
  },
  {
    id: 'transfer',
    name: 'Transfer Bank',
    note: 'Verifikasi manual 1×24 jam',
    kind: 'transfer',
    ...NO_DESTINATION,
  },
  {
    id: 'card',
    name: 'Kartu Kredit/Debit',
    note: 'Visa, Mastercard, JCB',
    kind: 'card',
    ...NO_DESTINATION,
  },
];

const outlets: PaymentMethod[] = [
  {
    id: 'outlet-cihampelas',
    name: 'Indomaret Cihampelas',
    note: 'Jl. Cihampelas No. 90 · buka 24 jam',
    kind: 'outlet',
    ...NO_DESTINATION,
  },
];

export const MOCK: PortalSnapshot = {
  customer,
  plan,
  currentInvoice,
  payments,
  usage,
  live,
  packages,
  pendingUpgrade: null as PendingUpgrade | null,
  tickets,
  notices,
  methods,
  outlets,
};

export const MOCK_SETTINGS: PortalSettings = {
  companyName: 'WinNet ISP',
  tagline: 'Internet Cepat Tanpa Batas',
  logoUrl: null,
  supportPhone: null,
  supportEmail: null,
};
