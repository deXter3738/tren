// @vitest-environment happy-dom
// The design system's 13 components, mounted once each.
//
// These files are copied in from design/design-system/components/src/ and are meant to stay
// byte-identical to it, so they are never edited here to fix a build. This test is the tripwire
// for that: it proves the app can still compile and render every one of them after a fresh drop
// from the designer — TypeScript through esbuild, React imported normally (not through the
// preview page's react-shim), and the icons loaded as hashed URLs by Vite.
//
// It checks mounting, not design. What a component should look like in each of its states is on
// the canvas's Component states board, and that is checked by eye, in light and dark, when the
// screen that uses it is built.
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  Button, ActionButton, TabBar, StartBar, StatTile, ValueStepper,
  EffortSlider, effortText, SetList, Toast, SyncPill, TextField, Switch, SegmentedControl,
} from './index.ts'
import homeIcon from './icons/home.svg'
import calendarIcon from './icons/calendar.svg'
import clockIcon from './icons/clock.svg'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let host, root
beforeEach(() => {
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => {
  act(() => root.unmount())
  host.remove()
})

const show = el => act(() => root.render(el))

const tabs = [
  { id: 'home', label: 'Home', icon: homeIcon },
  { id: 'routines', label: 'Routines', icon: calendarIcon },
  { id: 'history', label: 'History', icon: clockIcon },
]
const routines = [{ name: 'Push', meta: '17 sets · ~55 min', sets: 17, first: 'Bench press' }]

describe('every Tren component mounts', () => {
  it.each([
    ['Button', <Button>Start</Button>],
    ['Button, pending', <Button isPending pendingLabel="Saving…">Save</Button>],
    ['Button, danger', <Button variant="danger" isDisabled>Delete my account</Button>],
    ['ActionButton', <ActionButton kind="start" aria-label="Start Push workout" />],
    ['ActionButton, timer', <ActionButton kind="timer" time="12:48" aria-label="Back to your workout" />],
    ['TabBar', <TabBar tabs={tabs} selected="home" />],
    ['StartBar', <StartBar tabs={tabs} routines={routines} />],
    ['StatTile', <StatTile label="Streak" value="4 weeks" />],
    ['ValueStepper', <ValueStepper unit="kg" defaultValue={60} step={2.5} />],
    ['EffortSlider', <EffortSlider defaultValue={8} collapsible={false} />],
    ['EffortSlider, folded', <EffortSlider />],
    ['SetList', <SetList sets={[
      { label: 'Warm', value: '20 × 10', state: 'done', warmup: true },
      { label: 'Set 1', value: '60 × 8 · RPE 8', state: 'done' },
      { label: 'Set 2', value: '60 × 8', state: 'current' },
      { label: 'Set 3', value: '60 × 8', state: 'upcoming' },
    ]} />],
    ['Toast', <Toast message="Set 2 deleted" actionLabel="Undo" />],
    ['SyncPill', <SyncPill status="waiting" count={1} />],
    ['TextField', <TextField label="Your name" error="Add a name so we can greet you" />],
    ['Switch', <Switch aria-label="Rest timer" defaultSelected />],
    ['SegmentedControl', <SegmentedControl options={['By weekday', 'Rotation']} aria-label="Plan mode" />],
  ])('%s', (_name, el) => {
    show(el)
    expect(host.firstElementChild).not.toBeNull()
  })
})

describe('what the components carry with them', () => {
  // The bar is the app's main navigation; it has to read as tabs to a screen reader, not as
  // three unlabelled buttons.
  it('the tab bar is a tablist of real tabs, one of them selected', () => {
    show(<TabBar tabs={tabs} selected="routines" />)
    const list = host.querySelector('[role="tablist"]')
    expect(list).not.toBeNull()
    const items = [...host.querySelectorAll('[role="tab"]')]
    expect(items.map(b => b.textContent)).toEqual(['Home', 'Routines', 'History'])
    expect(items.map(b => b.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false'])
  })

  // Vite turns an .svg import into something an <img src> can load: these icons are each well
  // under the 4 KB inline limit, so they come back as `data:image/svg+xml,…`, and a bigger one
  // would come back as a hashed /assets/ URL. Either survives a sub-path deploy, and the
  // production Content-Security-Policy allows both (`img-src 'self' data: blob: https:`,
  // web/Dockerfile). What must never happen is the raw "<svg …" markup landing in the src,
  // which is what a misconfigured svg loader hands back — the tabs would show broken images.
  it('the icons arrive as something an <img> can load', () => {
    show(<TabBar tabs={tabs} selected="home" />)
    const srcs = [...host.querySelectorAll('[role="tab"] img')].map(i => i.getAttribute('src'))
    expect(srcs).toHaveLength(3)
    for (const src of srcs) {
      expect(src).not.toMatch(/^\s*<svg/)
      expect(src).toMatch(/^(data:image\/svg\+xml[,;]|[./].*\.svg$)/)
    }
  })

  // The effort slider has to say what it means, not only what number it is on: "RPE 8" alone
  // tells a screen-reader user nothing about how hard that was.
  it('the effort slider speaks its value and its meaning', () => {
    show(<EffortSlider defaultValue={8} collapsible={false} />)
    const input = host.querySelector('input[type="range"]')
    expect(input.getAttribute('aria-valuetext')).toBe('RPE 8, Hard')
    expect(effortText(8)).toBe('Hard. About 2 reps left')
    expect(effortText(10)).toBe('Max effort. Nothing left')
    expect(effortText(6)).toBe('Easy. 4 or more reps left')
    expect(effortText(8.5)).toBe('Hard. About 1–2 reps left')
  })

  // design/HANDOFF.md: "every tappable thing is a real button, link or input".
  it('the switch and the segmented control are real controls', () => {
    show(<Switch aria-label="Rest timer" defaultSelected />)
    const sw = host.querySelector('[role="switch"]')
    expect(sw.tagName).toBe('BUTTON')
    expect(sw.getAttribute('aria-checked')).toBe('true')
    show(<SegmentedControl options={['By weekday', 'Rotation']} aria-label="Plan mode" />)
    expect([...host.querySelectorAll('[role="radio"]')].map(b => b.getAttribute('aria-checked'))).toEqual(['true', 'false'])
  })
})
