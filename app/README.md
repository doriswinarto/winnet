# WinNet ISP — customer mobile app

A React + TypeScript implementation of the `WinNet Mobile App.dc.html` design
from the Claude Design handoff bundle in `../project/`.

Twelve screens, a light default theme and a **Neon Glow** dark theme, with the
animation set the design calls for: pulsing status dots, a flowing fiber line,
a live speed gauge, circular usage rings, press glow, screen transitions and
success toasts.

```bash
npm install
npm run dev      # http://localhost:5173, proxies /bff to the portal node
npm run build    # typecheck + production bundle
npm run lint
```

Data comes from the WinNet panel through the portal node in `../server`, which
holds the IP-locked API key — see its README. Start that too (`:8787`) for
live data; without it the app falls back to the design's content and says so.

## Live data

The browser never sees the panel. `../server` fetches, validates and
normalises, and the app only ever handles the view models in
`../shared/portal.ts`. There is no API key in this package and there must
never be — `VITE_`-prefixed variables are inlined into the built bundle.

`src/api/PortalProvider.tsx` fetches everything in one `/bff/data` call on
sign-in and exposes it through `usePortal()`. When the node is unreachable it
falls back to `src/data/mock.ts`, which carries the design's content in the
same shapes — so there is one rendering path, and the mock stays useful as a
visual reference. `source` tells the UI which it is looking at.

The session lives in an httpOnly cookie the node sets, so no screen handles a
token and script on the page cannot read one.

The live speed meter polls every 15s rather than the design's 1.4s — that
cadence against a real panel would be absurd, and the gauge's own 0.9s
transition carries the movement. On mock data the 1.4s jitter is kept so the
design still demos as drawn.

## Layout

On a desktop viewport the app renders inside a phone bezel with the brand mark
and Light / Neon Glow pills beside it — the way the design was presented. Below
460px the bezel and that chrome fall away and the app fills the screen; the
theme is then switched from **Profil → Mode Neon**, as in the design.

## Structure

```
src/
  styles/theme.css     .lite / .neon token sets, keyframes, frame chrome
  styles/fonts.css     self-hosted Plus Jakarta Sans + JetBrains Mono
  state/AppContext.tsx one store: theme, screen, payment step, filters, toast
  data/                all customer/billing/usage/ticket/notification content
  components/          phone frame, header, bottom nav, toast, primitives
  screens/             one component per screen
```

`theme.css` holds every colour and shadow from the design verbatim. Both themes
are pure CSS-variable swaps, so no component branches on the theme except where
the design itself does (the nav's active glow).

`--gk` scales the alpha of every glow shadow. It is the `glow` strength control
from the design's props panel; `1` is the design as drawn, `0` removes the glow.

## Data

All content is static mock data under `src/data/` — the Indonesian copy,
Rupiah amounts, ODP/OLT/ONT references and customer record (Budi Santoso,
WN-1180-4472) from the design. There is no backend; wiring one up means
replacing those modules, which is why they are kept apart from the screens.

The one live value is the speed meter, which re-reads every 1.4s within the
design's 45.4–49.8 Mbps band and drives both the Service Status gauge and its
KECEPATAN metric.

## Where this departs from the prototype

The prototype is a design canvas — a live frame plus twelve static frames — so
a few things had to be decided rather than copied:

- **Login is an OTP flow, not a password.** The panel authenticates by
  WhatsApp OTP plus an optional "ingat saya" token; it exposes no password
  endpoint, so the design's password field had nothing behind it. The screen
  keeps its layout — logo block, illustration panel, identifier tabs, button
  stack — and swaps the password field for a code step. *Ingat saya* now issues
  the remember-me token, and *Keluar* revokes it.
- **Entry point.** The app opens on Login (the canvas opened on Home). A valid
  remember-me token skips it.
- **Service Status** has no entry point in the prototype. The Home connection
  card now opens it, being the summary of that screen.
- **Ticket and notification filter chips** were decorative in the prototype and
  now filter their lists. `Semua` is the default, so the resting view is
  unchanged. `Tagihan` covers billing and payment notices, `Internet` covers
  connection and maintenance notices.
- **Bottom nav active glow** applies to whichever tab is active; the prototype
  hard-coded it to Home.
- **Login method tabs** (Customer ID / Email / No. HP) switch the credential
  field, which was static in the prototype.
- **Dead controls** — *Unduh/Lihat Invoice*, *Edit Profil*, *Ubah Password*,
  *Unduh Bukti Pembayaran* — now raise a confirmation toast instead of doing
  nothing. The message composer is a real input.
- **Ticket detail** opens scrolled to the newest message, so the technician's
  reply and the typing indicator are visible without scrolling.
- **Fonts are self-hosted** rather than pulled from the Google Fonts CDN.

## Where the design outran the API

Seven of the twelve screens map cleanly onto panel sections. These did not, and
the resolution is stated rather than faked:

| Design | Resolution |
| --- | --- |
| Password login | No endpoint. Rebuilt as the OTP flow above. |
| Register screen | No endpoint — the portal serves existing customers. Left on mock content; it does not create anything. |
| Daily usage chart (Sen–Min) | The panel exposes `usageByMonth` only, so the chart is monthly. Same component, same look. |
| "Rata-rata harian" tile | Restated per month, the granularity the data has. |
| Ticket conversation + composer | `tickets` returns rows; there is no message thread and no reply endpoint. The thread is illustrative and the composer raises a toast. |
| Payment: QRIS code, "Saya Sudah Bayar" | `paymentMethods` / `paymentOutlets` are read-only and there is no create-payment write. Method selection is live; the confirm and success steps are presentational. |
| Notification centre | No notifications section. The feed is `networkNotices` plus a billing entry derived from the outstanding invoice; the design's promo and receipt notices have no source and are not invented. |
| Profil → Keamanan tab | No security section. Derived from what the login flow itself establishes. |
| "Ubah Password" button | Nothing to change — replaced with support contact. |

The reverse gap: `/tulis/speedtest` exists and is wired end to end, but the
design has no speed-test screen. The Service Status gauge is a passive reading,
not a test the customer runs.

*Buat Tiket Baru* posts to `/tulis/lapor` using the active network notice for
its category and description, since the design's button opens no form. A form
is the obvious next step.
- Accessibility work the prototype had no need for: every tappable is a real
  button, the toast is a live region, tabs and chips carry pressed state, and
  `prefers-reduced-motion` stops the looping animations.
