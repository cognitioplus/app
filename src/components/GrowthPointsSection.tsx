import React from 'react';
import { Trophy, Flame, BookOpen, Heart, Users, Award } from 'lucide-react';

const BADGES = [
  { icon: Flame, name: '7-Day Streak', body: '7 daily check-ins in a row.', tier: 'Beginner', color: '#EE6048' },
  { icon: Heart, name: 'Mindful Month', body: '30 days of mindfulness practice.', tier: 'Intermediate', color: '#b425aa' },
  { icon: BookOpen, name: 'Knowledge Advocate', body: 'Shared 5 resources with the community.', tier: 'Intermediate', color: '#14A299' },
  { icon: Users, name: 'Circle Anchor', body: 'Facilitated 3 CareTalk Circles.', tier: 'Advanced', color: '#2F9C45' },
  { icon: Award, name: 'PFA Certified', body: 'Completed Psychological First Aid training.', tier: 'Advanced', color: '#D4AF37' },
  { icon: Trophy, name: 'Resilience Champion', body: 'Reached top resilience score for 90 days.', tier: 'Advanced', color: '#b425aa' },
];

const GrowthPointsSection: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
    <div className="rounded-3xl bg-cognitio-gradient text-white p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-c-amber-400/20 blur-3xl" />

      <div className="relative grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider">
            <Trophy className="h-3.5 w-3.5" />
            Incentive & Badge System
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl mt-4 mb-3 text-balance">
            Earn <span className="text-c-amber-300">Growth Points</span> for every step forward.
          </h2>
          <p className="text-white/85 text-base leading-relaxed mb-6 max-w-lg">
            150 GP = ₱1 in real-world value. Redeem for therapy sessions, scholarship eligibility,
            early feature access, and digital certificates.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Beginner', range: '0–1 badges', color: 'bg-white/15' },
              { label: 'Intermediate', range: '2–4 badges', color: 'bg-white/20' },
              { label: 'Advanced', range: '5+ badges', color: 'bg-c-amber-400/30 ring-1 ring-c-amber-300' },
            ].map((tier, i) => (
              <div key={i} className={`rounded-xl ${tier.color} backdrop-blur p-3`}>
                <div className="font-display font-bold text-sm">{tier.label}</div>
                <div className="text-[11px] text-white/75 mt-0.5">{tier.range}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {['Daily Engagement', 'Resilience', 'Community', 'Learning', 'Streaks'].map((c) => (
              <span key={c} className="rounded-full bg-white/15 backdrop-blur px-3 py-1.5 font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-2.5 shadow-lg"
                  style={{ backgroundColor: b.color }}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>
                <div className="font-display font-bold text-sm leading-tight">{b.name}</div>
                <div className="text-[11px] text-white/75 mt-1 leading-snug">{b.body}</div>
                <div className="text-[10px] font-display font-bold uppercase tracking-wider mt-2 text-c-amber-300">
                  {b.tier}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default GrowthPointsSection;
