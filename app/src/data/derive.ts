import type {
  Customer,
  Invoice,
  LiveSession,
  NetworkNotice,
  NoticeSeverity,
  PaymentMethodKind,
  Plan,
  UsageMonth,
} from '@shared/portal';
import type { KeyValue, ProfileTab } from '../types';

/**
 * Everything the screens show that is computed rather than fetched.
 *
 * Colours live here and in the components, never in the data: a section from
 * the panel and the mock snapshot carry the same semantic fields, and the
 * theme decides how they look.
 */

/* ================================================================ profile */

export function profileRows(
  c: Customer,
  live: LiveSession | null,
): Record<ProfileTab, KeyValue[]> {
  const devices = live?.devices ?? c.connectedDevices;
  return {
    'Data Pribadi': [
      { k: 'Nama Lengkap', v: c.name },
      { k: 'Customer ID', v: c.id },
      { k: 'No. HP', v: c.phone },
      { k: 'Email', v: c.email },
      { k: 'Tgl. Registrasi', v: c.memberSince },
      { k: 'Status', v: c.status },
    ],
    Alamat: [
      { k: 'Alamat Rumah', v: c.address },
      { k: 'Alamat Instalasi', v: c.installAddress },
      { k: 'Kelurahan', v: c.village },
      { k: 'Kota', v: c.city },
      { k: 'Kode Pos', v: c.postcode },
      { k: 'ODP', v: c.odp },
    ],
    Perangkat: [
      { k: 'ONT', v: c.ont },
      { k: 'Serial ONT', v: c.ontSerial },
      { k: 'Router', v: c.router },
      { k: 'Perangkat terhubung', v: `${devices} device` },
      { k: 'SSID', v: c.ssid },
      { k: 'Instalasi', v: c.installedOn },
    ],
    // The panel exposes no security section, so this tab is derived from what
    // the login flow itself establishes rather than invented.
    Keamanan: [
      { k: 'Metode masuk', v: 'OTP WhatsApp' },
      { k: 'Nomor terdaftar', v: c.phoneMasked },
      { k: 'Verifikasi 2 langkah', v: 'Aktif (WhatsApp OTP)' },
      { k: 'Status akun', v: c.status },
      { k: 'Pelanggan sejak', v: c.memberSince },
      { k: 'Customer ID', v: c.id },
    ],
  };
}

/* ================================================================== usage */

const fmtGb = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} GB`;

/** Download / upload / total for the most recent period in the series. */
export function usageBreakdown(usage: UsageMonth[]) {
  const latest = usage.at(-1);
  return [
    {
      label: 'DOWNLOAD',
      v: latest ? fmtGb(latest.downGb) : '—',
      c: 'var(--blue)',
    },
    {
      label: 'UPLOAD',
      v: latest ? fmtGb(latest.upGb) : '—',
      c: 'var(--warn)',
    },
    {
      label: 'TOTAL',
      v: latest ? fmtGb(latest.totalGb) : '—',
      c: 'var(--tx)',
    },
  ];
}

/**
 * The design's four stat tiles. Two of them asked for daily figures the panel
 * cannot answer, so they are stated per month — the granularity the data
 * actually has — rather than fabricated.
 */
export function usageStats(usage: UsageMonth[], plan: Plan) {
  const totals = usage.map((u) => u.totalGb);
  const latest = usage.at(-1);
  const previous = usage.at(-2);
  const mean = totals.length
    ? totals.reduce((a, b) => a + b, 0) / totals.length
    : 0;
  const peak = usage.reduce<UsageMonth | null>(
    (best, u) => (!best || u.totalGb > best.totalGb ? u : best),
    null,
  );

  const delta =
    latest && previous && previous.totalGb > 0
      ? Math.round(((latest.totalGb - previous.totalGb) / previous.totalGb) * 100)
      : null;

  const quotaTotal = Number(plan.quotaTotal.replace(/[^\d.]/g, ''));
  const quotaUsed = Number(plan.quotaUsed.replace(/[^\d.]/g, ''));
  const remaining =
    Number.isFinite(quotaTotal) && Number.isFinite(quotaUsed)
      ? quotaTotal - quotaUsed
      : null;

  return [
    {
      label: 'RATA-RATA BULANAN',
      v: fmtGb(Number(mean.toFixed(1))),
      note: `${usage.length} bulan terakhir`,
      c: 'var(--tx2)',
    },
    {
      label: 'PEMAKAIAN PUNCAK',
      v: peak ? fmtGb(peak.totalGb) : '—',
      note: peak ? peak.label : '—',
      c: 'var(--blue)',
    },
    {
      label: 'TOTAL BULAN INI',
      v: latest ? fmtGb(latest.totalGb) : '—',
      note:
        delta === null
          ? 'periode berjalan'
          : `${delta >= 0 ? '+' : ''}${delta}% dari bulan lalu`,
      c: delta !== null && delta < 0 ? 'var(--ok)' : 'var(--warn)',
    },
    {
      label: 'SISA KUOTA',
      v: remaining === null ? plan.quotaTotal : fmtGb(Number(remaining.toFixed(1))),
      note: remaining === null ? 'tanpa batas' : `dari ${plan.quotaTotal}`,
      c: 'var(--ok)',
    },
  ];
}

/** The month with the highest total, highlighted in the chart. */
export function peakMonth(usage: UsageMonth[]): string | null {
  return usage.reduce<UsageMonth | null>(
    (best, u) => (!best || u.totalGb > best.totalGb ? u : best),
    null,
  )?.month ?? null;
}

/* ================================================================= status */

export function statusMetrics(live: LiveSession | null) {
  return [
    { label: 'UPTIME', v: live?.uptime || '—', c: 'var(--ok)' },
    {
      label: 'KECEPATAN',
      v: live ? `${live.speedMbps.toFixed(1)} Mbps` : '—',
      c: 'var(--blue)',
    },
    {
      label: 'LATENCY',
      v: live?.latencyMs == null ? '—' : `${live.latencyMs} ms`,
      c: 'var(--ok)',
    },
    {
      label: 'PACKET LOSS',
      v: live?.packetLoss == null ? '—' : `${live.packetLoss.toFixed(1)} %`,
      c: live?.packetLoss ? 'var(--warn)' : 'var(--ok)',
    },
    { label: 'IP ADDRESS', v: live?.ip || '—', c: 'var(--tx)' },
    {
      label: 'PERANGKAT',
      v: live?.devices == null ? '—' : `${live.devices} terhubung`,
      c: 'var(--tx)',
    },
  ];
}

/** The chain of hops the Service Status screen draws. */
export function networkChain(c: Customer) {
  return [
    {
      name: 'Internet Backbone',
      note: 'Upstream WinNet Core · Jakarta',
    },
    {
      name: 'OLT',
      note: c.city || 'Jaringan distribusi',
    },
    {
      name: c.odp ? `ODP — ${c.odp}` : 'ODP',
      note: c.address || 'Titik distribusi terdekat',
    },
    {
      name: 'Pelanggan — ONT Anda',
      note: [c.ont, c.connectedDevices ? `${c.connectedDevices} perangkat` : '']
        .filter(Boolean)
        .join(' · '),
    },
  ];
}

/** The outage banner, if the panel is reporting one. */
export function activeOutage(notices: NetworkNotice[]): NetworkNotice | null {
  return notices.find((n) => n.severity === 'outage') ?? null;
}

/* ========================================================= notifications */

export interface FeedItem {
  id: string;
  cat: string;
  title: string;
  time: string;
  unread: boolean;
  fg: string;
  bg: string;
  glow: string;
  r: string;
}

const SEVERITY_CAT: Record<NoticeSeverity, [string, string, string, string]> = {
  outage: ['GANGGUAN', 'var(--dang)', 'var(--dangs)', '2px'],
  warning: ['MAINTENANCE', 'var(--warn)', 'var(--yels)', '2px'],
  info: ['INFO', 'var(--blue)', 'var(--blues)', '4px'],
};

/**
 * The notification centre.
 *
 * The panel has no notifications section — `networkNotices` is the only feed
 * it exposes — so the list is network notices plus a billing entry derived
 * from the outstanding invoice. Promo and payment-receipt notices in the
 * design have no source and are not fabricated here.
 */
export function notificationFeed(
  notices: NetworkNotice[],
  invoice: Invoice | null,
): FeedItem[] {
  const items: FeedItem[] = [];

  if (invoice && !invoice.paid) {
    items.push({
      id: `inv-${invoice.ref}`,
      cat: 'TAGIHAN',
      title: `Tagihan ${invoice.period} sebesar ${invoice.amount}. Jatuh tempo ${invoice.due}.`,
      time: `Jatuh tempo ${invoice.dueShort}`,
      unread: true,
      fg: 'var(--blue)',
      bg: 'var(--blues)',
      glow: 'var(--glowB)',
      r: '4px',
    });
  }

  for (const n of notices) {
    const [cat, fg, bg, r] = SEVERITY_CAT[n.severity];
    items.push({
      id: n.id,
      cat,
      title: n.body ? `${n.title}. ${n.body}` : n.title,
      time: n.time,
      unread: n.severity === 'outage',
      fg,
      bg,
      glow: n.severity === 'outage' ? 'var(--glowB)' : 'none',
      r,
    });
  }

  return items;
}

/* ======================================================= payment methods */

const METHOD_STYLE: Record<PaymentMethodKind, { fg: string; bg: string }> = {
  qris: { fg: 'var(--blue)', bg: 'var(--blues)' },
  va: { fg: 'var(--blued)', bg: 'var(--blues)' },
  ewallet: { fg: 'var(--warn)', bg: 'var(--yels)' },
  transfer: { fg: 'var(--tx2)', bg: 'var(--card2)' },
  card: { fg: 'var(--ok)', bg: 'var(--oks)' },
  outlet: { fg: 'var(--warn)', bg: 'var(--yels)' },
};

export function methodStyle(kind: PaymentMethodKind) {
  return METHOD_STYLE[kind] ?? METHOD_STYLE.transfer;
}
