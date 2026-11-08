# Keeping up with openGym

Tren is a restyled fork of [openGym](https://github.com/DuarteSantos8/openGym) (AGPL-3.0-or-later).
We keep openGym's engine — data model, sync, offline logging, passkeys, the exercise catalogue —
and change how it looks. That only stays true if upstream's work keeps arriving, so this repo
carries openGym's **full history**: `main` has a real merge base with `upstream/main`, and an
update is a plain merge, never a re-import.

Fork point: `e6a95c28` (27 Oct 2026), tagged `tren-base`.

```
git remote add upstream https://github.com/DuarteSantos8/openGym.git   # once
```

## The monthly merge

```bash
git fetch upstream
git switch -c merge/upstream-$(date +%Y-%m) main
git merge upstream/main
# resolve the hot spots below
cd frontend && npm ci && npm test
cd ../api && npm ci && npm test
cd ../frontend && node scripts/check-locales.mjs && node scripts/check-source-strings.mjs --strict
npm run build
```

Then open a PR into `main` and add a row to the table at the bottom.

**Resolve in favour of upstream unless the hunk is in the list below.** Tren's own code lives in
files upstream does not have, so most of a merge is not ours to think about:

| Tren-only | What it is |
|---|---|
| `frontend/src/tren/` | tokens, fonts, the alias bridge, type scale, bottom-bar CSS |
| `frontend/src/ui/tren/` | the design system's React components, verbatim |
| `design/` | the handover pack: the source of truth for every colour, size and word |
| `docs/UPSTREAM.md` | this file |

## Hot spots

Places where a Tren edit and an upstream edit can land on the same lines.

| File | What Tren changed | If upstream touches it |
|---|---|---|
| `frontend/src/index.css` | the two `--bg` lines deleted (tokens own the page colour); the whole `#tabbar` block deleted | Take upstream's hunk, then delete `--bg` and `#tabbar` again. Tab-bar styling lives in `frontend/src/tren/bottom-bar.css`. |
| `frontend/src/components/TabBar.jsx` | rewritten as the Tren bottom bar; same file name, default export and `onStart` prop | Read upstream's diff for behaviour (new routes, new conditions) and port the behaviour, not the markup. |
| `frontend/src/main.jsx` | five Tren stylesheet imports after `index.css` | Keep both import lists; Tren's come last. |
| `frontend/src/App.jsx` | `applyPrefs` no longer calls `applyAccent`; `theme-color` is read off the live `--bg` | Keep Tren's `applyPrefs` body, take upstream's changes around it. |
| `frontend/src/store/useStore.js` | `DEF.theme` is `'system'` | One line; keep Tren's. |
| `frontend/src/views/Settings.jsx` | the Accent row is gone; theme falls back to `'system'` | If upstream reworks the Look page, re-apply the removal. |
| `frontend/src/views/settings-pages.js` | the `Accent color` search entry is gone | Same. |
| `frontend/src/index.html` | `<body class="tr">` | Keep the class. The inline script is CSP-hashed — never edit it without `web/Dockerfile`. |
| `.env.example` | a `# Tren defaults` block appended at the end | Append-only; conflicts are rare. |
| `CLAUDE.md` | a `## Tren (this fork)` section prepended | Keep Tren's section on top, take upstream's body below it. |
| `.github/workflows/` | only `test.yml` is kept | If upstream adds a workflow that publishes or mirrors, delete it. |

## Every upstream file Tren has modified

Keep this list complete — it is what makes a merge reviewable.

| File | Milestone | Why |
|---|---|---|
| `CLAUDE.md` | M0 | Tren's rules on top of upstream's |
| `.env.example` | M0 | Tren defaults block |
| `.gitignore` | M0 | ignore `.context/` |
| `.github/workflows/*` | M0 | 8 workflows deleted (publish/mirror/sign/audit), `test.yml` kept |
| `frontend/src/main.jsx` | M1, M2, M3 | import Tren's stylesheets |
| `frontend/src/index.css` | M1, M3 | two `--bg` lines deleted; `#tabbar` rules deleted |
| `frontend/src/store/useStore.js` | M1 | `theme: 'dark'` → `'system'` |
| `frontend/src/App.jsx` | M1 | `applyPrefs`: no `applyAccent`, live `theme-color` |
| `frontend/src/views/Settings.jsx` | M1 | Accent row removed; `'system'` fallback |
| `frontend/src/views/settings-pages.js` | M1 | `Accent color` search entry removed |
| `frontend/index.html` | M2 | `<body class="tr">` |
| `frontend/src/a11y-contrast-transparency.test.js` | M2, M3 | Tren's stylesheets added to the Reduce Transparency check |
| `frontend/src/components/TabBar.jsx` | M3 | rewritten as the Tren bottom bar |
| `frontend/src/lib/native-keyboard.test.js` | M3 | reads `#tabbar` from `tren/bottom-bar.css`, where the rule now lives |
| `frontend/src/components/TabBar.test.jsx` | M3 | rewritten for the new bar |
| `frontend/src/components/TabBar.navigation.test.jsx` | M3 | rewritten for the new labels |
| `frontend/src/App.workout-tabbar.test.jsx` | M3 | button count and selectors |
| `frontend/src/views/Settings.accent.test.jsx` | M1 | **deleted** — the feature is gone |

## Patches to the design system

`frontend/src/ui/tren/` is meant to stay byte-identical to `design/design-system/components/src/`,
so a new drop from the designer is a `diff -r`. Where that was not possible, the file carries a
`TREN PATCH` comment at the top and the change is listed here.

| File | Patch | Why |
|---|---|---|
| `bundle.css` | the Google Fonts `@import` on line 1 removed; a `prefers-reduced-transparency` block appended | The production CSP (`font-src 'self' data:`) blocks Google Fonts, so Inter is self-hosted; and every blurred surface has to go opaque when the phone asks for less transparency. |
| `StartBar.tsx` | live mode follows the `startedAt` prop; `start()` only calls `onStart` | A session can also start from Home's today row, and the weigh-in sheet can cancel it, so the bar must not decide on its own that a workout is running. |
| `TabBar.tsx` | optional `ariaLabel` per tab | openGym says "Home, Connection problem" on the Home tab when sync is stuck. |
| `ActionButton.tsx` | `time` accepts a React node | So openGym's `<Elapsed>` ticker can render inside it. |

## Merged upstream revisions

| Date | Upstream SHA | Notes |
|---|---|---|
| 2026-10-28 | `e6a95c28` | Fork point (`tren-base`). |

## Decisions the owner made, so they are not re-litigated

| Date | Question | Answer |
|---|---|---|
| 2026-10-28 | `--label-3` has no Tren token | `--ink-muted` when it colours text (4.5:1), `--icon-muted` only for icons. Legacy tints (orange, teal…) keep their interim mapping and retire screen by screen. Yellow is reserved for the effort slider and the training-day glow. |
| 2026-10-28 | Heading (31px) letter spacing | −0.021em. |
| 2026-10-28 | Where Stats and the Exercise library are reached from | Nowhere — they are hidden in v0.1. Deep links keep working until the hiding PR. |
| 2026-10-28 | Round button on Routines and History | Starts today's routine directly, one tap. A rest day starts an empty workout. Choosing a different routine happens on Home, in the pill. |
| 2026-10-28 | Is v0.1 English only | Yes, English only. Copy still goes through `t()` so translating later is only adding keys. |
| 2026-10-28 | Increased contrast (`prefers-contrast: more`) | Glass surfaces go solid `--surface-sheet`, `--ink-muted` text becomes `--ink`, `--line` becomes `--ring`. Nothing else changes. |
| 2026-10-28 | The PRD's fork kit (steps 00–10) | Separate from the design handover; arrives later. The database-size meter and nightly backups stay placeholders until then. |

## Open, still

- **The "~55 min" estimate.** The canvas fixes the wording of the routine line; nothing says how
  the minutes are worked out. `frontend/src/tren/routine-meta.js` holds a documented guess (45s a
  set plus the rest timer, rounded to 5 minutes) with a test pinning it down. One number to change
  when the designer says what it should be.
- **openGym's seasonal decorations** (the Halloween spider and cobweb on Home) still draw. They are
  openGym's, not Tren's, and belong with the screens that hide the extra openGym features.
- **The boot screen and the name.** `frontend/index.html` still shows openGym's dark-and-lime
  splash and title. That is the branding swap (PRD R13), a later step.
