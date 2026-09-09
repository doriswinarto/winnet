import { SplashScreen } from '@capacitor/splash-screen';
import { Style, StatusBar } from '@capacitor/status-bar';
import type { Theme } from '../types';
import { isNative } from './platform';

/**
 * Android-only wiring. Every call is a no-op in a browser, so callers do not
 * have to guard, and the web build stays exactly as it was.
 */

/** Marks the document so the stylesheet can drop the desktop phone frame. */
export function markNativePlatform(): void {
  if (!isNative()) return;
  document.documentElement.classList.add('native');
}

/**
 * Keeps the system status bar in step with the in-app theme. The bar sits
 * above the app rather than over it, so its background has to match the
 * screen's or there is a visible seam when Mode Neon is toggled.
 */
export async function applyNativeTheme(theme: Theme): Promise<void> {
  if (!isNative()) return;
  const neon = theme === 'neon';
  try {
    await StatusBar.setBackgroundColor({ color: neon ? '#05070F' : '#F5F8FC' });
    // Style.Light means dark content on a light bar, and vice versa.
    await StatusBar.setStyle({ style: neon ? Style.Dark : Style.Light });
  } catch {
    /* older Android versions refuse to colour the bar; not worth surfacing */
  }
}

/** Dismisses the launch image once React has painted something. */
export async function hideSplash(): Promise<void> {
  if (!isNative()) return;
  try {
    await SplashScreen.hide();
  } catch {
    /* already hidden */
  }
}
