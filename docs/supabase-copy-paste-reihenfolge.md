# Supabase Copy-Paste Reihenfolge

Diese Datei ist die kurze Reihenfolge fuer die Supabase SQL-Konsole.

## Migrationen

Einfachste Variante:

1. `Copy-Supabase-Setup.command` starten
2. Inhalt im Supabase SQL Editor einfuegen und ausfuehren

Die kopierte Datei ist:

1. `supabase/000_combined_portal_setup.sql`

Oder einzeln:

1. `supabase/001_portal_schema.sql`
2. `supabase/002_storage_policies.sql`
3. `supabase/003_seed_roles_examples.sql`

## Danach Testnutzer anlegen

In Supabase Auth:

1. Admin-Testnutzer
2. Bearbeiter-Testnutzer
3. Kunde-Testnutzer

Dann die drei `auth.users.id` Werte kopieren.
Nicht-geheime Projektwerte koennen in `docs/supabase-werte-vorlage.md` notiert werden.
Fuer die Profile kann `Copy-Supabase-Testprofile.command` genutzt werden.

## Profile und Testdaten

4. `supabase/test_profiles_template.sql`
   - Platzhalter `AUTH_USER_ID_ADMIN` ersetzen
   - Platzhalter `AUTH_USER_ID_BEARBEITER` ersetzen
   - Platzhalter `AUTH_USER_ID_KUNDE` ersetzen
   - einfacher: `Copy-Supabase-Testprofile.command` starten

5. `supabase/test_data_template.sql`
   - legt Testvorgang, Dokument, Frist, Aufgabe und Audit-Eintrag an
   - gibt erzeugte IDs aus
   - einfacher: `Copy-Supabase-Testdaten.command` starten

## RLS pruefen

6. `supabase/004_rls_test_queries.sql`
   - jeweils mit Admin, Bearbeiter und Kunde pruefen
   - fremde `tenant_id` darf nicht lesbar oder schreibbar sein
   - einfacher: `Copy-Supabase-RLS-Test.command` starten

## Aufraeumen

7. `supabase/test_data_cleanup.sql`
   - entfernt nur die Testdaten im aktuellen Mandanten
   - einfacher: `Copy-Supabase-Cleanup.command` starten

## Fertig, wenn

- Admin sieht erwartete Daten.
- Bearbeiter sieht erwartete Daten.
- Kunde sieht keine fremden Mandantendaten.
- Storage-Bucket `behoerden-documents` bleibt privat.
- Cleanup ist ausgefuehrt.
