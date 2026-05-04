import React from 'react';
import { PILLARS, STATS } from '@/data/journeyData';

const PillarsAndStats: React.FC = () => {
  return (
    <section id="pillars" className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
      {/* Stats strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="relative rounded-2xl bg-white border border-c-purple-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-c-purple-100/40 blur-2xl" />
            <div className="relative">
              <div className="font-display font-extrabold text-4xl md:text-5xl gradient-text mb-2">{s.value}</div>
              <div className="font-display font-semibold text-cognitio-ink mb-1">{s.label}</div>
              <div className="text-xs text-cognitio-ink/50">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pillars */}
      <div className="text-center mb-10">
        <span className="text-xs font-display font-bold tracking-[0.25em] uppercase text-c-purple-600">
          Pillars of Wellness
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-cognitio-ink mt-2 mb-3">
          Built on principles that <span className="gradient-text">honor culture & care</span>
        </h2>
        <p className="text-cognitio-ink/65 max-w-2xl mx-auto">
          Cognitio+ is grounded in Filipino values — kapwa, bayanihan, and pakikipagkapwa-tao —
          translated into evidence-based digital tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PILLARS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={i}
              className="group rounded-2xl bg-white border border-c-purple-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${p.color}15`, color: p.color }}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-cognitio-ink mb-2">{p.title}</h3>
              <p className="text-sm text-cognitio-ink/65 leading-relaxed">{p.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PillarsAndStats;
