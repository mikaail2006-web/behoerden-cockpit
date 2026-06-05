-- Behoerden-Cockpit Testdaten
-- Diese Datei nach test_profiles_template.sql ausfuehren.
-- Voraussetzung: Du bist als Testnutzer eingeloggt oder auth.uid() ist im SQL-Kontext gesetzt.
-- Die Datei legt Vorgang, Dokument, Frist, Aufgabe und Audit-Eintrag in einem Lauf an.

with test_case as (
  insert into public.cases (tenant_id, owner_id, area, authority, status, priority, next_step, progress)
  values (
    public.current_tenant_id(),
    auth.uid(),
    'EM-Rente',
    'Deutsche Rentenversicherung Test',
    'Offen',
    'medium',
    'RLS-Testdaten pruefen',
    15
  )
  returning id, tenant_id
),
test_document as (
  insert into public.documents (tenant_id, case_id, owner_id, name, area, document_type, drive_url, analysis_status)
  select
    tenant_id,
    id,
    auth.uid(),
    '2026-06-01_EM-Rente_Testbescheid_Murat-Kocyigit.pdf',
    'EM-Rente',
    'Bescheid',
    'https://drive.google.com/test',
    'Testdaten'
  from test_case
  returning id
),
test_deadline as (
  insert into public.deadlines (tenant_id, case_id, title, area, due_date, reminder_days, status, next_step)
  select
    tenant_id,
    id,
    'Testfrist Bescheid pruefen',
    'EM-Rente',
    current_date + 14,
    7,
    'Offen',
    'Bescheid gegenpruefen'
  from test_case
  returning id
),
test_task as (
  insert into public.tasks (tenant_id, case_id, assigned_to, title, area, due_date, priority, status)
  select
    tenant_id,
    id,
    auth.uid(),
    'Testaufgabe Nachweis pruefen',
    'EM-Rente',
    current_date + 7,
    'medium',
    'Offen'
  from test_case
  returning id
),
test_audit as (
  insert into public.audit_log (tenant_id, actor_id, action, object_type, object_id, area, details)
  select
    tenant_id,
    auth.uid(),
    'Testdaten angelegt',
    'case',
    id,
    'EM-Rente',
    'Supabase RLS-Testdaten fuer Behoerden-Cockpit.'
  from test_case
  returning id
)
select
  (select id from test_case) as test_case_id,
  (select id from test_document) as test_document_id,
  (select id from test_deadline) as test_deadline_id,
  (select id from test_task) as test_task_id,
  (select id from test_audit) as test_audit_id;

select 'cases' as table_name, count(*) as visible_rows from public.cases
union all
select 'documents', count(*) from public.documents
union all
select 'deadlines', count(*) from public.deadlines
union all
select 'tasks', count(*) from public.tasks
union all
select 'audit_log', count(*) from public.audit_log;
