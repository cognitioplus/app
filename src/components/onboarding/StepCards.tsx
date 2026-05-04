import React from 'react';
import { USER_TYPES, UserType } from '@/data/journeyData';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export const UserTypeCards: React.FC<{ value: UserType | null; onChange: (u: UserType) => void }> = ({ value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {USER_TYPES.map((u) => {
      const Icon = u.icon;
      const active = value === u.id;
      return (
        <button
          key={u.id}
          type="button"
          onClick={() => onChange(u.id)}
          className={cn(
            'relative text-left rounded-2xl border-2 p-5 transition-all duration-300',
            'hover:shadow-xl hover:-translate-y-0.5',
            active ? 'shadow-xl scale-[1.01]' : 'border-c-purple-100 bg-white hover:border-c-purple-300'
          )}
          style={active ? { borderColor: u.hex, backgroundColor: `${u.hex}08` } : {}}
          aria-pressed={active}
        >
          {active && (
            <div
              className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: u.hex }}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </div>
          )}
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${u.hex}15`, color: u.hex }}
          >
            <Icon className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="font-display font-bold text-cognitio-ink mb-1">{u.label}</div>
          <div className="text-xs text-cognitio-ink/65 leading-relaxed">{u.description}</div>
        </button>
      );
    })}
  </div>
);
