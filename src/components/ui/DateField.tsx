import { useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  value: string; // yyyy-mm-dd
  onChange: (date: string) => void;
  compact?: boolean;
}

function toKey(d: Date) {
  return d.toISOString().split('T')[0];
}

function shiftDay(dateKey: string, delta: number) {
  const d = new Date(dateKey + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return toKey(d);
}

function label(dateKey: string) {
  const today = toKey(new Date());
  const yesterday = shiftDay(today, -1);
  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';
  const d = new Date(dateKey + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function DateField({ value, onChange, compact }: Props) {
  const nativeRef = useRef<HTMLInputElement>(null);
  const today = toKey(new Date());
  const yesterday = shiftDay(today, -1);
  const isCustom = value !== today && value !== yesterday;

  const chips: { key: string; text: string }[] = [
    { key: today, text: 'Today' },
    { key: yesterday, text: 'Yesterday' },
  ];

  const openNativePicker = () => {
    const el = nativeRef.current;
    if (!el) return;
    // Prefer the native picker UI when supported (Chromium)
    if (typeof el.showPicker === 'function') el.showPicker();
    else el.focus();
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {chips.map(({ key, text }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
            value === key
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-[0_2px_10px_rgba(139,92,246,0.35)]'
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-200',
          )}
        >
          {text}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(shiftDay(value, -1))}
        title="Previous day"
        className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <ChevronLeft size={13} />
      </button>
      <button
        type="button"
        onClick={() => onChange(shiftDay(value, 1))}
        title="Next day"
        disabled={value >= today}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronRight size={13} />
      </button>

      <div className="relative ml-auto">
        <button
          type="button"
          onClick={openNativePicker}
          className={cn(
            'flex items-center gap-1.5 rounded-full text-xs font-semibold border transition-all',
            compact ? 'px-2.5 py-1' : 'px-3 py-1.5',
            isCustom
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-[0_2px_10px_rgba(139,92,246,0.35)]'
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-200',
          )}
        >
          <Calendar size={12} />
          {isCustom ? label(value) : 'Pick date'}
        </button>
        <input
          ref={nativeRef}
          type="date"
          value={value}
          max={today}
          onChange={(e) => { if (e.target.value) onChange(e.target.value); }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
