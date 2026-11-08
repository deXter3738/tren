import React from 'react';
type P = { size?: number; color?: string };
const S = (d: string, sw = 2) => ({ size = 20, color = 'currentColor' }: P) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"><path d={d} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const Tick = S('M6 12.5L10 16.5L18 8', 2.6);
export const Plus = S('M12 5V19M5 12H19', 2.4);
export const Minus = S('M19 12H5');
export const ChevronUpDown = S('M8 9.5l4-4 4 4M8 14.5l4 4 4-4', 2.2);
export const Alert = S('M12 8v5M12 16.5v.5', 2.4);
export const Play = ({ size = 24, color = 'currentColor' }: P) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ marginLeft: 2 }}><path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11-7.2c.6-.4.6-1.4 0-1.8l-11-7.2C7.9 3.5 7 4 7 4.8z" /></svg>
);
export const Spinner = ({ size = 18, color = 'currentColor' }: P) => (
  <svg className="tr-spin" aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.25" strokeWidth="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3" strokeLinecap="round" /></svg>
);
