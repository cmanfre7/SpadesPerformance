-- Spades Performance - Supabase schema (invites + join requests)

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.invites (
  code text primary key,
  created_at timestamptz not null default now(),
  created_by text null,
  used_at timestamptz null,
  used_name text null,
  used_instagram text null,
  used_email text null
);

create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  invite_code text not null references public.invites(code) on delete restrict,
  name text not null,
  instagram text not null,
  car text null,
  email text null,
  status text not null default 'pending'
);

create index if not exists join_requests_invite_code_idx on public.join_requests(invite_code);


