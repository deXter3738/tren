# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tren (this fork)

**Tren is a restyled fork of openGym.** Everything below the line is openGym's own guide and is
still accurate about the engine. This section is what is different here, and it wins where the two
disagree.

Tren is a free workout tracker for logging sets fast between rests. The design lives in `design/`
(the handover pack: `design/HANDOFF.md` first, then `design/design-system/`). **`design/` is the
source of truth** for every colour, size, corner, timing and word. The canvas wins on layout and
wording, the design system on token values, the PRD on scope.

### Golden rules (design/HANDOFF.md)

1. **Restyle, don't rebuild.** Change how openGym looks; keep its data, sync and offline logic.
2. **Tokens only.** Every colour, size, spacing, corner and shadow comes from a Tren token. No
   hard-coded values in screens.
3. **Copy is final.** Use the wording on the canvas word for word, curly apostrophes included.
4. **States are part of the spec.** A screen is not done until its empty, loading, offline and
   error states match the States boards.
5. **Light and dark.** Every screen works in both, through the tokens.
6. **Reduce motion.** With "reduce motion" on, all animation stops and changes happen instantly.
7. **Ask, don't assume.** Anything missing goes on the open-questions list, not into the code.

### Where Tren's code lives

```
design/                     the handover pack (read-only reference; never hand-edit tokens.css)
design/boards/              board PNGs exported from the canvas — screens wait for these
frontend/src/tren/          tokens.css, fonts.css, bridge.css, type.css, bottom-bar.css,
                            toast.css, global.js (the global behaviours' words and numbers),
                            ConnectionWatch.jsx
frontend/src/ui/tren/       the design system's React components (.tsx), verbatim
docs/UPSTREAM.md            how to merge openGym, and every upstream file Tren has changed
```

### The five policies

1. **Upstream-merge friendliness.** New Tren code goes in new files. Edits to upstream files are
   kept to a short list, and that list is `docs/UPSTREAM.md` — add to it in the same commit.
2. **CSS tests.** openGym has 28 tests that read `index.css` as text. Leave its token block alone
   apart from the two deleted `--bg` lines. In Tren CSS: no `env()` (use `--sab` / `--sat`) and no
   unguarded `color-mix()`.
3. **i18n.** **v0.1 is English only** (owner, 28 Oct 2026). New Tren copy still goes through
   `t()`, so translating later is only a matter of adding keys, but the keys are **not** added to
   openGym's 19 locale packs: a key in no pack renders its English text, `check-locales.mjs` stays
   green, and nothing conflicts on an upstream merge. `check-source-strings.mjs` lists those keys
   in its report (CI runs it report-only); that list is the Tren copy waiting to be translated.
4. **TypeScript.** `.tsx` only under `frontend/src/ui/tren/`, as close to byte-identical to
   `design/design-system/components/src/` as the app allows, so a new drop from the designer is a
   `diff -r`. Three files carry a `TREN PATCH` comment at the top and a row in `docs/UPSTREAM.md`;
   the rest are untouched. There is no type-check step; app code stays plain JS.
5. **Media.** The Gym visual 180 px exercise files stay unmodified, the credit line in
   Settings → About stays word for word, and they are never sent to any AI service.

### Token quick reference

Names match the design system one for one (`--ink-muted`, `--radius-xl`, `--space-14`).

- **Colour:** `--bg` pages · `--surface-card` cards (no borders) · `--surface-sheet` sheets ·
  `--ink` / `--ink-muted` text · `--train-*` the monochrome primary action · `--blue-500` rest ·
  `--green-500` done or synced · `--danger-500` destructive and errors · `--rpe-6…10` the effort
  slider. Yellow appears **only** in the effort slider and the faint training-day glow.
- **Type:** Inter, self-hosted. 13 · 16 · 20 · 31 · 61 · 76 · 95. Letter spacing 0 at 13,
  −0.011em at 16, −0.017em at 20, −0.021em at 31, −0.022em at 61+. Changing numbers are tabular.
- **Spacing:** 4 · 8 · 12 · 16 · 20 · 24 · 48 · 56 only. Screen margins 24, card padding 16,
  gaps 8.
- **Corners:** 12 rows · 16 inputs · 20 tiles · 24 cards and menus · 32 sheets · pill for
  buttons, bars and circles.
- **Motion:** presses `cubic-bezier(.32,.72,0,1)` 0.35s · morphs `cubic-bezier(.34,1.25,.64,1)`
  0.62s · pops `cubic-bezier(.34,1.45,.64,1)` 0.35–0.5s · cross-fades opacity + 8px blur 0.32s.

### Build order

`design/HANDOFF.md` ends with the build order. Done so far: tokens + Inter, the bottom bar, and
the global behaviours (the handover's eight toasts and banners, which are words and numbers, not
layout, so they did not wait for a board).
Next: Home and Live workout — **both need `design/boards/` 04, 05 and 06**, which are not in the
repo yet. Then Summary and History, Routines and Add exercise, the account screens, You / Delete /
Privacy, and Admin.

---

For people, the same map with diagrams is [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Outside v0.1, so not described here:** the Android, iPhone and Apple Watch apps, the widgets and
their native bridges, the MCP server, the website, and the Helm / Kubernetes / Nix deploys. They
are mapped in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and indexed in
[docs/README.md](docs/README.md); don't open those folders for v0.1 work.

## What this is

openGym is a self-hosted gym and body-weight tracker. Two containers (`api` + `web`) plus a
`./data` folder the user owns: no third-party account, no telemetry. Passkey (WebAuthn) login and
installable as a PWA. License: AGPL-3.0-or-later; the exercise media are licensed separately
(NOTICE.md).

## Project layout

```
frontend/   React 19 + Vite app (src/views, src/components, src/store, src/lib, src/sheets.jsx).
api/        Backend: server.js (plain node:http) plus small testable modules beside it.
            coach/ is the optional AI coach; coach/core/ is shared with the phone apps.
            openapi.yaml documents every route.
web/        Multi-stage Dockerfile (builds frontend, adds catalogue/media, serves with nginx) and
            nginx.conf.template (serves the app, proxies /api).
catalogue/  The exercise database: exercises/<id>.json, i18n/, licensed 180 px media/.
scripts/    Build, CI and release helpers (scripts/README.md).
docs/       Guides indexed in docs/README.md; docs/dev/ holds feature design notes.
```

## Commands

```bash
# Local stack (api + web, prebuilt or built from source)
cp .env.example .env
docker compose up -d --build

# Frontend dev server (hot reload), proxies /api to :3000
cd frontend && npm install && npm run dev

# Tests (Node 22, the version CI and the Dockerfiles use)
cd frontend && npm test                          # vitest run, the whole suite
cd frontend && npx vitest run src/lib/progression.test.js   # one file
cd frontend && npx vitest run -t "some test name"           # one test by name
cd api && npm test                               # node --test

# Checks CI runs besides the suites (run `npm ci` in the repo root once, for js-yaml)
cd frontend && node scripts/check-locales.mjs && node scripts/check-source-strings.mjs --strict
node scripts/catalogue/build.mjs --check
node scripts/build-coach-assets.mjs --check
node scripts/build-api-docs.mjs --check

# Build
cd frontend && npm run build
```

There is no linter/formatter config and no TypeScript; match the existing style by hand.

GitHub (`github.com/DuarteSantos8/openGym`) is the home of the project. Pull requests are gated by
`.github/workflows/test.yml`.

## Architecture

### Frontend (`frontend/src`)

- **`store/useStore.js`**: a single Zustand store holding the client-side app state (`S`),
  persisted to `localStorage` (`gym_state_v1`) and debounce-pushed to the server when signed in
  (`pushState`, see `lib/api.js`). `store/useUI.js` holds ephemeral UI state (modals, active
  sheet, rest timer) separately from persisted data.
- **`lib/`**: pure, framework-free helpers, each paired with a same-directory `*.test.js`. The
  domain logic lives here, most importantly:
  - `progression.js`: the progression-rule engine (linear, Greyskull LP, double and triple
    progression, time-based). Rules implement a shared policy interface.
  - `onerm.js`: estimated 1RM from logged sets (several formulas).
  - `finish-workout.js`: reduces a completed session back into state (weights advance, PRs).
  - `recovery.js` / `recovery-view.js`: the fatigue and muscle-recovery model.
  - `workout-model.js`, `supersetFlow.js`: the in-session workout state machine.
  - `sync-merge.js`: the field-by-field merge behind the 409 retry (see "Sync" below).
  - `exercises.js` / `exercises-data.js`: the exercise library (5,632 catalogue exercises plus
    user-defined ones). `lib/exercises-data.js` and `src/instr/`, `src/exercise-names/` and
    `src/exercise-desc/` are generated from `catalogue/` by `scripts/catalogue/build.mjs`; they
    are huge, never edit them by hand and never read them.
  - `api.js`: the only place that talks to the backend (`fetch` wrapper, session flows).
  - CONTRIBUTING.md is explicit: **anything that decides what you lift next, or reads a logged
    session back, is a pure helper here with a unit test beside it.**
- **Body measurements (`lib/measurements.js`, `views/Measurements.jsx`)**: one check-in per day.
  Built-in circumferences and legacy custom fields store cm and follow the profile's cm/in
  display. Custom definitions may specify `unit: 'cm' | 'in' | '%' | 'kg' | 'lb' | 'none'`; that
  display choice stays fixed when the profile switches kg/lb. Custom values store canonical cm, kg
  (to 0.001 kg so a tenth of a pound round-trips), percent (0 to 100) or a plain number. Each
  custom reading also carries its unit, preserving its meaning in backups without definitions.
  Once values exist, the unit selector permits cm/in or kg/lb conversions within the recorded
  type; a different type needs a new field. The body CSV names a custom column with its unit,
  "Muscle ratio (%)", and the importer reads those columns back (only from our own header).
- **`views/`**: one file per screen, routed by `react-router-dom` from `App.jsx`.
- **`sheets.jsx`**: the bottom sheets (exercise picker, exercise config, workout detail, plan
  import...). It is large; a new sheet can go into `components/` as its own file.
- **`components/`**: shared UI (charts, modals, timers, media).
- **`locales/`**: one i18n pack per language, keyed by the English string (`lib/i18n.js`,
  `i18n-core.js`). v0.1 is English only, so Tren adds no keys to the packs and there is no reason
  to open them.

### API (`api/server.js`)

Plain `node:http`, no framework. Requests are dispatched through a `routes` object keyed by
`'METHOD /path'` (e.g. `routes['GET /api/health']`); add an endpoint by adding a key and its entry
in `openapi.yaml` (`openapi-routes.test.js` compares them). State is JSON under `DATA_DIR`:
`db.json` (users, credentials, push subscriptions, invites) and `state-<uid>.json` per user,
written temp-then-rename (`durable.js`). Custom-exercise photos and videos live in
`DATA_DIR/uploads` (`media.js`). Auth is WebAuthn passkeys (`@simplewebauthn/server`), an optional
password, and a signed session cookie (HMAC with `DATA_DIR/secret`); paired phones get the same
session as a bearer token. Optional pieces are gated by env vars: `ADMIN_UIDS`, `INVITE_ONLY`,
`ALLOW_GUEST`, `PASSWORD_LOGIN`, `AUDIT_*`. Web Push (`web-push`, VAPID keys in `data/vapid.json`)
drives rest-timer and reminder notifications.

### Sync

Each profile is one document with a server revision. A device PUTs with the revision it last saw;
if another device wrote in between, the server answers 409 with the current document and the
client merges (`lib/sync-merge.js`) and retries. Every change carries its own stamp, per setting
and per field, so the newest edit of each wins and deletions stay deleted.

### Code that exists twice on purpose

The API image cannot import the frontend, so some rules are hand-copied. Change both sides
together: `lib/sync-merge.js` and `api/sync-stamps.js` (parity test), `lib/glyphs.js` and
`api/coach/core/glyphs.js` (parity test), `lib/nudge.js` and `api/nudge.js`, `lib/queue.js` and
`api/queue.js` (mirrored test cases only, nothing compares the code). The other way round,
`lib/coach-local.js` imports `api/coach/core/` directly so the phones run the same coach pipeline.

### Passkeys and self-hosting constraints

WebAuthn passkeys are bound to an exact hostname (`RP_ID`) and need HTTPS (localhost excepted).
Read `docs/SELF_HOSTING.md` before touching auth, session or notification code; it documents the
env-var contract (`RP_ID`, `ORIGIN`, `PORT`, `WEB_PORT`, `NGINX_PORT`, `BACKEND`, `SESSION_DAYS`,
`ADMIN_UIDS`, `INVITE_ONLY`, `ALLOW_GUEST`, `AUDIT_*`, `VAPID_SUBJECT`) that real deployments
depend on.

### Docker / deploy

`docker-compose.yml` has two services, `api` and `web`. The web image builds `frontend/`, copies
`catalogue/media` into it as `/exercise-media/`, and nginx proxies `/api` to the api (one origin,
which passkeys require). `web/nginx.conf.template` is rendered from env vars at start
(`NGINX_PORT`, `BACKEND`, `PORT`), so remapping works against prebuilt images.

### Exercise media (licence, read before touching media)

The stills and animations are licensed from Gym visual, not AGPL. Only 180 px files may be in the
repository, CI, the web image, the demo or a self-hosted server (`scripts/catalogue/check-media.mjs`
enforces it). Larger sizes exist only inside the APK and store packages, built on the release
machine, or as Apple-hosted / Play asset packs. Never commit, upload or serve anything larger, and
never feed the media to an AI tool.

## Guidelines from CONTRIBUTING.md worth knowing before changing code

- **Dependency-light is a hard constraint.** Frontend: React + Router + Zustand (plus Capacitor
  plugins). `api/`: three dependencies. New dependencies are a hard sell either side.
- Don't commit `data/`. Don't add or replace anything in `catalogue/media/`.
- Training-logic changes (progression, 1RM, session read-back) need a unit test in `src/lib`
  beside the code.
- User-facing text: plain and human, no em dashes. CHANGELOG.md is written at release time.
