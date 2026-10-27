# Tren v0.1 — Build handoff for Claude Code

Oct 27, 2026 · @shreyas Bhosale

Build Tren v0.1's front end exactly as designed on the canvas: 14 screens, one bottom bar, and every state listed below. Don't invent layouts, wording or timings; if something isn't covered here or on the canvas, stop and ask.

## How to use this handoff

**Golden rules for Claude Code**

1. **Restyle, don't rebuild.** Tren is a fork of openGym. Change openGym's theme values and screens to match the designs; keep its data, sync and offline logic.
2. **Tokens only.** Every colour, size, spacing, corner and shadow comes from the Tren design tokens. No hard-coded values in screens.
3. **Copy is final.** Use the wording on the canvas and in this doc word for word, including the curly apostrophes.
4. **States are part of the spec.** A screen isn't done until its empty, loading, offline and error states match the States boards.
5. **Light and dark.** Every screen works in both, through the tokens.
6. **Reduce motion.** When the phone's “reduce motion” setting is on, all animation stops and changes happen instantly.
7. **Ask, don't assume.** Anything missing goes on the open-questions list, not into the code.

## Sources of truth

When these disagree, the canvas wins for layout and wording, the design system wins for token values, and the PRD wins for scope.

| Source | What it decides | Link |
| --- | --- | --- |
| Design canvas “Tren v0.1 UI” | Every screen, the tab bar state matrix, Component states, Screen states, the logo | [Open canvas](https://claude.ai/artifact/JK33k44WQXVk2dbUR1F9eR) |
| Tren Design System | Token names and values, component rules, motion, icons | [Open design system](https://claude.ai/artifact/7XcFHeuDx6LHK78wofewg6) |
| PRD | What's in v0.1 vs later, requirements R1–R14, acceptance checks | [Open PRD](https://claude.ai/artifact/99Mf6wQ9wzyA17wnZctvXQ) |
| Logo | App icon (dark and light) | Stored with the canvas as `tren-logo.svg` and `tren-logo-light.svg` |

On the canvas, the **Screens** page holds the real designs. The **Colour variations** page is exploration only; don't build from it. The two boards under “Old first direction” are retired.

## Build approach

Map Tren's tokens onto openGym's existing theme variables first, then restyle each screen, then build the few genuinely new components. This keeps monthly upstream merges from openGym easy.

1. **Add the tokens.** Put the design system's tokens (exported `tokens.css`) into the web app as CSS variables for light and dark. Point openGym's existing theme variables at them, so old screens pick up Tren's look at once.
2. **Load Inter.** Google Fonts, weights 400–600, with optical sizing on.
3. **Restyle screens** one by one against the canvas, in the build order at the end of this doc.
4. **Build the new components** (next section). 13 of them already exist as real React components in the design system: copy `components/src/` into the app (see its README, “Installing in the app”) instead of writing them again. Keep the class prefix `tr-` and the token names, so design and code stay in sync.
5. **Swap icons.** Use Tren's own colourful icon set from the design system for every icon listed there. Keep plain single-colour strokes for controls (−, +, arrows, ticks, close).
6. **Branding.** Replace openGym's name and logo with Tren (PRD R13). Keep the footer credit to openGym and the Gym visual media credit (R12).

Libraries are optional. `liquid-gooey` (MIT licence) can power the gooey tab lens, and `metal-fx` (MIT, WebGL) the live-bar ring. Plain CSS versions are fine and are what the designs use.

## Design tokens quick reference

Exact values live in the design system; this is the shape of the system so nothing gets improvised.

**Colour roles.** Black-and-white base. Text is near-black on white (white on black in dark). Cards are a light grey with no borders. The main button is glossy black (glossy white in dark). Blue marks rest and recovery, and green marks done or synced, both only as small accents. Red is only for delete and errors. Icons stay colourful.

**Type: Inter, 1.25 scale from 16px.**

| Style | Size / line height | Weight | Used for |
| --- | --- | --- | --- |
| display-lg | 95 / 96px | 500 | Home hero number, one per screen |
| display-md | 76 / 80px | 500 | Rest timer |
| display-sm | 61 / 64px | 500 | Weight and reps |
| heading | 31 / 36px | 600 | Screen and exercise titles |
| title | 20 / 28px | 600 | Section titles, stat values |
| body | 16 / 24px | 400 (600 for buttons) | Everything else |
| caption | 13 / 16px | 400 | Labels, helper text |
| tab-label | 10 / 16px | 500 | Tab bar labels only |

Letter spacing tightens with size: 0 at 13px, −0.011em at 16px, −0.017em at 20px, −0.022em at 61px and up. Changing numbers use tabular figures.

**Spacing: 4-point grid.** 4, 8, 12, 16, 20, 24, 48 and 56px only. Screen margins are 24px, card padding 16px, and gaps between cards 8px.

**Corners.** 12px small rows, 16px inputs and the slider, 20px tiles, 24px cards and menus, 32px sheets, fully round for buttons, bars and circles.

**Sizes.** Bottom bar and main buttons are 56px tall. Nothing tappable is under 44 × 44px.

**Motion.** Presses: scale 0.95 on `cubic-bezier(.32,.72,0,1)`, 0.35s. Morphs (Start circle into pill): 0.62s on `cubic-bezier(.34,1.25,.64,1)`. Pops (ticks, menus): 0.35–0.5s on `cubic-bezier(.34,1.45,.64,1)`. Cross-fades: opacity plus an 8px blur, 0.32s.

## Components to build

Each component is done when every state on the **Component states** board and the **Tab bar · state matrix** board matches in light and dark.

| Component | States to match | Key rules |
| --- | --- | --- |
| Button (black, quiet, danger) | Default, pressed, focus, loading, disabled; danger locked until DELETE is typed | One black button per screen. Loading shows “Saving…” and gives up after 10s with an error toast |
| Round action button | Training (play), rest (+), workout running (timer), pressed, focus | 56px, glossy black, glossy white in dark |
| Tab bar | Each tab selected, pressed, moving | Glass bar, 3 tabs (Home, Routines, History). Selected = colour icon + lens; others greyscale. Gooey lens, 3 blobs at 0.5 / 0.72 / 0.95s |
| Start bar morph | Tabs → workout pill → routine menu → live bar | Circle stretches into the pill. Tap or hold the routine for the menu. Live bar shows routine · elapsed time, the current set, Open, and the metal ring |
| Routine menu | Selected routine and the rest | “Switch routine” heading, 40px letter badges, selected = black badge + tick |
| Text input | Empty, focused, filled, error, disabled | Error: “Add a name so we can greet you”, clears on typing |
| Switch, segmented, chips | On, off, disabled; which option is selected | Green switch = on. Selected chip = ink fill |
| Set row | Upcoming, current, done, done with effort, warm-up, editing, swipe to delete, Undo | Warm-up isn't counted in totals. Swipe right copies a set. Undo toast lasts 5s |
| Value stepper | Normal, at minimum, typing | Steps: 2.5 kg (5 lb), 1 rep. Hold repeats after 0.5s |
| Effort (RPE) slider | Folded, open not set, set, max | 6–10 in half steps, optional, saved as “60 × 8 · RPE 8”, resets after each set |
| Toasts and banners | Offline, back online, waking server, sync failed, saved | One at a time, 16px above the bottom bar |
| Sync pill | Synced, syncing, waiting, paused | In the Home header; tap when paused opens Retry |
| Progressive blur | — | Six stacked blur layers (1–32px) behind the bottom bar, plus a light tint |

## Screens

Board numbers match the canvas. “Extra states” are on the **Screen states** board; every screen also follows the global behaviours below.

| # | Screen | What's on it | Extra states | PRD |
| --- | --- | --- | --- | --- |
| 1 | Welcome | App icon + “Tren”, tagline, Get started, “I already have an account”, Privacy link | Sign in: passkey not found | R1, R10 |
| 2 | Create account | Back, title, one line about passkeys, name field, Create passkey, Privacy link | Passkey cancelled; browser can't do passkeys | R1 |
| 3 | You're in | Green tick, passkey line, home-screen tip card, Set up my week, import from Strong or Hevy, Skip | — | R1 |
| 4 | Home · training day | Greeting + account button, day strip, Today / This week, hero number, “Up next” list, bottom bar | First run, loading, offline, waking server | R4, R5 |
| 5 | Home · rest day | Same layout, faint blue glow, “Rest” hero, next workout | Same as 4 | — |
| 6 | Live workout | Centred title + timer, Finish, set row, weight and reps cards, Rate effort, Log set, set list, rest timer sheet | Rest done; finish with sets left; offline pill | R4 |
| 7 | Workout summary | Hero sets logged, tiles, PR card, exercises, average effort, note, sync line, Done | Upload failed | R4, R5 |
| 8 | Routines | By weekday / Rotation switch, week list with routine badges, rest days with moon | — | — |
| 9 | Add exercise | Search, muscle chips, multi-select list, Add N exercises, media credit | No results; loading | R12 |
| 10 | History | Week tracker, streak / sets / bests tiles, Progress (weekly volume, PR projection), workout lists | Empty; loading; projection needs 4 sessions | — |
| 11 | You (settings) | Profile, theme, units, week start, rest default, reminder, passkeys, import, export, privacy, delete, about | Reminders blocked by the phone | R8, R11 |
| 12 | Delete account | What's deleted, 30-day backup note, export first, type DELETE, Delete my account, Keep my account | Deleting; “Your account is deleted” | R11 |
| 13 | Privacy (public) | Five plain-language sections, contact, source and credits | — | R10, R12 |
| 14 | Admin | Accounts count, Open / Invite-only, last backup, free-tier meters, accounts table, activity | Invite-only on; a meter at 80%+ turns red | R2, R3 |

History's Progress section (weekly volume and PR projection) belongs to v0.2 Stats in the PRD. Build the layout but keep it behind a switch until v0.2.

## Global behaviours

These apply on every screen and use exactly these numbers and words.

| Situation | What happens | Exact words |
| --- | --- | --- |
| No connection | Banner at the top; logging keeps working and saves on the phone | “No signal. Keep logging — it saves on this phone.” |
| Connection returns | Uploads waiting workouts; toast for 3s | “Back online · 1 workout synced” |
| Server asleep (cold start) | Toast only if the first request takes over 1.5s; hides when data arrives | “Waking up Tren… a few seconds” |
| Sync fails | Silent retries; after 3 failed tries show the toast; auto-retry every 5 min | “Couldn't sync. We'll keep trying.” + Retry |
| Saving | Button shows a spinner; after 10s, show the sync-failed toast | “Saving…” |
| Deleting a set | Toast with Undo for 5s, then final | “Set 2 deleted” + Undo |
| Rest timer ends | Short vibration, sheet closes, toast for 3s | “Rest done · Set 4 is up” |
| Loading | Grey shimmer placeholders shaped like the content, never a spinner on a whole screen | — |

Only one toast shows at a time; a newer one replaces the older one.

## Accessibility, motion and dark mode

- **Contrast:** text at least 4.5:1, large text and icons at least 3:1, in both themes.
- **Real controls:** every tappable thing is a real button, link or input. Icon-only buttons need a spoken label, for example “Start Push workout, 17 sets, about 55 minutes”.
- **Never colour alone:** pair every colour meaning with an icon, word or tick, for example the moon on rest days.
- **Keyboard focus:** a 2px outline, 3px from the edge, shown only when using a keyboard.
- **Screen readers:** the rest timer and logged values announce politely; the effort slider announces its value and meaning (“RPE 8, Hard”).
- **Reduce motion:** when the phone asks for less motion, no springs, blobs, pulses or rings; changes happen instantly.
- **Dark mode:** follows the phone by default; the You screen offers Light, Dark or Auto. Dark comes from the same tokens, with no separate designs.
- **Exercise media:** the animations are © Gym visual. Use only openGym's bundled 180px files, unmodified, with the credit, and never send them to any AI service, including the v0.5 AI Coach.

## Scope, open questions and build order

**Not in v0.1:** Google sign-in (v0.4), AI Coach (v0.5), Stats such as weekly volume and PR projection (v0.2, built behind a switch), warm-up generator and plan builder (v0.3), native apps.

**Open questions (ask before building these parts)**

- [ ] **Leftover yellow.** The canvas still has a faint yellow glow on training days and yellow in the effort slider; the design system has none. Decided: the canvas wins. Keep the faint yellow training-day glow and the yellow effort-slider fill; the design system now matches (updated 27 Oct).
- [ ] **Delete my account.** Does openGym already have it, or does it need building? (PRD open decision.)
- [ ] **Guest mode.** Not needed for now: v0.1 requires an account, so leave `ALLOW_GUEST` off.
- [ ] **PR projection maths** for v0.2: tracked in the PRD's open questions.
- [ ] **Placeholders to fill:** Privacy page `[DATE]`, `[CONTACT EMAIL]` and reply time `[X] days`; admin meters' live numbers.

**Build order (each step is done when its check passes)**

- [ ] Tokens and Inter in place; openGym screens already show Tren colours in light and dark.
- [ ] Bottom bar: tab bar, round action button and Start bar morph match the state matrix.
- [ ] Home (training and rest) and Live workout match boards 4–6, including offline and rest-timer states.
- [ ] Workout summary and History match boards 7 and 10, including empty, loading and upload-failed states.
- [ ] Routines and Add exercise match boards 8–9, including no results.
- [ ] Welcome, Create account and You're in match boards 1–3, including passkey errors.
- [ ] You, Delete account and Privacy match boards 11–13; deleting a test account removes its data (PRD acceptance check).
- [ ] Admin matches board 14, including invite-only and the red meter.
- [ ] Final pass: every Component states cell checked in light and dark, reduce-motion checked, and the release tagged v0.1.0.
