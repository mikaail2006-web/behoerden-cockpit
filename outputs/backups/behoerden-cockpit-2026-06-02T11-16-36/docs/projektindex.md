# Projektindex Behoerden-Cockpit

Diese Datei ist die Landkarte fuer das Projekt.

## Start und Bedienung

| Datei | Zweck |
| --- | --- |
| `project-manifest.json` | maschinenlesbare Projektuebersicht |
| `docs/ampelstatus.md` | kurze Gruen/Gelb/Rot-Uebersicht |
| `docs/faq.md` | schnelle Antworten fuer typische Fragen |
| `docs/heute-starten.md` | kompakte Starter-Reihenfolge fuer heute |
| `docs/heute-tun.md` | konkrete Arbeitsliste fuer den naechsten Termin |
| `Heute-Starten.command` | zeigt die heutige Starter-Reihenfolge im Terminal |
| `docs/kommunikationsvorlagen.md` | Vorlagen fuer Behoerdenkommunikation |
| `docs/dokumenten-checklisten.md` | typische Unterlagen je Bereich |
| `docs/unkritischer-upload-test.md` | Checkliste fuer ersten ungefaehrlichen Upload-Test |
| `Start-Behörden-Cockpit.command` | lokale App und Upload-Bruecke starten |
| `Check-Behörden-Cockpit.command` | technischen Gesamtcheck ausfuehren |
| `Status-Behörden-Cockpit.command` | Statusbericht mit naechsten Schritten anzeigen |
| `Backup-Behörden-Cockpit.command` | lokales Backup-Paket ohne Secrets und Laufzeitdaten erstellen |
| `Start-Supabase-Vorbereitung.command` | Supabase-Setup-Dateien und Checks anzeigen |
| `Copy-Supabase-Setup.command` | Supabase-Gesamtsetup in die Zwischenablage kopieren |
| `Copy-Supabase-Testprofile.command` | Testprofil-SQL aus drei Auth User IDs erzeugen |
| `Copy-Supabase-Testdaten.command` | Testdaten-SQL in die Zwischenablage kopieren |
| `Copy-Supabase-RLS-Test.command` | RLS-Test-SQL in die Zwischenablage kopieren |
| `Copy-Supabase-Cleanup.command` | Testdaten-Cleanup in die Zwischenablage kopieren |
| `Copy-Portal-Env.command` | Portal-Env-Vorlage aus Supabase-Werten kopieren |
| `Check-Portal-Env.command` | Portal-Env-Werte pruefen ohne Speichern |
| `Start-Portal-Demo.command` | Portal-API-Demo starten |
| `Start-Portal-Demo-Supabase.command` | Portal-Demo mit Supabase URL und publishable public key starten |
| `Check-Portal-Demo.command` | Portal-Demo per HTTP-Smoke-Test pruefen |
| `Copy-Supabase-Access-Token.command` | Supabase Access Token temporaer in die Zwischenablage kopieren |
| `Check-Portal-Bearer.command` | Portal-API mit echtem Supabase Access Token pruefen |
| `docs/kurzanleitung.md` | kurzer Einstieg fuer Alltag und Tests |

Laufzeitdienste aus `project-manifest.json`:

- App: `http://127.0.0.1:4173/index.html`
- Upload-Bruecke: `http://127.0.0.1:4180/document-check`
- Portal-Demo: `http://127.0.0.1:4190/api/health`

## App

| Datei | Zweck |
| --- | --- |
| `app/index.html` | Oberflaeche |
| `app/app.js` | App-Logik |
| `app/styles.css` | Gestaltung |
| `app/config.js` | lokale Konfiguration |
| `app/cockpit-data.json` | lokale Fallback-Daten |

## Checks

| Datei | Zweck |
| --- | --- |
| `scripts/check-app-content.mjs` | prueft wichtige Setup-Texte im HTML |
| `scripts/check-cockpit.mjs` | Hauptcheck |
| `scripts/check-cockpit.sh` | Shell-Starter fuer Hauptcheck |
| `scripts/create-local-backup.mjs` | lokales Backup-Paket fuer Projektdateien erstellen |
| `scripts/check-backup-script.mjs` | Backup-Starter und Ausschlussregeln pruefen |
| `scripts/check-docs.mjs` | prueft Markdown-Dokumente |
| `scripts/check-file-references.mjs` | prueft Datei-Verweise in Doku und App |
| `scripts/check-manifest.mjs` | prueft Manifest-Dateiverweise |
| `scripts/check-next-steps.mjs` | prueft naechste Schritte gegen Manifest |
| `scripts/check-package-scripts.mjs` | prueft npm-Skripte |
| `scripts/check-supabase-setup.mjs` | Supabase- und Verweispruefung |
| `scripts/check-secrets.mjs` | einfacher Secret-Scan |
| `scripts/status-cockpit.mjs` | Statusbericht |
| `scripts/copy-supabase-setup.sh` | Supabase-Gesamtsetup fuer SQL Editor kopieren |
| `scripts/copy-supabase-testprofiles.sh` | Testprofil-SQL fuer drei Rollen kopieren |
| `scripts/copy-supabase-testdata.sh` | Testdaten-SQL fuer Supabase kopieren |
| `scripts/copy-supabase-rls-test.sh` | RLS-Test-SQL fuer Supabase kopieren |
| `scripts/copy-supabase-cleanup.sh` | Testdaten-Cleanup fuer Supabase kopieren |
| `scripts/copy-portal-env-template.sh` | Portal-Env-Vorlage erzeugen |
| `scripts/check-portal-env.sh` | Portal-Env-Werte im Terminal pruefen |
| `scripts/check-portal-demo.sh` | Portal-Demo-Smoke-Test starten |
| `scripts/check-portal-bearer.sh` | Bearer-Token-Test gegen Portal-API starten |
| `scripts/copy-supabase-access-token.sh` | Supabase Access Token temporaer holen |
| `scripts/start-portal-demo-configured.sh` | Portal-Demo mit Supabase-Werten starten |
| `scripts/heute-starten.sh` | heutige Starter-Reihenfolge im Terminal ausgeben |
| `scripts/start-supabase-vorbereitung.sh` | Supabase-Vorbereitung im Terminal |

## Portal-API

| Datei | Zweck |
| --- | --- |
| `api/README.md` | Uebersicht und naechste Backend-Schritte |
| `api/portal-openapi.yaml` | API-Vertrag |
| `api/portal-permissions.json` | Rollen- und Endpunktmatrix |
| `api/portal-access.mjs` | Rollenpruefung |
| `api/portal-context.mjs` | Request-Kontext aus Token, Profil und Rolle |
| `api/supabase-profile-loader.mjs` | Supabase Auth-Nutzer und Profil laden |
| `api/supabase-portal-repository.mjs` | Supabase REST-Zugriffe fuer Portal-Listen |
| `api/portal-env.mjs` | Env-Pruefung |
| `api/portal-server.example.mjs` | minimale Server-Demo |
| `api/.env.example` | Env-Vorlage ohne echte Secrets |
| `docs/portal-demo-testen.md` | lokale Demo-Endpunkte pruefen |
| `docs/portal-api-supabase-anbindung.md` | sicherer Weg von Supabase-Werten zur Portal-API |
| `docs/portal-env-pruefung.md` | Anleitung zur Env-Pruefung ohne gespeicherte Secrets |
| `docs/live-test-fehlerhilfe.md` | Hilfe bei Token-, RLS- und Portal-Live-Test-Problemen |
| `api/portal-server.smoke.test.mjs` | startet die Demo-API kurz und prueft HTTP-Endpunkte |

Wichtige Demo-Endpunkte:

- `GET /api/health`
- `GET /api/me`
- `GET /api/permissions`

## Supabase

| Datei | Zweck |
| --- | --- |
| `supabase/README.md` | Uebersicht der Supabase-Dateien und Reihenfolge |
| `docs/supabase-testprojekt-runbook.md` | Schrittfolge fuer Testprojekt |
| `docs/supabase-copy-paste-reihenfolge.md` | kurze SQL-Ausfuehrungsreihenfolge |
| `docs/supabase-werte-vorlage.md` | Vorlage fuer nicht-geheime Supabase-Werte |
| `docs/supabase-testprotokoll.md` | Abhakprotokoll fuer Supabase-Testlauf |
| `supabase/000_combined_portal_setup.sql` | kombinierte Setup-Datei fuer 001 bis 003 |
| `supabase/001_portal_schema.sql` | Tabellen, Funktionen und RLS |
| `supabase/002_storage_policies.sql` | Storage-Bucket und Policies |
| `supabase/003_seed_roles_examples.sql` | Rollen-Rechte-Matrix |
| `supabase/004_rls_test_queries.sql` | RLS-Pruefung |
| `supabase/test_profiles_template.sql` | Testnutzer-Profile |
| `supabase/test_data_template.sql` | Testdaten |
| `supabase/test_data_cleanup.sql` | Testdaten aufraeumen |

## Google und n8n

| Datei | Zweck |
| --- | --- |
| `n8n/README.md` | Uebersicht, Reihenfolge und Sicherheit fuer n8n |
| `google-apps-script/README.md` | Uebersicht fuer Google Drive/Sheets Setup |
| `google-apps-script/setup-behoerden-cockpit.gs` | Drive/Sheets Setup |
| `docs/google-apps-script-setup.md` | Anleitung Google Setup |
| `n8n/workflow-cockpit-daten-api-import.json` | Daten-API Workflow |
| `n8n/workflow-document-check-upload.json` | Upload Workflow |
| `n8n/workflow-ocr-ki-analyse.json` | OCR/KI Workflow |
| `n8n/workflow-fristen-whatsapp-erinnerung.json` | WhatsApp Fristenworkflow |

## Betrieb und Uebergabe

| Datei | Zweck |
| --- | --- |
| `docs/naechste-schritte.md` | priorisierte Aufgaben |
| `docs/gesamtstatus.md` | Gesamtstatus |
| `docs/echte-daten-starten.md` | letzte Checkliste vor echten sensiblen Dokumenten |
| `docs/security-status.md` | Sicherheitsstand fuer Secrets, RLS und echte Daten |
| `docs/production-readiness.md` | Mindestanforderungen vor echtem Portalbetrieb |
| `docs/fertigstellung.md` | Definition der Fertigstellungsstufen |
| `docs/pilotplan.md` | kontrollierte Pilotphase vor Produktivbetrieb |
| `docs/abnahmeprotokoll.md` | Abnahme vor echten Daten/Uebergabe |
| `docs/datenschutz-backup-loeschkonzept.md` | Datenschutz, Backup, Loeschung |
| `docs/betriebsuebergabe.md` | Uebergabeuebersicht |
| `docs/aenderungsverlauf.md` | Verlauf der wichtigsten Aenderungen |
