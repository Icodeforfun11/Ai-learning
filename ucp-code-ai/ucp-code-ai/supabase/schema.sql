-- UCP CODE AI: Supabase schema with Row Level Security.
-- Run in the Supabase SQL editor. Every row belongs to one user; nobody can read or write another user's data.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  skill_level text not null default 'beginner' check (skill_level in ('beginner','intermediate','advanced')),
  settings jsonb not null default '{}'::jsonb,
  progress jsonb not null default '{}'::jsonb,   -- xp, completed lessons, quiz/exercise results, badges, streak
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) <= 80),
  files jsonb not null,
  template text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint files_size check (pg_column_size(files) < 512000)
);
create index if not exists projects_user_idx on public.projects(user_id, updated_at desc);

create table if not exists public.chats (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'studio' check (kind in ('studio','tutor')),
  title text not null check (char_length(title) <= 120),
  project_id text,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint messages_size check (pg_column_size(messages) < 512000)
);
create index if not exists chats_user_idx on public.chats(user_id, updated_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.chats    enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own projects" on public.projects;
create policy "own projects" on public.projects for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own chats" on public.chats;
create policy "own chats" on public.chats for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create a profile row automatically for new users
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
