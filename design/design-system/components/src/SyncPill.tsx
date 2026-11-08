import React from 'react';
import { Spinner, Alert } from './icons';
export interface SyncPillProps {
  status: 'synced' | 'syncing' | 'waiting' | 'paused';
  /** Workouts not uploaded yet, for `waiting`. */
  count?: number;
  /** Cloud-check icon for `synced` and offline icon for `waiting` (image URLs). */
  syncedIcon?: string;
  offlineIcon?: string;
  onPress?: () => void;
}
/** Sync status in the Home header. `paused` opens a sheet with Retry when tapped. */
export function SyncPill({ status, count = 1, syncedIcon, offlineIcon, onPress }: SyncPillProps) {
  const img = (src?: string) => (src ? <img src={src} alt="" width={16} height={16} /> : null);
  const content = {
    synced: [img(syncedIcon), 'Synced'],
    syncing: [<Spinner key="s" size={14} />, 'Syncing…'],
    waiting: [img(offlineIcon), `${count} waiting`],
    paused: [<Alert key="a" size={16} color="var(--danger-500)" />, 'Sync paused'],
  }[status];
  return (
    <button type="button" className="tr-sync tr-glass tr-press" onClick={onPress} aria-label={status === 'waiting' ? `${count} workouts waiting to upload` : (content[1] as string)}>
      {content[0]}{content[1]}
    </button>
  );
}
