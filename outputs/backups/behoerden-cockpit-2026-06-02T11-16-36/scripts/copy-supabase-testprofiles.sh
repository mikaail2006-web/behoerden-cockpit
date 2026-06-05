#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

UUID_RE='^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'

read -r -p "Admin Auth User ID: " ADMIN_ID
read -r -p "Bearbeiter Auth User ID: " BEARBEITER_ID
read -r -p "Kunde Auth User ID: " KUNDE_ID

for value in "$ADMIN_ID" "$BEARBEITER_ID" "$KUNDE_ID"; do
  if [[ ! "$value" =~ $UUID_RE ]]; then
    echo "Ungueltige UUID: $value"
    echo "Bitte die Auth User ID aus Supabase Auth > Users kopieren."
    exit 1
  fi
done

SQL=$(cat <<SQL
-- Behoerden-Cockpit Testprofile
-- Erst nach dem Anlegen der drei Supabase-Auth-Testnutzer ausfuehren.
-- Alle drei Rollen werden fuer den ersten Test im selben Mandanten angelegt.

with tenant as (
  select gen_random_uuid() as tenant_id
)
insert into public.profiles (id, tenant_id, full_name, role)
select '$ADMIN_ID'::uuid, tenant.tenant_id, 'Admin Test', 'admin' from tenant
union all
select '$BEARBEITER_ID'::uuid, tenant.tenant_id, 'Bearbeiter Test', 'bearbeiter' from tenant
union all
select '$KUNDE_ID'::uuid, tenant.tenant_id, 'Kunde Test', 'kunde' from tenant
on conflict (id) do update
set
  tenant_id = excluded.tenant_id,
  full_name = excluded.full_name,
  role = excluded.role,
  updated_at = now();

select id, tenant_id, full_name, role
from public.profiles
where id in (
  '$ADMIN_ID'::uuid,
  '$BEARBEITER_ID'::uuid,
  '$KUNDE_ID'::uuid
)
order by role;
SQL
)

if command -v pbcopy >/dev/null 2>&1; then
  printf "%s" "$SQL" | pbcopy
  echo
  echo "Testprofile-SQL wurde in die Zwischenablage kopiert."
  echo "Jetzt im Supabase SQL Editor einfuegen und ausfuehren."
else
  echo
  echo "$SQL"
fi
