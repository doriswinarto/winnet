import { z } from 'zod';
import { MAX_LIMIT, MAX_MONTHS, SECTIONS } from '../../shared/portal.js';

/**
 * Everything the browser sends is re-validated here before any of it reaches
 * the panel. The panel has its own gate — this is the second one, so that a
 * compromised or simply buggy front end cannot use this node as an open relay
 * to probe the panel with arguments we never intended to forward.
 */

const sectionEnum = z.enum(SECTIONS);

export const dataRequestSchema = z
  .object({
    bagian: z.array(sectionEnum).min(1).max(SECTIONS.length),
    limit: z.number().int().positive().max(MAX_LIMIT).optional(),
    months: z.number().int().positive().max(MAX_MONTHS).optional(),
    invoiceRef: z.string().min(1).max(128).optional(),
  })
  // Anything else the caller invents is dropped rather than forwarded. In
  // particular customer_id: the panel derives it from the session token, and
  // accepting one here would be the one change that breaks that guarantee.
  .strict();

export const otpSendSchema = z
  .object({ identifier: z.string().trim().min(3).max(64) })
  .strict();

export const otpVerifySchema = z
  .object({
    identifier: z.string().trim().min(3).max(64),
    code: z
      .string()
      .trim()
      .regex(/^[0-9]{4,8}$/, 'kode OTP tidak valid'),
    ingatSaya: z.boolean().optional(),
  })
  .strict();

export const laporSchema = z
  .object({
    kategori: z.string().trim().min(1).max(64),
    keterangan: z.string().trim().min(1).max(2000),
  })
  .strict();

export const upgradeSchema = z
  .object({ paketId: z.string().trim().min(1).max(64) })
  .strict();

export const speedtestSchema = z
  .object({
    downloadMbps: z.number().nonnegative().max(100_000),
    uploadMbps: z.number().nonnegative().max(100_000),
    latencyMs: z.number().nonnegative().max(600_000).optional(),
  })
  .strict();

/**
 * Belt and braces on the numeric caps. The schemas above already reject an
 * over-limit value; this makes the clamp explicit at the call site so the
 * panel never sees a number outside its documented range even if a schema is
 * later relaxed.
 */
export function clampLimit(n: number | undefined): number | undefined {
  return n == null ? undefined : Math.min(Math.max(1, Math.trunc(n)), MAX_LIMIT);
}

export function clampMonths(n: number | undefined): number | undefined {
  return n == null
    ? undefined
    : Math.min(Math.max(1, Math.trunc(n)), MAX_MONTHS);
}
