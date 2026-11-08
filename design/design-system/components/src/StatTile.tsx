import React from 'react';
export interface StatTileProps { icon?: string | React.ReactNode; label: string; value: string; }
/** One small stat, three in a row, on the Home glow. The label never wraps. */
export function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <div className="tr-tile">
      <span className="tr-tile__label">{typeof icon === 'string' ? <img src={icon} alt="" width={20} height={20} /> : icon}{label}</span>
      <span className="tr-tile__value">{value}</span>
    </div>
  );
}
