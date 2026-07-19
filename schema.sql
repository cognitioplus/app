-- ============================================================================
-- Cognitio+ Digital Wellbeing Ecosystem — COMPREHENSIVE DATABASE SCHEMA
-- Target: Supabase (PostgreSQL 15+) · Apply via SQL Editor or `supabase db push`
-- Date: 2026-07-19
--
-- This file is the full reference schema for a FRESH project. If you already
-- applied earlier migrations, use the incremental files in supabase/migrations/
-- instead — the end state is identical.
--
-- Design principles
--   • Every user-facing table has Row Level Security ENABLED + FORCED.
--   • Users can only ever touch their own rows (auth.uid()); anonymous
--     visitors can manage onboarding drafts only via their browser's
--     x-session-id header (interim, see cognitio_onboarding policies).
--   • Sensitive content (verification docs, assessments) is never public.
--   • Nothing is granted to anon except what onboarding strictly needs.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 0) Extensions & shared helpers
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;          -- gen_random_uuid()

-- Caller session id from the x-session-id request header (PostgREST GUC).
-- Returns NULL outside PostgREST → all session-scoped policies fail closed.
create or replace function public.request_session_id()
returns uuid
language sql stable
as $$
  select nullif(current_setting('request.headers', true)::json ->> 'x-session-id', '')::uuid
$$;

-- Generic updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ============================================================================
-- 1) ONBOARDING & IDENTITY
-- ============================================================================

-- 1.1 Onboarding drafts & completed enrollments ------------------------------
create table if not exists public.cognitio_onboarding (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz,
  -- anonymous drafts are keyed by browser session; after sign-in the row is
  -- claimed by setting user_id (see migration 002 / claim_onboarding_draft)
  session_id            uuid not null,
  user_id               uuid references auth.users(id) on delete set null,
  user_type             text check (user_type in ('individual','mhp','community','organization')),
  language              text default 'en' check (language in ('en','fil')),
  region                text,
  full_name             text,
  email                 text,
  organization_name     text,
  vulnerabilities       jsonb default '[]'::jsonb,
  urbanization          text check (urbanization in ('rural','urban','huc')),
  has_external_funder   boolean default false,
  promo_code            text,
  promo_valid           boolean default false,
  verification_doc_name text,
  verification_doc_path text,                 -- storage object path (bucket verification-docs)
  goals                 jsonb default '[]'::jsonb,
  profile_data          jsonb default '{}'::jsonb,
  base_price            numeric(10,2),
  final_price           numeric(10,2),
  discount_breakdown    jsonb,
  completed             boolean default false,
  current_step          integer,
  crm_consent           boolean default false
);

-- one live row per browser session (enables .upsert onConflict: 'session_id')
create unique index if not exists cognitio_onboarding_session_id_key
  on public.cognitio_onboarding (session_id);
create index if not exists cognitio_onboarding_user_id_idx
  on public.cognitio_onboarding (user_id);
create index if not exists cognitio_onboarding_email_idx
  on public.cognitio_onboarding (lower(email));

drop trigger if exists trg_onboarding_updated on public.cognitio_onboarding;
create trigger trg_onboarding_updated before update on public.cognitio_onboarding
  for each row execute function public.set_updated_at();

alter table public.cognitio_onboarding enable row level security;
alter table public.cognitio_onboarding force row level security;

revoke all on public.cognitio_onboarding from anon;
grant select, insert, update on public.cognitio_onboarding to anon;
grant select, insert, update on public.cognitio_onboarding to authenticated;

-- anonymous (draft) access: strictly the caller's own session
drop policy if exists onboarding_anon_select on public.cognitio_onboarding;
create policy onboarding_anon_select on public.cognitio_onboarding
  for select to anon using (session_id = public.request_session_id());

drop policy if exists onboarding_anon_insert on public.cognitio_onboarding;
create policy onboarding_anon_insert on public.cognitio_onboarding
  for insert to anon with check (session_id = public.request_session_id());

drop policy if exists onboarding_anon_update on public.cognitio_onboarding;
create policy onboarding_anon_update on public.cognitio_onboarding
  for update to anon
  using (session_id = public.request_session_id() and user_id is null)
  with check (session_id = public.request_session_id());

-- authenticated access: strictly own rows
drop policy if exists onboarding_user_select on public.cognitio_onboarding;
create policy onboarding_user_select on public.cognitio_onboarding
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists onboarding_user_insert on public.cognitio_onboarding;
create policy onboarding_user_insert on public.cognitio_onboarding
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists onboarding_user_update on public.cognitio_onboarding;
create policy onboarding_user_update on public.cognitio_onboarding
  for update to authenticated
  using (auth.uid() = user_id or (session_id = public.request_session_id() and user_id is null))
  with check (auth.uid() = user_id);

-- 1.2 Profile (1:1 with auth.users) ------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz,
  full_name    text,
  avatar_url   text,
  user_type    text check (user_type in ('individual','mhp','community','organization')),
  language     text default 'en',
  region       text,
  onboarded    boolean default false
);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists profiles_self_insert on public.profiles;
create policy profiles_self_insert on public.profiles
  for insert to authenticated with check (auth.uid() = id);
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- auto-provision a profile for every new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- claim an anonymous onboarding draft after first sign-in
create or replace function public.claim_onboarding_draft(p_session_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update public.cognitio_onboarding
     set user_id = auth.uid()
   where session_id = p_session_id
     and user_id is null;
end;
$$;
grant execute on function public.claim_onboarding_draft(uuid) to authenticated;

-- ============================================================================
-- 2) VERIFICATION DOCUMENTS (private storage + metadata)
-- ============================================================================

create table if not exists public.verification_documents (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  onboarding_id uuid references public.cognitio_onboarding(id) on delete set null,
  file_path     text not null,                -- e.g. '<uid>/<session>/<file>.pdf'
  file_name     text not null,
  mime_type     text,
  size_bytes    bigint,
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected')),
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  review_note   text
);

create index if not exists verification_documents_user_idx
  on public.verification_documents (user_id);

alter table public.verification_documents enable row level security;
alter table public.verification_documents force row level security;
grant select, insert on public.verification_documents to authenticated;
-- note: no UPDATE/DELETE for users — review actions go through service role

drop policy if exists verif_docs_owner_read on public.verification_documents;
create policy verif_docs_owner_read on public.verification_documents
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists verif_docs_owner_insert on public.verification_documents;
create policy verif_docs_owner_insert on public.verification_documents
  for insert to authenticated with check (auth.uid() = user_id);

-- private bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('verification-docs', 'verification-docs', false)
on conflict (id) do nothing;

-- storage RLS: users manage files only inside their own '<uid>/' folder
drop policy if exists verif_storage_insert on storage.objects;
create policy verif_storage_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'verification-docs'
              and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists verif_storage_read on storage.objects;
create policy verif_storage_read on storage.objects
  for select to authenticated
  using (bucket_id = 'verification-docs'
         and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists verif_storage_update on storage.objects;
create policy verif_storage_update on storage.objects
  for update to authenticated
  using (bucket_id = 'verification-docs'
         and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists verif_storage_delete on storage.objects;
create policy verif_storage_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'verification-docs'
         and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================================
-- 3) ASSESSMENTS & SCREENINGS (PHI-adjacent — owner-only)
-- ============================================================================

create table if not exists public.assessments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  instrument  text not null,                  -- 'pre_session' | 'savs' | 'wellness_tracker' | ...
  responses   jsonb not null default '{}'::jsonb,
  score       numeric,
  severity    text,                           -- 'low' | 'moderate' | 'high' | 'critical'
  notes       text
);

create index if not exists assessments_user_idx on public.assessments (user_id, created_at desc);

alter table public.assessments enable row level security;
alter table public.assessments force row level security;
grant select, insert on public.assessments to authenticated;

drop policy if exists assessments_owner_read on public.assessments;
create policy assessments_owner_read on public.assessments
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists assessments_owner_insert on public.assessments;
create policy assessments_owner_insert on public.assessments
  for insert to authenticated with check (auth.uid() = user_id);

-- ============================================================================
-- 4) PROFESSIONALS & APPOINTMENTS
-- ============================================================================

create table if not exists public.professionals (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz,
  user_id        uuid not null unique references auth.users(id) on delete cascade,
  license_number text,
  specialization text,
  clinic_name    text,
  bio            text,
  verified       boolean not null default false,   -- set by service role after review
  accepting_clients boolean not null default true
);

alter table public.professionals enable row level security;
alter table public.professionals force row level security;
grant select on public.professionals to authenticated;      -- directory is member-visible
grant insert, update on public.professionals to authenticated;

drop policy if exists professionals_directory_read on public.professionals;
create policy professionals_directory_read on public.professionals
  for select to authenticated using (verified = true or auth.uid() = user_id);
drop policy if exists professionals_self_insert on public.professionals;
create policy professionals_self_insert on public.professionals
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists professionals_self_update on public.professionals;
create policy professionals_self_update on public.professionals
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id and verified = false);   -- edits reset verification flow

create table if not exists public.appointments (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz,
  client_id       uuid not null references auth.users(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  service         text,
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  status          text not null default 'requested'
                  check (status in ('requested','confirmed','completed','cancelled','no_show')),
  client_note     text,
  professional_note text
);

create index if not exists appointments_client_idx on public.appointments (client_id, starts_at);
create index if not exists appointments_pro_idx    on public.appointments (professional_id, starts_at);

alter table public.appointments enable row level security;
alter table public.appointments force row level security;
grant select, insert, update on public.appointments to authenticated;

drop policy if exists appointments_parties_read on public.appointments;
create policy appointments_parties_read on public.appointments
  for select to authenticated
  using (auth.uid() = client_id
         or auth.uid() = (select user_id from public.professionals p where p.id = professional_id));
drop policy if exists appointments_client_insert on public.appointments;
create policy appointments_client_insert on public.appointments
  for insert to authenticated with check (auth.uid() = client_id);
drop policy if exists appointments_parties_update on public.appointments;
create policy appointments_parties_update on public.appointments
  for update to authenticated
  using (auth.uid() = client_id
         or auth.uid() = (select user_id from public.professionals p where p.id = professional_id));

-- ============================================================================
-- 5) WELLNESS TRACKING & HABITS
-- ============================================================================

create table if not exists public.tracker_entries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  entry_date  date not null default current_date,
  mood        smallint check (mood between 1 and 10),
  stress      smallint check (stress between 1 and 10),
  sleep_hours numeric(3,1),
  energy      smallint check (energy between 1 and 10),
  note        text,
  unique (user_id, entry_date)
);

alter table public.tracker_entries enable row level security;
alter table public.tracker_entries force row level security;
grant select, insert, update, delete on public.tracker_entries to authenticated;

drop policy if exists tracker_owner_all on public.tracker_entries;
create policy tracker_owner_all on public.tracker_entries
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.habit_plans (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  design     jsonb not null default '{}'::jsonb,   -- cue / routine / reward, micro-steps
  active     boolean not null default true
);

alter table public.habit_plans enable row level security;
alter table public.habit_plans force row level security;
grant select, insert, update, delete on public.habit_plans to authenticated;

drop policy if exists habit_plans_owner_all on public.habit_plans;
create policy habit_plans_owner_all on public.habit_plans
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.habit_checkins (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  plan_id    uuid not null references public.habit_plans(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  done       boolean not null default true,
  note       text,
  unique (plan_id, checkin_date)
);

alter table public.habit_checkins enable row level security;
alter table public.habit_checkins force row level security;
grant select, insert, update, delete on public.habit_checkins to authenticated;

drop policy if exists habit_checkins_owner_all on public.habit_checkins;
create policy habit_checkins_owner_all on public.habit_checkins
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 6) GROWTH POINTS (ledger + balance view)
-- ============================================================================

create table if not exists public.growth_points_ledger (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  points     integer not null,                    -- signed: earn +, redeem -
  reason     text not null,                       -- 'daily_checkin' | 'assessment_done' | ...
  ref_table  text,
  ref_id     uuid
);

create index if not exists gp_ledger_user_idx on public.growth_points_ledger (user_id, created_at desc);

alter table public.growth_points_ledger enable row level security;
alter table public.growth_points_ledger force row level security;
grant select on public.growth_points_ledger to authenticated;
-- inserts come from trusted server logic (service role), not directly from clients

drop policy if exists gp_owner_read on public.growth_points_ledger;
create policy gp_owner_read on public.growth_points_ledger
  for select to authenticated using (auth.uid() = user_id);

create or replace view public.growth_points_balance as
  select user_id, coalesce(sum(points), 0) as balance
  from public.growth_points_ledger
  group by user_id;

-- ============================================================================
-- 7) BILLING: PLANS, PROMOS, CONSENTED CONTACTS
-- ============================================================================

create table if not exists public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz,
  user_id            uuid not null references auth.users(id) on delete cascade,
  plan               text not null,              -- 'individual' | 'mhp' | 'community' | 'organization'
  price_php          numeric(10,2) not null,
  status             text not null default 'active'
                     check (status in ('trialing','active','past_due','cancelled')),
  current_period_start timestamptz default now(),
  current_period_end timestamptz
);

alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;
grant select on public.subscriptions to authenticated;

drop policy if exists subscriptions_owner_read on public.subscriptions;
create policy subscriptions_owner_read on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.promo_codes (
  code         text primary key,
  label        text not null,
  discount_pct numeric(4,3) not null check (discount_pct > 0 and discount_pct <= 1),
  active       boolean not null default true,
  expires_at   timestamptz
);

alter table public.promo_codes enable row level security;
alter table public.promo_codes force row level security;
grant select on public.promo_codes to anon, authenticated;

drop policy if exists promo_public_read on public.promo_codes;
create policy promo_public_read on public.promo_codes
  for select to anon, authenticated
  using (active = true and (expires_at is null or expires_at > now()));

insert into public.promo_codes (code, label, discount_pct) values
  ('WELCOME50', 'Welcome offer — 50% off first month', 0.50),
  ('KAPWA25',   'Kapwa partner — 25% off',             0.25),
  ('YOUTH40',   'Youth subsidy — 40% off',             0.40)
on conflict (code) do nothing;

-- consented marketing contacts (written only after explicit opt-in)
create table if not exists public.crm_contacts (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  user_id         uuid references auth.users(id) on delete set null,
  email           text not null,
  full_name       text,
  tags            jsonb default '[]'::jsonb,
  source          text,
  consent_at      timestamptz not null default now(),
  unsubscribed_at timestamptz,
  unique (email)
);

alter table public.crm_contacts enable row level security;
alter table public.crm_contacts force row level security;
grant select, insert, update on public.crm_contacts to authenticated;

drop policy if exists crm_self_read on public.crm_contacts;
create policy crm_self_read on public.crm_contacts
  for select to authenticated using (auth.uid() = user_id or lower(email) = auth.email());
drop policy if exists crm_self_insert on public.crm_contacts;
create policy crm_self_insert on public.crm_contacts
  for insert to authenticated with check (auth.uid() = user_id or lower(email) = auth.email());
drop policy if exists crm_self_unsubscribe on public.crm_contacts;
create policy crm_self_unsubscribe on public.crm_contacts
  for update to authenticated using (lower(email) = auth.email())
  with check (lower(email) = auth.email());

-- ============================================================================
-- 8) COMMUNITY (anonymized + moderated)
-- ============================================================================

create table if not exists public.community_posts (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_id  uuid not null references auth.users(id) on delete cascade,
  alias      text not null,                        -- server-assigned pseudonym, never the real name
  topic      text not null,
  body       text not null,
  status     text not null default 'pending'
             check (status in ('pending','published','rejected'))
);

create index if not exists community_posts_feed_idx
  on public.community_posts (status, created_at desc);

alter table public.community_posts enable row level security;
alter table public.community_posts force row level security;
grant select, insert on public.community_posts to authenticated;

drop policy if exists community_read_published on public.community_posts;
create policy community_read_published on public.community_posts
  for select to authenticated
  using (status = 'published' or auth.uid() = author_id);
drop policy if exists community_insert_own on public.community_posts;
create policy community_insert_own on public.community_posts
  for insert to authenticated with check (auth.uid() = author_id and status = 'pending');
-- moderation (status flips) happens via service role only

-- ============================================================================
-- 9) AUDIT LOG (service role only — no client access at all)
-- ============================================================================

create table if not exists public.audit_log (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor_id   uuid,
  action     text not null,
  table_name text,
  row_id     text,
  meta       jsonb default '{}'::jsonb
);

alter table public.audit_log enable row level security;
alter table public.audit_log force row level security;
revoke all on public.audit_log from anon, authenticated;   -- service role bypasses RLS

commit;

-- ============================================================================
-- VERIFICATION QUERIES (run after applying)
--   select tablename, rowsecurity from pg_tables
--    where schemaname = 'public' order by 1;              -- all rowsecurity = t
--   select tablename, policyname, cmd from pg_policies
--    where schemaname = 'public' order by 1, 2;
--   select id, public from storage.buckets where id = 'verification-docs';
-- ============================================================================
