-- Behoerden-Cockpit RLS summary test with simulated Supabase JWT claims
-- Gibt Admin, Bearbeiter und Kunde in einer Ergebnistabelle aus.

create temporary table if not exists rls_smoke_results (
  test_role text,
  current_user_id uuid,
  portal_role text,
  current_tenant_id uuid,
  visible_cases integer,
  visible_documents integer,
  visible_deadlines integer,
  visible_tasks integer,
  visible_audit_log integer,
  foreign_cases_visible integer
) on commit preserve rows;

truncate table rls_smoke_results;
grant insert on rls_smoke_results to authenticated;

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
insert into rls_smoke_results
select
  'admin',
  auth.uid(),
  public.current_user_role(),
  public.current_tenant_id(),
  (select count(*) from public.cases),
  (select count(*) from public.documents),
  (select count(*) from public.deadlines),
  (select count(*) from public.tasks),
  (select count(*) from public.audit_log),
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002');
commit;

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'b0000000-0000-4000-9000-000000000002';
insert into rls_smoke_results
select
  'bearbeiter',
  auth.uid(),
  public.current_user_role(),
  public.current_tenant_id(),
  (select count(*) from public.cases),
  (select count(*) from public.documents),
  (select count(*) from public.deadlines),
  (select count(*) from public.tasks),
  (select count(*) from public.audit_log),
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002');
commit;

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'c0000000-0000-4000-9000-000000000001';
insert into rls_smoke_results
select
  'kunde',
  auth.uid(),
  public.current_user_role(),
  public.current_tenant_id(),
  (select count(*) from public.cases),
  (select count(*) from public.documents),
  (select count(*) from public.deadlines),
  (select count(*) from public.tasks),
  (select count(*) from public.audit_log),
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002');
commit;

delete from public.cases
where id = 'f0000000-0000-4000-9000-000000000001';

select
  *,
  case
    when portal_role = test_role
      and current_tenant_id = 'b0000000-0000-4000-9000-000000000001'
      and foreign_cases_visible = 0
    then 'bestanden'
    else 'pruefen'
  end as rls_status
from rls_smoke_results
order by test_role;
