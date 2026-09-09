# Android build

The customer app wrapped as an APK with Capacitor. Same React code as the web
build; the Android project lives in `android/`.

```bash
cp .env.example .env          # set VITE_PORTAL_ORIGIN
npm run android:sync          # build the web bundle and copy it into android/
npm run android:open          # open in Android Studio
npm run android:apk           # or assemble a debug APK from the CLI
```

The debug APK lands at
`android/app/build/outputs/apk/debug/app-debug.apk`.

Building needs the Android SDK (API 36, build-tools) and JDK 17+. Android
Studio installs both; from the CLI, `sdkmanager "platforms;android-36"
"build-tools;36.0.0"` and an `ANDROID_HOME` pointing at the SDK.

## Why the APK could exist at all

Because the app talks to the portal node, not the panel. The panel key is
bound to allowlisted IPs — a phone's IP can never be one — so an app calling
the panel directly would be impossible. The node is the fixed address in
front of it, and Android is just another client of `/bff`.

## What differs from the web build

Four things, each keyed off `isNative()` in `src/api/platform.ts`.

**The API origin becomes absolute.** In a browser the node serves the bundle,
so `/bff` is relative and same-origin. In the APK the WebView serves from
`https://localhost`, where `/bff` would resolve *inside the APK*. The native
build therefore needs `VITE_PORTAL_ORIGIN` — the node's public https origin.
That is a public URL, not a secret; the panel key stays in `server/.env`.

**The session cookie changes flags — for the app only.** Android's
`CookieManager` honours `SameSite`, and from its point of view a WebView on
`https://localhost` calling the node is cross-site, so a `Strict` cookie would
never be sent back. Rather than loosen the cookie for everybody, the app
identifies itself with an `X-WinNet-Client` header and only those responses
get `Secure; SameSite=None`. Browser sessions keep `Strict`.

A web page cannot forge that header: sending a custom header cross-origin
requires a CORS preflight, and the node grants no CORS at all. And CSRF does
not apply to the app anyway — the cookie sits in Android's native jar, which
no web page can make send anything.

Requests go through `CapacitorHttp`, which patches `fetch` to use Android's
HTTP stack and its cookie jar. That is what avoids needing CORS in the first
place.

**The drawn status bar comes off.** The `09:41` bar and the notch are
browser-preview chrome; a handset has real ones and two would collide. On
Android they are replaced by a safe-area inset, and the system bar is coloured
to match the theme — including when Mode Neon is toggled, or there is a seam.

**The hardware back button.** Navigation is state, not routes, so back would
otherwise close the app from any screen. There is now a screen history stack:
back unwinds it, rewinds a step inside the payment flow rather than leaving it,
and only exits from the root. Signing out clears the stack so back from Login
cannot return to a screen with no session behind it.

## Before shipping

- **Signing key.** `android:apk` produces a *debug* APK — fine for sideloading
  and testing, not for Play. Generate a release keystore, keep it out of the
  repo (`.gitignore` covers `*.jks`/`*.keystore`), and back it up: losing it
  means never being able to update the listing, and leaking it means someone
  else can sign updates as you.
- **`applicationId`** is `id.net.winartha.winnet`. It is permanent once
  published — change it now if it is wrong.
- **TLS is required.** `allowMixedContent` is false and there is no cleartext
  permission, so the node must be reachable over https.
- **Version code** in `android/app/build.gradle` must increase on every Play
  upload.
- The panel gaps in `README.md` apply here too — an APK that cannot take a
  payment is still an APK that cannot take a payment.
