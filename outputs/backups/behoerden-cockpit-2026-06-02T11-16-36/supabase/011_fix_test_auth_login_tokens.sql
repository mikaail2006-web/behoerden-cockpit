-- Behoerden-Cockpit auth login token fix
-- Repariert per SQL angelegte Testnutzer, wenn Auth Login "Database error querying schema" meldet.

update auth.users
set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  updated_at = now()
where email in (
  'admin-test@example.de',
  'bearbeiter-test@example.de',
  'kunde-test@example.de'
);

select
  email,
  confirmation_token = '' as confirmation_token_ok,
  recovery_token = '' as recovery_token_ok,
  email_change_token_new = '' as email_change_token_new_ok,
  email_change = '' as email_change_ok
from auth.users
where email in (
  'admin-test@example.de',
  'bearbeiter-test@example.de',
  'kunde-test@example.de'
)
order by email;
