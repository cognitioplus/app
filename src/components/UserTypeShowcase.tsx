import React from 'react';
import { USER_TYPES, UserType } from '@/data/journeyData';
import { cn } from '@/lib/utils';

interface Props {
  onPick: (u: UserType) => void;
}

const UserTypeShowcase: React.FC<Props> = ({ onPick }) => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
    <div className="text-center mb-10">
      <span className="text-xs font-display font-bold tracking-[0.25em] uppercase text-c-purple-600">
        Who is it for?
      </span>
      <h2 className="font-display font-extrabold text-3xl md:text-4xl text-cognitio-ink mt-2 mb-3 text-balance">
        A platform built for <span className="gradient-text">every role</span>
      </h2>
      <p className="text-cognitio-ink/65 max-w-2xl mx-auto">
        Pick your user type to explore how Cognitio+ adapts its dashboard,
        tools, and journey to your specific needs.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {USER_TYPES.map((u) => {
        const Icon = u.icon;
        return (
          <button
            key={u.id}
            type="button"
            onClick={() => onPick(u.id)}
            className={cn(
              'group text-left rounded-2xl bg-white border border-c-purple-100 p-6',
              'hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
            )}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${u.hex}15`, color: u.hex }}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="font-display font-bold text-cognitio-ink mb-1.5">{u.label}</div>
            <p className="text-sm text-cognitio-ink/65 leading-relaxed">{u.description}</p>
            <div
              className="mt-4 text-xs font-display font-bold uppercase tracking-wider"
              style={{ color: u.hex }}
            >
              Explore journey →
            </div>
          </button>
        );
      })}
    </div>
  </section>
);

export default UserTypeShowcase;
