-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- for the "After" estate-navigator app's saved-progress and document-vault
-- features.

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
