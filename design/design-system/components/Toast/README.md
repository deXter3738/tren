# Toast

A short message 16px above the bottom bar. One at a time; a newer one replaces it.

## Usage

- `dark` for confirmations, `light` for warnings.
- Exact wording and times: "Workout saved" 2s · "Back online · 1 workout synced" 3s · "Set 2 deleted" + Undo 5s · "Waking up Tren… a few seconds" until data arrives (only after 1.5s) · "Couldn’t sync. We’ll keep trying." + Retry after 3 failed tries.

## States

Static once shown; dismisses on its timer or its action.

## Tokens

`ink`/`bg` (dark tone), `surface-card` (light tone), radius 26px.

## Code

Source: `components/src/Toast.tsx`. Props: `index.d.ts` (`ToastProps`).

```tsx
<Toast message="Set 2 deleted" actionLabel="Undo" onAction={undo} />
<Toast tone="light" icon={<img src={wifiOffSvg} alt="" />} message="No signal. Keep logging — it saves on this phone." />
```
