# StartBar

The bottom bar's morph: tab bar + round button → workout pill (with a routine menu) → live bar. Everything stays at the bottom, in thumb reach.

## Usage

- Use it on Home only. Other tab screens use TabBar + ActionButton.
- Tap or hold (0.45s) the routine in the pill to open the "Switch routine" menu.
- Start moves to the live bar; the Home circle returns to tabs and the timer keeps running in the round button.
- `dayKind="log"` on rest days (+ instead of play).

## States

| Mode | Shows |
|---|---|
| Tabs | TabBar and the round button |
| Pill | Home circle; routine badge (white circle, black letter), name, meta, change control, black Start |
| Menu | "Switch routine" heading; 40px letter badges; selected = black badge + tick |
| Live | Pulsing dot, "Push · 12:48", current set, black Open, liquid-metal ring |

Morphs: width over 0.62s on `cubic-bezier(.34,1.25,.64,1)`; contents cross-fade through an 8px blur (0.32s).

## Tokens

`glass`, `glass-menu`, `shadow-glass`, `lens`, `black-*`, `space-14`, `radius-xl` for the menu.

## Code

Source: `components/src/StartBar.tsx`. Props: `index.d.ts` (`StartBarProps`).

```tsx
<StartBar tabs={tabs} routines={routines} routine="Push" dayKind="start"
  onStart={(name) => startWorkout(name)} onOpen={() => navigate('/workout')} />
```
