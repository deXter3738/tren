// Tren components read React from the page (window.React), so the bundle ships no copy of it.
const R = (window as any).React;
export default R;
export const { useState, useEffect, useRef, useMemo, useCallback, useId, Fragment } = R;
