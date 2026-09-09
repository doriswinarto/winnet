import type {
  Customer,
  Invoice,
  InvoiceStatus,
  LiveSession,
  NetworkNotice,
  NoticeSeverity,
  PackageTier,
  PaymentMethod,
  PaymentMethodKind,
  PaymentRecord,
  PendingUpgrade,
  Plan,
  PortalSettings,
  Ticket,
  TicketStatus,
  UsageMonth,
} from '../../shared/portal.js';
import { asArray, asRecord, bool, num, pick, str } from './fields.js';
import {
  bulanPendek,
  gigabyte,
  inisial,
  periode,
  rupiah,
  samarkanNomor,
  tanggal,
  tanggalJam,
  tanggalPendek,
} from './format.js';

/**
 * Panel payloads to view models.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE CANDIDATE KEY LISTS BELOW ARE PROVISIONAL. The brief documented which
 * sections exist and what they mean, not the field names inside them. Each
 * reader tries the names a panel of this kind plausibly uses; whatever does
 * not match is logged once by name (see fields.ts) and surfaced at
 * GET /bff/diagnostik. Correcting one is a one-line edit here — no screen,
 * route or type changes.
 * ─────────────────────────────────────────────────────────────────────────
 */

/* ============================================================== customer */

export function normalizeCustomer(raw: unknown): {
  customer: Customer;
  plan: Plan;
} {
  const s = 'customer';
  const r = asRecord(raw);
  const paket = asRecord(pick(r, ['paket', 'package', 'plan', 'langganan']));

  const name = str(r, ['nama', 'name', 'nama_lengkap', 'full_name'], {
    section: s,
    field: 'name',
  });
  const phone = str(r, ['no_hp', 'telepon', 'phone', 'whatsapp', 'hp', 'msisdn'], {
    section: s,
    field: 'phone',
  });
  const alamat = str(r, ['alamat', 'address', 'alamat_rumah'], {
    section: s,
    field: 'address',
    fallback: '',
  });

  const quotaTotalGb = num(paket ?? r, ['kuota', 'quota', 'kuota_gb', 'quota_gb'], {
    section: s,
    field: 'quotaTotal',
    fallback: null,
  });
  const quotaUsedGb = num(r, ['pemakaian', 'usage', 'terpakai', 'used_gb'], {
    section: s,
    field: 'quotaUsed',
    fallback: null,
  });

  const customer: Customer = {
    name,
    initials: inisial(name),
    id: str(r, ['customer_id', 'kode_pelanggan', 'no_pelanggan', 'id_pelanggan', 'id'], {
      section: s,
      field: 'id',
    }),
    email: str(r, ['email', 'surel'], { section: s, field: 'email', fallback: '' }),
    phone,
    phoneMasked: samarkanNomor(phone),
    memberSince: tanggal(
      pick(r, ['tanggal_daftar', 'registered_at', 'created_at', 'sejak']),
    ),
    address: alamat,
    installAddress: str(
      r,
      ['alamat_instalasi', 'alamat_pasang', 'install_address'],
      { section: s, field: 'installAddress', fallback: alamat },
    ),
    village: str(r, ['kelurahan', 'desa', 'village'], {
      section: s,
      field: 'village',
      fallback: '',
    }),
    city: str(r, ['kota', 'kabupaten', 'city'], {
      section: s,
      field: 'city',
      fallback: '',
    }),
    postcode: str(r, ['kode_pos', 'postcode', 'zip'], {
      section: s,
      field: 'postcode',
      fallback: '',
    }),
    odp: str(r, ['odp', 'odp_name', 'nama_odp'], {
      section: s,
      field: 'odp',
      fallback: '',
    }),
    ont: str(r, ['ont', 'tipe_ont', 'ont_type', 'modem'], {
      section: s,
      field: 'ont',
      fallback: '',
    }),
    ontSerial: str(r, ['serial_ont', 'ont_serial', 'sn_ont', 'serial'], {
      section: s,
      field: 'ontSerial',
      fallback: '',
    }),
    router: str(r, ['router', 'perangkat_router'], {
      section: s,
      field: 'router',
      fallback: '',
    }),
    ssid: str(r, ['ssid', 'nama_wifi'], {
      section: s,
      field: 'ssid',
      fallback: '',
    }),
    connectedDevices:
      num(r, ['perangkat_terhubung', 'connected_devices', 'devices'], {
        section: s,
        field: 'connectedDevices',
        fallback: 0,
      }) ?? 0,
    installedOn: tanggal(
      pick(r, ['tanggal_instalasi', 'installed_at', 'tanggal_pasang']),
    ),
    status: str(r, ['status', 'status_layanan'], {
      section: s,
      field: 'status',
      fallback: 'Aktif',
    }),
  };

  const speed =
    num(paket ?? r, ['kecepatan', 'speed', 'mbps', 'bandwidth'], {
      section: s,
      field: 'plan.speed',
      fallback: 0,
    }) ?? 0;

  const plan: Plan = {
    speed,
    unit: 'Mbps',
    price: rupiah(pick(paket ?? r, ['harga', 'price', 'tarif', 'biaya'])),
    quotaUsed: quotaUsedGb == null ? '' : gigabyte(quotaUsedGb),
    quotaTotal: quotaTotalGb == null ? 'Unlimited' : gigabyte(quotaTotalGb),
    usedFraction:
      quotaTotalGb && quotaUsedGb != null && quotaTotalGb > 0
        ? Math.min(1, quotaUsedGb / quotaTotalGb)
        : null,
  };

  return { customer, plan };
}

/* =============================================================== invoices */

/**
 * An explicit status always wins. A `paid` flag is only consulted when the row
 * carries no status at all — otherwise a defaulted flag would silently report
 * a pending invoice as settled, which is the one direction this must not err.
 */
function invoiceStatus(raw: unknown, paid: boolean): InvoiceStatus {
  const v = String(raw ?? '').toLowerCase();
  if (v.includes('expired') || v.includes('kedaluwarsa') || v.includes('batal'))
    return 'Expired';
  if (v.includes('lunas') || v.includes('paid') || v.includes('berhasil'))
    return 'Lunas';
  if (v.includes('pending') || v.includes('menunggu') || v.includes('belum'))
    return 'Pending';
  return paid ? 'Lunas' : 'Pending';
}

export function normalizeInvoice(raw: unknown): Invoice | null {
  const r = asRecord(raw);
  if (!r) return null;
  const s = 'invoice';
  const paid = bool(r, ['lunas', 'paid', 'is_paid', 'sudah_bayar']);
  const due = pick(r, ['jatuh_tempo', 'due_date', 'tanggal_jatuh_tempo', 'due']);
  return {
    no: str(r, ['no_invoice', 'invoice_no', 'nomor', 'no', 'kode'], {
      section: s,
      field: 'no',
    }),
    period: periode(
      pick(r, ['periode', 'period', 'bulan', 'tanggal', 'created_at']),
    ),
    amount: rupiah(pick(r, ['jumlah', 'total', 'amount', 'nominal', 'tagihan'])),
    due: tanggal(due),
    dueShort: tanggalPendek(due),
    paid,
    ref: String(
      pick(r, ['id', 'invoice_id', 'ref', 'no_invoice', 'invoice_no']) ?? '',
    ),
  };
}

export function normalizeInvoices(raw: unknown): Invoice[] {
  return asArray(raw)
    .map((x) => normalizeInvoice(x))
    .filter((x): x is Invoice => x !== null);
}

export function normalizeInvoiceItems(
  raw: unknown,
): { label: string; amount: string }[] {
  return asArray(raw).map((r) => ({
    label: str(r, ['keterangan', 'label', 'nama', 'description', 'item'], {
      section: 'invoiceItems',
      field: 'label',
      fallback: '',
    }),
    amount: rupiah(pick(r, ['jumlah', 'amount', 'harga', 'total', 'nominal'])),
  }));
}

/* =============================================================== payments */

export function normalizePayment(raw: unknown): PaymentRecord | null {
  const r = asRecord(raw);
  if (!r) return null;
  const s = 'payments';
  const paid = bool(r, ['lunas', 'paid', 'berhasil', 'success'], true);
  const speed = num(r, ['kecepatan', 'speed', 'mbps'], {
    section: s,
    field: 'pkg',
    fallback: null,
  });
  return {
    inv: str(r, ['no_invoice', 'invoice_no', 'nomor', 'invoice', 'kode'], {
      section: s,
      field: 'inv',
      fallback: '',
    }),
    amount: rupiah(pick(r, ['jumlah', 'amount', 'total', 'nominal'])),
    date: tanggalPendek(
      pick(r, ['tanggal', 'paid_at', 'date', 'waktu', 'created_at']),
    ),
    pkg:
      str(r, ['paket', 'package', 'nama_paket'], {
        section: s,
        field: 'pkgName',
        fallback: '',
      }) || (speed ? `${speed} Mbps` : ''),
    status: invoiceStatus(pick(r, ['status', 'state']), paid),
  };
}

export function normalizePayments(raw: unknown): PaymentRecord[] {
  return asArray(raw)
    .map((x) => normalizePayment(x))
    .filter((x): x is PaymentRecord => x !== null);
}

/* ======================================================== payment methods */

function methodKind(raw: unknown, name: string): PaymentMethodKind {
  const v = `${String(raw ?? '')} ${name}`.toLowerCase();
  if (v.includes('qris') || v.includes('qr')) return 'qris';
  if (v.includes('virtual') || v.includes('va')) return 'va';
  if (v.includes('wallet') || v.includes('gopay') || v.includes('ovo'))
    return 'ewallet';
  if (v.includes('transfer') || v.includes('bank')) return 'transfer';
  if (v.includes('kartu') || v.includes('card') || v.includes('kredit'))
    return 'card';
  return 'transfer';
}

export function normalizePaymentMethods(
  raw: unknown,
  opts: { outlet?: boolean } = {},
): PaymentMethod[] {
  const s = opts.outlet ? 'paymentOutlets' : 'paymentMethods';
  return asArray(raw).map((r, i) => {
    const name = str(r, ['nama', 'name', 'metode', 'method', 'label'], {
      section: s,
      field: 'name',
      fallback: '',
    });
    return {
      id: String(pick(r, ['id', 'kode', 'code', 'slug']) ?? `${s}-${i}`),
      name,
      note: str(r, ['keterangan', 'note', 'deskripsi', 'description', 'alamat'], {
        section: s,
        field: 'note',
        fallback: '',
      }),
      kind: opts.outlet
        ? 'outlet'
        : methodKind(pick(r, ['jenis', 'type', 'kind', 'channel']), name),
    };
  });
}

/* ================================================================== usage */

export function normalizeUsage(raw: unknown): UsageMonth[] {
  const s = 'usageByMonth';
  return asArray(raw).map((r) => {
    const key = pick(r, ['bulan', 'month', 'periode', 'period']);
    const down =
      num(r, ['download', 'down', 'rx', 'unduh', 'download_gb'], {
        section: s,
        field: 'downGb',
        fallback: 0,
      }) ?? 0;
    const up =
      num(r, ['upload', 'up', 'tx', 'unggah', 'upload_gb'], {
        section: s,
        field: 'upGb',
        fallback: 0,
      }) ?? 0;
    const total = num(r, ['total', 'total_gb', 'pemakaian'], {
      section: s,
      field: 'totalGb',
      fallback: null,
    });
    return {
      month: String(key ?? ''),
      label: bulanPendek(key),
      downGb: down,
      upGb: up,
      totalGb: total ?? down + up,
    };
  });
}

/* =========================================================== live session */

export function normalizeLiveSession(raw: unknown): LiveSession | null {
  const r = asRecord(raw);
  if (!r) return null;
  const s = 'liveSession';
  return {
    online: bool(r, ['online', 'aktif', 'connected', 'status'], true),
    speedMbps:
      num(r, ['kecepatan', 'speed', 'mbps', 'rate', 'rx_rate'], {
        section: s,
        field: 'speedMbps',
        fallback: 0,
      }) ?? 0,
    uptime: str(r, ['uptime', 'durasi', 'lama_koneksi'], {
      section: s,
      field: 'uptime',
      fallback: '',
    }),
    latencyMs: num(r, ['latency', 'ping', 'latensi', 'latency_ms'], {
      section: s,
      field: 'latencyMs',
      fallback: null,
    }),
    packetLoss: num(r, ['packet_loss', 'loss', 'paket_hilang'], {
      section: s,
      field: 'packetLoss',
      fallback: null,
    }),
    ip: str(r, ['ip', 'ip_address', 'alamat_ip'], {
      section: s,
      field: 'ip',
      fallback: '',
    }),
    devices: num(r, ['perangkat', 'devices', 'jumlah_perangkat'], {
      section: s,
      field: 'devices',
      fallback: null,
    }),
  };
}

/* =============================================================== packages */

export function normalizePackages(raw: unknown): PackageTier[] {
  const s = 'offerablePackages';
  return asArray(raw).map((r, i) => ({
    id: String(pick(r, ['id', 'kode', 'code', 'slug']) ?? `paket-${i}`),
    speed:
      num(r, ['kecepatan', 'speed', 'mbps', 'bandwidth'], {
        section: s,
        field: 'speed',
        fallback: 0,
      }) ?? 0,
    price: rupiah(pick(r, ['harga', 'price', 'tarif', 'biaya'])),
    note: str(r, ['keterangan', 'note', 'deskripsi', 'description'], {
      section: s,
      field: 'note',
      fallback: '',
    }),
    current: bool(r, ['aktif', 'current', 'is_current', 'terpakai']),
    popular: bool(r, ['populer', 'popular', 'is_popular', 'rekomendasi']),
  }));
}

export function normalizePendingUpgrade(raw: unknown): PendingUpgrade | null {
  const r = asRecord(raw);
  if (!r) return null;
  const s = 'pendingUpgrade';
  return {
    toSpeed:
      num(r, ['kecepatan', 'speed', 'kecepatan_baru', 'to_speed'], {
        section: s,
        field: 'toSpeed',
        fallback: 0,
      }) ?? 0,
    requestedOn: tanggalPendek(
      pick(r, ['tanggal', 'created_at', 'diajukan', 'requested_at']),
    ),
    status: str(r, ['status', 'state'], {
      section: s,
      field: 'status',
      fallback: 'Diproses',
    }),
  };
}

/* ================================================================ tickets */

function ticketStatus(raw: unknown): TicketStatus {
  const v = String(raw ?? '').toLowerCase();
  if (v.includes('selesai') || v.includes('closed') || v.includes('resolved'))
    return 'Selesai';
  if (v.includes('proses') || v.includes('progress') || v.includes('pending'))
    return 'Diproses';
  return 'Terbuka';
}

export function normalizeTickets(raw: unknown): Ticket[] {
  const s = 'tickets';
  return asArray(raw).map((r, i) => ({
    id: String(pick(r, ['no_tiket', 'ticket_no', 'nomor', 'id', 'kode']) ?? i),
    cat: str(r, ['kategori', 'category', 'jenis', 'type'], {
      section: s,
      field: 'cat',
      fallback: '',
    }),
    subject: str(r, ['subjek', 'judul', 'subject', 'title', 'perihal'], {
      section: s,
      field: 'subject',
      fallback: '',
    }),
    date: tanggalJam(pick(r, ['tanggal', 'created_at', 'waktu', 'dibuat'])),
    status: ticketStatus(pick(r, ['status', 'state'])),
  }));
}

/* ========================================================= network notices */

function noticeSeverity(raw: unknown): NoticeSeverity {
  const v = String(raw ?? '').toLowerCase();
  if (v.includes('gangguan') || v.includes('outage') || v.includes('down'))
    return 'outage';
  if (
    v.includes('maintenance') ||
    v.includes('pemeliharaan') ||
    v.includes('warning')
  )
    return 'warning';
  return 'info';
}

export function normalizeNotices(raw: unknown): NetworkNotice[] {
  const s = 'networkNotices';
  return asArray(raw).map((r, i) => {
    const title = str(r, ['judul', 'title', 'perihal', 'subjek'], {
      section: s,
      field: 'title',
      fallback: '',
    });
    return {
      id: String(pick(r, ['id', 'kode']) ?? `notice-${i}`),
      title,
      body: str(r, ['isi', 'body', 'keterangan', 'deskripsi', 'pesan'], {
        section: s,
        field: 'body',
        fallback: '',
      }),
      severity: noticeSeverity(
        pick(r, ['tingkat', 'severity', 'level', 'jenis', 'type']) ?? title,
      ),
      area:
        str(r, ['area', 'lokasi', 'odp', 'wilayah'], {
          section: s,
          field: 'area',
          fallback: '',
        }) || null,
      eta: (() => {
        const v = pick(r, ['estimasi', 'eta', 'estimasi_selesai', 'resolved_at']);
        return v === undefined ? null : tanggalJam(v);
      })(),
      time: tanggalJam(pick(r, ['waktu', 'time', 'created_at', 'tanggal'])),
    };
  });
}

/* =============================================================== settings */

export function normalizeSettings(raw: unknown): PortalSettings {
  const r = asRecord(raw);
  const s = 'pengaturan';
  return {
    companyName: str(r, ['nama_perusahaan', 'company_name', 'nama', 'brand'], {
      section: s,
      field: 'companyName',
      fallback: 'WinNet ISP',
    }),
    tagline: str(r, ['tagline', 'slogan', 'motto', 'deskripsi'], {
      section: s,
      field: 'tagline',
      fallback: 'Internet Cepat Tanpa Batas',
    }),
    logoUrl:
      str(r, ['logo', 'logo_url', 'url_logo'], {
        section: s,
        field: 'logoUrl',
        fallback: '',
      }) || null,
    supportPhone:
      str(r, ['telepon', 'phone', 'kontak', 'telepon_support', 'whatsapp'], {
        section: s,
        field: 'supportPhone',
        fallback: '',
      }) || null,
    supportEmail:
      str(r, ['email', 'email_support', 'surel'], {
        section: s,
        field: 'supportEmail',
        fallback: '',
      }) || null,
  };
}
