# StatTile

One small stat on the Home glow: icon and label on one line, value below.

## Usage

- Three in a row with an 8px gap. Labels never wrap: keep them to one or two words.
- Icon by meaning: Time → stopwatch, Sets → layers, Volume → plate, New bests → trophy, This week → calendar, Next → bell, Rest → moon, Exercises → dumbbell.

## States

Static.

## Tokens

`frost`, `radius-lg`, `title` for the value, `caption` for the label.

## Code

Source: `components/src/StatTile.tsx`. Props: `index.d.ts` (`StatTileProps`).

```tsx
<StatTile icon={stopwatchSvg} label="Time" value="~55 min" />
```
