# Button

Button triggers an action. Tren has three variants: glossy black `primary`, `quiet` and `danger`, in two sizes.

## Usage

- One **primary** per screen, for the thing the screen is for: "Log set 3", "Done", "Get started".
- **Quiet** for secondary actions beside it: "Export my data", "Keep going".
- **Danger** only to confirm a delete, and locked until the person has confirmed (typed DELETE).
- Labels are verbs in sentence case. Icon-only buttons need an `aria-label`.
- 56px tall (`md`) everywhere, 44px (`sm`) only in headers. Never below 44px.

## States

| State | What changes |
|---|---|
| Pressed | Scales to 0.95, springs back over 0.35s |
| Keyboard focus | 2px `ink` outline, 3px gap, keyboard only |
| Pending | Spinner + `pendingLabel` ("Saving…"); presses ignored; after 10s show the sync-failed toast |
| Disabled | 40% opacity, `aria-disabled`; never hidden |

## Tokens

`black-top` → `black-bottom` gradient, `black-ink` text and `shadow-gloss-black` for primary (they flip to glossy white in dark). Quiet uses `surface-card` and `ink`. Radius `radius-pill`, height `space-14`.

## Code

Source: `components/src/Button.tsx`. Props: `index.d.ts` (`ButtonProps`).

```tsx
import { Button } from '@tren/ui';

<Button onPress={logSet}>Log set 3</Button>
<Button isPending pendingLabel="Saving…">Log set 3</Button>
<Button variant="quiet">Export my data</Button>
<Button variant="danger" isDisabled={typed !== 'DELETE'}>Delete my account</Button>
```
