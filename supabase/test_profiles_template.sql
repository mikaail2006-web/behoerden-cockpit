-- Behoerden-Cockpit Testprofile
-- Diese Datei erst nach dem Anlegen der drei Supabase-Auth-Testnutzer verwenden.
-- Platzhalter AUTH_USER_ID_* durch die echten Werte aus auth.users ersetzen.

-- Variante A: Alle drei Testrollen im selben Mandanten testen.
-- Gut fuer Rollenvergleich innerhalb eines Kundenbestands.
with tenant as (
  select gen_random_uuid() as tenant_id
)
insert into public.profiles (id, tenant_id, full_name, role)
select 'AUTH_USER_ID_ADMIN'::uuid, tenant.tenant_id, 'Admin Test', 'admin' from tenant
union all
select 'AUTH_USER_ID_BEARBEITER'::uuid, tenant.tenant_id, 'Bearbeiter Test', 'bearbeiter' from tenant
union all
select 'AUTH_USER_ID_KUNDE'::uuid, tenant.tenant_id, 'Kunde Test', 'kunde' from tenant
on conflict (id) do update
set
  tenant_id = excluded.tenant_id,
  full_name = excluded.full_name,
  role = excluded.role,
  updated_at = now();

-- Variante B: Kunde in eigenem Mandanten testen.
-- Diese Variante nutzen, wenn gezielt Mandantentrennung geprueft werden soll.
-- Vorher Variante A auskommentieren.
/*
insert into public.profiles (id, tenant_id, full_name, role)
values
  ('AUTH_USER_ID_ADMIN'::uuid, gen_random_uuid(), 'Admin Test', 'admin'),
  ('AUTH_USER_ID_BEARBEITER'::uuid, gen_random_uuid(), 'Bearbeiter Test', 'bearbeiter'),
  ('AUTH_USER_ID_KUNDE'::uuid, gen_random_uuid(), 'Kunde Test', 'kunde')
on conflict (id) do update
set
  tenant_id = excluded.tenant_id,
  full_name = excluded.full_name,
  role = excluded.role,
  updated_at = now();
*/

select id, tenant_id, full_name, role
from public.profiles
where id in (
  'AUTH_USER_ID_ADMIN'::uuid,
  'AUTH_USER_ID_BEARBEITER'::uuid,
  'AUTH_USER_ID_KUNDE'::uuid
)
order by role;
