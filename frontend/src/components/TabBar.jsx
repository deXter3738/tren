// Tren's bottom bar.
//
// Same file, same default export, same `onStart` prop as openGym's tab bar, so App.jsx and its
// tests do not have to change; everything inside is the design system's. The id stays `tabbar`
// too: views/Workout.jsx measures this element to decide whether a set row is on screen.
//
// Three tabs — Home, Routines, History — over a progressive blur, with a round glossy button at
// the right. On Home the whole thing is a StartBar, which morphs: tabs → workout pill → routine
// menu → live bar. Everywhere else it is the plain tab bar plus that round button.
//
// The bar never decides on its own that a workout is running. It says "Start was pressed"; the
// app answers by putting a session in the store, and the bar follows (`startedAt`). That matters
// because Start can open the weigh-in sheet, and the weigh-in sheet can be cancelled.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { effectiveRoutineIds, effectiveRoutines, setsDoneActive, setUnitsTotal } from '../lib/history.js'
import { todayISO } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Elapsed from './Elapsed.jsx'
import { useConnectionTrouble } from './SyncBanner.jsx'
import { ActionButton, StartBar, TabBar as TrTabBar } from '../ui/tren/index.ts'
import { routineMeta, routineSpokenLabel } from '../tren/routine-meta.js'
import homeIcon from '../ui/tren/icons/home.svg'
import calendarIcon from '../ui/tren/icons/calendar.svg'
import clockIcon from '../ui/tren/icons/clock.svg'

// Which of the three tabs a route belongs to. A screen without a tab of its own lights the tab it
// is opened from, the way its back button goes. Stats and the body screens are hidden in v0.1 but
// their deep links still work, so they are still mapped: landing on /stats from a link should not
// leave the bar blank.
const TAB_OF = {
  home: 'home', settings: 'home', checkin: 'home',
  plan: 'routines', library: 'routines', muscles: 'routines',
  history: 'history', stats: 'history', 'structural-balance': 'history',
  'progress-photos': 'history', measurements: 'history',
}
const PATH_OF = { home: '/home', routines: '/plan', history: '/history' }

// Six stacked layers, each blurrier than the one before and each masked to its own band, so the
// blur fades in towards the bottom of the screen instead of stopping at a hard edge. The bands
// and the tint are in src/tren/bottom-bar.css; this is only the stack.
function ProgressiveBlur() {
  return (
    <span className="tr-bottombar__blur" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map(i => <span key={i} />)}
    </span>
  )
}

export default function TabBar({ onStart }) {
  const nav = useNavigate()
  const loc = useLocation()
  const S = useStore(s => s.S)
  const user = useStore(s => s.user)
  const isGuest = useStore(s => s.isGuest())
  // With the connection banner switched off, a sync problem shows as a dot on Home, the tab
  // Settings lives under (#369, #330).
  const trouble = useConnectionTrouble()
  // The routine shown in the pill, once someone has chosen one. Null means "whatever today is".
  const [picked, setPicked] = useState(null)
  if (!user && !isGuest) return null

  const cur = loc.pathname.split('/')[1] || 'home'
  const selected = cur === 'muscles' && loc.state?.from === '/stats' ? 'history' : (TAB_OF[cur] || '')

  // Root tabs are peers, not another level to unwind with Android Back.
  const switchTab = path => {
    if (loc.pathname !== path || loc.search) nav(path, { replace: true })
  }

  const running = !!S.active && cur !== 'workout' && !S.active.editingWorkoutId && !S.active.backfill && S.active.start > 0
  // One tap, away from Home: start what today says, no screen in between (owner, 28 Oct 2026).
  // A weekday can hold several routines, and they start as one combined session. A rest day has
  // nothing planned, so it starts an empty one — the same freestyle session openGym's own start
  // chooser offers, which is still there behind /workout for anyone who deep-links to it.
  // Choosing a different routine happens on Home, in the pill.
  const startWorkout = () => {
    if (S.active) { nav('/workout'); return }
    const ids = effectiveRoutineIds(S, todayISO())
    onStart(effectiveRoutines(S, todayISO()).some(r => r.ex.length) ? ids : [])
  }

  // A sync problem puts a dot on the Home icon. Colour alone never carries a meaning here, so the
  // tab also says it: "Home, Connection problem".
  const homeTabIcon = trouble
    ? <span className="tab-ic"><img src={homeIcon} alt="" width={24} height={24} /><span className="tab-dot" aria-hidden="true" /></span>
    : homeIcon
  const tabs = [
    { id: 'home', label: t('Home'), icon: homeTabIcon, ariaLabel: trouble ? t('Home') + ', ' + t('Connection problem') : undefined },
    { id: 'routines', label: t('Routines'), icon: calendarIcon },
    { id: 'history', label: t('History'), icon: clockIcon },
  ]
  const onTabChange = id => switchTab(PATH_OF[id] || '/home')

  // Today decides what the round button offers: a play on a training day, a + on a rest day.
  const todayIds = effectiveRoutineIds(S, todayISO())
  const dayKind = todayIds.length ? 'start' : 'log'
  const rest = Number(S.restSec)

  // Home gets the morphing StartBar — unless a past workout is open for editing, which is not a
  // session to resume and has no clock: that falls through to the plain bar below.
  const onHome = selected === 'home' && (!S.active || running)
  if (onHome) {
    const usable = (S.routines || []).filter(r => r.ex?.length)
    const choices = usable.map(r => ({
      id: r.id,
      name: r.name,
      meta: routineMeta(r, rest),
      sets: null,
      first: null,
    }))
    // An empty plan still needs something in the pill, and the design system draws this one with
    // a + on its badge.
    if (!choices.length) choices.push({ id: null, name: t('Empty workout'), meta: t('Pick the exercises as you go'), sets: null, first: null })

    const todayFirst = effectiveRoutines(S, todayISO()).find(r => r.ex.length)
    const defaultName = (picked && choices.some(c => c.name === picked) ? picked : null)
      ?? todayFirst?.name ?? choices[0].name

    // While a session runs the bar shows that session, not a plan: its real name, the set you are
    // on and how long you have been at it. `sets` is left null and the line goes in `first`,
    // because the design system's own wording there is "Set 1 of N" — true at the start of a
    // workout, not in the middle of one.
    const live = running ? {
      id: null,
      name: S.active.name,
      meta: '',
      sets: null,
      first: t('Set {0} of {1}', setsDoneActive(S.active) + 1, setUnitsTotal(S.active.entries)),
    } : null
    const routines = live ? [live, ...choices] : choices
    const shown = live ? live.name : defaultName

    return (
      <div id="tabbar" className="tr-bottombar">
        <ProgressiveBlur />
        <StartBar
          tabs={tabs}
          selectedTab="home"
          onTabChange={onTabChange}
          routines={routines}
          routine={shown}
          onRoutineChange={setPicked}
          dayKind={dayKind}
          startedAt={running ? S.active.start : null}
          onStart={name => {
            const chosen = choices.find(c => c.name === name)
            onStart(chosen?.id ? [chosen.id] : [])
          }}
          onOpen={() => nav('/workout')}
        />
      </div>
    )
  }

  // Everywhere else: the three tabs and the round button on its own.
  const todayRoutine = effectiveRoutines(S, todayISO()).find(r => r.ex.length)
  const actionLabel = running ? t('Resume')
    : S.active ? (S.active.editingWorkoutId ? t('Edit workout') : t('Resume'))
      : todayRoutine ? routineSpokenLabel(todayRoutine, rest)
        : t('Start an empty workout')

  return (
    <div id="tabbar" className="tr-bottombar">
      <ProgressiveBlur />
      <TrTabBar tabs={tabs} selected={selected} onChange={onTabChange} />
      <ActionButton
        kind={running ? 'timer' : dayKind}
        time={running ? <Elapsed start={S.active.start} /> : undefined}
        aria-label={actionLabel}
        onPress={startWorkout}
      />
    </div>
  )
}
