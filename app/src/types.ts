export type Theme = 'lite' | 'neon';

export type ScreenId =
  | 'login'
  | 'register'
  | 'home'
  | 'usage'
  | 'billing'
  | 'payment'
  | 'package'
  | 'tickets'
  | 'ticket'
  | 'status'
  | 'profile'
  | 'notif';

/** Screens that render the app chrome (header + bottom nav). */
export const CHROME_SCREENS: ScreenId[] = [
  'home',
  'usage',
  'billing',
  'payment',
  'package',
  'tickets',
  'ticket',
  'status',
  'profile',
  'notif',
];

export type TicketStatus = 'Terbuka' | 'Diproses' | 'Selesai';
export type InvoiceStatus = 'Lunas' | 'Pending' | 'Expired';
export type BadgeStatus = TicketStatus | InvoiceStatus;

export type PaymentMethodName =
  | 'QRIS'
  | 'Virtual Account'
  | 'E-Wallet'
  | 'Transfer Bank'
  | 'Kartu Kredit/Debit';

export type ProfileTab = 'Data Pribadi' | 'Alamat' | 'Perangkat' | 'Keamanan';

export type UsagePeriod = 'Hari ini' | 'Minggu ini' | 'Bulan ini' | 'Custom';

export interface KeyValue {
  k: string;
  v: string;
}
