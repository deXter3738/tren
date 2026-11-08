import React from 'react';
import { cx } from './utils';
import { Tick } from './icons';

export interface SetItem {
  /** "Warm", "Set 1", "Set 2"… */
  label: string;
  /** "60 × 8", with " · RPE 8" when rated. */
  value: string;
  state: 'upcoming' | 'current' | 'done';
  /** Warm-up sets don't count toward sets or volume. */
  warmup?: boolean;
}
export interface SetListProps { sets: SetItem[]; onSelect?: (index: number) => void; }

/** The sets of the current exercise in one card. Done sets get a black tick that pops in. */
export function SetList({ sets, onSelect }: SetListProps) {
  return (
    <div className="tr-sets">
      {sets.map((s, i) => (
        <button key={i} type="button" className={cx('tr-set', `is-${s.state}`)} onClick={onSelect ? () => onSelect(i) : undefined} tabIndex={onSelect ? 0 : -1}>
          <span className={cx('tr-set__label', s.warmup && 'is-warm')}>{s.label}</span>
          <span className="tr-set__value tr-num">{s.value}</span>
          {s.state === 'done' ? <span className="tr-tick" role="img" aria-label="Done"><Tick size={14} /></span> : <span className={cx('tr-ring', s.state === 'current' && 'is-current')} aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}
