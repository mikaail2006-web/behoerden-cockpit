-- Beispielwerte fuer Rollen und Testverstaendnis.
-- Hinweis: Echte profile.id-Werte muessen aus auth.users stammen.

-- Rollenmodell als Referenz fuer App und Doku.
create table if not exists public.role_permissions (
  role text not null,
  permission text not null,
  allowed boolean not null default false,
  primary key (role, permission),
  check (role in ('admin', 'bearbeiter', 'kunde'))
);

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

-- Beispielabfrage:
-- select * from public.role_permissions where role = 'kunde';
