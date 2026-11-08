# SetList

The sets of the current exercise in one card.

## Usage

- Values come prefilled from last time; upcoming values are grey.
- Warm-up sets have a grey label and don't count toward sets or volume.
- Swipe left to delete (with a 5s Undo toast), swipe right to copy — add these in the app.

## States

| State | Right side |
|---|---|
| Upcoming | Grey ring |
| Current | Ink ring |
| Done | Black tick that pops in (0.5s) |

## Tokens

`surface-card`, `line`, `ring`, `ink`, `radius-xl`.

## Code

Source: `components/src/SetList.tsx`. Props: `index.d.ts` (`SetListProps`).

```tsx
<SetList sets={[{ label: 'Warm', value: '40 × 10', state: 'done', warmup: true }, { label: 'Set 1', value: '60 × 8 · RPE 8', state: 'done' }, { label: 'Set 2', value: '60 × 8', state: 'current' }]} onSelect={editSet} />
```
