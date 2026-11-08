export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');
export const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
