import React from 'react';
import { Users, MessageCircle, Calendar, BookOpen } from 'lucide-react';

const ITEMS = [
  { icon: Users, title: 'GROWTH Tribe', body: 'Personal Growth · Resilience · Well-Being · Transformation · Mind-Body-Soul.', color: '#2F9C45' },
  { icon: MessageCircle, title: 'CareTalk Circles', body: 'Trauma-informed peer support facilitated by trained leaders.', color: '#b425aa' },
  { icon: Calendar, title: 'Webinars & Events', body: 'Live MHP-led sessions, bookable directly from your dashboard.', color: '#14A299' },
  { icon: BookOpen, title: 'Resource Sharing', body: 'Earn Knowledge Advocate badge for community contributions.', color: '#D4AF37' },
];

const CommunityCallout: React.FC = () => (
  <section id="community" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5">
        <span className="text-xs font-display font-bold tracking-[0.25em] uppercase text-c-green-700">
          Community
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-cognitio-ink mt-2 mb-4 text-balance">
          Healing happens in <span className="gradient-text">connection.</span>
        </h2>
        <p className="text-cognitio-ink/65 leading-relaxed mb-6">
          Cross-type features that build belonging, shared knowledge, and peer accountability —
          rooted in <em>kapwa</em> and <em>bayanihan</em>.
        </p>
        <ul className="space-y-2 text-sm text-cognitio-ink/75">
          {[
            'Anonymized, moderated discussion threads',
            'Trauma-informed community guidelines',
            'Opt-in leaderboard — no personal data exposed',
            'Webinars hosted by accredited MHPs',
          ].map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-c-green-500 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          return (
            <div
              key={i}
              className="rounded-2xl bg-white border border-c-purple-100 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${it.color}15`, color: it.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-cognitio-ink mb-1.5">{it.title}</h3>
              <p className="text-xs text-cognitio-ink/65 leading-relaxed">{it.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default CommunityCallout;
