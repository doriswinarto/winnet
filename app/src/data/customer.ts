import type { KeyValue, ProfileTab } from '../types';

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

export const PLAN = {
  speed: 50,
  unit: 'Mbps',
  price: 'Rp165.000',
  quotaUsed: '12.5 GB',
  quotaTotal: '50 GB',
  usedFraction: 0.25,
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

export const PROFILE_ROWS: Record<ProfileTab, KeyValue[]> = {
  'Data Pribadi': [
    { k: 'Nama Lengkap', v: 'Budi Santoso' },
    { k: 'Customer ID', v: 'WN-1180-4472' },
    { k: 'No. HP', v: '0812 3456 4472' },
    { k: 'Email', v: 'budi.santoso@gmail.com' },
    { k: 'Tgl. Registrasi', v: '14 Maret 2023' },
    { k: 'Status', v: 'Aktif' },
  ],
  Alamat: [
    { k: 'Alamat Rumah', v: 'Jl. Cihampelas No. 118, Bandung' },
    { k: 'Alamat Instalasi', v: 'Jl. Cihampelas No. 118, Bandung' },
    { k: 'Kelurahan', v: 'Cipaganti' },
    { k: 'Kota', v: 'Bandung, Jawa Barat' },
    { k: 'Kode Pos', v: '40131' },
    { k: 'ODP', v: 'ODP-BDG-042' },
  ],
  Perangkat: [
    { k: 'ONT', v: 'ZTE F670L' },
    { k: 'Serial ONT', v: 'ZTEG1180C4472' },
    { k: 'Router', v: 'WinNet Mesh AX1800' },
    { k: 'Perangkat terhubung', v: '6 device' },
    { k: 'SSID', v: 'WinNet-Budi' },
    { k: 'Instalasi', v: '14 Maret 2023' },
  ],
  Keamanan: [
    { k: 'Password', v: 'Diubah 2 bulan lalu' },
    { k: 'Verifikasi 2 langkah', v: 'Aktif (SMS OTP)' },
    { k: 'PIN Pembayaran', v: 'Terpasang' },
    { k: 'Login terakhir', v: 'Hari ini, 09:12' },
    { k: 'Perangkat login', v: 'iPhone 14 · Bandung' },
    { k: 'Sesi aktif', v: '2 perangkat' },
  ],
};
