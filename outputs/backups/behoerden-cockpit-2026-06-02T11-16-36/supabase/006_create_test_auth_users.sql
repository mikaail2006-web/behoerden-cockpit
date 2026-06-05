-- Behoerden-Cockpit test auth users
-- Nur fuer das Supabase-Testprojekt verwenden.
-- Testpasswort fuer alle drei Nutzer: Bhc-Test-2026!

do $$
declare
  tenant_id uuid := 'b0000000-0000-4000-9000-000000000001';
  admin_id uuid := 'a0000000-0000-4000-9000-000000000001';
  bearbeiter_id uuid := 'b0000000-0000-4000-9000-000000000002';
  kunde_id uuid := 'c0000000-0000-4000-9000-000000000001';
  test_password text := 'Bhc-Test-2026!';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    created_at,
    updated_at
  )
  values
    (
      '00000000-0000-0000-0000-000000000000',
      admin_id,
      'authenticated',
      'authenticated',
      'admin-test@example.de',
      crypt(test_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Admin Test"}'::jsonb,
      false,
      false,
      '',
      '',
      '',
      '',
      now(),
      now()
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      bearbeiter_id,
      'authenticated',
      'authenticated',
      'bearbeiter-test@example.de',
      crypt(test_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Bearbeiter Test"}'::jsonb,
      false,
      false,
      '',
      '',
      '',
      '',
      now(),
      now()
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      kunde_id,
      'authenticated',
      'authenticated',
      'kunde-test@example.de',
      crypt(test_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Kunde Test"}'::jsonb,
      false,
      false,
      '',
      '',
      '',
      '',
      now(),
      now()
    )
  on conflict (id) do update
  set
    email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    confirmation_token = excluded.confirmation_token,
    recovery_token = excluded.recovery_token,
    email_change_token_new = excluded.email_change_token_new,
    email_change = excluded.email_change,
    updated_at = now();

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values
    (
      gen_random_uuid(),
      admin_id,
      admin_id::text,
      jsonb_build_object('sub', admin_id::text, 'email', 'admin-test@example.de', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    ),
    (
      gen_random_uuid(),
      bearbeiter_id,
      bearbeiter_id::text,
      jsonb_build_object('sub', bearbeiter_id::text, 'email', 'bearbeiter-test@example.de', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    ),
    (
      gen_random_uuid(),
      kunde_id,
      kunde_id::text,
      jsonb_build_object('sub', kunde_id::text, 'email', 'kunde-test@example.de', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    )
  on conflict (provider, provider_id) do update
  set
    user_id = excluded.user_id,
    identity_data = excluded.identity_data,
    updated_at = now();

  insert into public.profiles (id, tenant_id, full_name, role)
  values
    (admin_id, tenant_id, 'Admin Test', 'admin'),
    (bearbeiter_id, tenant_id, 'Bearbeiter Test', 'bearbeiter'),
    (kunde_id, tenant_id, 'Kunde Test', 'kunde')
  on conflict (id) do update
  set
    tenant_id = excluded.tenant_id,
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = now();
end $$;

select
  p.role,
  p.full_name,
  u.email,
  p.tenant_id,
  p.id as auth_user_id
from public.profiles p
join auth.users u on u.id = p.id
where u.email in (
  'admin-test@example.de',
  'bearbeiter-test@example.de',
  'kunde-test@example.de'
)
order by p.role;
