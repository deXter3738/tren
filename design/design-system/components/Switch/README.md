# Switch

An on/off switch. Green means on.

## Usage

- Always label it (`aria-label`, and visible text beside it).
- Disable it when the phone blocks the feature, and say why in the row: "Notifications are off for Tren".

## States

On, off and disabled; the knob slides on a 0.4s spring.

## Tokens

`green-500`, `ring`.

## Code

Source: `components/src/Switch.tsx`. Props: `index.d.ts` (`SwitchProps`).

```tsx
<Switch aria-label="Gym reminder" isSelected={on} onChange={setOn} />
```
