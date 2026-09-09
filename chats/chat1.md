# Mobile app neon glow design

_Started 2026-09-09 12:15 UTC_

---

## User

Design a mobile app for for customer power full neon glow animatiion full

## Assistant



## Assistant

The brief specifies a clean white premium ISP look; your message asks for full neon glow. Those pull opposite directions, so a few quick calls before I build.

_[tool: ask_user]_

Waiting on your answers — mainly the neon direction, since that decides the whole visual system.

## User

Answered — neon_mode: Both: light default with a neon dark-mode toggle in the app; screens: Login, Register, Home, Internet Usage, Billing, Payment flow, My Package, Ticket list, Ticket detail, Service Status, Profile, Notifications; frame: Both; anim: Speed gauge / live meter, Usage circular progress, Fiber-line data flow, Card glow pulse, Screen transitions, Button press glow, Toast + success states

## Assistant

Building it now — one DC with a live interactive phone plus a gallery of all 12 screens, light default and a neon dark mode.

_[tool: dc_write]_

_[tool: ready_for_verification]_

WinNet ISP mobile app — leftmost frame is a live prototype (tap nav, run the payment flow, toggle theme), followed by all 12 screens as static frames.

- Light default with a **Neon Glow** dark mode (toggle top-right, or in Profil → Mode Neon); glow strength is a tweak.
- Animated: pulsing status dots, flowing fiber line, live speed gauge, usage rings, glow on press, screen transitions, success toast.
- Realistic Indonesian data throughout (Budi Santoso, WN-1180-4472, Rupiah, ODP/OLT/ONT terms).

Next: desktop/tablet portal screens from the same brief, or a "gangguan/offline" variant of Home and Status.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed: the theme prop now only seeds the initial value, so both the header pills and the in-app "Mode Neon" switch flip to neon.

