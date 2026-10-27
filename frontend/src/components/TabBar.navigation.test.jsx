// @vitest-environment happy-dom
// Where the three tabs and the round button take you, against a real router.
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TabBar from './TabBar.jsx'
import { DEF, useStore } from '../store/useStore.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let host, root, router, originalS, originalUser, onStart
beforeEach(() => {
  const store = useStore.getState()
  originalS = store.S
  originalUser = store.user
  useStore.setState({ S: JSON.parse(JSON.stringify(DEF)), user: { id: 'test', name: 'test' } })
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  onStart = vi.fn()
  router = createMemoryRouter([{ path: '*', element: <TabBar onStart={onStart} /> }], { initialEntries: ['/home'] })
  act(() => root.render(<RouterProvider router={router} />))
})
afterEach(() => {
  act(() => root.unmount())
  router.dispose()
  host.remove()
  useStore.setState({ S: originalS, user: originalUser })
})
const tap = async label => {
  const button = [...host.querySelectorAll('[role="tab"]')].find(b => b.textContent === label)
  expect(button, label).toBeTruthy()
  await act(async () => button.click())
}
const tapAction = async () => {
  const button = host.querySelector('#tabbar .tr-action')
  expect(button).toBeTruthy()
  await act(async () => button.click())
}
const go = async to => { await act(async () => router.navigate(to)) }

describe('root tab history', () => {
  it('does not accumulate a back stack when switching tabs repeatedly', async () => {
    for (let i = 0; i < 3; i++) {
      for (const label of ['Routines', 'History', 'Home']) await tap(label)
    }
    await tap('Routines')
    expect(router.state.location.pathname).toBe('/plan')
    await go(-1)
    expect(router.state.location.pathname).toBe('/plan')
  })

  it('ignores a tap on the current root, but clears a tab query when returning to its root', async () => {
    const key = router.state.location.key
    await tap('Home')
    expect(router.state.location.key).toBe(key)
    await go('/history?range=month')
    await tap('History')
    expect(router.state.location.pathname).toBe('/history')
    expect(router.state.location.search).toBe('')
  })

  it('still pushes a detail page and returns to the tab it opened from', async () => {
    await tap('Routines')
    await go('/plan/r/one')
    await go(-1)
    expect(router.state.location.pathname).toBe('/plan')
    await go('/settings/workout')
    await go(-1)
    expect(router.state.location.pathname).toBe('/plan')
  })

  it('opens a different tab root from a nested page of the active tab', async () => {
    await go('/plan/r/one')
    await tap('Routines')
    expect(router.state.location.pathname).toBe('/plan')
    expect(router.state.historyAction).toBe('REPLACE')
  })

  // Stats and the Exercise library have no tab of their own in v0.1. Their deep links still
  // render, and the tab they fall under takes you back out.
  it('a hidden screen still has a way back', async () => {
    await go('/stats')
    await tap('History')
    expect(router.state.location.pathname).toBe('/history')
    await go('/library')
    await tap('Routines')
    expect(router.state.location.pathname).toBe('/plan')
  })
})

describe('the round button, one tap', () => {
  // Owner, 28 Oct 2026: it starts today's routine directly. No chooser in between.
  it('starts today’s routines away from Home', async () => {
    act(() => {
      useStore.getState().update(s => {
        s.routines = [{ id: 'r1', name: 'Push', ex: [{ id: 'x', sets: 3, reps: 10, mode: 'reps' }] }]
        s.week = { 0: ['r1'], 1: ['r1'], 2: ['r1'], 3: ['r1'], 4: ['r1'], 5: ['r1'], 6: ['r1'] }
      }, false)
    })
    await go('/plan')
    await tapAction()
    expect(onStart).toHaveBeenCalledWith(['r1'])
  })

  it('starts an empty workout on a rest day', async () => {
    await go('/plan')
    await tapAction()
    expect(onStart).toHaveBeenCalledWith([])
  })

  // A past workout open for editing is not a session to start again; the button returns to it.
  it('returns to a workout that is already open instead of starting another', async () => {
    act(() => { useStore.getState().update(s => { s.active = { id: 'a', name: 'Push', entries: [], cur: 0, editingWorkoutId: 'w1' } }, false) })
    await go('/plan')
    await tapAction()
    expect(onStart).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe('/workout')
  })
})

describe('the pill on Home', () => {
  // Tapping the circle opens the pill; Start in the pill hands the routine to the app. The bar
  // does not decide a workout is running — the weigh-in sheet can still cancel it.
  it('opens the pill and starts the routine shown in it', async () => {
    act(() => {
      useStore.getState().update(s => {
        s.routines = [{ id: 'r1', name: 'Push', ex: [{ id: 'x', sets: 3, reps: 10, mode: 'reps' }] }]
        s.week = { 0: ['r1'], 1: ['r1'], 2: ['r1'], 3: ['r1'], 4: ['r1'], 5: ['r1'], 6: ['r1'] }
      }, false)
    })
    const circle = host.querySelector('.tr-startbar__circle')
    expect(circle.getAttribute('aria-label')).toBe('Start a workout')
    await act(async () => circle.click())
    const start = [...host.querySelectorAll('.tr-startbar__pill button')].find(b => b.textContent === 'Start')
    expect(start).toBeTruthy()
    await act(async () => start.click())
    expect(onStart).toHaveBeenCalledWith(['r1'])
    // Still not live: nothing in the store says a workout began.
    expect(host.querySelector('[role="timer"]').className).toContain('is-off')
  })

  // Nothing planned yet, or a rest day: the circle offers a + instead of a play, and the pill
  // starts a freestyle session.
  it('offers an empty workout when there is no plan yet', async () => {
    expect(host.querySelector('.tr-startbar__circle').getAttribute('aria-label')).toBe('Log a workout')
    await act(async () => host.querySelector('.tr-startbar__circle').click())
    const start = [...host.querySelectorAll('.tr-startbar__pill button')].find(b => b.textContent === 'Start')
    await act(async () => start.click())
    expect(onStart).toHaveBeenCalledWith([])
  })
})
