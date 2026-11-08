import React, { useId } from 'react';
import { cx } from './utils';
import { Alert } from './icons';
export interface TextFieldProps {
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Error message; shows a red ring. Clear it as soon as the person types. */
  error?: string;
  isDisabled?: boolean;
  onChange?: (v: string) => void;
}
/** 56px field with its label always visible above. */
export function TextField({ label, value, defaultValue, placeholder, error, isDisabled, onChange }: TextFieldProps) {
  const id = useId();
  return (
    <div className="tr-field">
      <label htmlFor={id} className="tr-field__label">{label}</label>
      <input id={id} className={cx('tr-field__input', error && 'is-error')} value={value} defaultValue={defaultValue} placeholder={placeholder}
        disabled={isDisabled} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-e` : undefined} onChange={(e) => onChange?.(e.target.value)} />
      {error && <span id={`${id}-e`} className="tr-field__error"><Alert size={14} />{error}</span>}
    </div>
  );
}
