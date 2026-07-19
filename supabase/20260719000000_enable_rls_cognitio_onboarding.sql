-- ============================================================================
-- Cognitio+ | cognitio_onboarding — table definition + interim RLS hardening
-- Date: 2026-07-19
--
-- CONTEXT
--   The SPA currently talks to Postgres with the public anon key and no user
--   authentication. Rows are keyed by a client-generated `session_id` UUID.
--   This migration locks the table down so the anon role can ONLY touch rows
--   whose session_id matches the request's `x-session-id` header (sent by
--   src/lib/supabase.ts). Unrestricted SELECT/UPDATE/DELETE is denied.
--
--   WARNING — INTERIM MEASURE. Anyone who learns a victim's session UUID can
--   still act as that session. Replace with Supabase Auth (auth.uid())
--   policies as soon as accounts land. Treat all rows written BEFORE this
--   migration as potentially exposed.
--
-- Apply via: Supabase Dashboard -> SQL Editor, or `supabase db push`.
-- ============================================================================

-- 1) Table (creates it on fresh projects; harmless if it already exists) ----
create table if not exists public.cognitio_onboarding (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz,
  session_id            uuid not null,
  user_type             text,
  language              text default 'en',
  region                text,
  full_name             text,
  email                 text,
  organization_name     text,
  vulnerabilities       jsonb default '[]'::jsonb,
  urbanization          text,
  has_external_funder   boolean default false,
  promo_code            text,
  promo_valid           boolean default false,
  verification_doc_name text,
  goals                 jsonb default '[]'::jsonb,
  profile_data          jsonb default '{}'::jsonb,
  base_price            numeric,
  final_price           numeric,
  discount_breakdown    jsonb,
  completed             boolean default false,
  current_step          integer,
  crm_consent           boolean default false
);

-- For databases that predate this migration:
alter table public.cognitio_onboarding
  add column if not exists crm_consent boolean default false;

-- 2) Helper: the caller's session id, taken from the request header ---------
-- PostgREST exposes request headers as a JSON object in the `request.headers`
-- GUC. Outside PostgREST the setting is NULL and the function returns NULL,
-- which makes every policy below evaluate to false (fail closed).
create or replace function public.request_session_id()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.headers', true)::json ->> 'x-session-id', '')::uuid
$$;

-- 3) Enable and FORCE row level security ------------------------------------
alter table public.cognitio_onboarding enable row level security;
alter table public.cognitio_onboarding force row level security;

-- 4) Privileges: anon may read/create/edit drafts, never delete -------------
revoke all on public.cognitio_onboarding from anon;
grant select, insert, update on public.cognitio_onboarding to anon;

-- 5) Policies — every operation is scoped to the caller's session -----------
drop policy if exists cognitio_onboarding_select on public.cognitio_onboarding;
create policy cognitio_onboarding_select
  on public.cognitio_onboarding
  for select to anon
  using (session_id = public.request_session_id());

drop policy if exists cognitio_onboarding_insert on public.cognitio_onboarding;
create policy cognitio_onboarding_insert
  on public.cognitio_onboarding
  for insert to anon
  with check (session_id = public.request_session_id());

drop policy if exists cognitio_onboarding_update on public.cognitio_onboarding;
create policy cognitio_onboarding_update
  on public.cognitio_onboarding
  for update to anon
  using (session_id = public.request_session_id())
  with check (session_id = public.request_session_id());

-- No DELETE policy => deletes are denied for the anon role.

-- 6) Verify after applying:
--    select tablename, rowsecurity from pg_tables where tablename = 'cognitio_onboarding';
--    select policyname, cmd from pg_policies where tablename = 'cognitio_onboarding';
-- Both should show RLS enabled and exactly the three policies above.
