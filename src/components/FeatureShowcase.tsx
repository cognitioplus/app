import React from 'react';
import { BarChart3, BookOpen, ShieldCheck, Compass, Activity, HeartPulse, MessageCircle, FlaskConical } from 'lucide-react';

const FEATURES = [
  { icon: BarChart3, title: 'Analytics', body: 'Wellness trends, engagement, and outcome insights at every level.', color: '#b425aa' },
  { icon: BookOpen, title: 'Learning', body: 'Culturally adapted psychoeducation and gamified learning paths.', color: '#14A299' },
  { icon: ShieldCheck, title: 'Security', body: 'End-to-end encryption, RA 11036 aligned, role-based access.', color: '#2F9C45' },
  { icon: Compass, title: 'Resilience Navigator', body: 'CASE framework — guided micro-practices that build resilience.', color: '#D4AF37' },
  { icon: Activity, title: 'Habit Studio', body: 'B=MAP behavior design — tiny habits that stick, gently.', color: '#EE6048' },
  { icon: HeartPulse, title: 'Well-Be', body: 'HRV-informed mind-body monitor with daily nudges.', color: '#b425aa' },
  { icon: MessageCircle, title: 'Kalinga Connect', body: 'Substance abuse support — discreet, structured, compassionate.', color: '#14A299' },
  { icon: FlaskConical, title: 'PsychAssess Pro', body: 'PHQ-9, GAD-7, DASS-21 — automated scoring & reports.', color: '#2F9C45' },
];

const FeatureShowcase: React.FC = () => (
  <section id="services" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <div>
        <span className="text-xs font-display font-bold tracking-[0.25em] uppercase text-c-purple-600">
          Feature Showcase
        </span>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-cognitio-ink mt-2">
          Eight capabilities, <span className="gradient-text">one ecosystem</span>
        </h2>
      </div>
      <p className="text-sm text-cognitio-ink/65 max-w-md">
        Wellness tools live inside your personalized dashboard — accessible right after login,
        tailored to your role and context.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {FEATURES.map((f, i) => {
        const Icon = f.icon;
        return (
          <div
            key={i}
            className="group relative rounded-2xl bg-white border border-c-purple-100 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
          >
            <div
              className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 group-hover:opacity-30 transition-opacity blur-2xl"
              style={{ backgroundColor: f.color }}
            />
            <div className="relative">
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${f.color}18`, color: f.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-cognitio-ink mb-1.5">{f.title}</h3>
              <p className="text-xs text-cognitio-ink/65 leading-relaxed">{f.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default FeatureShowcase;
