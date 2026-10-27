import React from 'react';
import { cx } from './utils';
import { Spinner } from './icons';

export interface ButtonProps {
  /** `primary` = glossy black, the one main action per screen. `quiet` = secondary. `danger` = delete only. */
  variant?: 'primary' | 'quiet' | 'danger';
  /** `md` = 56px (default), `sm` = 44px for headers. */
  size?: 'md' | 'sm';
  /** Shows a spinner and the pending label; presses are ignored. */
  isPending?: boolean;
  /** Label while pending, e.g. "Saving…". Defaults to the children. */
  pendingLabel?: string;
  isDisabled?: boolean;
  /** Full width of its container. */
  isBlock?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  'aria-label'?: string;
}

export function Button({ variant = 'primary', size = 'md', isPending, pendingLabel, isDisabled, isBlock, icon, children, onPress, ...rest }: ButtonProps) {
  const off = isDisabled || isPending;
  return (
    <button
      type="button"
      className={cx('tr-btn', 'tr-press', `tr-btn--${variant}`, size === 'sm' && 'tr-btn--sm', isBlock && 'tr-btn--block', isDisabled && 'is-disabled')}
      aria-disabled={off || undefined}
      aria-busy={isPending || undefined}
      aria-label={rest['aria-label']}
      onClick={off ? undefined : onPress}
    >
      {isPending ? <Spinner /> : icon}
      {(isPending ? pendingLabel ?? children : children) != null && <span>{isPending ? pendingLabel ?? children : children}</span>}
    </button>
  );
}
