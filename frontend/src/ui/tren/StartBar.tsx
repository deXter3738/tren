/* TREN PATCH (docs/UPSTREAM.md): the live bar follows the `startedAt` prop instead of deciding
   for itself. A workout can also begin from Home's today row or from the round button on another
   screen, and pressing Start here may open the weigh-in sheet, which can be cancelled — so the
   bar must not switch itself to "running" the moment Start is pressed. `start()` now only calls
   `onStart`; the app answers by setting `startedAt`, and clearing it ends the live bar.
   Nothing else here differs from design/design-system/components/src/StartBar.tsx. */
import React, { useState, useEffect, useRef } from 'react';
import { cx } from './utils';
import { Play, Plus, ChevronUpDown, Tick } from './icons';
import { TabBar, TabItem } from './TabBar';

export interface Routine { name: string; /** e.g. "17 sets · ~55 min" */ meta: string; /** First set, e.g. "Bench press" */ first?: string; sets?: number; }
export interface StartBarProps {
  tabs: TabItem[];
  selectedTab?: string;
  onTabChange?: (id: string) => void;
  routines: Routine[];
  /** Name of the routine shown in the pill; defaults to the first. */
  routine?: string;
  onRoutineChange?: (name: string) => void;
  /** `start` on training days, `log` on rest days. */
  dayKind?: 'start' | 'log';
  /** Called when Start is pressed in the pill; the bar moves to live mode. */
  onStart?: (routine: string) => void;
  /** Called when Open is pressed in the live bar. */
  onOpen?: () => void;
  /** Time the workout started (ms). Set it to show the live bar from the start. */
  startedAt?: number | null;
}

const initial = (n: string) => (n === 'Empty workout' ? '+' : n.charAt(0));
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** The bottom bar's morph: tabs + round button → workout pill (with routine menu) → live bar with the metal ring. */
export function StartBar({ tabs, selectedTab, onTabChange, routines, routine, onRoutineChange, dayKind = 'start', onStart, onOpen, startedAt = null }: StartBarProps) {
  const [mode, setMode] = useState<'tabs' | 'pill' | 'live'>(startedAt ? 'live' : 'tabs');
  const [menu, setMenu] = useState(false);
  const [own, setOwn] = useState(routine ?? routines[0]?.name);
  const [t0, setT0] = useState<number | null>(startedAt);
  const [, tick] = useState(0);
  const hold = useRef<number | undefined>(undefined);
  const held = useRef(false);
  useEffect(() => { if (!t0) return; const iv = window.setInterval(() => tick((x: number) => x + 1), 1000); return () => window.clearInterval(iv); }, [t0]);
  // The app owns "a workout is running". When it says so, the bar goes live; when it stops saying
  // so, the bar comes back to the tabs — but only from live, so someone part-way through choosing
  // a routine is not thrown back to the tabs under their thumb.
  useEffect(() => {
    setT0(startedAt);
    setMode((m) => (startedAt ? 'live' : m === 'live' ? 'tabs' : m));
  }, [startedAt]);
  const name = routine ?? own;
  const r = routines.find((x) => x.name === name) ?? routines[0];
  const secs = t0 ? Math.max(0, Math.floor((Date.now() - t0) / 1000)) : 0;
  const pickRoutine = (n: string) => { if (routine == null) setOwn(n); onRoutineChange?.(n); setMenu(false); };
  const start = () => { setMenu(false); onStart?.(r.name); };
  const on = (m: string) => (mode === m ? 'is-on' : 'is-off');
  return (
    <div className="tr-startbar">
      <div role="menu" aria-label="Choose a routine" className={cx('tr-menu', 'tr-glass-menu', menu && mode === 'pill' ? 'is-on' : 'is-off')}>
        <span className="tr-menu__title">Switch routine</span>
        {routines.map((x) => (
          <button key={x.name} type="button" role="menuitemradio" aria-checked={x.name === r.name} className={cx('tr-menu__row', 'tr-press', x.name === r.name && 'is-selected')} onClick={() => pickRoutine(x.name)}>
            <span className="tr-menu__badge">{initial(x.name)}</span>
            <span className="tr-menu__text"><span className="tr-menu__name">{x.name}</span><span className="tr-menu__meta">{x.meta}</span></span>
            {x.name === r.name && <Tick size={20} />}
          </button>
        ))}
      </div>
      <div className={cx('tr-startbar__tabs', 'tr-morph', on('tabs'))}><TabBar tabs={tabs} selected={selectedTab} onChange={onTabChange} /></div>
      <button type="button" aria-label="Back to tabs" className={cx('tr-startbar__home', 'tr-glass', 'tr-press', 'tr-morph', mode !== 'tabs' ? 'is-on' : 'is-off')} onClick={() => { setMode('tabs'); setMenu(false); }}>
        {typeof tabs[0]?.icon === 'string' ? <img src={tabs[0].icon as string} alt="" width={24} height={24} /> : tabs[0]?.icon}
      </button>
      <div className={cx('tr-startbar__shape', mode === 'tabs' ? 'is-circle' : 'is-pill')}>
        <span className="tr-metal" aria-hidden="true" style={{ opacity: mode === 'live' ? 1 : 0 }} />
        <button type="button" className={cx('tr-startbar__circle', 'tr-morph', on('tabs'))} aria-label={t0 ? `Back to your workout, ${fmt(secs)}` : dayKind === 'start' ? 'Start a workout' : 'Log a workout'} onClick={() => setMode(t0 ? 'live' : 'pill')}>
          {t0 ? <span className="tr-action__time">{fmt(secs)}</span> : dayKind === 'start' ? <Play /> : <Plus size={24} />}
        </button>
        <div className={cx('tr-startbar__pill', 'tr-morph', on('pill'))}>
          <button type="button" aria-haspopup="menu" aria-expanded={menu} className="tr-startbar__routine"
            onClick={() => { if (held.current) { held.current = false; return; } setMenu(!menu); }}
            onPointerDown={() => { window.clearTimeout(hold.current); held.current = false; hold.current = window.setTimeout(() => { held.current = true; setMenu(true); }, 450); }}
            onPointerUp={() => window.clearTimeout(hold.current)} onPointerLeave={() => window.clearTimeout(hold.current)}>
            <span className="tr-startbar__badge">{initial(r.name)}</span>
            <span className="tr-menu__text"><span className="tr-menu__name">{r.name}</span><span className="tr-menu__meta">{r.meta}</span></span>
            <span className="tr-startbar__chev"><ChevronUpDown size={16} /></span>
          </button>
          <button type="button" className="tr-btn tr-btn--primary tr-press tr-btn--inpill" onClick={start}><span>Start</span></button>
        </div>
        <div className={cx('tr-startbar__live', 'tr-morph', on('live'))} role="timer">
          <span className="tr-pulse" aria-hidden="true" />
          <span className="tr-menu__text"><span className="tr-menu__name tr-num">{r.name} · {fmt(secs)}</span><span className="tr-menu__meta">{r.sets ? `Set 1 of ${r.sets}` : ''}{r.first ? `${r.sets ? ' · ' : ''}${r.first}` : ''}</span></span>
          <button type="button" className="tr-btn tr-btn--primary tr-press tr-btn--inpill" onClick={onOpen}><span>Open</span></button>
        </div>
      </div>
    </div>
  );
}
