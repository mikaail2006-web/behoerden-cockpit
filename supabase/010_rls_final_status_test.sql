-- Behoerden-Cockpit final RLS status test
-- Kompakte Ausgabe fuer Supabase SQL Editor: Rolle, Fremdzugriff, Status.

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

create temporary table if not exists rls_final_results (
  test_role text,
  foreign_cases_visible integer,
  rls_status text
) on commit preserve rows;

truncate table rls_final_results;
grant insert on rls_final_results to authenticated;

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'a0000000-0000-4000-9000-000000000001';
insert into rls_final_results
select
  'admin',
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002'),
  case
    when public.current_user_role() = 'admin'
      and public.current_tenant_id() = 'b0000000-0000-4000-9000-000000000001'
      and (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002') = 0
    then 'bestanden'
    else 'pruefen'
  end;
commit;

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'b0000000-0000-4000-9000-000000000002';
insert into rls_final_results
select
  'bearbeiter',
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002'),
  case
    when public.current_user_role() = 'bearbeiter'
      and public.current_tenant_id() = 'b0000000-0000-4000-9000-000000000001'
      and (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002') = 0
    then 'bestanden'
    else 'pruefen'
  end;
commit;

begin;
set local role authenticated;
set local request.jwt.claim.sub = 'c0000000-0000-4000-9000-000000000001';
insert into rls_final_results
select
  'kunde',
  (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002'),
  case
    when public.current_user_role() = 'kunde'
      and public.current_tenant_id() = 'b0000000-0000-4000-9000-000000000001'
      and (select count(*) from public.cases where tenant_id = 'f0000000-0000-4000-9000-000000000002') = 0
    then 'bestanden'
    else 'pruefen'
  end;
commit;

delete from public.cases
where id = 'f0000000-0000-4000-9000-000000000001';

select test_role, foreign_cases_visible, rls_status
from rls_final_results
order by test_role;
