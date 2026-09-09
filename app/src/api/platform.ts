import { Capacitor } from '@capacitor/core';

/**
 * Whether we are inside the Android WebView rather than a browser tab.
 *
 * Everything platform-specific keys off this one predicate, so the difference
 * stays visible in a handful of places instead of spreading through screens.
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export function platform(): string {
  return Capacitor.getPlatform();
}
