import React from 'react';
import { USER_TYPES, UserType } from '@/data/journeyData';
import { cn } from '@/lib/utils';

interface Props {
  value: UserType;
  onChange: (u: UserType) => void;
}

/**
 * Segmented pill control for switching the active user type.
 * Used by JourneyExplorer to recolor the journey stages per audience.
 */
const UserTypeSwitcher: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div
      role="tablist"
      aria-label="Switch user type"
      className="inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white border border-c-purple-100 p-1.5 shadow-sm"
    >
      {USER_TYPES.map((u) => {
        const Icon = u.icon;
        const active = value === u.id;
        return (
          <button
            key={u.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(u.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-display font-bold transition-all duration-300',
              active
                ? 'text-white shadow-md'
                : 'text-cognitio-ink/60 hover:text-cognitio-ink hover:bg-c-purple-50'
            )}
            style={active ? { backgroundColor: u.hex } : {}}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>{u.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

export default UserTypeSwitcher;
