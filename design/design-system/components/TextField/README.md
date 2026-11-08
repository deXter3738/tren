# TextField

A 56px text field with its label always visible above.

## Usage

- Errors appear when the person submits an empty field and clear as soon as they type.
- Disable it while the phone's passkey prompt is open.

## States

| State | What changes |
|---|---|
| Focused | 2px `ink` ring |
| Error | 2px `danger-500` ring and message, e.g. "Add a name so we can greet you" |
| Disabled | 50% opacity |

## Tokens

`surface-card`, `radius-md`, `ink`, `ink-muted` placeholder, `danger-500`.

## Code

Source: `components/src/TextField.tsx`. Props: `index.d.ts` (`TextFieldProps`).

```tsx
<TextField label="What should we call you?" placeholder="Your name" value={name} onChange={setName} error={err} />
```
