import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { useOnline } from '../components/ServerSync.jsx'
import {
  BACK_ONLINE_MS, UNTIL_DISMISSED_MS, WAKING_AFTER_MS,
  SYNC_TRIES_BEFORE_TOAST, SYNC_TRY_MS, SYNC_RETRY_MS,
  backOnlineLine, wakingLine, syncFailedLine, retryLabel, serverIsFailing,
} from './global.js'

/* The three things the connection says for itself (design/HANDOFF.md, "Global behaviours"):
   the server waking up, the connection coming back, and a sync that has failed often enough to
   be worth a word. It draws nothing — it watches the store and raises toasts — so it has no
   layout and does not wait for a board.

   The fourth, the banner while the phone has no network, stays with openGym's own indicator
   (components/SyncBanner.jsx); this file would only be a second one.

   SILENT RETRIES ARE ALREADY HAPPENING. openGym asks the server for its revision every 30s
   (useStore.js, POLL_MS) and pushes again when a change is made, so the spec's "silent retries"
   need nothing added here: counting 30s windows of continuous failure counts real attempts.
   Only after three of them does this file act — one toast, then an attempt of its own every five
   minutes until the server answers. */
export default function ConnectionWatch() {
  const ready = useStore(s => s.ready)
  const sync = useStore(s => s.sync)
  const online = useOnline()

  /* ---- "Waking up Tren… a few seconds" ---------------------------------------------------- */
  /* Only the first request, and only when it is slow: a server that answers inside 1.5s says
     nothing at all, which is the usual case and the reason for the threshold. The toast is given
     a long life rather than a short one because what ends it is the data arriving, not a clock. */
  const wakingShown = useRef(false)
  useEffect(() => {
    const ui = useUI.getState()
    if (ready) {
      // Mine to take back, and only if it is still the one showing: a newer toast has replaced it.
      if (wakingShown.current && useUI.getState().toastMsg === wakingLine()) ui.dismissToast()
      wakingShown.current = false
      return
    }
    const tm = setTimeout(() => {
      if (useStore.getState().ready) return
      wakingShown.current = true
      useUI.getState().toast(wakingLine(), { ms: UNTIL_DISMISSED_MS })
    }, WAKING_AFTER_MS)
    return () => clearTimeout(tm)
  }, [ready])

  /* ---- "Back online · 1 workout synced" ---------------------------------------------------- */
  /* What counts as "waiting workouts" is the workouts logged while the server was out of reach:
     the count is taken the moment it goes and read again when the two copies agree. Nothing
     logged in between means nothing went up, and then there is nothing to say — the spec's
     sentence only exists in the plural and singular of a number of workouts. */
  const offlineAt = useRef(null)
  useEffect(() => {
    const status = sync?.status
    const reachable = !!online && status === 'ok'
    const count = () => (useStore.getState().S.workouts || []).length
    if (!reachable) {
      // 'local' is a device with no server at all: there is no "back" for it to come from.
      if (offlineAt.current === null && status && status !== 'local') offlineAt.current = count()
      return
    }
    if (offlineAt.current === null) return
    const line = backOnlineLine(Math.max(0, count() - offlineAt.current))
    offlineAt.current = null
    if (line) useUI.getState().toast(line, { ms: BACK_ONLINE_MS })
  }, [sync?.status, online])

  /* ---- "Couldn’t sync. We’ll keep trying." + Retry ----------------------------------------- */
  const tries = useRef(0)
  const failing = serverIsFailing(sync, { online })
  useEffect(() => {
    if (!failing) { tries.current = 0; return }
    const again = () => useStore.getState().syncNow().catch(() => {})
    const step = () => {
      tries.current += 1
      if (tries.current < SYNC_TRIES_BEFORE_TOAST) return SYNC_TRY_MS
      // Said once per spell of trouble, not once per attempt: the toast carries the Retry, and a
      // sentence that re-appears every five minutes is a nag, not news.
      if (tries.current === SYNC_TRIES_BEFORE_TOAST) {
        // No `ms`: a toast with an action already stays the spec's 5s (useUI.js).
        useUI.getState().toast(syncFailedLine(), { action: retryLabel(), onAction: again })
      } else {
        again()
      }
      return SYNC_RETRY_MS
    }
    let tm = setTimeout(function run() { tm = setTimeout(run, step()) }, SYNC_TRY_MS)
    return () => clearTimeout(tm)
    // The whole spell is one effect: it restarts only when the trouble starts or ends, not on
    // every store write, so the count of failed windows is not reset by an unrelated change.
  }, [failing])

  return null
}
