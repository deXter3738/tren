import React, { useState, useId } from 'react';
import { cx } from './utils';
import { Plus } from './icons';

export interface EffortSliderProps {
  /** RPE 6–10 in half steps, or null when not rated yet. */
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (v: number) => void;
  /** Start folded behind a "Rate effort" button (default true). */
  collapsible?: boolean;
  /** Colourful flame icon (image URL or element). */
  icon?: string | React.ReactNode;
}

const WORD: Record<number, string> = { 6: 'Easy', 7: 'Steady', 8: 'Hard', 9: 'Very hard', 10: 'Max effort' };
export const effortText = (v: number) => {
  if (v >= 10) return 'Max effort. Nothing left';
  if (v <= 6) return 'Easy. 4 or more reps left';
  const left = 10 - v;
  const n = left % 1 ? `${left - 0.5}–${left + 0.5}` : String(left);
  return `${WORD[Math.floor(v)]}. About ${n} ${left === 1 ? 'rep' : 'reps'} left`;
};

/** Optional effort rating: a chunky track with the number inside, a growing flame and lighting step dots. */
export function EffortSlider({ value, defaultValue = null, onChange, collapsible = true, icon }: EffortSliderProps) {
  const [own, setOwn] = useState<number | null>(defaultValue);
  const [open, setOpen] = useState(!collapsible || (value ?? defaultValue) != null);
  const [bump, setBump] = useState(0);
  const id = useId();
  const v = value === undefined ? own : value;
  const rv = v ?? 8;
  const f = (rv - 6) / 4;
  const pos = `calc(14px + (100% - 28px) * ${f})`;
  if (!open) return (
    <button type="button" className="tr-btn tr-btn--quiet tr-btn--sm tr-press tr-effort__open" onClick={() => setOpen(true)}>
      <Plus size={18} /><span>Rate effort <span className="tr-muted">optional</span></span>
    </button>
  );
  const set = (n: number) => { if (value === undefined) setOwn(n); setBump((b: number) => b + 1); onChange?.(n); };
  return (
    <div className="tr-card tr-effort-card">
      <div className="tr-effort__head">
        <span className={cx('tr-effort__flame', v != null && (bump % 2 ? 'wgA' : 'wgB'))} style={{ transform: `scale(${v == null ? 0.85 : 0.85 + (rv - 6) * 0.1})` }}>
          {typeof icon === 'string' ? <img src={icon} alt="" width={20} height={20} /> : icon}
          {v === 10 && <><span className="tr-burst" /><span className="tr-burst tr-burst--2" /></>}
        </span>
        <label htmlFor={id} className="tr-effort__label">Effort <span className="tr-muted tr-cap">RPE · optional</span></label>
        <span className={cx('tr-cap', 'tr-effort__word', rv >= 9 && 'is-hard')}>{v != null ? WORD[Math.floor(rv)] : ''}</span>
      </div>
      <div className="tr-effort">
        <span className="tr-effort__fill" style={{ width: `calc(28px + (100% - 28px) * ${f})`, background: v == null ? 'var(--ring)' : `linear-gradient(90deg, var(--rpe-6), var(--rpe-${Math.floor(rv)}))` }} />
        <span className="tr-effort__thumb" style={{ left: pos }} />
        <span className={cx('tr-effort__num', bump % 2 ? 'bpA' : 'bpB')} style={{ left: v != null && rv < 7 ? `calc(${pos} + 20px)` : 16, color: v == null ? 'var(--ink-muted)' : rv < 7 ? 'var(--ink)' : 'var(--yellow-ink)' }}>{v == null ? 'Slide' : String(v)}</span>
        <input id={id} type="range" min={6} max={10} step={0.5} value={rv} aria-valuetext={v == null ? 'Not set' : `RPE ${v}, ${WORD[Math.floor(rv)]}`}
          onChange={(e) => set(Number(e.target.value))} />
      </div>
      <div className="tr-effort__dots" aria-hidden="true">
        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((d) => { const lit = v != null && d <= rv; return <span key={d} className={cx('tr-dot', d % 1 === 0 && 'is-major', lit && 'is-lit')} style={{ left: `${((d - 6) / 4) * 100}%`, background: lit ? `var(--rpe-${Math.floor(d)})` : undefined }} />; })}
      </div>
      <span className="tr-cap tr-muted" aria-live="polite">{v == null ? 'Slide to rate how hard that set felt' : effortText(v)}</span>
    </div>
  );
}
