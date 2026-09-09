export type NotifCategory =
  | 'TAGIHAN'
  | 'INTERNET'
  | 'MAINTENANCE'
  | 'PEMBAYARAN'
  | 'PROMO'
  | 'TIKET';

export interface Notification {
  cat: NotifCategory;
  title: string;
  time: string;
  unread: boolean;
  /** Icon tile background / foreground and the icon's corner radius. */
  bg: string;
  fg: string;
  r: string;
  /** Glow on the icon tile — only unread items glow. */
  glow: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    cat: 'TAGIHAN',
    title:
      'Tagihan internet Anda telah diterbitkan. Jatuh tempo 15 September 2026.',
    time: 'Hari ini, 07:00',
    unread: true,
    bg: 'var(--blues)',
    fg: 'var(--blue)',
    glow: 'var(--glowB)',
    r: '4px',
  },
  {
    cat: 'INTERNET',
    title: 'Internet Anda kembali online setelah gangguan 42 menit.',
    time: 'Hari ini, 06:58',
    unread: true,
    bg: 'var(--oks)',
    fg: 'var(--ok)',
    glow: 'var(--glowG)',
    r: '99px',
  },
  {
    cat: 'MAINTENANCE',
    title:
      'Jadwal maintenance jaringan area Cipaganti, 14 Sep 01:00–03:00 WIB.',
    time: 'Kemarin, 18:30',
    unread: true,
    bg: 'var(--yels)',
    fg: 'var(--warn)',
    glow: 'var(--glowY)',
    r: '2px',
  },
  {
    cat: 'PEMBAYARAN',
    title: 'Pembayaran Rp165.000 berhasil untuk periode Agustus 2026.',
    time: '12 Agu 2026',
    unread: false,
    bg: 'var(--oks)',
    fg: 'var(--ok)',
    glow: 'none',
    r: '99px',
  },
  {
    cat: 'PROMO',
    title: 'Promo upgrade 100 Mbps hanya Rp185.000 untuk 3 bulan pertama.',
    time: '10 Agu 2026',
    unread: false,
    bg: 'var(--yels)',
    fg: 'var(--warn)',
    glow: 'none',
    r: '4px',
  },
  {
    cat: 'TIKET',
    title: 'Tiket TKT-2026-0822 telah diselesaikan oleh teknisi.',
    time: '23 Agu 2026',
    unread: false,
    bg: 'var(--blues)',
    fg: 'var(--blue)',
    glow: 'none',
    r: '3px',
  },
];

export type NotifFilter =
  | 'Semua'
  | 'Tagihan'
  | 'Internet'
  | 'Promo'
  | 'Tiket';

export const NOTIF_FILTERS: NotifFilter[] = [
  'Semua',
  'Tagihan',
  'Internet',
  'Promo',
  'Tiket',
];

/** Which raw categories each filter chip covers. */
export const NOTIF_FILTER_CATS: Record<
  Exclude<NotifFilter, 'Semua'>,
  NotifCategory[]
> = {
  Tagihan: ['TAGIHAN', 'PEMBAYARAN'],
  Internet: ['INTERNET', 'MAINTENANCE'],
  Promo: ['PROMO'],
  Tiket: ['TIKET'],
};

/** The two most recent items, previewed on the Home screen. */
export const HOME_NOTIFS = [
  {
    title: 'Tagihan internet Anda telah diterbitkan.',
    time: 'Hari ini, 07:00',
    bg: 'var(--blues)',
    fg: 'var(--blue)',
    sh: 'var(--glowB)',
  },
  {
    title: 'Promo upgrade 100 Mbps, hemat Rp40.000.',
    time: 'Kemarin, 16:20',
    bg: 'var(--yels)',
    fg: 'var(--warn)',
    sh: 'var(--glowY)',
  },
];
