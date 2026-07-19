-- ============================================================================
-- 003 · Verification documents — private Storage bucket + metadata table
-- Run AFTER 002_auth_binding_and_upsert.sql
--
-- Documents live in a PRIVATE bucket ('verification-docs'); access is only
-- ever via short-lived signed URLs. Users may read/write solely inside their
-- own '<auth.uid()>/' folder. Review/status changes happen via service role.
-- ============================================================================

begin;

create table if not exists public.verification_documents (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  onboarding_id uuid references public.cognitio_onboarding(id) on delete set null,
  file_path     text not null,
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

-- storage RLS: own '<uid>/' folder only
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

commit;
