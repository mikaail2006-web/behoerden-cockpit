-- Behoerden-Cockpit RLS test queries
-- Diese Datei nach 001-003 in der Supabase SQL-Konsole nutzen.
-- Wichtig: Die Queries jeweils mit eingeloggtem Testnutzer ausfuehren:
-- 1. admin
-- 2. bearbeiter
-- 3. kunde

-- Aktuellen Portal-Kontext pruefen.
select
  auth.uid() as current_user_id,
  public.current_user_role() as current_role,
  public.current_tenant_id() as current_tenant_id;

-- Erwartung:
-- - current_user_id ist nicht leer
-- - current_role ist admin, bearbeiter oder kunde
-- - current_tenant_id ist nicht leer

-- Sichtbarkeit der eigenen Mandantendaten pruefen.
select 'profiles' as table_name, count(*) as visible_rows from public.profiles
union all
select 'cases', count(*) from public.cases
union all
select 'documents', count(*) from public.documents
union all
select 'deadlines', count(*) from public.deadlines
union all
select 'tasks', count(*) from public.tasks
union all
select 'audit_log', count(*) from public.audit_log;

-- Erwartung:
-- - admin/bearbeiter/kunde sehen nur Daten des eigenen tenant_id.
-- - profile-Sichtbarkeit: eigener Datensatz, admin zusaetzlich Profile je nach Policy.

-- Tenant-Leak-Test: Es duerfen keine fremden tenant_id sichtbar sein.
select distinct tenant_id from public.cases;
select distinct tenant_id from public.documents;
select distinct tenant_id from public.deadlines;
select distinct tenant_id from public.tasks;

-- Erwartung:
-- - Jede Abfrage liefert maximal eine tenant_id.
-- - Diese tenant_id entspricht public.current_tenant_id().

-- Schreibtest mit korrektem tenant_id.
-- Erwartung: insert funktioniert fuer Rollen, die Schreibrechte haben sollen.
insert into public.cases (tenant_id, owner_id, area, authority, status, priority, next_step, progress)
values (
  public.current_tenant_id(),
  auth.uid(),
  'EM-Rente',
  'Testbehoerde',
  'Offen',
  'low',
  'RLS-Testeintrag loeschen',
  5
)
returning id, tenant_id, area, status;

-- Schreibtest mit fremdem tenant_id.
-- Erwartung: Diese Abfrage MUSS fehlschlagen.
insert into public.cases (tenant_id, owner_id, area, authority, status, priority, next_step, progress)
values (
  gen_random_uuid(),
  auth.uid(),
  'RLS-Test',
  'Fremder Mandant',
  'Offen',
  'low',
  'Darf nicht gespeichert werden',
  0
);

-- Aufraeumen des erlaubten Testeintrags.
delete from public.cases
where tenant_id = public.current_tenant_id()
  and authority = 'Testbehoerde'
  and next_step = 'RLS-Testeintrag loeschen';

-- Storage-Test in Supabase UI/API:
-- 1. Datei in Bucket behoerden-documents hochladen:
--    {current_tenant_id}/RLS-TEST/test.pdf
-- 2. Zugriff mit eigenem Nutzer muss funktionieren.
-- 3. Zugriff auf {fremde_tenant_id}/RLS-TEST/test.pdf muss fehlschlagen.
