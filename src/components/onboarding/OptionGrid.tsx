import React from 'react';
import { OptionItem } from '@/lib/onboardingData';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Props {
  options: OptionItem[];
  selected: string[] | string;
  multi?: boolean;
  onChange: (next: string[] | string) => void;
  accentHex?: string;
  columns?: 2 | 3 | 4;
  showModifier?: boolean;
}

const OptionGrid: React.FC<Props> = ({
  options, selected, multi = true, onChange, accentHex = '#b425aa', columns = 2, showModifier = false,
}) => {
  const isSelected = (id: string) => Array.isArray(selected) ? selected.includes(id) : selected === id;

  const toggle = (id: string) => {
    if (multi) {
      const arr = (selected as string[]) || [];
      onChange(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
    } else {
      onChange(id);
    }
  };

  const colClass =
    columns === 2 ? 'sm:grid-cols-2' :
    columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' :
    'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={cn('grid grid-cols-1 gap-2.5', colClass)}>
      {options.map((opt) => {
        const sel = isSelected(opt.id);
        const mod = opt.modifier;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={cn(
              'group relative text-left rounded-xl border-2 p-3.5 transition-all duration-200',
              'hover:shadow-md hover:-translate-y-0.5',
              sel ? 'shadow-md' : 'border-c-purple-100 bg-white hover:border-c-purple-300'
            )}
            style={sel ? { borderColor: accentHex, backgroundColor: `${accentHex}08` } : {}}
            aria-pressed={sel}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 h-5 w-5 rounded-md flex items-center justify-center border-2 shrink-0 transition-all',
                  sel ? 'text-white' : 'border-c-purple-200 bg-white'
                )}
                style={sel ? { backgroundColor: accentHex, borderColor: accentHex } : {}}
              >
                {sel && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm text-cognitio-ink leading-tight">{opt.label}</div>
                {opt.description && (
                  <div className="text-xs text-cognitio-ink/60 mt-1 leading-snug">{opt.description}</div>
                )}
              </div>
              {showModifier && mod !== undefined && mod !== 0 && (
                <span
                  className={cn(
                    'text-[10px] font-display font-bold rounded-md px-1.5 py-0.5 shrink-0',
                    mod < 0 ? 'bg-c-green-100 text-c-green-700' : 'bg-c-coral-100 text-c-coral-700'
                  )}
                >
                  {mod < 0 ? `${Math.round(mod * 100)}%` : `+${Math.round(mod * 100)}%`}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default OptionGrid;
