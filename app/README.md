# WinNet ISP — customer mobile app

A React + TypeScript implementation of the `WinNet Mobile App.dc.html` design
from the Claude Design handoff bundle in `../project/`.

Twelve screens, a light default theme and a **Neon Glow** dark theme, with the
animation set the design calls for: pulsing status dots, a flowing fiber line,
a live speed gauge, circular usage rings, press glow, screen transitions and
success toasts.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
npm run lint
```

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

- **Entry point.** The app opens on Login (the canvas opened on Home). *Masuk*
  goes to Home; *Keluar* on Profil returns to Login.
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
- Accessibility work the prototype had no need for: every tappable is a real
  button, the toast is a live region, tabs and chips carry pressed state, and
  `prefers-reduced-motion` stops the looping animations.
