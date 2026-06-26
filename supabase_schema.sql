-- Supabase schema for BuildGuard AI

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now(),
  plan text not null default 'free',
  credits_remaining integer not null default 3,
  token_version integer not null default 0
);

-- Contracts table
create table if not exists contracts (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  file_name text not null,
  file_size integer not null,
  upload_time timestamptz not null default now(),
  extracted_text text not null,
  status text not null default 'processing',
  page_count integer not null
);

-- Analyses table
create table if not exists analyses (
  id uuid primary key,
  contract_id uuid not null references contracts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  overall_risk_score integer not null,
  risk_level text not null,
  summary text not null,
  clauses jsonb not null,
  recommendations jsonb not null,
  red_flags jsonb not null,
  missing_protections jsonb not null default '[]'::jsonb,
  overall_recommendation text not null default '',
  model_used text not null
);

alter table analyses add column if not exists missing_protections jsonb not null default '[]'::jsonb;
alter table analyses add column if not exists overall_recommendation text not null default '';
-- FIX: GAP-05 — Store detected language per analysis
alter table analyses add column if not exists detected_language text default 'en';

-- Data retention policy: delete analyses older than 90 days
-- Run this via Supabase pg_cron or as a scheduled job:
--
-- create extension if not exists pg_cron;
-- select cron.schedule(
--   'cleanup-old-analyses',
--   '0 3 * * *',  -- daily at 3am
--   $$ delete from analyses where created_at < now() - interval '90 days' $$
-- );
--
-- Alternative: manually run when needed:
-- delete from analyses where created_at < now() - interval '90 days';

-- Indexes for performance
create index if not exists idx_users_email on users(email);
create index if not exists idx_contracts_user_id on contracts(user_id);
create index if not exists idx_contracts_status on contracts(status);
create index if not exists idx_analyses_contract_id on analyses(contract_id);
create index if not exists idx_analyses_user_id on analyses(user_id);
create index if not exists idx_analyses_created_at on analyses(created_at desc);

-- Enable Row Level Security
alter table users enable row level security;
alter table contracts enable row level security;
alter table analyses enable row level security;

-- RLS policies for users table
create policy if not exists users_select_own on users for select using (auth.uid() = id);
create policy if not exists users_insert_self on users for insert with check (auth.uid() = id);
create policy if not exists users_update_self on users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy if not exists users_delete_self on users for delete using (auth.uid() = id);

-- RLS policies for contracts table
create policy if not exists contracts_select_own on contracts for select using (auth.uid() = user_id);
create policy if not exists contracts_insert_own on contracts for insert with check (auth.uid() = user_id);
create policy if not exists contracts_update_own on contracts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists contracts_delete_own on contracts for delete using (auth.uid() = user_id);

-- RLS policies for analyses table
create policy if not exists analyses_select_own on analyses for select using (auth.uid() = user_id);
create policy if not exists analyses_insert_own on analyses for insert with check (auth.uid() = user_id);
create policy if not exists analyses_update_own on analyses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists analyses_delete_own on analyses for delete using (auth.uid() = user_id);
