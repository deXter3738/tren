# Boards

The screen designs themselves, exported from the Tren v0.1 UI canvas as PNG, one file per
board. **They are not in the repository yet.** Screens beyond the bottom bar wait for them:
without the board a screen would have to be guessed, and golden rule 7 says ask, don't assume.

Canvas: https://claude.ai/artifact/JK33k44WQXVk2dbUR1F9eR

## What to drop in here

One PNG per board on the **Screens** page, plus the three state boards. Suggested names, so a
build step can find the board it is working from:

```
01-welcome.png                 08-routines.png
02-create-account.png          09-add-exercise.png
03-youre-in.png                10-history.png
04-home-training-day.png       11-you.png
05-home-rest-day.png           12-delete-account.png
06-live-workout.png            13-privacy.png
07-workout-summary.png         14-admin.png

tab-bar-state-matrix.png       component-states.png       screen-states.png
```

Export at 2x so 13px captions stay legible. The **Colour variations** page and the two
"Old first direction" boards are exploration and are not built from (HANDOFF.md).
