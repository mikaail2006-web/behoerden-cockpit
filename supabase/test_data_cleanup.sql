-- Behoerden-Cockpit Testdaten aufraeumen
-- Entfernt nur die Datensaetze aus supabase/test_data_template.sql im aktuellen Mandanten.

delete from public.audit_log
where tenant_id = public.current_tenant_id()
  and details = 'Supabase RLS-Testdaten fuer Behoerden-Cockpit.';

delete from public.tasks
where tenant_id = public.current_tenant_id()
  and title = 'Testaufgabe Nachweis pruefen'
  and area = 'EM-Rente';

delete from public.deadlines
where tenant_id = public.current_tenant_id()
  and title = 'Testfrist Bescheid pruefen'
  and area = 'EM-Rente';

delete from public.documents
where tenant_id = public.current_tenant_id()
  and name = '2026-06-01_EM-Rente_Testbescheid_Murat-Kocyigit.pdf';

delete from public.cases
where tenant_id = public.current_tenant_id()
  and authority = 'Deutsche Rentenversicherung Test'
  and next_step = 'RLS-Testdaten pruefen';

select 'cases' as table_name, count(*) as visible_rows from public.cases
union all
select 'documents', count(*) from public.documents
union all
select 'deadlines', count(*) from public.deadlines
union all
select 'tasks', count(*) from public.tasks
union all
select 'audit_log', count(*) from public.audit_log;
