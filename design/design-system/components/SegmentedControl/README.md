# SegmentedControl

Two or three options in a pill. The white pill slides to the selected one.

## Usage

- Units (kg / lb), theme (Light / Dark / Auto), plan type (By weekday / Rotation).
- Keep labels to one or two words.

## States

Selected option sits on the sliding pill (0.5s spring).

## Tokens

`surface-card`, `surface-sheet` pill, `radius-pill`.

## Code

Source: `components/src/SegmentedControl.tsx`. Props: `index.d.ts` (`SegmentedControlProps`).

```tsx
<SegmentedControl aria-label="Units" options={['kg', 'lb']} selected={unit} onChange={setUnit} />
```
