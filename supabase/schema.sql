-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- for the "After" estate-navigator app's saved-progress, document-vault,
-- and family-sharing features. Safe to re-run in full any time this file
-- changes — every statement is idempotent (create-if-not-exists /
-- drop-then-create).

-- One row per signed-in user: their saved intake answers and which
-- checklist steps they've marked done.
create table if not exists public.checklists (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  done text[] not null default '{}'::text[],
  updated_at timestamptz not null default now()
);

alter table public.checklists enable row level security;

drop policy if exists "Users manage their own checklist" on public.checklists;
create policy "Users manage their own checklist"
  on public.checklists
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Keep updated_at current on every write.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists checklists_set_updated_at on public.checklists;
create trigger checklists_set_updated_at
  before update on public.checklists
  for each row execute function public.set_updated_at();

-- Family sharing: the checklist owner can invite family members by email so
-- they see and check off the same shared checklist instead of each person
-- having their own separate copy. A member gains access purely by signing
-- in with the email address the owner invited — no invite email is sent.
create table if not exists public.checklist_members (
  checklist_owner_id uuid not null references auth.users(id) on delete cascade,
  member_email text not null,
  invited_at timestamptz not null default now(),
  primary key (checklist_owner_id, member_email)
);

alter table public.checklist_members enable row level security;

drop policy if exists "Owner and member can see membership rows" on public.checklist_members;
create policy "Owner and member can see membership rows"
  on public.checklist_members
  for select
  using (checklist_owner_id = auth.uid() or member_email = auth.email());

drop policy if exists "Owner manages invites" on public.checklist_members;
create policy "Owner manages invites"
  on public.checklist_members
  for insert
  with check (checklist_owner_id = auth.uid());

drop policy if exists "Owner removes invites" on public.checklist_members;
create policy "Owner removes invites"
  on public.checklist_members
  for delete
  using (checklist_owner_id = auth.uid());

-- Let invited members view and update (check off tasks on) the shared
-- checklist — the app only ever sends `done` updates on behalf of members,
-- never `answers`, so the owner stays the only one who can change what's on
-- the list.
drop policy if exists "Members can view shared checklist" on public.checklists;
create policy "Members can view shared checklist"
  on public.checklists
  for select
  using (
    exists (
      select 1 from public.checklist_members m
      where m.checklist_owner_id = checklists.user_id
        and m.member_email = auth.email()
    )
  );

drop policy if exists "Members can update shared checklist progress" on public.checklists;
create policy "Members can update shared checklist progress"
  on public.checklists
  for update
  using (
    exists (
      select 1 from public.checklist_members m
      where m.checklist_owner_id = checklists.user_id
        and m.member_email = auth.email()
    )
  )
  with check (
    exists (
      select 1 from public.checklist_members m
      where m.checklist_owner_id = checklists.user_id
        and m.member_email = auth.email()
    )
  );

-- Private file storage for uploaded documents (death certificate, etc.),
-- one folder per user: documents/{user_id}/{task_id}/{filename}.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "Users manage their own documents" on storage.objects;
create policy "Users manage their own documents"
  on storage.objects
  for all
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
