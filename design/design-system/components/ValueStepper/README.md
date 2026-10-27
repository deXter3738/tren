# ValueStepper

The weight or reps card: a big number, its unit and round − / + controls.

## Usage

- Weight steps 2.5 kg (5 lb); reps step 1 with `min={1}`.
- Two side by side; only weight and reps get these cards.
- Hold − or + to repeat after 0.5s.

## States

| State | What changes |
|---|---|
| At minimum | − disabled (35% opacity) |
| Pressed | Control scales to 0.95 |
| Typing | Tap the number to type it (number keypad) |

## Tokens

`surface-card`, `radius-xl`, `display-sm` number, `shadow-control` on the controls.

## Code

Source: `components/src/ValueStepper.tsx`. Props: `index.d.ts` (`ValueStepperProps`).

```tsx
<ValueStepper unit="kg" value={kg} step={2.5} onChange={setKg} />
<ValueStepper unit="reps" value={reps} step={1} min={1} onChange={setReps} />
```
