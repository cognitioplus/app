import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import CognitioLogo from '@/components/CognitioLogo';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { sendMagicLink, useAuth } from '@/hooks/use-auth';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/onboarding';
  const { user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Already signed in? Go straight to the target page.
  useEffect(() => {
    if (!loading && user) navigate(redirect, { replace: true });
  }, [user, loading, navigate, redirect]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      const { error } = await sendMagicLink(
        trimmed,
        `${window.location.origin}${redirect}`
      );
      if (error) throw error;
      setSent(true);
    } catch (err) {
      console.error('Magic link error:', err);
      toast.error('Could not send the sign-in link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cognitio-soft relative flex flex-col">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-c-purple-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-c-amber-200/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-4 w-full flex items-center justify-between">
        <CognitioLogo size="md" />
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-display font-semibold text-cognitio-ink/70 hover:text-c-purple-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-3xl bg-white border border-c-purple-100 shadow-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-c-green-100 text-c-green-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-cognitio-ink mb-2">
                Check your inbox
              </h1>
              <p className="text-sm text-cognitio-ink/65 leading-relaxed mb-6">
                We sent a secure sign-in link to{' '}
                <span className="font-display font-bold text-cognitio-ink">{email}</span>.
                Click it within the hour to continue — no password needed.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-full font-display"
                onClick={() => setSent(false)}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <div className="h-14 w-14 rounded-2xl bg-c-purple-100 text-c-purple-700 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-cognitio-ink text-center mb-2">
                Sign in to Cognitio+
              </h1>
              <p className="text-sm text-cognitio-ink/65 text-center leading-relaxed mb-6">
                Enter your email and we'll send you a magic link.
                Your onboarding progress carries over automatically.
              </p>
              <form onSubmit={handleSend} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoFocus
                  className="w-full rounded-lg border border-c-purple-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-c-purple-400"
                />
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-c-purple-600 hover:bg-c-purple-700 font-display"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending link…
                    </>
                  ) : (
                    'Email me a sign-in link'
                  )}
                </Button>
              </form>
              <p className="text-[11px] text-cognitio-ink/45 text-center mt-4 leading-relaxed">
                New here? The same link creates your account.
                We never see or store a password.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
