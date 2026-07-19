import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Session identity
// A client-generated UUID identifies this browser's onboarding session.
// It is sent with every request as the `x-session-id` header; Postgres RLS
// policies on `cognitio_onboarding` restrict reads/writes to matching rows
// (interim measure until Supabase Auth lands — see supabase/migrations/).
// ---------------------------------------------------------------------------
const SESSION_KEY = 'cognitio_session_id';

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function clearSessionId(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ---------------------------------------------------------------------------
// Configuration — injected at build/dev time from environment variables.
// Copy .env.example to .env and fill in your project values. Never commit
// real credentials to the repository.
// ---------------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Cognitio+] Missing Supabase configuration. ' +
      'Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: { 'x-session-id': getSessionId() },
  },
});

export { supabase };
