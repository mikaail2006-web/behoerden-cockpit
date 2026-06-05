-- Behoerden-Cockpit RLS smoke test with simulated Supabase JWT claims
-- Nach 006_create_test_auth_users.sql und 007_create_rls_test_data.sql ausfuehren.

insert into public.cases (
  id,
  tenant_id,
  owner_id,
  area,
  authority,
  status,
  priority,
  next_step,
  progress
)
values (
  'f0000000-0000-4000-9000-000000000001',
  'f0000000-0000-4000-9000-000000000002',
  null,
  'RLS-Test',
  'Fremder Mandant',
  'Offen',
  'low',
  'Darf fuer Testnutzer nicht sichtbar sein',
  0
)
on conflict (id) do update
set
  tenant_id = excluded.tenant_id,
  next_step = excluded.next_step,
  updated_at = now();

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'a0000000-0000-4000-9000-000000000001';

select
  'admin' as test_role,
  auth.uid() as current_user_id,
  public.current_user_role() as current_role,
  public.current_tenant_id() as current_tenant_id,
  (select count(*) from public.cases) as visible_cases,
  (select count(*) from public.documents) as visible_documents,
  (select count(*) from public.deadlines) as visible_deadlines,
  (select count(*) from public.tasks) as visible_tasks,
  (select count(*) from public.audit_log) as visible_audit_log,
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002') as foreign_cases_visible;
rollback;

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'b0000000-0000-4000-9000-000000000002';

select
  'bearbeiter' as test_role,
  auth.uid() as current_user_id,
  public.current_user_role() as current_role,
  public.current_tenant_id() as current_tenant_id,
  (select count(*) from public.cases) as visible_cases,
  (select count(*) from public.documents) as visible_documents,
  (select count(*) from public.deadlines) as visible_deadlines,
  (select count(*) from public.tasks) as visible_tasks,
  (select count(*) from public.audit_log) as visible_audit_log,
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002') as foreign_cases_visible;
rollback;

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'c0000000-0000-4000-9000-000000000001';

select
  'kunde' as test_role,
  auth.uid() as current_user_id,
  public.current_user_role() as current_role,
  public.current_tenant_id() as current_tenant_id,
  (select count(*) from public.cases) as visible_cases,
  (select count(*) from public.documents) as visible_documents,
  (select count(*) from public.deadlines) as visible_deadlines,
  (select count(*) from public.tasks) as visible_tasks,
  (select count(*) from public.audit_log) as visible_audit_log,
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002') as foreign_cases_visible;
rollback;

delete from public.cases
where id = 'f0000000-0000-4000-9000-000000000001';

select 'Erwartung' as pruefung, 'foreign_cases_visible muss bei admin, bearbeiter und kunde jeweils 0 sein' as details;
