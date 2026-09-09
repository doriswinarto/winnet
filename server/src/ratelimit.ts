/**
 * Small in-memory fixed-window limiter, used to keep `/otp/kirim` from being
 * turned into a WhatsApp spam cannon (each send costs money and lands on a
 * real customer's phone).
 *
 * In memory means per process: if you run more than one portal node behind a
 * load balancer, move this to Redis or the limit multiplies by the node count.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Drop expired buckets so a long-running process does not grow unbounded. */
function sweep(now: number): void {
  if (buckets.size < 1000) return;
  for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
}

export interface RateResult {
  allowed: boolean;
  /** Seconds until the window resets. */
  retryAfter: number;
}

export function consume(
  key: string,
  max: number,
  windowSec: number,
): RateResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { allowed: true, retryAfter: 0 };
  }

  const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
  if (existing.count >= max) return { allowed: false, retryAfter };

  existing.count += 1;
  return { allowed: true, retryAfter };
}

/** Test seam. */
export function resetRateLimits(): void {
  buckets.clear();
}
