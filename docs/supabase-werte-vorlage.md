# Supabase Werte Vorlage

Diese Vorlage hilft beim Einrichten des Testprojekts. Keine geheimen Server-Schluessel in diese Datei eintragen.

## Projekt

| Wert | Eintrag |
| --- | --- |
| Project URL | `https://...supabase.co` |
| Project Ref | `...` |
| Region | `...` |
| Storage Bucket | `behoerden-documents` |

## Public Client Werte

| Wert | Eintrag |
| --- | --- |
| Supabase publishable public key | `...` |
| Erlaubter App-Ursprung | `http://127.0.0.1:4173` |

## Server Only

| Wert | Regel |
| --- | --- |
| Service Role Key | nur serverseitig in echter `.env`, nicht hier eintragen |
| n8n Tokens | nur in n8n Credentials oder serverseitiger `.env` |
| Google Secrets | nicht in App, Sheet oder Doku eintragen |

## Testnutzer

| Rolle | E-Mail | Auth User ID | Tenant ID |
| --- | --- | --- | --- |
| admin | `admin-test@example.de` | `...` | `...` |
| bearbeiter | `bearbeiter-test@example.de` | `...` | `...` |
| kunde | `kunde-test@example.de` | `...` | `...` |

## Nach dem Eintragen pruefen

- `supabase/test_profiles_template.sql` mit den Auth User IDs aktualisieren
- `supabase/test_data_template.sql` ausfuehren
- `supabase/004_rls_test_queries.sql` mit allen Rollen pruefen
- `supabase/test_data_cleanup.sql` nach dem Test ausfuehren
