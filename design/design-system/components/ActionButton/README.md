# ActionButton

The round 56px glossy button at the right of the bottom bar.

## Usage

- `start` (play) on training days, `log` (+) on rest days, `timer` while a workout runs.
- Always give a spoken label with the details: "Start Push workout, 17 sets, about 55 minutes".
- On Home it is the circle the StartBar morphs from; elsewhere use it on its own.

## States

Pressed scales to 0.95. Focus shows the 2px outline. In dark mode it becomes glossy white with a dark icon.

## Tokens

`black-top`, `black-bottom`, `black-ink`, `shadow-gloss-black`, `space-14`, `radius-pill`.

## Code

Source: `components/src/ActionButton.tsx`. Props: `index.d.ts` (`ActionButtonProps`).

```tsx
<ActionButton kind="start" aria-label="Start Push workout, 17 sets, about 55 minutes" onPress={openPill} />
<ActionButton kind="timer" time="12:48" aria-label="Back to your workout, 12:48" />
```
