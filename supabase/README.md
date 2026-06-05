# Supabase Portal Setup

Diese Dateien bereiten das Behörden-Cockpit für ein echtes Portal mit Supabase Auth vor.

Die Schritt-fuer-Schritt-Anleitung fuer das Testprojekt liegt in `docs/supabase-testprojekt-runbook.md`.

## Reihenfolge

Einfachste Variante:

1. `000_combined_portal_setup.sql`

Oder einzeln:

1. `001_portal_schema.sql`
2. `002_storage_policies.sql`
3. `003_seed_roles_examples.sql`
4. `005_security_advisor_fix.sql` falls der Supabase Advisor RLS-Warnungen zeigt
5. `004_rls_test_queries.sql` als Pruefung mit Admin, Bearbeiter und Kunde

## Rollen

- `admin`: Vollzugriff, Nutzer, Automationen und Datenquellen
- `bearbeiter`: Vorgänge, Dokumente, Fristen und Aufgaben pflegen
- `kunde`: eigene Dokumente hochladen, eigene Aufgaben und Vorgänge sehen

Die Datei `003_seed_roles_examples.sql` legt zusätzlich eine Referenztabelle `role_permissions` für die Rechte-Matrix an.
Die Datei `005_security_advisor_fix.sql` aktiviert RLS fuer die Rechte-Matrix und eine eventuell vorhandene alte `fristen`-Tabelle.
Die Datei `004_rls_test_queries.sql` ist keine Migration, sondern ein Testlauf fuer Row-Level-Security und Storage-Zugriff.
Die Datei `test_profiles_template.sql` ist eine Vorlage fuer die drei Supabase-Auth-Testnutzer.
Die Datei `006_create_test_auth_users.sql` legt drei bestaetigte Testnutzer direkt per SQL an, falls der Dashboard-Dialog nicht nutzbar ist.
Die Datei `007_create_rls_test_data.sql` legt Testvorgang, Dokument, Frist, Aufgabe und Audit-Eintrag mit festen Testnutzer-IDs an.
Die Datei `008_rls_claims_smoke_test.sql` prueft RLS im SQL Editor mit simulierten Supabase-JWT-Claims.
Die Datei `009_rls_claims_summary_test.sql` gibt den RLS-Smoke-Test fuer alle drei Rollen in einer Ergebnistabelle aus.
Die Datei `010_rls_final_status_test.sql` gibt nur Rolle, Fremdzugriff und Status aus und ist die finale kompakte RLS-Pruefung.
Die Datei `011_fix_test_auth_login_tokens.sql` repariert Auth-Testnutzer, falls der Login mit `Database error querying schema` fehlschlaegt.
Die Datei `test_data_template.sql` legt Testvorgang, Dokument, Frist, Aufgabe und Audit-Eintrag an.
Die Datei `test_data_cleanup.sql` entfernt diese Testdaten wieder aus dem aktuellen Mandanten.

Die API-seitige Rollenmatrix liegt zusätzlich in `api/portal-permissions.json`.

## Storage-Pfad

Der Bucket heißt:

```text
behoerden-documents
```

Dateien sollten tenantbasiert abgelegt werden:

```text
{tenant_id}/{case_id}/{dateiname}
```

Beispiel:

```text
7d4.../EMR-2026-001/2026-06-01_EM-Rente_Bescheid_Murat-Kocyigit.pdf
```

## Wichtig

Die lokale PIN in der App schützt nur diese lokale Browser-Sitzung. Für ein öffentliches Portal müssen Supabase Auth, RLS und geschützte Server-Endpunkte genutzt werden.
