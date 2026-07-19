import React from 'react';
import { USER_TYPES, UserType } from '@/data/journeyData';
import { ArrowRight } from 'lucide-react';

interface Props {
  onPick: (u: UserType) => void;
}

/**
 * Landing-page section presenting the four audience paths.
 * Picking a card hands the user type to AppLayout, which pre-selects
 * it in JourneyExplorer and smooth-scrolls to the journey section.
 */
const UserTypeShowcase: React.FC<Props> = ({ onPick }) => (
  <section id="who-its-for" className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
    <div className="text-center mb-10">
      <span className="text-xs font-display font-bold tracking-[0.25em] uppercase text-c-teal-600">
        Who it&rsquo;s for
      </span>
      <h2 className="font-display font-extrabold text-3xl md:text-5xl text-cognitio-ink mt-2 mb-3 text-balance">
        One platform, <span className="gradient-text">four journeys</span>
      </h2>
      <p className="text-cognitio-ink/65 max-w-2xl mx-auto">
        Cognitio+ adapts to who you are — pick your path to preview a personalized
        journey, tailored tools, and context-aware pricing.
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
            aria-label={`View the ${u.label} journey`}
            className="group text-left rounded-2xl bg-white border border-c-purple-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 h-1 w-full"
              style={{ backgroundColor: u.hex }}
            />
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${u.hex}15`, color: u.hex }}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="font-display font-bold text-cognitio-ink mb-1.5 leading-snug">
              {u.label}
            </div>
            <p className="text-xs text-cognitio-ink/65 leading-relaxed mb-4">
              {u.description}
            </p>
            <div
              className="text-xs font-display font-bold flex items-center gap-1"
              style={{ color: u.hex }}
            >
              View my journey
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        );
      })}
    </div>
  </section>
);

export default UserTypeShowcase;
