// @vitest-environment happy-dom
// Tren's bottom bar: three tabs, a round button, and on Home the StartBar that morphs into the
// workout pill and then into the live bar.
//
// The bar is fixed on screen and re-renders on every store write — once a second for the whole of
// a rest — so the first thing checked here is still openGym's original worry: its buttons have to
// survive that, which they only do while every component it renders is declared at module scope.
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TabBar from './TabBar.jsx'
import { DEF, useStore } from '../store/useStore.js'

const where = vi.hoisted(() => ({ loc: { pathname: '/home' } }))
vi.mock('react-router-dom', () => ({
  useNavigate: () => () => {},
  useLocation: () => where.loc,
}))

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let host, root, originalS, originalUser

beforeEach(() => {
  const store = useStore.getState()
  originalS = store.S
  originalUser = store.user
  useStore.setState({ S: JSON.parse(JSON.stringify(DEF)), user: { id: 1, name: 'test' } })
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  useStore.setState({ S: originalS, user: originalUser })
  where.loc = { pathname: '/home' }
})

const mount = () => act(() => { root.render(<TabBar onStart={() => {}} />) })
const tabs = () => [...host.querySelectorAll('#tabbar [role="tab"]')]
const labels = () => tabs().map(b => b.textContent)
const lit = () => tabs().filter(b => b.getAttribute('aria-selected') === 'true').map(b => b.textContent)
const action = () => host.querySelector('#tabbar .tr-action')
const live = () => host.querySelector('#tabbar [role="timer"]')
const session = extra => ({ id: 'a', name: 'Push', entries: [], cur: 0, ...extra })

describe('the bar across a store write', () => {
  it('keeps the very same tabs instead of rebuilding them every tick', () => {
    mount()
    const before = tabs()
    expect(before).toHaveLength(3)

    // What a rest does once a second: S is replaced, so everything reading it re-renders.
    act(() => { useStore.getState().update(s => { s.restSec = 91 }, false) })

    const after = tabs()
    expect(after).toHaveLength(before.length)
    after.forEach((el, i) => expect(el).toBe(before[i]))
  })
})

describe('the three tabs', () => {
  it('are Home, Routines and History, in that order', () => {
    mount()
    expect(labels()).toEqual(['Home', 'Routines', 'History'])
    expect(lit()).toEqual(['Home'])
  })

  // A screen without a tab of its own lights the tab it is opened from, the way its back button
  // goes. Stats and the Exercise library are hidden in v0.1 but their deep links keep working,
  // so they still light a tab rather than leaving the bar blank.
  it.each([
    ['/home', 'Home'], ['/settings', 'Home'], ['/settings/units', 'Home'], ['/checkin', 'Home'],
    ['/plan', 'Routines'], ['/plan/r/one', 'Routines'], ['/library', 'Routines'], ['/muscles', 'Routines'],
    ['/history', 'History'], ['/stats', 'History'], ['/structural-balance', 'History'],
    ['/progress-photos', 'History'], ['/measurements', 'History'],
  ])('%s lights %s', (pathname, tab) => {
    where.loc = { pathname }
    mount()
    expect(lit()).toEqual([tab])
  })

  it('Muscles opened from Stats lights History, the tab Stats falls under', () => {
    where.loc = { pathname: '/muscles', state: { from: '/stats' } }
    mount()
    expect(lit()).toEqual(['History'])
  })

  // The admin dashboard belongs to no tab. Lighting one would say it does.
  it('lights nothing on a screen that belongs to no tab', () => {
    where.loc = { pathname: '/admin' }
    mount()
    expect(lit()).toEqual([])
  })
})

// Settings → "Show connection status" off (#369, #330): a stuck sync shows as a dot on Home, the
// tab Settings opens from, and the tab's name says it, because a dot alone is colour-only meaning.
describe('the connection dot on Home', () => {
  const home = () => tabs()[0]
  it('is there for a sync problem only while the banner is switched off', () => {
    const original = useStore.getState().sync
    try {
      useStore.setState({ sync: { status: 'error', lastError: { status: 502 }, pending: true } })
      mount()
      expect(home().querySelector('.tab-dot')).toBeNull()
      act(() => { useStore.getState().update(s => { s.connStatus = false }, false) })
      expect(home().querySelector('.tab-dot')).not.toBeNull()
      expect(home().getAttribute('aria-label')).toBe('Home, Connection problem')
      act(() => { useStore.setState({ sync: { status: 'ok', lastError: null, pending: false } }) })
      expect(home().querySelector('.tab-dot')).toBeNull()
      expect(home().getAttribute('aria-label')).toBeNull()
    } finally { useStore.setState({ sync: original }) }
  })
})

describe('the round button away from Home', () => {
  beforeEach(() => { where.loc = { pathname: '/plan' } })

  // Owner, 28 Oct 2026: one tap starts today's routine. Choosing a different one happens on Home,
  // in the pill. A rest day has no routine to name, so the button offers an empty workout.
  it('names today’s routine, and says so in full', () => {
    act(() => {
      useStore.getState().update(s => {
        s.routines = [{ id: 'r1', name: 'Push', ex: [{ id: 'x', sets: 3, reps: 10, mode: 'reps' }] }]
        s.week = { 0: ['r1'], 1: ['r1'], 2: ['r1'], 3: ['r1'], 4: ['r1'], 5: ['r1'], 6: ['r1'] }
      }, false)
    })
    mount()
    expect(action().getAttribute('aria-label')).toMatch(/^Start Push workout, 3 sets, about \d+ minutes$/)
  })

  it('offers an empty workout on a rest day', () => {
    mount()
    expect(action().getAttribute('aria-label')).toBe('Start an empty workout')
  })

  it('becomes the running clock, named Resume, while a session is away', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date(2026, 9, 5, 18, 0, 0))
      act(() => { useStore.getState().update(s => { s.active = session({ start: Date.now() - 754_000 }) }, false) })
      mount()
      const button = action()
      expect(button.getAttribute('aria-label')).toBe('Resume')
      expect(button.textContent).toBe('12:34')
      act(() => { vi.advanceTimersByTime(2000) })
      expect(button.textContent).toBe('12:36')
      expect(action()).toBe(button)   // the same button, only its text ticks

      // A past workout being edited has no clock running, and is not a session to resume.
      act(() => { useStore.getState().update(s => { s.active.editingWorkoutId = 'w1' }, false) })
      expect(action().getAttribute('aria-label')).toBe('Edit workout')
    } finally { vi.useRealTimers() }
  })
})

describe('the live bar on Home', () => {
  it('shows the running session, its time and the set you are on', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date(2026, 9, 5, 18, 0, 0))
      act(() => {
        useStore.getState().update(s => {
          s.active = session({
            start: Date.now() - 754_000,
            entries: [{ id: 'x', target: { mode: 'reps' }, sets: [{ w: 60, r: 8, done: true }, { w: 60, r: 8, done: false }, { w: 60, r: 8, done: false }] }],
          })
        }, false)
      })
      mount()
      const bar = live()
      expect(bar).not.toBeNull()
      expect(bar.textContent).toContain('Push · 12:34')
      expect(bar.textContent).toContain('Set 2 of 3')
      // The tabs are still there behind it: the bar morphs, it is not replaced.
      expect(labels()).toEqual(['Home', 'Routines', 'History'])
    } finally { vi.useRealTimers() }
  })

  it('goes back to the tabs when the session ends', () => {
    act(() => { useStore.getState().update(s => { s.active = session({ start: Date.now() - 1000 }) }, false) })
    mount()
    expect(live().className).toContain('is-on')
    act(() => { useStore.getState().update(s => { s.active = null }, false) })
    expect(live().className).toContain('is-off')
  })
})
