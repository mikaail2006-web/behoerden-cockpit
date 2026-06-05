-- Behoerden-Cockpit security advisor fix
-- Nach dem ersten Supabase-Setup ausfuehren, wenn der Advisor RLS-Warnungen zeigt.

alter table if exists public.role_permissions enable row level security;

drop policy if exists "role_permissions_read_authenticated" on public.role_permissions;

create policy "role_permissions_read_authenticated"
on public.role_permissions for select
using (auth.uid() is not null);

do $$
begin
  if to_regclass('public.fristen') is not null then
    execute 'alter table public.fristen enable row level security';
  end if;
end $$;
