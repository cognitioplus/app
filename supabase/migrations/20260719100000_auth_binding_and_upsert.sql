-- ============================================================================
-- 002 · Auth binding + atomic upsert support
-- Run AFTER 20260719000000_enable_rls_cognitio_onboarding.sql
--
--   • Adds user_id (auth.users) + verification_doc_path to cognitio_onboarding
--   • De-duplicates existing rows, then adds UNIQUE(session_id) so the client
--     can use .upsert(..., { onConflict: 'session_id' })
--   • Adds authenticated-role policies (own rows) alongside the anon
--     session-scoped draft policies from 001
--   • Adds profiles table (1:1 with auth.users) + auto-provision trigger
--   • Adds claim_onboarding_draft() for post-sign-in draft claiming
-- ============================================================================

begin;

-- 1) New columns -------------------------------------------------------------
alter table public.cognitio_onboarding
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists verification_doc_path text;

-- 2) De-duplicate: keep the newest row per session_id ------------------------
delete from public.cognitio_onboarding a
using public.cognitio_onboarding b
where a.session_id = b.session_id
  and a.created_at < b.created_at;

create unique index if not exists cognitio_onboarding_session_id_key
  on public.cognitio_onboarding (session_id);
create index if not exists cognitio_onboarding_user_id_idx
  on public.cognitio_onboarding (user_id);

-- 3) Grants + authenticated policies -----------------------------------------
grant select, insert, update on public.cognitio_onboarding to authenticated;

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

-- tighten the anon update policy: anonymous callers may not touch claimed rows
drop policy if exists cognitio_onboarding_update on public.cognitio_onboarding;
create policy cognitio_onboarding_update on public.cognitio_onboarding
  for update to anon
  using (session_id = public.request_session_id() and user_id is null)
  with check (session_id = public.request_session_id());

-- 4) Profiles (1:1 with auth.users) ------------------------------------------
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

-- 5) Claim an anonymous draft after sign-in ----------------------------------
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

commit;
