import { describe, it, expect } from 'vitest'
import {
  SAVING_GIVES_UP_MS, BACK_ONLINE_MS, REST_DONE_MS, UNDO_MS, WAKING_AFTER_MS,
  SYNC_TRIES_BEFORE_TOAST, SYNC_RETRY_MS,
  offlineBanner, backOnlineLine, wakingLine, syncFailedLine, savingLabel,
  setDeletedLine, restDoneLine, setUpAfterRest, syncPillStatus, serverIsFailing,
} from './global.js'

/* These are the handover's own numbers and sentences (design/HANDOFF.md, "Global behaviours").
   The test exists so a later edit has to be deliberate: copy is final, golden rule 3. */

describe('the numbers the spec fixes', () => {
  it('matches the table', () => {
    expect(WAKING_AFTER_MS).toBe(1500)
    expect(BACK_ONLINE_MS).toBe(3000)
    expect(REST_DONE_MS).toBe(3000)
    expect(UNDO_MS).toBe(5000)
    expect(SAVING_GIVES_UP_MS).toBe(10000)
    expect(SYNC_TRIES_BEFORE_TOAST).toBe(3)
    expect(SYNC_RETRY_MS).toBe(300000)
  })
})

describe('the words the spec fixes', () => {
  it('says the offline banner with its em dash', () => {
    expect(offlineBanner()).toBe('No signal. Keep logging — it saves on this phone.')
  })
  it('counts the workouts that went up, and says nothing when none did', () => {
    expect(backOnlineLine(1)).toBe('Back online · 1 workout synced')
    expect(backOnlineLine(2)).toBe('Back online · 2 workouts synced')
    expect(backOnlineLine(0)).toBe(null)
  })
  it('says the server is waking, with the ellipsis character', () => {
    expect(wakingLine()).toBe('Waking up Tren… a few seconds')
  })
  it('says a failed sync with curly apostrophes', () => {
    expect(syncFailedLine()).toBe('Couldn’t sync. We’ll keep trying.')
  })
  it('says "Saving…"', () => {
    expect(savingLabel()).toBe('Saving…')
  })
  it('names the set it deleted', () => {
    expect(setDeletedLine(2)).toBe('Set 2 deleted')
  })
  it('names the set that is up after a rest, and keeps the half it knows without one', () => {
    expect(restDoneLine(4)).toBe('Rest done · Set 4 is up')
    expect(restDoneLine(null)).toBe('Rest done')
    expect(restDoneLine(0)).toBe('Rest done')
  })
})

describe('syncPillStatus', () => {
  const S = (status, extra = {}) => ({ status, ...extra })
  it('is synced when the two copies agree', () => {
    expect(syncPillStatus(S('ok'))).toBe('synced')
  })
  it('is syncing while a change is on its way to a server that answers', () => {
    expect(syncPillStatus(S('pending', { pending: true }))).toBe('syncing')
  })
  it('counts what is owed when the server is out of reach', () => {
    expect(syncPillStatus(S('offline', { pending: true }))).toBe('waiting')
  })
  it('is paused when the server is out of reach with nothing owed', () => {
    expect(syncPillStatus(S('offline'))).toBe('paused')
  })
  it('is paused when the server refuses the device or answers with a failure', () => {
    expect(syncPillStatus(S('auth'))).toBe('paused')
    expect(syncPillStatus(S('error'))).toBe('paused')
    expect(syncPillStatus(S('held'))).toBe('paused')
  })
  it('has no pill for a device with no server, or no sync state at all', () => {
    expect(syncPillStatus(S('local'))).toBe(null)
    expect(syncPillStatus(null)).toBe(null)
  })
  it('believes the phone the moment it says its network is gone', () => {
    expect(syncPillStatus(S('ok'), { online: false })).toBe('paused')
    expect(syncPillStatus(S('pending', { pending: true }), { online: false })).toBe('waiting')
  })
})

describe('serverIsFailing', () => {
  it('is the server’s fault only when the phone still has a network', () => {
    expect(serverIsFailing({ status: 'offline' }, { online: true })).toBe(true)
    expect(serverIsFailing({ status: 'error' }, { online: true })).toBe(true)
    expect(serverIsFailing({ status: 'offline' }, { online: false })).toBe(false)
  })
  it('is quiet when there is nothing wrong, or nothing to be wrong with', () => {
    expect(serverIsFailing({ status: 'ok' })).toBe(false)
    expect(serverIsFailing({ status: 'pending' })).toBe(false)
    expect(serverIsFailing({ status: 'local' })).toBe(false)
    expect(serverIsFailing(null)).toBe(false)
  })
})

describe('setUpAfterRest', () => {
  const work = sets => ({ entries: [{ sets }] })
  const plain = n => Array.from({ length: n }, () => ({ reps: 5 }))
  const T = (forSet, forIdx = 0) => ({ forIdx, forSet })

  it('names the set after the one the rest followed', () => {
    expect(setUpAfterRest(work(plain(4)), T(0))).toBe(2)
    expect(setUpAfterRest(work(plain(4)), T(2))).toBe(4)
  })
  it('says nothing after the last set of the exercise', () => {
    expect(setUpAfterRest(work(plain(3)), T(2))).toBe(null)
  })
  it('does not count warm-ups, and does not name one', () => {
    const sets = [{ reps: 10, warmup: true }, { reps: 5 }, { reps: 5 }]
    expect(setUpAfterRest(work(sets), T(1))).toBe(2)   // the first working set is behind it
    expect(setUpAfterRest(work(sets), T(0))).toBe(null) // a warm-up carries no number
  })
  it('keeps the number while the second side of a set is still to come', () => {
    const sets = [{ side: 'L' }, { side: 'R' }, { side: 'L' }, { side: 'R' }]
    expect(setUpAfterRest(work(sets), T(0))).toBe(1)   // left done, right of set 1 is up
    expect(setUpAfterRest(work(sets), T(1))).toBe(2)   // set 1 done, set 2 is up
  })
  it('says nothing when it cannot know', () => {
    expect(setUpAfterRest(null, T(0))).toBe(null)
    expect(setUpAfterRest(work(plain(3)), {})).toBe(null)          // a rest that never knew
    expect(setUpAfterRest(work(plain(3)), T(9))).toBe(null)        // its set has been deleted
    expect(setUpAfterRest(work(plain(3)), T(0, 7))).toBe(null)     // its exercise has gone
  })
})
