// What the bottom bar says about a routine: "17 sets · ~55 min".
//
// The line is on the canvas, so the shape is fixed. The minutes are not: nothing in openGym
// records how long a routine takes, and nothing in the handover says how to work it out. This is
// a plain estimate, written down here rather than hidden in the bar, so it is one number to
// change when the designer says what it should be. It is deliberately rough and is always
// prefixed with "~".
//
// The model, per set:
//   · a cardio set takes its own minutes (`min`),
//   · a timed set takes its own seconds (`sec`),
//   · a normal set of reps is counted as WORK_SEC,
//   · and every set but the last in the routine is followed by a rest — the exercise's own
//     `restSec` when it has one, otherwise the profile's rest timer.
// The total is rounded to the nearest 5 minutes, because an estimate that says "53 min" is
// claiming more than it knows, and never falls below 5.

import { t, tn } from '../lib/i18n.js'

/** How long one set of reps is taken to last, rest not counted. */
export const WORK_SEC = 45
/** Used when the rest timer is switched off, so "no rest timer" does not mean "no pause". */
export const REST_FALLBACK_SEC = 60

const setsOf = ex => Math.max(1, Math.round(Number(ex?.sets) || 1))

/** Every set in a routine, warm-ups included — the number the pill shows. */
export function routineSets(routine) {
  return (routine?.ex || []).reduce((n, ex) => n + setsOf(ex), 0)
}

/** The estimate in whole seconds, before rounding. Exported so the test can read it exactly. */
export function routineSeconds(routine, defaultRestSec) {
  const fallbackRest = Number(defaultRestSec) > 0 ? Number(defaultRestSec) : REST_FALLBACK_SEC
  let seconds = 0
  let lastRest = 0
  for (const ex of routine?.ex || []) {
    const n = setsOf(ex)
    const work = ex.mode === 'cardio' ? (Number(ex.min) || 20) * 60
      : ex.mode === 'time' ? (Number(ex.sec) || 45)
        : WORK_SEC
    const rest = Number(ex.restSec) > 0 ? Number(ex.restSec) : fallbackRest
    seconds += n * (work + rest)
    lastRest = rest
  }
  // Nobody rests after the last set of the last exercise.
  return Math.max(0, seconds - lastRest)
}

/** The estimate in minutes, rounded to 5 and never below 5. */
export function routineMinutes(routine, defaultRestSec) {
  const seconds = routineSeconds(routine, defaultRestSec)
  if (!seconds) return 0
  return Math.max(5, Math.round(seconds / 60 / 5) * 5)
}

/** "17 sets · ~55 min", or just "17 sets" for a routine with nothing in it to time. */
export function routineMeta(routine, defaultRestSec) {
  const sets = routineSets(routine)
  const mins = routineMinutes(routine, defaultRestSec)
  const setsText = tn('{0} set', '{0} sets', sets)
  return mins ? setsText + ' · ' + t('~{0} min', mins) : setsText
}

/**
 * What the round button and the pill say out loud, e.g.
 * "Start Push workout, 17 sets, about 55 minutes".
 */
export function routineSpokenLabel(routine, defaultRestSec) {
  const sets = routineSets(routine)
  const mins = routineMinutes(routine, defaultRestSec)
  const parts = [tn('{0} set', '{0} sets', sets)]
  if (mins) parts.push(t('about {0} minutes', mins))
  return t('Start {0} workout, {1}', routine?.name || '', parts.join(', '))
}
