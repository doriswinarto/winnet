import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Android wrapper for the customer app.
 *
 * The WebView loads the bundle from `https://localhost`, not from the portal
 * node, so the app is no longer same-origin with `/bff`. Rather than open a
 * CORS hole and weaken the session cookie to `SameSite=None`, requests are
 * routed through `CapacitorHttp`: fetch is patched to go out through Android's
 * native HTTP stack, which keeps its own cookie jar. No CORS, no SameSite
 * relaxation, and CSRF does not apply — a hostile web page cannot make the
 * native jar send anything.
 *
 * The portal node's IP allowlist is unaffected: the app talks to the node,
 * and only the node talks to the panel.
 */
const config: CapacitorConfig = {
  appId: 'id.net.winartha.winnet',
  appName: 'WinNet',
  webDir: 'dist',

  android: {
    // The panel is reached over TLS; never allow plaintext.
    allowMixedContent: false,
  },

  server: {
    androidScheme: 'https',
  },

  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: '#0B5ED7',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      // The app paints its own header colour; the system bar sits above it.
      overlaysWebView: false,
      style: 'LIGHT',
      backgroundColor: '#F5F8FC',
    },
  },
};

export default config;
