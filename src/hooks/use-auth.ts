import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, getSessionId } from '@/lib/supabase';

export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

/**
 * Live auth state. On every fresh sign-in, the browser's anonymous onboarding
 * draft is claimed for the authenticated user (idempotent, security-definer RPC).
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false);
      if (event === 'SIGNED_IN' && s?.user) {
        // Claim any anonymous draft created before sign-in. Fire-and-forget:
        // failure only means the draft stays session-scoped.
        supabase
          .rpc('claim_onboarding_draft', { p_session_id: getSessionId() })
          .then(({ error }) => {
            if (error) console.warn('Draft claim failed:', error.message);
          });
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

/** Send a magic-link email. `redirectTo` defaults to the current origin + /onboarding. */
export async function sendMagicLink(email: string, redirectTo?: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo ?? `${window.location.origin}/onboarding`,
    },
  });
}

/** Full sign-out: ends the Supabase session AND clears the local draft session. */
export async function signOut() {
  await supabase.auth.signOut();
}
