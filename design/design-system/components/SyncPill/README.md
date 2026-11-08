# SyncPill

Sync status in the Home header.

## Usage

- `synced`, `syncing`, `waiting` (with the count of workouts not uploaded) and `paused`.
- Tapping `paused` opens a sheet with Retry.

## States

Static per status.

## Tokens

`glass`, `shadow-glass`, `danger-500` for paused.

## Code

Source: `components/src/SyncPill.tsx`. Props: `index.d.ts` (`SyncPillProps`).

```tsx
<SyncPill status="waiting" count={1} offlineIcon={wifiOffSvg} />
```
