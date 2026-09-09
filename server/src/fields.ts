/**
 * Field readers for panel payloads.
 *
 * The exact key names the panel returns are not documented in the brief we
 * were given, so each view-model field is read from a short list of candidate
 * keys. When none of them match, `missing()` records it once so the log names
 * precisely which field to correct rather than the app silently rendering a
 * blank — see `normalize.ts` for the mapping and README for how to fix it.
 */

const reported = new Set<string>();

export function missing(section: string, field: string, tried: string[]): void {
  const key = `${section}.${field}`;
  if (reported.has(key)) return;
  reported.add(key);
  console.warn(
    `[panel] no key matched for ${key} (tried: ${tried.join(', ')}). ` +
      `Add the real key to normalize.ts.`,
  );
}

/** Which fields have gone unmatched so far, for the /bff/diagnostik route. */
export function unmatchedFields(): string[] {
  return [...reported].sort();
}

type Rec = Record<string, unknown>;

export function isRecord(v: unknown): v is Rec {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function asArray(v: unknown): Rec[] {
  if (Array.isArray(v)) return v.filter(isRecord);
  // Some panels wrap collections as { data: [...] } or { items: [...] }.
  if (isRecord(v)) {
    for (const k of ['data', 'items', 'rows', 'list', 'hasil']) {
      if (Array.isArray(v[k])) return (v[k] as unknown[]).filter(isRecord);
    }
  }
  return [];
}

/** Unwraps { data: {...} } style envelopes around a single object. */
export function asRecord(v: unknown): Rec | null {
  if (!isRecord(v)) return null;
  for (const k of ['data', 'item', 'hasil']) {
    if (isRecord(v[k])) return v[k] as Rec;
  }
  return v;
}

/** First candidate key that is present and not null. */
export function pick(src: Rec | null, keys: string[]): unknown {
  if (!src) return undefined;
  for (const k of keys) {
    const v = src[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

export function str(
  src: Rec | null,
  keys: string[],
  opts: { section: string; field: string; fallback?: string },
): string {
  const v = pick(src, keys);
  if (v === undefined) {
    if (opts.fallback === undefined) missing(opts.section, opts.field, keys);
    return opts.fallback ?? '';
  }
  return String(v);
}

export function num(
  src: Rec | null,
  keys: string[],
  opts: { section: string; field: string; fallback?: number | null },
): number | null {
  const v = pick(src, keys);
  if (v === undefined) {
    if (opts.fallback === undefined) missing(opts.section, opts.field, keys);
    return opts.fallback ?? null;
  }
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function bool(src: Rec | null, keys: string[], fallback = false): boolean {
  const v = pick(src, keys);
  if (v === undefined) return fallback;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  return s === '1' || s === 'true' || s === 'ya' || s === 'aktif' || s === 'online';
}
