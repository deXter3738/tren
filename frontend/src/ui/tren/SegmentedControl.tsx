import React, { useState } from 'react';
export interface SegmentedControlProps { options: string[]; selected?: string; defaultSelected?: string; onChange?: (v: string) => void; 'aria-label': string; }
/** 2–3 options. The white pill slides on a spring (0.5s). */
export function SegmentedControl({ options, selected, defaultSelected, onChange, ...rest }: SegmentedControlProps) {
  const [own, setOwn] = useState(defaultSelected ?? options[0]);
  const cur = selected ?? own;
  const i = Math.max(0, options.indexOf(cur));
  const n = options.length;
  return (
    <div className="tr-seg" role="radiogroup" aria-label={rest['aria-label']} style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
      <span className="tr-seg__pill" aria-hidden="true" style={{ width: `calc((100% - 8px) / ${n})`, left: `calc(4px + ${i} * (100% - 8px) / ${n})` }} />
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={o === cur} onClick={() => { if (selected == null) setOwn(o); onChange?.(o); }}>{o}</button>
      ))}
    </div>
  );
}
