# Supabase-Testprojekt Runbook

Dieses Runbook beschreibt den naechsten technischen Schritt fuer das Behoerden-Cockpit: ein geschuetztes Portal-Testprojekt mit Supabase Auth, Datenbank, Storage und RLS-Pruefung.

Die reine Copy-Paste-Reihenfolge liegt in `docs/supabase-copy-paste-reihenfolge.md`.
Die Vorlage zum Notieren der nicht-geheimen Projektwerte liegt in `docs/supabase-werte-vorlage.md`.
Das Abhakprotokoll fuer den Testlauf liegt in `docs/supabase-testprotokoll.md`.

## Ziel

Nach diesem Schritt ist geprueft:

- Supabase Auth funktioniert.
- Admin, Bearbeiter und Kunde haben getrennte Rollen.
- Tabellen und Storage sind angelegt.
- Row-Level-Security verhindert fremde Mandantendaten.
- Die spaetere Portal-API kann auf echte Rollen und `tenant_id` aufbauen.

## 1. Projekt anlegen

1. Neues Supabase-Projekt anlegen.
2. Region passend auswaehlen.
3. Datenbankpasswort sicher speichern.
4. In `Authentication` den E-Mail-Login aktivieren.
5. In `Storage` sicherstellen, dass keine Buckets oeffentlich benoetigt werden.

## 2. SQL-Dateien ausfuehren

In der Supabase SQL-Konsole nacheinander ausfuehren:

Einfachste Variante:

1. `supabase/000_combined_portal_setup.sql`
2. Bei Advisor-Warnungen danach `supabase/005_security_advisor_fix.sql`

Oder einzeln:

1. `supabase/001_portal_schema.sql`
2. `supabase/002_storage_policies.sql`
3. `supabase/003_seed_roles_examples.sql`
4. Bei Advisor-Warnungen `supabase/005_security_advisor_fix.sql`

Danach noch nicht `004` als Migration ausfuehren. `004` ist nur fuer Tests.

## 3. Testnutzer erstellen

In Supabase Auth drei Testnutzer anlegen:

| Rolle | Zweck | Beispiel |
| --- | --- | --- |
| admin | Verwaltung und Vollzugriff | `admin-test@example.de` |
| bearbeiter | Fachbearbeitung | `bearbeiter-test@example.de` |
| kunde | Kundenportal | `kunde-test@example.de` |

Die E-Mail-Adressen koennen spaeter ersetzt werden. Fuer den ersten Test reichen technische Testkonten.

## 4. Profile setzen

Nach dem Anlegen der Auth-Nutzer die jeweilige `auth.users.id` kopieren und in `profiles` eintragen.
Als Vorlage kann `supabase/test_profiles_template.sql` genutzt werden.
Einfacher: `Copy-Supabase-Testprofile.command` starten, die drei Auth User IDs einfuegen und die erzeugte SQL im Supabase SQL Editor ausfuehren.
Wenn der Dashboard-Dialog `Add user` nicht funktioniert, kann stattdessen `supabase/006_create_test_auth_users.sql` im SQL Editor ausgefuehrt werden. Dieses Skript legt drei bestaetigte Testnutzer und die passenden Profile direkt an.
Falls der Passwort-Login danach `Database error querying schema` meldet, `supabase/011_fix_test_auth_login_tokens.sql` ausfuehren.

Beispiel:

```sql
insert into public.profiles (id, tenant_id, full_name, role)
values
  ('AUTH_USER_ID_ADMIN', gen_random_uuid(), 'Admin Test', 'admin'),
  ('AUTH_USER_ID_BEARBEITER', gen_random_uuid(), 'Bearbeiter Test', 'bearbeiter'),
  ('AUTH_USER_ID_KUNDE', gen_random_uuid(), 'Kunde Test', 'kunde');
```

Fuer echte Mandanten muessen Bearbeiter und Kunde nur dann denselben `tenant_id` teilen, wenn sie denselben Kundenbestand sehen sollen.

## 5. Testdaten anlegen

Mit Admin oder Bearbeiter einen Testvorgang anlegen:
Als Vorlage kann `supabase/test_data_template.sql` genutzt werden. Die Datei legt Vorgang, Dokument, Frist, Aufgabe und Audit-Eintrag in einem Lauf an und gibt die erzeugten IDs zur Kontrolle aus.
Einfacher: `Copy-Supabase-Testdaten.command` starten und die kopierte SQL als Admin oder Bearbeiter ausfuehren.
Wenn die Testnutzer ueber `supabase/006_create_test_auth_users.sql` angelegt wurden, kann fuer den ersten Datenlauf `supabase/007_create_rls_test_data.sql` direkt im SQL Editor ausgefuehrt werden.
Fuer einen SQL-Editor-Smoke-Test der Rollen kann danach `supabase/008_rls_claims_smoke_test.sql` ausgefuehrt werden.
Wenn Supabase nur das letzte Ergebnis anzeigt, stattdessen `supabase/009_rls_claims_summary_test.sql` ausfuehren. Diese Datei gibt Admin, Bearbeiter und Kunde in einer gemeinsamen Ergebnistabelle aus.
Falls die Ergebnistabelle horizontal abgeschnitten ist, `supabase/010_rls_final_status_test.sql` nutzen. Erwartung: `foreign_cases_visible = 0` und `rls_status = bestanden` fuer alle drei Rollen.

```sql
insert into public.cases (tenant_id, owner_id, area, authority, status, priority, next_step, progress)
values (
  public.current_tenant_id(),
  auth.uid(),
  'EM-Rente',
  'Testbehoerde',
  'Offen',
  'medium',
  'Portal-RLS testen',
  10
);
```

## 6. RLS pruefen

Die Datei `supabase/004_rls_test_queries.sql` jeweils mit diesen Rollen ausfuehren:
Einfacher: `Copy-Supabase-RLS-Test.command` starten und die SQL je Rolle einfuegen.

1. admin
2. bearbeiter
3. kunde

Erwartung:

- Jede Rolle sieht nur die eigene `tenant_id`.
- Fremde `tenant_id` kann nicht geschrieben werden.
- Kunde kann geschuetzte Admin-/Bearbeiterfunktionen nicht nutzen.
- Storage-Pfade funktionieren nur unter `{tenant_id}/...`.

## 7. Testdaten aufraeumen

Nach der Pruefung kann `supabase/test_data_cleanup.sql` ausgefuehrt werden. Die Datei entfernt nur die Testdaten aus `supabase/test_data_template.sql` im aktuellen Mandanten.
Einfacher: `Copy-Supabase-Cleanup.command` starten und die kopierte SQL ausfuehren.

## 8. Portal-Werte sichern

Diese Werte fuer die spaetere App-/API-Anbindung notieren:

- Supabase Project URL
- Supabase publishable public key
- Storage Bucket `behoerden-documents`
- Testnutzer-IDs
- Rollen und `tenant_id`

Keine Service-Role-Keys im Browser oder in lokalen App-Dateien speichern.

## Abnahmekriterium

Der Schritt ist fertig, wenn:

- `004_rls_test_queries.sql` fuer alle drei Rollen geprueft wurde.
- Fremde Mandantendaten nicht sichtbar sind.
- Der Bucket `behoerden-documents` privat bleibt.
- `docs/portal-produktivstart-checkliste.md` im Abschnitt Auth/Daten abgehakt werden kann.
