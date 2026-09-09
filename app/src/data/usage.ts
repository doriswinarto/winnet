import type { UsagePeriod } from '../types';

export const PERIODS: UsagePeriod[] = [
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
  'Custom',
];

export const BREAKDOWN = [
  { label: 'DOWNLOAD', v: '8.2 GB', c: 'var(--blue)' },
  { label: 'UPLOAD', v: '4.1 GB', c: 'var(--warn)' },
  { label: 'TOTAL', v: '12.5 GB', c: 'var(--tx)' },
];

/** Daily download / upload percentages for the bar chart. */
export const DAILY_BARS: { d: string; down: number; up: number }[] = [
  { d: 'Sen', down: 34, up: 14 },
  { d: 'Sel', down: 48, up: 18 },
  { d: 'Rab', down: 29, up: 11 },
  { d: 'Kam', down: 62, up: 22 },
  { d: 'Jum', down: 41, up: 16 },
  { d: 'Sab', down: 74, up: 26 },
  { d: 'Min', down: 52, up: 19 },
];

/** The peak day, highlighted with a glow in the chart. */
export const PEAK_DAY = 'Sab';

export const USAGE_STATS = [
  {
    label: 'RATA-RATA HARIAN',
    v: '1.04 GB',
    note: '12 hari berjalan',
    c: 'var(--tx2)',
  },
  {
    label: 'PEMAKAIAN PUNCAK',
    v: '2.8 GB',
    note: 'Sabtu, 6 Sep',
    c: 'var(--blue)',
  },
  {
    label: 'TOTAL BULAN INI',
    v: '12.5 GB',
    note: '+8% dari Agustus',
    c: 'var(--ok)',
  },
  {
    label: 'SISA KUOTA',
    v: '37.5 GB',
    note: 'Cukup sampai 30 Sep',
    c: 'var(--ok)',
  },
];
