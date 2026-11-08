/* Tren's global behaviours: the words and the numbers.
   -----------------------------------------------------------------------------------------------
   design/HANDOFF.md, "Global behaviours", fixes eight situations that happen on every screen —
   what the app says, and how long it says it for. That table is the whole specification: nothing
   here is a choice, and nothing here is a layout, so none of it waits for a board.

   Everything in this file is pure. The words come back as strings (through t(), so a later
   translation is only keys — CLAUDE.md, policy 3) and the numbers are plain exports, so a screen,
   a store or a test can read the same value the spec gives.

   COPY IS FINAL (golden rule 3). The sentences below are the handover's, character for character:
   the em dash in the offline banner, the middots, the ellipsis character in "Saving…". The one
   place this file does not copy blindly is the apostrophe in "Couldn’t sync. We’ll keep trying.",
   which the handover's own table writes straight while rule 3 asks for curly and every other
   apostrophe in the pack is curly. Curly it is, and docs/UPSTREAM.md carries the question. */
import { t } from '../lib/i18n.js'
import { isWarmupRow } from '../lib/workout-model.js'

/* ---- how long things stay ------------------------------------------------------------------ */

/** "Saving…" has given up: show the sync-failed toast. */
export const SAVING_GIVES_UP_MS = 10000
/** "Back online · 1 workout synced". */
export const BACK_ONLINE_MS = 3000
/** "Rest done · Set 4 is up". */
export const REST_DONE_MS = 3000
/** A toast offering Undo, e.g. a deleted set. openGym's own TOAST_ACTION_MS is the same 5s. */
export const UNDO_MS = 5000
/** The first request is still out after this long: say the server is waking up. */
export const WAKING_AFTER_MS = 1500
/** A very long life for a toast that is dismissed by an event, not by its clock (waking up). */
export const UNTIL_DISMISSED_MS = 120000
/** Failed attempts the app keeps quiet about before it says a word. */
export const SYNC_TRIES_BEFORE_TOAST = 3
/** How long one silent attempt is given. openGym already asks the server for its revision on this
 *  rhythm (useStore.js, POLL_MS), so counting these windows counts real attempts and adds none. */
export const SYNC_TRY_MS = 30000
/** Once the toast is out, the app tries again this often. */
export const SYNC_RETRY_MS = 5 * 60 * 1000

/* ---- the words ------------------------------------------------------------------------------ */

/** The banner across the top while the phone has no network. */
export const offlineBanner = () => t('No signal. Keep logging — it saves on this phone.')

/** The connection came back and `n` workouts went up with it. Nothing waiting, nothing to say. */
/* Two keys rather than tn(): v0.1 is English only and adds nothing to openGym's 19 locale packs
   (CLAUDE.md, policy 3), while every tn() key is required to carry real one/few/many forms in
   ru, uk and pl (src/lib/i18n-plural.test.js). Two t() keys say the same thing and keep both
   rules true; a language that needs more forms gets them when it is added. */
export const backOnlineLine = n =>
  (n > 0 ? (n === 1 ? t('Back online · 1 workout synced') : t('Back online · {0} workouts synced', n)) : null)

/** The server was asleep and the first request is taking its time. */
export const wakingLine = () => t('Waking up Tren… a few seconds')

/** Three attempts have failed. Carries a Retry. */
export const syncFailedLine = () => t('Couldn’t sync. We’ll keep trying.')
export const retryLabel = () => t('Retry')

/** What a button says while it is saving. */
export const savingLabel = () => t('Saving…')

/** A set was removed, with an Undo for 5 seconds. */
export const setDeletedLine = n => t('Set {0} deleted', n)
export const undoLabel = () => t('Undo')

/** The rest timer ran out. `next` is the number of the set that is now up; without it — a rest
 *  whose set has since been deleted, or one restored from a reload that never knew — the sentence
 *  keeps its first half, which is the part that says what happened. */
export const restDoneLine = next => (next ? t('Rest done · Set {0} is up', next) : t('Rest done'))

/** The number of the set that is up now that a rest has run out, from the live workout and the
 *  timer that just ended (its `forIdx` and `forSet` say which set it followed). Warm-ups are not
 *  counted — they are not counted in totals anywhere in Tren — and a per-side set is two rows
 *  that read as one, so finishing its first side leaves the same number up.
 *
 *  `null` where there is no honest number: a rest that never recorded which set it followed, one
 *  whose set has since been deleted, a warm-up, or the last set of the exercise. restDoneLine()
 *  then says the half of the sentence that is still true. */
export function setUpAfterRest(active, timer) {
  const sets = active?.entries?.[timer?.forIdx]?.sets
  const i = timer?.forSet
  const row = Array.isArray(sets) && i != null ? sets[i] : null
  if (!row || isWarmupRow(row)) return null
  if (!sets.slice(i + 1).some(x => !isWarmupRow(x))) return null
  const counted = sets.slice(0, i + 1).filter(x => !isWarmupRow(x)).length
  if (!row.side) return counted + 1
  // Halves: an odd count means one side is done and the other is the next thing, under the same
  // number; an even count means the set is finished and the next one is up.
  const cur = Math.ceil(counted / 2)
  return counted % 2 ? cur : cur + 1
}

/* ---- the sync pill ------------------------------------------------------------------------- */

/* openGym's connection has seven states (useStore.js, statusOf); Tren's pill has four. This is the
   map between them, and the only place it exists.

     synced    this device holds what the server holds
     syncing   reachable, and a change is on its way
     waiting   out of reach with changes owed — the pill counts them
     paused    out of reach with nothing owed, refused, or answering with an error: tap for Retry

   `null` means no pill at all: a phone kept local, a guest, nobody signed in. A device whose own
   network is gone is treated as out of reach straight away, the moment the phone says so, rather
   than at the next attempt — the same rule components/ServerSync.jsx uses for the banner. */
export function syncPillStatus(sync, { online = true } = {}) {
  if (!sync) return null
  const status = !online && (sync.status === 'ok' || sync.status === 'pending') ? 'offline' : sync.status
  switch (status) {
    case 'ok': return 'synced'
    case 'pending': return 'syncing'
    case 'offline': return sync.pending ? 'waiting' : 'paused'
    case 'error':
    case 'auth':
    case 'held': return 'paused'
    default: return null   // 'local'
  }
}

/** True while the connection is the server's fault rather than the phone's: the device has a
 *  network and the server still is not answering, or is answering with a failure. This is what
 *  the silent retries and the "Couldn’t sync" toast watch; a phone with no network gets the
 *  banner instead, and nagging it with a toast as well would be two words for one fact. */
export function serverIsFailing(sync, { online = true } = {}) {
  if (!sync || !online) return false
  return sync.status === 'offline' || sync.status === 'error'
}
