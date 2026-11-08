import React, { useState, useRef } from 'react';
import { Minus, Plus } from './icons';

export interface ValueStepperProps {
  /** e.g. "kg" or "reps" — also used in the spoken labels. */
  unit: string;
  value?: number;
  defaultValue?: number;
  /** 2.5 for kg, 5 for lb, 1 for reps. */
  step?: number;
  min?: number;
  onChange?: (v: number) => void;
}

const fmt = (v: number) => (v % 1 ? v.toFixed(1) : String(v));

/** Weight or reps card: a big number, its unit and round − / + controls. Hold to repeat after 0.5s. */
export function ValueStepper({ unit, value, defaultValue = 0, step = 1, min = 0, onChange }: ValueStepperProps) {
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const ref = useRef(v); ref.current = v;
  const timer = useRef<number | undefined>(undefined);
  const set = (n: number) => { const c = Math.max(min, Math.round(n * 100) / 100); if (value == null) setOwn(c); onChange?.(c); ref.current = c; };
  const startHold = (d: number) => { set(ref.current + d); timer.current = window.setTimeout(function rep() { set(ref.current + d); timer.current = window.setTimeout(rep, 90); }, 500); };
  const stop = () => window.clearTimeout(timer.current);
  const btn = (d: number, label: string, icon: React.ReactNode, off: boolean) => (
    <button type="button" className="tr-ctrl tr-press" aria-label={label} aria-disabled={off || undefined} disabled={off}
      onPointerDown={() => !off && startHold(d)} onPointerUp={stop} onPointerLeave={stop}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(ref.current + d); } }}>{icon}</button>
  );
  return (
    <div className="tr-value">
      <span className="tr-value__num" aria-live="polite">{fmt(v)}</span>
      <span className="tr-value__unit">{unit}</span>
      <div className="tr-value__steps">
        {btn(-step, `${fmt(step)} ${unit} less`, <Minus />, v - step < min)}
        {btn(step, `${fmt(step)} ${unit} more`, <Plus size={20} />, false)}
      </div>
    </div>
  );
}
