import type { TicketStatus } from '../types';

export type TicketFilter = 'Semua' | TicketStatus;

export const TICKET_FILTERS: TicketFilter[] = [
  'Semua',
  'Terbuka',
  'Diproses',
  'Selesai',
];

export interface Ticket {
  id: string;
  cat: string;
  subject: string;
  date: string;
  status: TicketStatus;
}

export const TICKETS: Ticket[] = [
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

export const TICKET_DETAIL = {
  id: 'TKT-2026-0912',
  subject: 'Internet putus sejak pagi',
  status: 'Diproses' as TicketStatus,
  cat: 'Internet Gangguan',
  created: '12 Sep 2026, 08:14',
  technician: 'Andi P.',
};

export interface ChatMessage {
  name: string;
  msg: string;
  time: string;
  /** `true` for the customer's own messages (right-aligned, blue). */
  own: boolean;
}

export const TICKET_CHAT: ChatMessage[] = [
  {
    name: 'BUDI SANTOSO',
    msg: 'Internet saya mati total dari jam 6 pagi. Lampu LOS di ONT berwarna merah.',
    time: '08:14',
    own: true,
  },
  {
    name: 'WINNET SUPPORT',
    msg: 'Terima kasih, Pak Budi. Kami mendeteksi gangguan kabel di ODP-BDG-042. Tim teknisi menuju lokasi.',
    time: '08:22',
    own: false,
  },
  {
    name: 'BUDI SANTOSO',
    msg: 'Baik, saya lampirkan foto indikator ONT.',
    time: '08:25',
    own: true,
  },
  {
    name: 'WINNET SUPPORT',
    msg: 'Foto diterima. Estimasi perbaikan selesai 14:30 WIB. Kompensasi 1 hari layanan akan otomatis ditambahkan.',
    time: '09:02',
    own: false,
  },
];
