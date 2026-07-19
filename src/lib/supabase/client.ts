// Reserved for the future Supabase Auth / SSR migration — NOT currently wired
// into the app. The SPA's active client is src/lib/supabase.ts (single browser
// client with the x-session-id header used by RLS policies).
// Uses the same env vars as the active client.
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )
}
