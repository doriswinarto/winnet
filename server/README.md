# WinNet portal node

The server that holds the panel API key and serves the customer app.

```bash
npm install
cp .env.example .env      # then set WINNET_PORTAL_API_KEY
npm run dev               # tsx watch, :8787
npm run build && npm start
```

## Why this exists

The portal key must be presented from an allowlisted IP, and the browser is
not one. Two separate reasons, either of which is on its own decisive:

- **The bundle is public.** Anything reachable from app code ships to every
  visitor. A `VITE_`-prefixed variable is inlined into the built JavaScript, so
  putting the key there publishes it.
- **A visitor's IP cannot be registered.** That is exactly what separates the
  portal key from the landing-page key: the landing-page key runs from
  arbitrary browsers, the portal key runs from one server with a known address.

So the key lives here, on one machine whose IP goes in Daftar IP, and the
browser only ever talks to this node.

```
browser  ──/bff/*──▶  portal node  ──X-API-Key──▶  panel
         (cookies)    (fixed IP)                  registrasi.winartha.net.id
```

The node also serves the built SPA, so both sit on one origin. That is what
lets the session cookie be `SameSite=Strict` with no CORS surface at all.

## What guards what

The panel has its own gate. These are the second one, so a compromised or
merely buggy front end cannot use this node as a more permissive relay:

| Guard | Where |
| --- | --- |
| `bagian` re-validated against the panel's own list | `guard.ts` |
| `limit` ≤ 100 and `months` ≤ 24, clamped again at the call site | `guard.ts`, `routes/data.ts` |
| Request bodies are `.strict()` — an injected `customer_id` is rejected, not forwarded | `guard.ts` |
| Session token read only from the httpOnly cookie, never from a request body | `session.ts` |
| OTP sends rate-limited per identifier and (loosely) per IP | `routes/auth.ts` |
| An unknown identifier returns the same response as a known one | `routes/auth.ts` |
| Upstream error text is replaced before it reaches the browser | `routes/errors.ts` |
| `/pengaturan` returns normalised fields only | `routes/pengaturan.ts` |

The three properties the brief asked us not to weaken are preserved: the panel
still derives `customer_id` from the token (we never send one), only listed
sections are callable (the allowlist is `SECTIONS` in `shared/portal.ts`, and
nothing cross-customer is in it), and settings stay a whitelist — the node
passes on the normalised fields rather than whatever the panel returned, so a
widened panel whitelist still would not leak WhatsApp or gateway credentials
through this route.

Rate limiting is per process, in memory. **Behind more than one node the
effective limit multiplies by the node count** — move it to Redis before
scaling out.

## Endpoints

Everything is POST unless noted. The browser never sends a token; the cookie
carries it.

| Route | Panel call | Notes |
| --- | --- | --- |
| `/bff/pengaturan` | `/portal/pengaturan` | No session. Cached 5 min, serves stale on failure |
| `/bff/otp/kirim` | `/portal/otp/kirim` | Rate limited |
| `/bff/otp/periksa` | `/portal/otp/periksa` (+ `/ingat/terbitkan`) | Sets session cookie |
| `/bff/sesi/pulihkan` | `/portal/ingat/pulihkan` | Remember-me → session |
| `/bff/sesi` (GET) | — | Is there a session cookie |
| `/bff/keluar` | `/portal/ingat/cabut` | Clears cookies first |
| `/bff/data` | `/portal/data` | Normalises every section |
| `/bff/lapor` | `/portal/tulis/lapor` | Capped per session |
| `/bff/upgrade` | `/portal/tulis/upgrade` | Capped per session |
| `/bff/speedtest` | `/portal/tulis/speedtest` | Wired; the design has no UI for it |
| `/bff/sehat` (GET) | — | Health check |
| `/bff/diagnostik` (GET) | — | Normalizer fields that matched no panel key |

## Pointing it at the real panel

`/data` is the only endpoint whose body the brief spelled out (`token`,
`bagian`). Everything else — the other endpoints' request keys, and the field
names *inside* every section — is a documented guess.

That guesswork is confined to two files:

- **`panelFields.ts`** — request/response key names for the OTP, remember-me
  and write endpoints. Every one is overridable by environment variable, so a
  mismatch is a config change rather than a deploy.
- **`normalize.ts`** — the field names inside each section. Each reader tries
  a list of plausible keys; correcting one is a one-line edit, and no route,
  type or screen changes with it.

Nothing silently renders blank. A reader that matches no key logs the section,
the field and the names it tried, and `GET /bff/diagnostik` lists everything
unmatched so far. **After the first run against the real panel, read that
list** — it is the to-do list for `normalize.ts`.

Values are normalised as well as renamed: money through `rupiah()`, dates
through the Indonesian formatters, statuses onto the closed sets the UI knows.
An explicit status always beats an inferred one — a `pending` invoice is never
reported as settled because a `paid` flag defaulted true.

## Deploying

1. Build the app first (`cd ../app && npm run build`) — the node serves
   `../app/dist`.
2. Set `WINNET_PORTAL_API_KEY`, and register this machine's public IP in the
   panel's Daftar IP.
3. Run behind TLS. Keep `WINNET_SECURE_COOKIES=true`; set
   `WINNET_TRUST_PROXY` to the number of proxy hops so OTP rate limiting sees
   the real client IP rather than the proxy's.
