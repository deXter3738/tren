import React from 'react';
import { cx } from './utils';
import { Play, Plus } from './icons';

export interface ActionButtonProps {
  /** `start` = play (training day), `log` = + (rest day), `timer` = shows elapsed time while a workout runs. */
  kind?: 'start' | 'log' | 'timer';
  /** Elapsed time for `timer`, e.g. "12:48". */
  time?: string;
  onPress?: () => void;
  /** Spoken label, e.g. "Start Push workout, 17 sets, about 55 minutes". Required. */
  'aria-label': string;
}

/** The 56px round glossy button at the right of the bottom bar. Glossy black; glossy white in dark mode. */
export function ActionButton({ kind = 'start', time, onPress, ...rest }: ActionButtonProps) {
  return (
    <button type="button" className={cx('tr-action', 'tr-press')} aria-label={rest['aria-label']} onClick={onPress}>
      {kind === 'start' && <Play />}
      {kind === 'log' && <Plus size={24} />}
      {kind === 'timer' && <span className="tr-action__time">{time}</span>}
    </button>
  );
}
