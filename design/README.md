# Tren v0.1 — handover pack

Everything Claude Code needs to build Tren's front end. Start with `HANDOFF.md`.

| Path | What it is |
| --- | --- |
| `HANDOFF.md` | What to build and in what order: golden rules, screens, states, timings, open questions, build checklist |
| `design-system/README.md` | How Tren looks and reads; token names match CSS variables 1:1; how to install the components |
| `design-system/tokens.json` | All design tokens (light and dark) |
| `design-system/tokens.css` | The same tokens as CSS variables: light on `:root`, dark on `[data-theme="dark"]` and the phone's dark setting |
| `design-system/components/src/` | 13 React components (TypeScript) to copy into the app as `src/ui/tren/` |
| `design-system/components/bundle.css` | Component styles (`tr-` classes); import once after `tokens.css` |
| `design-system/components/index.d.ts` | Props for every component |
| `design-system/components/<Name>/README.md` | Usage, states, tokens and code examples per component |
| `design-system/components/bundle.js`, `lib/`, `*/preview.html` | The built bundle and previews used by the online design system (not needed in the app) |
| `design-system/assets/Icons/` | Tren's 13 colourful icons (SVG) |
| `design-system/Motion.md`, `Scaling.md` | Motion curves and timings; how to add new screens |
| `logo/` | App icon, dark (`tren-logo.svg`) and light |

Live versions (always newest): design canvas https://claude.ai/artifact/JK33k44WQXVk2dbUR1F9eR · design system https://claude.ai/artifact/7XcFHeuDx6LHK78wofewg6 · handoff https://claude.ai/artifact/8XDZYHxBVN9VMWgP5uxFLY · PRD https://claude.ai/artifact/99Mf6wQ9wzyA17wnZctvXQ

In the app: delete `components/src/react-shim.ts` and import React normally — the shim only exists for the online previews.
