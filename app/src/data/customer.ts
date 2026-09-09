import type { ProfileTab } from '../types';

/**
 * Identity shown on the Register screen, which has no panel endpoint behind
 * it. Everything else about the signed-in customer comes from `customer`.
 */
export const CUSTOMER = {
  name: 'Budi Santoso',
  initials: 'BS',
  id: 'WN-1180-4472',
  email: 'budi.santoso@gmail.com',
  phone: '0812 3456 4472',
  phoneMasked: '0812•••4472',
  password: 'budi2026',
  memberSince: '14 Maret 2023',
};

export const REG_FIELDS: { label: string; value: string }[] = [
  { label: 'Nama Lengkap', value: 'Budi Santoso' },
  { label: 'Nomor HP', value: '0812 3456 4472' },
  { label: 'Email', value: 'budi.santoso@gmail.com' },
  { label: 'Alamat Instalasi', value: 'Jl. Cihampelas No. 118, Bandung 40131' },
  { label: 'Password', value: '••••••••' },
];

/** Partially-entered OTP, as drawn in the design. */
export const OTP_DIGITS = ['4', '7', '2', '', ''];

export const PROFILE_TABS: ProfileTab[] = [
  'Data Pribadi',
  'Alamat',
  'Perangkat',
  'Keamanan',
];
