import type { InvoiceStatus, PaymentMethodName } from '../types';

export const CURRENT_INVOICE = {
  no: 'INV/2026/09/4472',
  period: 'September 2026',
  amount: 'Rp165.000',
  due: '15 September 2026',
  dueShort: '15 Sep 2026',
  status: 'Belum Dibayar',
};

export const PAYMENT_HISTORY: {
  inv: string;
  amount: string;
  date: string;
  pkg: string;
  status: InvoiceStatus;
}[] = [
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

export interface PaymentMethod {
  name: PaymentMethodName;
  note: string;
  fg: string;
  bg: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: 'QRIS',
    note: 'Scan sekali, semua e-wallet',
    fg: 'var(--blue)',
    bg: 'var(--blues)',
  },
  {
    name: 'Virtual Account',
    note: 'BCA · Mandiri · BNI · BRI',
    fg: 'var(--blued)',
    bg: 'var(--blues)',
  },
  {
    name: 'E-Wallet',
    note: 'GoPay, OVO, DANA, ShopeePay',
    fg: 'var(--warn)',
    bg: 'var(--yels)',
  },
  {
    name: 'Transfer Bank',
    note: 'Verifikasi manual 1×24 jam',
    fg: 'var(--tx2)',
    bg: 'var(--card2)',
  },
  {
    name: 'Kartu Kredit/Debit',
    note: 'Visa, Mastercard, JCB',
    fg: 'var(--ok)',
    bg: 'var(--oks)',
  },
];

export const PAY_STEPS = ['Metode', 'Konfirmasi', 'Selesai'];

export const RECEIPT_TRX = 'TRX-4472-90821';
export const RECEIPT_TIME = '12 Sep 2026, 09:41';
