// The "17 sets · ~55 min" line. The sets are counted; the minutes are an estimate, and this is
// where the estimate is pinned down so a change to it is visible rather than quiet.
import { describe, expect, it } from 'vitest'
import { routineMeta, routineMinutes, routineSeconds, routineSets, routineSpokenLabel, REST_FALLBACK_SEC, WORK_SEC } from './routine-meta.js'

const reps = (sets, extra = {}) => ({ id: 'x', mode: 'reps', sets, reps: 10, ...extra })

describe('how many sets', () => {
  it('adds up every exercise, warm-ups and all', () => {
    expect(routineSets({ ex: [reps(3), reps(4), reps(5)] })).toBe(12)
  })
  it('counts an exercise with no set count as one set, and an empty routine as none', () => {
    expect(routineSets({ ex: [{ id: 'x' }] })).toBe(1)
    expect(routineSets({ ex: [] })).toBe(0)
    expect(routineSets(undefined)).toBe(0)
  })
})

describe('how long it takes', () => {
  // Three sets: three lots of work, but only two rests — nobody rests after the last one.
  it('counts a rest after every set but the very last', () => {
    expect(routineSeconds({ ex: [reps(3)] }, 90)).toBe(3 * WORK_SEC + 2 * 90)
  })

  it('uses the exercise’s own rest when it has one', () => {
    expect(routineSeconds({ ex: [reps(2, { restSec: 180 })] }, 90)).toBe(2 * WORK_SEC + 180)
  })

  it('times a held set by its seconds and a cardio set by its minutes', () => {
    expect(routineSeconds({ ex: [{ id: 'p', mode: 'time', sets: 2, sec: 60 }] }, 60)).toBe(2 * 60 + 60)
    expect(routineSeconds({ ex: [{ id: 'c', mode: 'cardio', sets: 1, min: 20 }] }, 60)).toBe(20 * 60)
  })

  // "No rest timer" means the app stops counting, not that nobody breathes between sets.
  it('still allows a pause when the rest timer is switched off', () => {
    expect(routineSeconds({ ex: [reps(2)] }, 0)).toBe(2 * WORK_SEC + REST_FALLBACK_SEC)
  })

  // An estimate that says "53 min" is claiming more than it knows.
  it('rounds to five minutes, and never promises less than five', () => {
    expect(routineMinutes({ ex: [reps(12)] }, 90)).toBe(Math.round((12 * WORK_SEC + 11 * 90) / 60 / 5) * 5)
    expect(routineMinutes({ ex: [reps(1)] }, 60)).toBe(5)
    expect(routineMinutes({ ex: [] }, 90)).toBe(0)
  })
})

describe('what the bar says', () => {
  it('reads "N sets · ~M min"', () => {
    expect(routineMeta({ ex: [reps(3), reps(3)] }, 90)).toMatch(/^6 sets · ~\d+ min$/)
  })
  it('drops the minutes for a routine with nothing in it', () => {
    expect(routineMeta({ name: 'New', ex: [] }, 90)).toBe('0 sets')
  })
  it('says one set, not 1 sets', () => {
    expect(routineMeta({ ex: [reps(1)] }, 90)).toMatch(/^1 set · /)
  })
  it('spells the whole thing out for a screen reader', () => {
    expect(routineSpokenLabel({ name: 'Push', ex: [reps(3), reps(3)] }, 90))
      .toMatch(/^Start Push workout, 6 sets, about \d+ minutes$/)
  })
})
