import type { TicketStatus } from '../types';


export type TicketFilter = 'Semua' | TicketStatus;

export const TICKET_FILTERS: TicketFilter[] = [
  'Semua',
  'Terbuka',
  'Diproses',
  'Selesai',
];

/**
 * Illustrative thread for the ticket detail screen. The panel returns ticket
 * rows only — there is no messages section and no endpoint to post a reply —
 * so this content is not live and the composer raises a toast.
 */
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
