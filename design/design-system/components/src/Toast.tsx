import React from 'react';
import { cx } from './utils';
export interface ToastProps {
  icon?: React.ReactNode;
  message: string;
  /** Optional action, e.g. "Undo" or "Retry". */
  actionLabel?: string;
  onAction?: () => void;
  /** `dark` (default) for confirmations, `light` for warnings like offline. */
  tone?: 'dark' | 'light';
}
/** One message at a time, 16px above the bottom bar. Timings: saved 2s, back online 3s, Undo 5s. */
export function Toast({ icon, message, actionLabel, onAction, tone = 'dark' }: ToastProps) {
  return (
    <div role="status" className={cx('tr-toast', `tr-toast--${tone}`)}>
      {icon}<span className="tr-toast__msg">{message}</span>
      {actionLabel && <button type="button" className="tr-toast__action tr-press" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
