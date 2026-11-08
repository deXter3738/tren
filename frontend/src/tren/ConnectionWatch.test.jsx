// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConnectionWatch from './ConnectionWatch.jsx'
import { WAKING_AFTER_MS, SYNC_TRY_MS, SYNC_RETRY_MS } from './global.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

/* The three things the connection says for itself (design/HANDOFF.md, "Global behaviours"). The
   store is a stand-in — what each test sets is `ready`, `sync` and how many workouts are logged —
   and the toast is a spy, since one toast at a time is openGym's own machine and is tested there. */
const mocks = vi.hoisted(() => {
  const state = { ready: true, sync: null, workouts: [] }
  state.toast = vi.fn()
  state.dismissToast = vi.fn()
  state.toastMsg = ''
  state.syncNow = vi.fn(async () => state.sync)
  state.snapshot = () => ({ ready: state.ready, sync: state.sync, S: { workouts: state.workouts }, syncNow: state.syncNow })
  return state
})
vi.mock('../store/useStore.js', () => {
  const useStore = selector => (selector ? selector(mocks.snapshot()) : mocks.snapshot())
  useStore.getState = mocks.snapshot
  return { useStore }
})
vi.mock('../store/useUI.js', () => {
  const snap = () => ({
    toast: (...a) => mocks.toast(...a),
    dismissToast: (...a) => mocks.dismissToast(...a),
    get toastMsg() { return mocks.toastMsg },
  })
  const useUI = selector => (selector ? selector(snap()) : snap())
  useUI.getState = snap
  return { useUI }
})

const sync = (status, extra = {}) => ({ status, offline: false, pending: false, auth: false, lastError: null, ...extra })
const network = on => {
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => on })
  window.dispatchEvent(new Event(on ? 'online' : 'offline'))
}

let host, root
const render = () => {
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => root.render(<ConnectionWatch />))
}
// The toast raised by the last render, or '' for none.
const said = () => (mocks.toast.mock.calls.at(-1) || [''])[0]
const saidOpts = () => (mocks.toast.mock.calls.at(-1) || [null, {}])[1] || {}

beforeEach(() => {
  vi.useFakeTimers()
  mocks.ready = true
  mocks.sync = null
  mocks.workouts = []
  mocks.toastMsg = ''
  mocks.toast.mockClear()
  mocks.dismissToast.mockClear()
  mocks.syncNow.mockClear()
  network(true)
})
afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  vi.useRealTimers()
})

describe('waking the server up', () => {
  it('says nothing when the first answer comes back inside 1.5s', () => {
    mocks.ready = false
    render()
    act(() => { vi.advanceTimersByTime(WAKING_AFTER_MS - 1) })
    mocks.ready = true
    act(() => root.render(<ConnectionWatch />))
    act(() => { vi.advanceTimersByTime(5000) })
    expect(mocks.toast).not.toHaveBeenCalled()
  })

  it('says the server is waking once the first request is slower than that', () => {
    mocks.ready = false
    render()
    act(() => { vi.advanceTimersByTime(WAKING_AFTER_MS) })
    expect(said()).toBe('Waking up Tren… a few seconds')
  })

  it('takes the line back the moment the data arrives', () => {
    mocks.ready = false
    render()
    act(() => { vi.advanceTimersByTime(WAKING_AFTER_MS) })
    mocks.toastMsg = said()
    mocks.ready = true
    act(() => root.render(<ConnectionWatch />))
    expect(mocks.dismissToast).toHaveBeenCalledTimes(1)
  })

  it('leaves a newer message alone: only its own line is taken back', () => {
    mocks.ready = false
    render()
    act(() => { vi.advanceTimersByTime(WAKING_AFTER_MS) })
    mocks.toastMsg = 'Set 2 deleted'   // something else has replaced it meanwhile
    mocks.ready = true
    act(() => root.render(<ConnectionWatch />))
    expect(mocks.dismissToast).not.toHaveBeenCalled()
  })
})

describe('the connection coming back', () => {
  it('counts the workouts logged while the server was out of reach', () => {
    mocks.sync = sync('offline', { offline: true, pending: true })
    mocks.workouts = [{ id: 'a' }]
    render()
    mocks.workouts = [{ id: 'a' }, { id: 'b' }]
    mocks.sync = sync('ok')
    act(() => root.render(<ConnectionWatch />))
    expect(said()).toBe('Back online · 1 workout synced')
    expect(saidOpts().ms).toBe(3000)
  })

  it('says nothing when nothing was logged while it was away', () => {
    mocks.sync = sync('offline', { offline: true })
    mocks.workouts = [{ id: 'a' }]
    render()
    mocks.sync = sync('ok')
    act(() => root.render(<ConnectionWatch />))
    expect(mocks.toast).not.toHaveBeenCalled()
  })

  it('has no "back" for a device that never had a server', () => {
    mocks.sync = sync('local')
    render()
    mocks.workouts = [{ id: 'a' }]
    mocks.sync = sync('ok')
    act(() => root.render(<ConnectionWatch />))
    expect(mocks.toast).not.toHaveBeenCalled()
  })
})

describe('a sync that keeps failing', () => {
  it('keeps quiet for the first two attempts, then says so once, with a Retry', () => {
    mocks.sync = sync('error', { lastError: { status: 502, code: 'http' } })
    render()
    act(() => { vi.advanceTimersByTime(SYNC_TRY_MS * 2) })
    expect(mocks.toast).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(SYNC_TRY_MS) })
    expect(said()).toBe('Couldn’t sync. We’ll keep trying.')
    expect(saidOpts().action).toBe('Retry')
  })

  it('then tries again every five minutes, without saying it again', () => {
    mocks.sync = sync('offline', { offline: true, pending: true })
    render()
    act(() => { vi.advanceTimersByTime(SYNC_TRY_MS * 3) })
    expect(mocks.toast).toHaveBeenCalledTimes(1)
    act(() => { vi.advanceTimersByTime(SYNC_RETRY_MS) })
    expect(mocks.syncNow).toHaveBeenCalledTimes(1)
    expect(mocks.toast).toHaveBeenCalledTimes(1)
  })

  it('the Retry on the toast asks the server now', async () => {
    mocks.sync = sync('error', { lastError: { status: 500, code: 'http' } })
    render()
    act(() => { vi.advanceTimersByTime(SYNC_TRY_MS * 3) })
    await act(async () => { saidOpts().onAction() })
    expect(mocks.syncNow).toHaveBeenCalledTimes(1)
  })

  it('leaves a phone with no network alone: that is the banner’s job, not a toast’s', () => {
    network(false)
    mocks.sync = sync('offline', { offline: true, pending: true })
    render()
    act(() => { vi.advanceTimersByTime(SYNC_TRY_MS * 5) })
    expect(mocks.toast).not.toHaveBeenCalled()
  })

  it('forgets the failed attempts once the server answers again', () => {
    mocks.sync = sync('error', { lastError: { status: 502, code: 'http' } })
    render()
    act(() => { vi.advanceTimersByTime(SYNC_TRY_MS * 2) })
    mocks.sync = sync('ok')
    act(() => root.render(<ConnectionWatch />))
    mocks.sync = sync('error', { lastError: { status: 502, code: 'http' } })
    act(() => root.render(<ConnectionWatch />))
    act(() => { vi.advanceTimersByTime(SYNC_TRY_MS * 2) })
    expect(mocks.toast).not.toHaveBeenCalled()   // counting started over
  })
})
