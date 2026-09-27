-- Friend comments + guestbook for pearlspaho.com.
-- Run this once in the Supabase SQL editor.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('comments', 'guestbook')),
  name text not null check (char_length(name) between 1 and 40),
  body text not null check (char_length(body) between 1 and 600),
  mood text check (mood is null or char_length(mood) <= 20),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists posts_kind_status_created on public.posts (kind, status, created_at desc);

alter table public.posts enable row level security;

-- visitors can post, but only as 'pending'
drop policy if exists "anon can insert pending" on public.posts;
create policy "anon can insert pending" on public.posts
  for insert to anon
  with check (status = 'pending');

-- visitors only ever see approved posts
drop policy if exists "anon can read approved" on public.posts;
create policy "anon can read approved" on public.posts
  for select to anon
  using (status = 'approved');

-- visitors can't change or delete anything (no update/delete policies for anon).
-- Pearl approves posts in the Supabase table editor, which bypasses RLS.
revoke update, delete on public.posts from anon;
