# Tren

Your goals. Your work. Your progress.

Tren is a free workout tracker for logging sets fast between rests, built as a fork of openGym. This system is the handover for building it: the README, the tokens and the 13 components are what Claude Code reads and installs, and every new screen is built from them, never restyled by hand.

It was taken from the Tren v0.1 design canvas as approved (27 October 2026; [canvas](https://claude.ai/artifact/JK33k44WQXVk2dbUR1F9eR)). Token names match the CSS custom properties in code one for one: the token `ink-muted` is `--ink-muted`, `radius-xl` is `--radius-xl`, `space-14` is `--space-14`. Use the same names in designs and in code, so a design change maps straight onto the code. Screens, states, timings and build order live in the [build handoff](https://claude.ai/artifact/8XDZYHxBVN9VMWgP5uxFLY); requirements in the [PRD](https://claude.ai/artifact/99Mf6wQ9wzyA17wnZctvXQ).

## Principles
- **One thumb, one glance.** Everything you need mid-set sits in the bottom half of the screen, in big, tabular numbers. Nothing needs the top corners.
- **Clean, calm, iOS-native.** White space, soft cards with no borders, glass that floats over content, and motion that springs instead of snapping.
- **Minimal, black and white.** Black, white and greys do the work. Small accents carry meaning: blue for rest and recovery, green for done or synced, and one yellow — only in the effort slider and a faint training-day glow.
- **Playful where it rewards effort.** Small moments of delight (popping ticks, a growing flame, a metal ring while you train) live in the workout, not in the chrome.

## Voice
Plain, short and encouraging, like a good gym partner. Use sentence case, second person and numbers over words.
- Yes: "17 sets planned", "Saved on this phone. It uploads when you're back online.", "Hard. About 2 reps left"
- No: "Workout Session Initiated!", "Sync pending (error 409)", jargon without explanation

## Colour
Two themes, Light (primary) and Dark, with the same token names.
- **Grounds**: `bg` for pages, `surface-card` for cards, `surface-sheet` for sheets. Cards are separated by tone, never by borders.
- **Text**: `ink` for primary text and `ink-muted` for secondary. Both pass 4.5:1 on `bg` and `surface-card` in both themes.
- **Training (monochrome)**: `train-500` is near-black in Light and near-white in Dark, with `train-300` → `train-700` for the glossy gradient. Text on it is always `train-ink`. Training is marked by the play icon and the word Start, not by a hue.
- **Rest (blue accent)**: `blue-500`, used small (a dot, a badge, the rest-day + button), with `blue-300` → `blue-700` for gloss. White text or icons on blue are used only for the large + icon, which meets 3:1.
- **Glow**: the top of Home fades from `glow-train` (a faint yellow) on training days or `glow-rest` (a faint blue) on rest days into `bg` by 62% of a 560px band; other screens use the same glow at 320px. Text on the glow is plain `ink`. Decided 27 Oct 2026: the canvas wins on colour, so this faint yellow stays.
- **Status**: `green-500` for done and synced, `danger-500` for destructive actions and the offline badge. Never tell states apart by hue alone; pair them with an icon or word.
- **Effort**: `rpe-6` … `rpe-10` run from pale to deep yellow (`#FFE9A8` → `#CC8F00`), darkening with effort so it also reads by lightness. The number on it is `yellow-ink`. Yellow appears nowhere else: never a button, badge or tick.
- **Glass**: `glass` and `glass-menu` always come with `backdrop-filter: blur(24px) saturate(180%)` and `shadow-glass`.

## Typography
Inter (Google Fonts) with optical sizing on, so large numbers get the Display cut automatically. The scale uses a 1.25 ratio from 16px, rounded: **13 · 16 · 20 · 31 · 61 · 76 · 95**. Every line height is a multiple of 4. Letter spacing tightens as size grows (0 at 13px, −0.011em at 16px, −0.017em at 20px, −0.022em at 61px and up).
- `display-lg` (95/96) for one hero number per screen, `display-md` (76/80) for the rest timer, `display-sm` (61/64) for weight and reps.
- `heading` (31/36) for the exercise name, `title` (20/28) for section titles and stat values.
- `body` and `body-strong` (16/24), `caption` (13/16), and `tab-label` (10/16) for tab labels only.
- All changing numbers use tabular figures.

## Spacing and shape
A 4-point grid: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24, plus `space-12` (48, top inset) and `space-14` (56, bars and buttons). No odd values like 6, 10, 14, 18 or 22.
- Screen margins are `space-6` (24px), card padding `space-4`, gaps between tiles and cards `space-2`.
- Corners: `radius-lg` (20) tiles, `radius-xl` (24) cards, `radius-2xl` (32) sheets, `radius-pill` for buttons, bars and circles.
- A circle inside a pill sits `space-1` (4px) in from the edge so the curves are concentric.
- Touch targets are at least 44 × 44px.

## Elevation
Shadows are always neutral grey; no coloured glows. `shadow-float` lifts the bottom bar and round buttons, `shadow-glass` gives glass its bright rim, and the `shadow-gloss-*` tokens make buttons feel glossy and pressable.

## Iconography
Colourful layered icons, Tren's own set (see Assets → Icons): bright filled shapes, a lighter overlapping layer for depth and small white details, on a 24px grid. Use them at 20px in labels and 24px in the tab bar. Selected tabs show the icon in colour; unselected tabs show it in greyscale. Controls (−, +, arrows, play, ticks) stay simple single-colour strokes so they read as controls.

## Components

Components are real React components (React 18, plain function components, no other runtime libraries), styled by `components/bundle.css` on these tokens. The previews here run the same code that the app installs, so a preview is the shipped component, not a drawing of it. Each component page holds its guidelines and a Code section; source is in `components/src/`, props in `components/index.d.ts`. Class names start with `tr-`.

**Built so far (27 Oct 2026):** Button, ActionButton, TabBar, StartBar, StatTile, ValueStepper, EffortSlider, SetList, Toast, SyncPill, TextField, Switch, SegmentedControl.

**Next, from the canvas:** Sheet (rest timer and "Finish workout?"), RoutineBadge and WeekStrip (Home day strip and History tracker), ListRow and ListGroup (You settings), EmptyState and Skeleton (Screen states board), ProgressCard (weekly volume and PR projection, v0.2), AdminMeter and AccountsTable (Admin).

**Installing in the app.** Copy `components/src/` into the openGym web app as `src/ui/tren/` (or publish it as `@tren/ui`), import `tokens.css` and `bundle.css` once at the root, and import components by name. The sources import `react` through `react-shim.ts` only for this page; in the app, delete the shim and import React normally.

## Accessibility
- Text contrast is 4.5:1 or more in both themes (3:1 for 24px+ and icons).
- Every control is a real `button`, `a` or `input`, with an `aria-label` when icon-only.
- All motion respects "reduce motion": springs become instant and loops stop.

## Credits
Exercise animations in the app are © Gym visual, used unmodified with credit, as allowed for a non-commercial openGym fork. They must never be fed to AI services.
