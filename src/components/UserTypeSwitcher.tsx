import React from 'react';
import { USER_TYPES, UserType } from '@/data/journeyData';
import { cn } from '@/lib/utils';

interface Props {
  value: UserType;
  onChange: (u: UserType) => void;
}

const UserTypeSwitcher: React.FC<Props> = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {USER_TYPES.map((u) => {
      const Icon = u.icon;
      const active = value === u.id;
      return (
        <button
          key={u.id}
          type="button"
          onClick={() => onChange(u.id)}
          className={cn(
            'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-display font-semibold border-2 transition-all duration-200',
            active
              ? 'text-white shadow-md border-transparent'
              : 'bg-white border-c-purple-100 text-cognitio-ink/70 hover:border-c-purple-300'
          )}
          style={active ? { backgroundColor: u.hex, borderColor: u.hex } : {}}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
          {u.shortLabel}
        </button>
      );
    })}
  </div>
);

export default UserTypeSwitcher;
