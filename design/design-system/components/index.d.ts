// Tren components — props reference. window.Tren in previews; import from "@tren/ui" in the app.
import type * as React from "react";

export interface ActionButtonProps {
  /** `start` = play (training day), `log` = + (rest day), `timer` = shows elapsed time while a workout runs. */
  kind?: 'start' | 'log' | 'timer';
  /** Elapsed time for `timer`, e.g. "12:48". */
  time?: string;
  onPress?: () => void;
  /** Spoken label, e.g. "Start Push workout, 17 sets, about 55 minutes". Required. */
  'aria-label': string;
}

/** `start` = play (training day), `log` = + (rest day), `timer` = shows elapsed time while a workout runs. */
  kind?: 'start' | 'log' | 'timer';
  /** Elapsed time for `timer`, e.g. "12:48". */
  time?: string;
  onPress?: () => void;
  /** Spoken label, e.g. "Start Push workout, 17 sets, about 55 minutes". Required. */
  'aria-label': string;
}

/** The 56px round glossy button at the right of the bottom bar. Glossy black; glossy white in dark mode. */
export declare function ActionButton(props: ActionButtonProps): React.JSX.Element;

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

export declare function Button(props: ButtonProps): React.JSX.Element;

export interface EffortSliderProps {
  /** RPE 6–10 in half steps, or null when not rated yet. */
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (v: number) => void;
  /** Start folded behind a "Rate effort" button (default true). */
  collapsible?: boolean;
  /** Colourful flame icon (image URL or element). */
  icon?: string | React.ReactNode;
}

/** RPE 6–10 in half steps, or null when not rated yet. */
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (v: number) => void;
  /** Start folded behind a "Rate effort" button (default true). */
  collapsible?: boolean;
  /** Colourful flame icon (image URL or element). */
  icon?: string | React.ReactNode;
}

const WORD: Record<number, string> = { 6: 'Easy', 7: 'Steady', 8: 'Hard', 9: 'Very hard', 10: 'Max effort' };
export const effortText = (v: number) => {
  if (v >= 10) return 'Max effort. Nothing left';
  if (v <= 6) return 'Easy. 4 or more reps left';
  const left = 10 - v;
  const n = left % 1 ? `${left - 0.5}–${left + 0.5}` : String(left);
  return `${WORD[Math.floor(v)]}. About ${n} ${left === 1 ? 'rep' : 'reps'} left`;
};

/** Optional effort rating: a chunky track with the number inside, a growing flame and lighting step dots. */
export declare function EffortSlider(props: EffortSliderProps): React.JSX.Element;

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

/** 2–3 options. The white pill slides on a spring (0.5s). */
export declare function SegmentedControl(props: SegmentedControlProps): React.JSX.Element;

export interface SetItem {
  /** "Warm", "Set 1", "Set 2"… */
  label: string;
  /** "60 × 8", with " · RPE 8" when rated. */
  value: string;
  state: 'upcoming' | 'current' | 'done';
  /** Warm-up sets don't count toward sets or volume. */
  warmup?: boolean;
}

export interface SetListProps { sets: SetItem[]; onSelect?: (index: number) => void; }

/** The sets of the current exercise in one card. Done sets get a black tick that pops in. */
export function SetList({ sets, onSelect }: SetListProps) {
  return (
    <div className="tr-sets">
      {sets.map((s, i) => (
        <button key={i} type="button" className={cx('tr-set', `is-${s.state}`)} onClick={onSelect ? () => onSelect(i) : undefined} tabIndex={onSelect ? 0 : -1}>
          <span className={cx('tr-set__label', s.warmup && 'is-warm')}>{s.label}</span>
          <span className="tr-set__value tr-num">{s.value}</span>
          {s.state === 'done' ? <span className="tr-tick" role="img" aria-label="Done"><Tick size={14} /></span> : <span className={cx('tr-ring', s.state === 'current' && 'is-current')} aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

/** "Warm", "Set 1", "Set 2"… */
  label: string;
  /** "60 × 8", with " · RPE 8" when rated. */
  value: string;
  state: 'upcoming' | 'current' | 'done';
  /** Warm-up sets don't count toward sets or volume. */
  warmup?: boolean;
}
export interface SetListProps { sets: SetItem[]; onSelect?: (index: number) => void; }

/** The sets of the current exercise in one card. Done sets get a black tick that pops in. */
export declare function SetList(props: SetListProps): React.JSX.Element;

export interface Routine { name: string; /** e.g. "17 sets · ~55 min" */ meta: string; /** First set, e.g. "Bench press" */ first?: string; sets?: number; }
export interface StartBarProps {
  tabs: TabItem[];
  selectedTab?: string;
  onTabChange?: (id: string) => void;
  routines: Routine[];
  /** Name of the routine shown in the pill; defaults to the first. */
  routine?: string;
  onRoutineChange?: (name: string) => void;
  /** `start` on training days, `log` on rest days. */
  dayKind?: 'start' | 'log';
  /** Called when Start is pressed in the pill; the bar moves to live mode. */
  onStart?: (routine: string) => void;
  /** Called when Open is pressed in the live bar. */
  onOpen?: () => void;
  /** Time the workout started (ms). Set it to show the live bar from the start. */
  startedAt?: number | null;
}

/** e.g. "17 sets · ~55 min" */ meta: string; /** First set, e.g. "Bench press" */ first?: string; sets?: number; }
export interface StartBarProps {
  tabs: TabItem[];
  selectedTab?: string;
  onTabChange?: (id: string) => void;
  routines: Routine[];
  /** Name of the routine shown in the pill; defaults to the first. */
  routine?: string;
  onRoutineChange?: (name: string) => void;
  /** `start` on training days, `log` on rest days. */
  dayKind?: 'start' | 'log';
  /** Called when Start is pressed in the pill; the bar moves to live mode. */
  onStart?: (routine: string) => void;
  /** Called when Open is pressed in the live bar. */
  onOpen?: () => void;
  /** Time the workout started (ms). Set it to show the live bar from the start. */
  startedAt?: number | null;
}

const initial = (n: string) => (n === 'Empty workout' ? '+' : n.charAt(0));
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** The bottom bar's morph: tabs + round button → workout pill (with routine menu) → live bar with the metal ring. */
export declare function StartBar(props: StartBarProps): React.JSX.Element;

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

/** One small stat, three in a row, on the Home glow. The label never wraps. */
export declare function StatTile(props: StatTileProps): React.JSX.Element;

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

/** Green when on. 0.4s spring slide. */
export declare function Switch(props: SwitchProps): React.JSX.Element;

export interface SyncPillProps {
  status: 'synced' | 'syncing' | 'waiting' | 'paused';
  /** Workouts not uploaded yet, for `waiting`. */
  count?: number;
  /** Cloud-check icon for `synced` and offline icon for `waiting` (image URLs). */
  syncedIcon?: string;
  offlineIcon?: string;
  onPress?: () => void;
}

/** Workouts not uploaded yet, for `waiting`. */
  count?: number;
  /** Cloud-check icon for `synced` and offline icon for `waiting` (image URLs). */
  syncedIcon?: string;
  offlineIcon?: string;
  onPress?: () => void;
}
/** Sync status in the Home header. `paused` opens a sheet with Retry when tapped. */
export declare function SyncPill(props: SyncPillProps): React.JSX.Element;

export interface TabItem { id: string; label: string; /** Colourful icon (image URL or element). Shown greyscale when not selected. */ icon: string | React.ReactNode; }
export interface TabBarProps {
  tabs: TabItem[];
  /** Selected tab id. Leave unset to let the bar keep its own state. */
  selected?: string;
  defaultSelected?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
}

/** Colourful icon (image URL or element). Shown greyscale when not selected. */ icon: string | React.ReactNode; }
export interface TabBarProps {
  tabs: TabItem[];
  /** Selected tab id. Leave unset to let the bar keep its own state. */
  selected?: string;
  defaultSelected?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
}

/** Floating glass tab bar with a gooey selection lens (three blobs at 0.5 / 0.72 / 0.95s). */
export declare function TabBar(props: TabBarProps): React.JSX.Element;

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

/** Error message; shows a red ring. Clear it as soon as the person types. */
  error?: string;
  isDisabled?: boolean;
  onChange?: (v: string) => void;
}
/** 56px field with its label always visible above. */
export declare function TextField(props: TextFieldProps): React.JSX.Element;

export interface ToastProps {
  icon?: React.ReactNode;
  message: string;
  /** Optional action, e.g. "Undo" or "Retry". */
  actionLabel?: string;
  onAction?: () => void;
  /** `dark` (default) for confirmations, `light` for warnings like offline. */
  tone?: 'dark' | 'light';
}

/** Optional action, e.g. "Undo" or "Retry". */
  actionLabel?: string;
  onAction?: () => void;
  /** `dark` (default) for confirmations, `light` for warnings like offline. */
  tone?: 'dark' | 'light';
}
/** One message at a time, 16px above the bottom bar. Timings: saved 2s, back online 3s, Undo 5s. */
export declare function Toast(props: ToastProps): React.JSX.Element;

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
export declare function ValueStepper(props: ValueStepperProps): React.JSX.Element;

export declare function effortText(rpe: number): string;