# Motion

Tren moves like iOS: things grow, shrink and slide from where they are, settle on a spring, and never pop.

| Use | Curve | Duration |
|---|---|---|
| Presses (dip to 0.95) | `cubic-bezier(.32,.72,0,1)` | 0.35s |
| Sheets and cards entering | `cubic-bezier(.32,.72,0,1)` | 0.6–0.7s, staggered 0.06s |
| Morphs (Start → pill → live bar) | `cubic-bezier(.34,1.25,.64,1)`, slight overshoot | 0.62s |
| Pops (ticks, menus, tab icons, slider number) | `cubic-bezier(.34,1.45,.64,1)` | 0.35–0.5s |
| Gooey tab lens | three blobs at 0.5s / 0.72s / 0.95s | — |
| Cross-fades | opacity plus an 8px blur | 0.32s |
| Colour wash change | opacity | 0.7s |

## Rules
- Animate from the element's current position; no teleporting.
- Loops are reserved for "something is live": the pulsing dot and the metal ring on the live bar.
- Under `prefers-reduced-motion: reduce`, disable animations and transitions. Layout still updates instantly.
