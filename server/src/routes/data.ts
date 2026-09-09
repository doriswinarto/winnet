import { Router } from 'express';
import type { DataResponse, Section } from '../../../shared/portal.js';
import { clampLimit, clampMonths, dataRequestSchema } from '../guard.js';
import { callPanel, PANEL_PATHS } from '../panel.js';
import { asRecord } from '../fields.js';
import {
  normalizeCustomer,
  normalizeInvoice,
  normalizeInvoiceItems,
  normalizeInvoices,
  normalizeLiveSession,
  normalizeNotices,
  normalizePackages,
  normalizePayment,
  normalizePaymentMethods,
  normalizePayments,
  normalizePendingUpgrade,
  normalizeTickets,
  normalizeUsage,
} from '../normalize.js';
import { requireSession } from '../session.js';
import { sendPanelError } from './errors.js';

export const dataRouter = Router();

/** Pulls one section out of the panel response, tolerating an envelope. */
function sectionOf(payload: unknown, name: Section): unknown {
  const root = asRecord(payload);
  return root ? root[name] : undefined;
}

const NORMALIZERS: {
  [K in Section]: (raw: unknown) => DataResponse[K];
} = {
  customer: (raw) => normalizeCustomer(raw),
  unpaidInvoices: (raw) => normalizeInvoices(raw),
  currentInvoice: (raw) => normalizeInvoice(raw),
  invoice: (raw) => normalizeInvoice(raw),
  invoiceItems: (raw) => normalizeInvoiceItems(raw),
  paymentOf: (raw) => normalizePayment(raw),
  payments: (raw) => normalizePayments(raw),
  usageByMonth: (raw) => normalizeUsage(raw),
  liveSession: (raw) => normalizeLiveSession(raw),
  offerablePackages: (raw) => normalizePackages(raw),
  pendingUpgrade: (raw) => normalizePendingUpgrade(raw),
  tickets: (raw) => normalizeTickets(raw),
  networkNotices: (raw) => normalizeNotices(raw),
  paymentMethods: (raw) => normalizePaymentMethods(raw),
  paymentOutlets: (raw) => normalizePaymentMethods(raw, { outlet: true }),
};

dataRouter.post('/data', async (req, res) => {
  const token = requireSession(req, res);
  if (!token) return;

  const parsed = dataRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Permintaan tidak valid.' });
    return;
  }
  const { bagian, limit, months, invoiceRef } = parsed.data;

  // The token is read from the httpOnly cookie, never from the request body,
  // and no customer identifier is forwarded: the panel derives customer_id
  // from the token, which is what stops this node reading anyone else's data.
  const body: Record<string, unknown> = { token, bagian };
  const safeLimit = clampLimit(limit);
  const safeMonths = clampMonths(months);
  if (safeLimit !== undefined) body.limit = safeLimit;
  if (safeMonths !== undefined) body.months = safeMonths;
  if (invoiceRef !== undefined) body.invoiceRef = invoiceRef;

  try {
    const payload = await callPanel(PANEL_PATHS.data, body);
    const out: DataResponse = {};
    for (const name of bagian) {
      const raw = sectionOf(payload, name);
      if (raw === undefined) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (out as any)[name] = NORMALIZERS[name](raw);
    }
    res.json(out);
  } catch (err) {
    sendPanelError(res, err);
  }
});
