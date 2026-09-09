import type { ScreenId } from '../types';

/** Header title + subtitle for every screen that renders the app chrome. */
export const TITLES: Partial<Record<ScreenId, [string, string]>> = {
  home: ['Hallo, Budi 👋', 'Selamat datang di akun pelanggan Anda'],
  usage: ['Cek Pemakaian Internet', 'Periode: 1 – 12 September 2026'],
  billing: ['Billing & Pembayaran', '1 tagihan menunggu pembayaran'],
  payment: ['Pembayaran', 'Tagihan September 2026'],
  package: ['Paket Saya', 'Kelola & upgrade layanan'],
  tickets: ['Ticket Bantuan', '2 tiket aktif'],
  ticket: ['Detail Tiket', 'Respon rata-rata 12 menit'],
  status: ['Status Layanan', 'Diperbarui 3 detik lalu'],
  profile: ['Profil Saya', 'Pelanggan sejak 14 Maret 2023'],
  notif: ['Notifikasi', '3 belum dibaca'],
};
