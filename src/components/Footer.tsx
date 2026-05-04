import React, { useState } from 'react';
import CognitioLogo from './CognitioLogo';
import { Button } from '@/components/ui/button';
import { Mail, Heart, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch('https://famous.ai/api/crm/69f85b6d28284c19361b5c25/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'footer-signup',
          tags: ['cognitio-plus', 'newsletter', 'footer'],
        }),
      });
      toast.success('Subscribed! Salamat. 🌱');
      setEmail('');
    } catch {
      toast.error('Could not subscribe. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cols = [
    {
      title: 'Platform',
      links: ['Landing Page', 'Onboarding', 'Dashboards', 'Solutions', 'Community', 'Retention'],
    },
    {
      title: 'For You',
      links: ['Individual', 'Mental Health Pro', 'Community Leader', 'Organization', 'Pricing', 'Subsidy Program'],
    },
    {
      title: 'Tools',
      links: ['Resilience Navigator', 'Habit Studio', 'Well-Be', 'SMART Emotion Tracker', 'Oasis', 'Kalinga Connect'],
    },
    {
      title: 'Company',
      links: ['About', 'Research', 'Careers', 'Press', 'Contact', 'Privacy & RA 11036'],
    },
  ];

  return (
    <footer className="relative mt-10 bg-cognitio-ink text-white">
      <div className="absolute inset-0 dotted-pattern opacity-5" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-4">
            <CognitioLogo size="lg" invert />
            <p className="text-white/65 text-sm mt-4 leading-relaxed max-w-sm">
              A culturally rooted digital ecosystem for mental health, resilience, and community
              wellness — built for and with Filipinos.
            </p>
            <form onSubmit={submit} className="mt-5 flex gap-2 max-w-sm">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Subscribe to GROWTH digest"
                  className="w-full rounded-lg bg-white/10 border border-white/20 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-c-amber-300"
                />
              </div>
              <Button type="submit" size="sm" disabled={submitting} className="bg-c-amber-400 hover:bg-c-amber-500 text-cognitio-ink font-display font-semibold">
                {submitting ? '…' : 'Join'}
              </Button>
            </form>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/55">
              <Globe className="h-3.5 w-3.5" />
              <span>Tagalog · English · Bisaya (coming soon)</span>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {cols.map((c, i) => (
              <div key={i}>
                <div className="font-display font-bold text-sm text-c-amber-300 mb-3 uppercase tracking-wider">
                  {c.title}
                </div>
                <ul className="space-y-2">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-white/55">
          <div>© {new Date().getFullYear()} Cognitio+. All rights reserved.</div>
          <div className="flex items-center gap-1.5">
            Crafted with <Heart className="h-3 w-3 text-c-coral-400 fill-c-coral-400" /> in the Philippines · Aligned with RA 11036
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
