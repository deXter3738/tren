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
| `frontend/src/tren/` | tokens, fonts, the alias bridge, type scale, bottom-bar CSS, the toast and banner skin, the global behaviours (`global.js`, `ConnectionWatch.jsx`) |
| `frontend/src/ui/tren/` | the design system's React components, verbatim |
| `design/` | the handover pack: the source of truth for every colour, size and word |
| `docs/UPSTREAM.md` | this file |

## Hot spots

Places where a Tren edit and an upstream edit can land on the same lines.

| File | What Tren changed | If upstream touches it |
|---|---|---|
| `frontend/src/index.css` | the two `--bg` lines deleted (tokens own the page colour); the whole `#tabbar` block deleted | Take upstream's hunk, then delete `--bg` and `#tabbar` again. Tab-bar styling lives in `frontend/src/tren/bottom-bar.css`. |
| `frontend/src/components/TabBar.jsx` | rewritten as the Tren bottom bar; same file name, default export and `onStart` prop | Read upstream's diff for behaviour (new routes, new conditions) and port the behaviour, not the markup. |
| `frontend/src/main.jsx` | six Tren stylesheet imports after `index.css` | Keep both import lists; Tren's come last. |
| `frontend/src/index.css` (`#toast`, `.conn-*`) | nothing deleted: `frontend/src/tren/toast.css` re-states those rules later in the cascade | Take upstream's hunk as it comes. If it adds a part — another button inside the toast, another banner tone — give that part a Tren rule in `tren/toast.css` too. |
| `frontend/src/App.jsx` | `applyPrefs` no longer calls `applyAccent`; `theme-color` is read off the live `--bg` | Keep Tren's `applyPrefs` body, take upstream's changes around it. |
| `frontend/src/store/useStore.js` | `DEF.theme` is `'system'` | One line; keep Tren's. |
| `frontend/src/views/Settings.jsx` | the Accent row is gone; theme falls back to `'system'` | If upstream reworks the Look page, re-apply the removal. |
| `frontend/src/views/settings-pages.js` | the `Accent color` search entry is gone | Same. |
| `frontend/src/index.html` | `<body class="tr">` | Keep the class. The inline script is CSP-hashed — never edit it without `web/Dockerfile`. |
| `README.md` | rewritten as Tren's front page: openGym's badges, Discord, stores, funding, mirror, roadmap and screenshots dropped; the engine sections (architecture, sync, your data, config) kept and the credit to openGym kept | Keep Tren's README. Read upstream's diff for facts about the engine (a new `.env` variable, a changed data file, a new sync rule) and port that fact into Tren's wording. Never take upstream's hunk wholesale. |
| `.env.example` | a `# Tren defaults` block appended at the end | Append-only; conflicts are rare. |
| `CLAUDE.md` | a `## Tren (this fork)` section prepended, and the openGym body below it trimmed to what v0.1 touches | Keep Tren's section on top. Below it, take upstream's hunk only if it lands on a section Tren still keeps; hunks about the phone apps, the Watch, the MCP server, the website or Helm / Kubernetes / Nix are dropped again, since one pointer to `docs/ARCHITECTURE.md` stands in for all of them. |
| `.github/workflows/` | only `test.yml` is kept | If upstream adds a workflow that publishes or mirrors, delete it. |

## Every upstream file Tren has modified

Keep this list complete — it is what makes a merge reviewable.

| File | Milestone | Why |
|---|---|---|
| `CLAUDE.md` | M0 | Tren's rules on top of upstream's |
| `CLAUDE.md` | M4 | openGym body trimmed for context cost: phone apps, Watch, MCP server, website and Helm / Kubernetes / Nix replaced by one line pointing at `docs/ARCHITECTURE.md`. Sync, "Code that exists twice", Passkeys, Docker, Exercise media and the CONTRIBUTING guidelines kept verbatim. |
| `.env.example` | M0 | Tren defaults block |
| `.gitignore` | M0 | ignore `.context/` |
| `.github/workflows/*` | M0 | 8 workflows deleted (publish/mirror/sign/audit), `test.yml` kept |
| `frontend/src/main.jsx` | M1, M2, M3, M4 | import Tren's stylesheets |
| `frontend/src/index.css` | M1, M3 | two `--bg` lines deleted; `#tabbar` rules deleted |
| `frontend/src/store/useStore.js` | M1 | `theme: 'dark'` → `'system'` |
| `frontend/src/App.jsx` | M1, M4 | `applyPrefs`: no `applyAccent`, live `theme-color`; mounts `ConnectionWatch` |
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
| `frontend/src/store/useUI.js` | M4 | the rest-timer end says Tren's sentence, for 3s |
| `frontend/src/views/Workout.jsx` | M4 | a deleted set says Tren's sentence |
| `frontend/src/components/ServerSync.jsx` | M4 | the no-network banner says Tren's sentence |
| `frontend/src/components/SyncBanner.test.jsx` | M4 | the offline rows expect that sentence |
| `frontend/src/views/Workout.swipe.test.jsx` | M4 | the delete rows expect "Set N deleted" |
| `README.md` | M5 | repo branding (PRD R13): Tren's name, logo and status on the front page, openGym credited as the upstream it forks |

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
- **Three sentences the handover does not word.** "Set 2 deleted" covers a plain set; a warm-up
  (which carries no number) and a set whose rest timer went with it keep openGym's own wording,
  and a rest that cannot name the set that is up says "Rest done" on its own. Three lines to
  confirm or replace.
- **A straight apostrophe in the handover.** Golden rule 3 asks for curly apostrophes, and every
  other apostrophe in the pack is curly, but the global-behaviours table writes "Couldn't sync.
  We'll keep trying." straight. Tren uses curly. One word from the designer settles it.
- **The rest timer's sheet and its vibration.** The handover says the sheet closes and the phone
  gives a short buzz when a rest ends. openGym has a bar, not a sheet, and buzzes twice. Both
  belong with the Live workout screen (board 6), which is where the rest sheet is designed.
- **"Saving…" and its ten seconds.** `frontend/src/tren/global.js` holds the word and the
  give-up time; the buttons that will use them are on screens not built yet (Create account,
  You, Delete account).
- **openGym's seasonal decorations** (the Halloween spider and cobweb on Home) still draw. They are
  openGym's, not Tren's, and belong with the screens that hide the extra openGym features.
- **The boot screen and the in-app name.** `README.md` now says Tren (M5), but
  `frontend/index.html` still shows openGym's dark-and-lime splash and title, and the rest of
  the branding swap (PRD R13) is still to come: the app's own name and logo, `assets/banner.png`,
  and the `image:` lines in `docker-compose.yml`, which still point at openGym's prebuilt images
  (`docker compose up -d --build` is the documented way round it for now). The inherited guides
  under `docs/` keep saying openGym on purpose: they describe upstream's engine and releases.
