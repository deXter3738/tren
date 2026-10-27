# TabBar

The floating liquid-glass tab bar with a gooey selection lens.

## Usage

- Three tabs at most: Home, Routines, History. The profile lives in the header, not here.
- Selected tab: colourful icon and `ink` label; others: greyscale icon and `icon-muted` label.
- Pass Tren's colourful icons (Assets → Icons) as image URLs.

## States

| State | What changes |
|---|---|
| Selected | Lens behind the tab; icon in colour |
| Moving | Three blobs travel at 0.5 / 0.72 / 0.95s and merge (SVG goo filter) |
| Pressed | Icon dips to 0.86 |
| Reduced motion | Only the first blob, no stretch |

## Tokens

`glass`, `shadow-glass`, `lens-solid`, `ink`, `icon-muted`, `space-14`.

## Code

Source: `components/src/TabBar.tsx`. Props: `index.d.ts` (`TabBarProps`).

```tsx
<TabBar tabs={[{ id: 'home', label: 'Home', icon: homeSvg }, { id: 'routines', label: 'Routines', icon: calendarSvg }, { id: 'history', label: 'History', icon: clockSvg }]} selected={route} onChange={navigate} />
```
