import React, { useState } from 'react';
import { cx } from './utils';

export interface TabItem { id: string; label: string; /** Colourful icon (image URL or element). Shown greyscale when not selected. */ icon: string | React.ReactNode; }
export interface TabBarProps {
  tabs: TabItem[];
  /** Selected tab id. Leave unset to let the bar keep its own state. */
  selected?: string;
  defaultSelected?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
}

/** Floating glass tab bar with a gooey selection lens (three blobs at 0.5 / 0.72 / 0.95s). */
export function TabBar({ tabs, selected, defaultSelected, onChange, ...rest }: TabBarProps) {
  const [own, setOwn] = useState(defaultSelected ?? tabs[0]?.id);
  const cur = selected ?? own;
  const idx = Math.max(0, tabs.findIndex((t) => t.id === cur));
  const n = tabs.length || 1;
  const col = `(100% - 8px) / ${n}`;
  const pick = (id: string) => { if (selected == null) setOwn(id); onChange?.(id); };
  return (
    <nav className="tr-tabbar tr-glass" role="tablist" aria-label={rest['aria-label'] ?? 'Main'}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs><filter id="tr-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" /><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" /></filter></defs></svg>
      <span className="tr-tabbar__goo" aria-hidden="true">
        <span className="tr-tabbar__blob tr-tabbar__blob--1" style={{ width: `calc(${col} - 4px)`, left: `calc(6px + ${idx} * ${col})` }} />
        <span className="tr-tabbar__blob tr-tabbar__blob--2" style={{ width: 40, left: `calc(4px + ${idx} * ${col} + (${col} - 40px) / 2)` }} />
        <span className="tr-tabbar__blob tr-tabbar__blob--3" style={{ width: 24, left: `calc(4px + ${idx} * ${col} + (${col} - 24px) / 2)` }} />
      </span>
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={t.id === cur} className="tr-tab" onClick={() => pick(t.id)}>
          <span className="tr-tab__icon">{typeof t.icon === 'string' ? <img src={t.icon} alt="" width={24} height={24} /> : t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
