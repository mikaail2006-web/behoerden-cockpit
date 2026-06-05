-- Behoerden-Cockpit combined portal setup
-- Diese Datei fasst die produktiven Setup-Schritte 001, 002 und 003 zusammen.
-- Danach separat ausfuehren:
-- - supabase/test_profiles_template.sql
-- - supabase/test_data_template.sql
-- - supabase/004_rls_test_queries.sql
-- - supabase/test_data_cleanup.sql

-- 001_portal_schema.sql

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

-- 002_storage_policies.sql

insert into storage.buckets (id, name, public)
values ('behoerden-documents', 'behoerden-documents', false)
on conflict (id) do nothing;

create policy "tenant_document_upload"
on storage.objects for insert
with check (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);

create policy "tenant_document_read"
on storage.objects for select
using (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);

create policy "tenant_document_update"
on storage.objects for update
using (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
)
with check (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);

create policy "tenant_document_delete_admin_only"
on storage.objects for delete
using (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and public.current_user_role() = 'admin'
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);

-- 003_seed_roles_examples.sql

create table if not exists public.role_permissions (
  role text not null,
  permission text not null,
  allowed boolean not null default false,
  primary key (role, permission),
  check (role in ('admin', 'bearbeiter', 'kunde'))
);

alter table public.role_permissions enable row level security;

create policy "role_permissions_read_authenticated"
on public.role_permissions for select
using (auth.uid() is not null);

insert into public.role_permissions (role, permission, allowed)
values
  ('admin', 'documents.upload', true),
  ('admin', 'deadlines.edit', true),
  ('admin', 'contacts.edit', true),
  ('admin', 'automations.edit', true),
  ('admin', 'tasks.view_own', true),
  ('bearbeiter', 'documents.upload', true),
  ('bearbeiter', 'deadlines.edit', true),
  ('bearbeiter', 'contacts.edit', true),
  ('bearbeiter', 'automations.edit', false),
  ('bearbeiter', 'tasks.view_own', true),
  ('kunde', 'documents.upload', true),
  ('kunde', 'deadlines.edit', false),
  ('kunde', 'contacts.edit', false),
  ('kunde', 'automations.edit', false),
  ('kunde', 'tasks.view_own', true)
on conflict (role, permission) do update
set allowed = excluded.allowed;
