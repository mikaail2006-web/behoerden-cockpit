-- Behoerden-Cockpit portal schema
-- Startpunkt fuer Supabase Auth + Row Level Security.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null default gen_random_uuid(),
  full_name text not null,
  role text not null check (role in ('admin', 'bearbeiter', 'kunde')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  owner_id uuid references public.profiles(id) on delete set null,
  area text not null,
  authority text,
  status text not null default 'Offen',
  priority text not null default 'medium',
  next_step text,
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  case_id uuid references public.cases(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  area text not null,
  document_type text,
  drive_url text,
  analysis_status text not null default 'Nicht analysiert',
  uploaded_at timestamptz not null default now()
);

create table if not exists public.deadlines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  case_id uuid references public.cases(id) on delete cascade,
  title text not null,
  area text not null,
  due_date date not null,
  reminder_days integer not null default 7,
  status text not null default 'Offen',
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  case_id uuid references public.cases(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  title text not null,
  area text not null,
  due_date date,
  priority text not null default 'medium',
  status text not null default 'Offen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  object_type text not null,
  object_id uuid,
  area text,
  details text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.documents enable row level security;
alter table public.deadlines enable row level security;
alter table public.tasks enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
security definer
stable
as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "tenant_case_access"
on public.cases for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "tenant_document_access"
on public.documents for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "tenant_deadline_access"
on public.deadlines for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "tenant_task_access"
on public.tasks for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "tenant_audit_select"
on public.audit_log for select
using (tenant_id = public.current_tenant_id());
