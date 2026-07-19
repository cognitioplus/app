import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, clearSessionId, getSessionId } from '@/lib/supabase';
import { useAuth, signOut } from '@/hooks/use-auth';
import { USER_TYPES, UserType, STAGES } from '@/data/journeyData';
import CognitioLogo from '@/components/CognitioLogo';
import { Button } from '@/components/ui/button';
import { Bell, Settings, LogOut, Trophy, Flame, Sparkles, ArrowRight, Home } from 'lucide-react';
import { formatPHP } from '@/lib/pricing';
import type { OnboardingRow } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { userType: paramType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const userType = (paramType as UserType) || 'individual';
  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState<OnboardingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // The dashboard is personal: require a signed-in account.
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=/dashboard/${userType}`, { replace: true });
    }
  }, [authLoading, user, navigate, userType]);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      try {
        // Make sure any anonymous draft is claimed before reading.
        await supabase.rpc('claim_onboarding_draft', { p_session_id: getSessionId() });
        const { data, error } = await supabase
          .from('cognitio_onboarding')
          .select('*')
          .or(`user_id.eq.${user.id},session_id.eq.${getSessionId()}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        setData(data);
      } catch (err) {
        console.error('Dashboard load failed:', err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, userType]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign-out failed:', err);
    } finally {
      clearSessionId();
      navigate('/');
    }
  };

  const meta = USER_TYPES.find((u) => u.id === userType) ?? USER_TYPES[0];
  const stage = STAGES.find((s) => s.id === 'dashboard')!;
  const dashCards = stage.byUserType ? stage.byUserType[userType] : [];
  const servicesStage = STAGES.find((s) => s.id === 'services')!;
  const services = servicesStage.byUserType ? servicesStage.byUserType[userType] : [];

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-cognitio-ink/60">Loading your dashboard…</div>;
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-cognitio-ink/70">
        <p>We couldn’t load your dashboard. Please check your connection and try again.</p>
        <Button onClick={() => window.location.reload()} className="rounded-full bg-c-purple-600 hover:bg-c-purple-700 font-display">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cognitio-soft">
      {/* Top nav */}
      <header className="bg-white/80 backdrop-blur border-b border-c-purple-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <CognitioLogo size="md" />
          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-c-purple-50 border border-c-purple-100 px-3 py-1.5">
            <meta.icon className="h-3.5 w-3.5" style={{ color: meta.hex }} />
            <span className="text-xs font-display font-bold" style={{ color: meta.hex }}>
              {meta.label} Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Settings className="h-4 w-4" /></Button>
            {user?.email && (
              <span className="hidden lg:block text-xs text-cognitio-ink/50 font-display">{user.email}</span>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="font-display">
              <Home className="h-4 w-4 mr-1" /> Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="font-display"
            >
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div
          className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${meta.hex} 0%, #b425aa 60%, #D4AF37 100%)` }}
        >
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative text-white">
            <span className="text-xs font-display font-bold uppercase tracking-wider opacity-80">
              Mabuhay! Welcome back
            </span>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl mt-1">
              Hello, {data?.full_name || 'friend'} 👋
            </h1>
            <p className="text-white/85 mt-2 max-w-2xl">
              Your personalized {meta.label} home base — tools, programs, and people, all in one place.
            </p>
            {data && (
              <div className="mt-5 flex flex-wrap gap-3">
                <StatPill icon={Trophy} label="Growth Points" value="450 GP" sub="≈ ₱3" />
                <StatPill icon={Flame} label="Streak" value="3 days" sub="Keep going!" />
                <StatPill icon={Sparkles} label="Plan" value={formatPHP(data.final_price ?? 0)} sub={`${Math.round((((data.base_price ?? 0) - (data.final_price ?? 0)) / Math.max(1, data.base_price ?? 1)) * 100)}% off`} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard widgets */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="text-xs font-display font-bold uppercase tracking-wider text-c-purple-600">
              Your dashboard
            </span>
            <h2 className="font-display font-extrabold text-2xl text-cognitio-ink mt-1">
              Tools & metrics tailored for you
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashCards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-c-purple-100 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 h-1 w-full"
                style={{ backgroundColor: meta.hex }}
              />
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center font-display font-bold text-sm mb-3"
                style={{ backgroundColor: `${meta.hex}15`, color: meta.hex }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="font-display font-bold text-cognitio-ink mb-1.5 leading-snug">{card.title}</div>
              <p className="text-xs text-cognitio-ink/65 leading-relaxed">{card.body}</p>
              <div className="mt-3 text-xs font-display font-bold flex items-center gap-1" style={{ color: meta.hex }}>
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="text-xs font-display font-bold uppercase tracking-wider text-c-teal-600">
              Solutions & services
            </span>
            <h2 className="font-display font-extrabold text-2xl text-cognitio-ink mt-1">
              What you can access today
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-c-purple-100 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-start gap-4"
            >
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 font-display font-bold"
                style={{ backgroundColor: `${meta.hex}15`, color: meta.hex }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-cognitio-ink mb-1">{s.title}</div>
                <p className="text-xs text-cognitio-ink/65 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const StatPill: React.FC<{ icon: LucideIcon; label: string; value: string; sub: string }> = ({ icon: Icon, label, value, sub }) => (
  <div className="rounded-xl bg-white/15 backdrop-blur border border-white/25 px-3.5 py-2.5 flex items-center gap-3">
    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
      <Icon className="h-4 w-4" />
    </div>
    <div className="leading-tight">
      <div className="text-[10px] uppercase tracking-wider opacity-80 font-display font-bold">{label}</div>
      <div className="font-display font-extrabold">{value}</div>
      <div className="text-[10px] opacity-75">{sub}</div>
    </div>
  </div>
);

export default Dashboard;
