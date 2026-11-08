# EffortSlider

The optional effort (RPE) rating: a chunky track with the number inside, a growing flame and lighting step dots.

## Usage

- Folded behind "Rate effort · optional" by default; opens on tap.
- 6–10 in half steps. Saved with the set as "60 × 8 · RPE 8", then reset for the next set.
- Pass the colourful flame icon. The only yellow in Tren is this fill (`rpe-6` → `rpe-10`).

## States

| State | What shows |
|---|---|
| Folded | Quiet button "Rate effort optional" |
| Not set | Grey fill, "Slide", "Slide to rate how hard that set felt" |
| Set | Yellow fill, number in `yellow-ink`, effort word, e.g. "Hard. About 2 reps left" |
| 10 | Two rings burst from the flame |

It is a real `input type=range` under the visuals, so tap, drag, keyboard arrows and screen readers work.

## Tokens

`rpe-6`…`rpe-10`, `yellow-ink`, `effort-word`, `ring`, `radius-md`, `surface-card`.

## Code

Source: `components/src/EffortSlider.tsx`. Props: `index.d.ts` (`EffortSliderProps`).

```tsx
<EffortSlider icon={flameSvg} value={rpe} onChange={setRpe} />
effortText(8.5) // "Hard. About 1–2 reps left"
```
