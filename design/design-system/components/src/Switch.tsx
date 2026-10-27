import React, { useState } from 'react';
export interface SwitchProps { 'aria-label': string; isSelected?: boolean; defaultSelected?: boolean; isDisabled?: boolean; onChange?: (on: boolean) => void; }
/** Green when on. 0.4s spring slide. */
export function Switch({ isSelected, defaultSelected = false, isDisabled, onChange, ...rest }: SwitchProps) {
  const [own, setOwn] = useState(defaultSelected);
  const on = isSelected ?? own;
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={rest['aria-label']} disabled={isDisabled}
      className="tr-switch" onClick={() => { if (isSelected == null) setOwn(!on); onChange?.(!on); }}>
      <span className="tr-switch__knob" />
    </button>
  );
}
