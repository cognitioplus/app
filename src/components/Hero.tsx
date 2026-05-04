import React, { useState } from 'react';
import { ArrowRight, Sparkles, Globe, Coins, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CognitioLogo from './CognitioLogo';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface HeroProps {
  onBegin: () => void;
  onExplore: () => void;
  language: 'en' | 'fil';
  setLanguage: (l: 'en' | 'fil') => void;
}

const copy = {
  en: {
    eyebrow: 'Cognitio+ Digital Ecosystem',
    title: 'Your complete journey from',
    titleAccent: 'discovery to lifelong wellness',
    subtitle:
      'Integrated cognitive & health tracking — built for Filipinos. Explore the full user flow from landing page through retention, organized by user type.',
    primary: 'Begin Journey',
    secondary: 'Explore Features',
    chips: ['Tagalog & English', 'Growth Points (150 GP = ₱1)', 'Vulnerability-aware pricing'],
  },
  fil: {
    eyebrow: 'Cognitio+ Digital Ecosystem',
    title: 'Ang kumpletong paglalakbay mula sa',
    titleAccent: 'pagtuklas hanggang sa habambuhay na wellness',
    subtitle:
      'Pinagsamang cognitive at health tracking — ginawa para sa mga Pilipino. Galugarin ang buong user flow mula landing page hanggang retention.',
    primary: 'Simulan ang Paglalakbay',
    secondary: 'Galugarin ang Features',
    chips: ['Tagalog at Ingles', 'Growth Points (150 GP = ₱1)', 'Mura ayon sa konteksto'],
  },
};

const Hero: React.FC<HeroProps> = ({ onBegin, onExplore, language, setLanguage }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const t = copy[language];

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch('https://famous.ai/api/crm/69f85b6d28284c19361b5c25/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'hero-signup',
          tags: ['cognitio-plus', 'newsletter', 'waitlist'],
        }),
      });
      toast.success(language === 'en' ? 'Welcome! Check your inbox.' : 'Maligayang pagdating! Tingnan ang inyong inbox.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <header className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-cognitio-soft" />
      <div className="absolute inset-0 -z-10 dotted-pattern opacity-50" />
      <div className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-c-purple-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-c-amber-200/30 blur-3xl" />

      {/* Top nav */}
      <nav className="relative max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        <CognitioLogo size="md" />
        <div className="hidden md:flex items-center gap-6 text-sm font-display font-medium text-cognitio-ink/70">
          <a href="#journey" className="hover:text-c-purple-600 transition-colors">Journey</a>
          <a href="#pillars" className="hover:text-c-purple-600 transition-colors">Pillars</a>
          <a href="#services" className="hover:text-c-purple-600 transition-colors">Services</a>
          <a href="#community" className="hover:text-c-purple-600 transition-colors">Community</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center rounded-full bg-white border border-c-purple-200 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={cn('px-3 py-1.5 rounded-full transition-all', language === 'en' ? 'bg-c-purple-500 text-white' : 'text-cognitio-ink/70')}
            >EN</button>
            <button
              onClick={() => setLanguage('fil')}
              className={cn('px-3 py-1.5 rounded-full transition-all', language === 'fil' ? 'bg-c-purple-500 text-white' : 'text-cognitio-ink/70')}
            >FIL</button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex font-display"
            onClick={() => toast.info('Login modal coming next')}
          >
            Login
          </Button>
          <Button
            size="sm"
            onClick={onBegin}
            className="font-display bg-c-purple-600 hover:bg-c-purple-700 text-white shadow-md"
          >
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-16 md:pt-16 md:pb-24 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-c-purple-200 px-3 py-1.5 mb-5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-c-amber-500" />
            <span className="text-xs font-display font-semibold text-c-purple-700 tracking-wide uppercase">
              {t.eyebrow}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-cognitio-ink text-balance mb-5">
            {t.title}{' '}
            <span className="gradient-text">{t.titleAccent}</span>
          </h1>
          <p className="text-cognitio-ink/70 text-base md:text-lg max-w-2xl mb-7 leading-relaxed">
            {t.subtitle}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              onClick={onBegin}
              className="font-display font-semibold bg-c-amber-400 hover:bg-c-amber-500 text-cognitio-ink shadow-lg shadow-c-amber-200/50 group"
            >
              {t.primary}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onExplore}
              className="font-display font-semibold border-2 border-c-purple-300 text-c-purple-700 hover:bg-c-purple-50"
            >
              {t.secondary}
            </Button>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Globe, label: t.chips[0] },
              { icon: Coins, label: t.chips[1] },
              { icon: Award, label: t.chips[2] },
            ].map((chip, i) => {
              const Icon = chip.icon;
              return (
                <div key={i} className="flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-c-purple-100 px-3 py-1.5 text-xs font-medium text-cognitio-ink/75">
                  <Icon className="h-3.5 w-3.5 text-c-purple-500" />
                  {chip.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right card stack */}
        <div className="lg:col-span-5 relative">
          <div className="relative">
            {/* main card */}
            <div className="relative rounded-3xl bg-white shadow-2xl shadow-c-purple-200/50 border border-c-purple-100 p-6 animate-float">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-c-green-500 animate-pulse-soft" />
                  <span className="text-xs font-display font-bold text-cognitio-ink">Live Journey Map</span>
                </div>
                <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-c-purple-500">7 stages</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { n: 1, label: 'Landing', color: '#b425aa' },
                  { n: 2, label: 'Onboarding', color: '#EE6048' },
                  { n: 3, label: 'Goals & Profile', color: '#D4AF37' },
                  { n: 4, label: 'Dashboard', color: '#b425aa' },
                  { n: 5, label: 'Solutions', color: '#14A299' },
                  { n: 6, label: 'Community', color: '#2F9C45' },
                  { n: 7, label: 'Retention', color: '#D4AF37' },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-3 rounded-xl bg-c-purple-50/40 border border-c-purple-100 px-3 py-2">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-display font-bold"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.n}
                    </div>
                    <span className="font-display font-semibold text-sm text-cognitio-ink">{s.label}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-c-purple-300" />
                  </div>
                ))}
              </div>

              <form onSubmit={subscribe} className="mt-5 pt-4 border-t border-c-purple-100">
                <label className="text-xs font-display font-semibold text-cognitio-ink/70 mb-2 block">
                  Get early access
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 rounded-lg border border-c-purple-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400"
                  />
                  <Button type="submit" size="sm" disabled={submitting} className="bg-c-purple-600 hover:bg-c-purple-700 text-white font-display">
                    {submitting ? '...' : 'Join'}
                  </Button>
                </div>
              </form>
            </div>

            {/* floating badge */}
            <div className="absolute -top-4 -left-4 rounded-2xl bg-cognitio-gradient text-white px-4 py-3 shadow-xl rotate-[-4deg] hidden sm:block">
              <div className="text-[10px] font-display uppercase tracking-wider opacity-80">Earn</div>
              <div className="font-display font-extrabold text-lg leading-none">+50 GP</div>
              <div className="text-[10px] mt-0.5 opacity-90">Daily check-in</div>
            </div>

            <div className="absolute -bottom-4 -right-2 rounded-2xl bg-white border-2 border-c-amber-300 px-4 py-3 shadow-xl rotate-[4deg] hidden sm:block">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-c-amber-500" />
                <div>
                  <div className="text-[10px] font-display uppercase tracking-wider text-cognitio-ink/60">Badge</div>
                  <div className="font-display font-extrabold text-sm text-cognitio-ink leading-none">7-Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
