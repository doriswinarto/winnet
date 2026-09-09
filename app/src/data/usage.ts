import type { UsagePeriod } from '../types';

/**
 * Period chips on the Usage screen. The panel takes a `months` argument
 * rather than named periods, so these scope the request rather than map to
 * anything it returns.
 */
export const PERIODS: UsagePeriod[] = [
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
  'Custom',
];
