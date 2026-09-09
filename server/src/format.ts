/** Presentation helpers. The panel may return raw numbers or ISO dates; the
 *  browser only ever receives strings already formatted for Indonesian. */

const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const BULAN_PENDEK = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

/** Formats 165000 as "Rp165.000". A string that already looks formatted is
 *  passed through, so a panel that pre-formats is not double-formatted. */
export function rupiah(v: unknown): string {
  if (typeof v === 'string') {
    if (/^Rp/i.test(v.trim())) return v.trim();
    const n = Number(v.replace(/[^\d.-]/g, ''));
    if (!Number.isFinite(n)) return v;
    return rupiah(n);
  }
  if (typeof v !== 'number' || !Number.isFinite(v)) return '';
  return 'Rp' + Math.round(v).toLocaleString('id-ID');
}

function toDate(v: unknown): Date | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === 'number') return new Date(v * (v < 1e12 ? 1000 : 1));
  if (typeof v !== 'string' || !v.trim()) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "15 September 2026". Non-date input is returned unchanged. */
export function tanggal(v: unknown): string {
  const d = toDate(v);
  if (!d) return typeof v === 'string' ? v : '';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** "15 Sep 2026". */
export function tanggalPendek(v: unknown): string {
  const d = toDate(v);
  if (!d) return typeof v === 'string' ? v : '';
  return `${d.getDate()} ${BULAN_PENDEK[d.getMonth()]} ${d.getFullYear()}`;
}

/** "12 Sep 2026, 08:14". */
export function tanggalJam(v: unknown): string {
  const d = toDate(v);
  if (!d) return typeof v === 'string' ? v : '';
  const jam = String(d.getHours()).padStart(2, '0');
  const menit = String(d.getMinutes()).padStart(2, '0');
  return `${tanggalPendek(d)}, ${jam}:${menit}`;
}

/** "September 2026" from an ISO date or a "2026-09" month key. */
export function periode(v: unknown): string {
  if (typeof v === 'string' && /^\d{4}-\d{2}$/.test(v)) {
    const [y, m] = v.split('-');
    return `${BULAN[Number(m) - 1]} ${y}`;
  }
  const d = toDate(v);
  return d ? `${BULAN[d.getMonth()]} ${d.getFullYear()}` : '';
}

/** "Sep" for the usage chart axis. */
export function bulanPendek(v: unknown): string {
  if (typeof v === 'string' && /^\d{4}-\d{2}$/.test(v)) {
    return BULAN_PENDEK[Number(v.slice(5, 7)) - 1];
  }
  const d = toDate(v);
  return d ? BULAN_PENDEK[d.getMonth()] : '';
}

/** "Budi Santoso" -> "BS". */
export function inisial(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** "081234564472" -> "0812•••4472". Never widen this: the masked form is what
 *  the OTP screen shows before anyone has proved who they are. */
export function samarkanNomor(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return '•••';
  return `${digits.slice(0, 4)}•••${digits.slice(-4)}`;
}

/** GB from the panel as "12.5 GB" — whole numbers keep no decimal ("50 GB"). */
export function gigabyte(v: unknown): string {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return '';
  return `${Number.isInteger(n) ? n : n.toFixed(1)} GB`;
}
