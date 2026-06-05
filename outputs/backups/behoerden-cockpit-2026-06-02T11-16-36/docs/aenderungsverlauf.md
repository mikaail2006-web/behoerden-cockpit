# Aenderungsverlauf

## 2026-06-01

### App und lokale Bedienung

- lokale Starter sichtbar im Setup-Bereich ergaenzt
- Supabase-Vorbereitungsstarter ergaenzt
- Setup-Sichtcheck fuer wichtige App-Texte als Check ergaenzt
- Statusbericht per `Status-Behörden-Cockpit.command` ergaenzt
- Check per `Check-Behörden-Cockpit.command` erweitert
- Kurzanleitung unter `docs/kurzanleitung.md` ergaenzt
- Checkliste fuer den Start mit echten Daten ergaenzt
- priorisierte Aufgabenliste unter `docs/naechste-schritte.md` ergaenzt
- Abnahmeprotokoll unter `docs/abnahmeprotokoll.md` ergaenzt

### Portal und Supabase

- kombinierte Supabase-Gesamtdatei `supabase/000_combined_portal_setup.sql` ergaenzt
- Starter `Copy-Supabase-Setup.command` fuer SQL-Zwischenablage ergaenzt
- Starter `Copy-Supabase-Testprofile.command` fuer Rollen-Testprofile ergaenzt
- Starter `Copy-Supabase-Testdaten.command` fuer Testdaten ergaenzt
- Starter fuer RLS-Test und Testdaten-Cleanup ergaenzt
- Supabase-Testlauf als klare Reihenfolge im Setup-Bereich sichtbar gemacht
- Supabase-Testprotokoll fuer den 5-Schritte-Durchlauf ergaenzt
- Portal-Env-Starter und Anleitung zur Supabase-Anbindung ergaenzt
- Portal-Env-Pruefung ohne Speichern echter Secrets ergaenzt
- Portal-Kontextmodul fuer Bearer Token, Profil und Rollenpruefung ergaenzt
- Supabase-Profil-Loader fuer Auth-Nutzer und `public.profiles` ergaenzt
- Portal-Demo auf Demo-Kontext und optionalen Supabase-Bearer-Kontext vorbereitet
- Supabase-Repository fuer Portal-Listen-Endpunkte ergaenzt
- Supabase-Repository um sichere Update-Methoden fuer Vorgaenge, Fristen und Aufgaben ergaenzt
- Portal-Demo-Listenrouten mit Supabase-Repository und Demo-Fallback verbunden
- Portal-Demo-PATCH-Routen fuer Vorgaenge, Fristen und Aufgaben ergaenzt
- Portal-Demo Fehlerbehandlung fuer JSON-, Repository- und Routenfehler gehaertet
- Portal-Demo Smoke-Test fuer echte HTTP-Endpunkte ergaenzt
- Starter `Check-Portal-Demo.command` fuer gezielten Smoke-Test ergaenzt
- Projektstatus und naechste Schritte auf Portal-API-Demo-Stand aktualisiert
- Starter `Check-Portal-Bearer.command` fuer echten Supabase Access Token Test ergaenzt
- Starter `Copy-Supabase-Access-Token.command` fuer temporaere Token-Abholung ergaenzt
- Starter `Start-Portal-Demo-Supabase.command` fuer konfigurierte Supabase-Demo ohne gespeicherte `.env` ergaenzt
- Portal Live-Test als eigene Reihenfolge im Setup-Bereich ergaenzt
- Fertigstellungsdefinition mit Stufen lokal, Testbetrieb, echte Daten und Produktiv/SaaS ergaenzt
- Statusbericht zeigt Fertigstellungsstufen und naechsten fehlenden Meilenstein
- Tagesliste fuer 2026-06-02 auf Supabase Live-Test und Portal-Bearer-Test aktualisiert
- kompakte Starter-Reihenfolge `docs/heute-starten.md` ergaenzt
- Starter `Heute-Starten.command` fuer die Tagesreihenfolge ergaenzt
- Live-Test Fehlerhilfe fuer Token-, RLS- und Portal-Probleme ergaenzt
- Statusbericht verweist auf Tagesstart und Live-Test Fehlerhilfe
- Checkliste `docs/unkritischer-upload-test.md` fuer ersten ungefaehrlichen Upload-Test ergaenzt
- Supabase-Runbook fuer Testprojekt ergaenzt
- Testprofil-Vorlage ergaenzt
- Testdaten-Vorlage ohne manuelle Case-ID ergaenzt
- Testdaten-Cleanup ergaenzt
- RLS-Testdatei ergaenzt
- OpenAPI-Vertrag fuer Portal-API ergaenzt
- Rollen- und Endpunktmatrix ergaenzt
- Zugriffshilfe fuer Portalrollen ergaenzt
- Env-Pruefung fuer Portal-API ergaenzt
- Demo-Server fuer Portal-API ergaenzt
- App zeigt jetzt im Portalbereich die naechsten 6 Punkte fuer Supabase-Test, RLS-Pruefung, Portal-Live-Test und unkritischen Upload-Test
- Supabase Security-Advisor-Fix fuer `role_permissions` und vorhandene `fristen`-Tabelle ergaenzt
- Supabase-Grundsetup und Security-Advisor-Fix im Testprojekt `szopcvtlzxbfwfhazhnc` erfolgreich ausgefuehrt
- SQL-Fallback zum Anlegen der drei Supabase-Testnutzer samt Profilrollen ergaenzt
- SQL-Fallback fuer RLS-Testdaten mit festen Testnutzer-IDs ergaenzt
- SQL-Smoke-Test fuer RLS mit simulierten Supabase-JWT-Claims ergaenzt
- RLS-Summary-Test ergaenzt, der Admin, Bearbeiter und Kunde in einer Ergebnistabelle ausgibt
- Kompakter finaler RLS-Status-Test fuer Supabase SQL Editor ergaenzt
- Supabase-RLS-Test fuer Admin, Bearbeiter und Kunde bestanden: `foreign_cases_visible = 0`, `rls_status = bestanden`
- Portal-Supabase-Startertexte auf neuen Supabase `publishable public key` angepasst
- Auth-Login-Reparatur fuer per SQL angelegte Supabase-Testnutzer ergaenzt
- Portal-API mit echtem Supabase Admin-Token getestet: `/api/me` und Listen-Endpunkte liefern Status 200
- Portal-API Schreibtest bestanden: PATCH fuer Vorgang, Frist und Aufgabe gegen Supabase-Testdaten erfolgreich
- Echte Upload-Strecke mit unkritischer Test-PDF bestanden: Drive-Ablage `01_EM-Rente/04_Bescheide`, Sheet-Sync und automatische Risiko-/Fristerkennung erfolgreich
- Lokale OCR/KI-Regeln erweitert: konkrete Fristdaten, Behoerdennamen, Aktenzeichen und kritische Eskalationssignale werden erkannt
- KI/OCR-Regeltest mit unkritischer Test-PDF bestanden: Frist `2026-07-15`, Behoerde `Deutsche Rentenversicherung`, Aktenzeichen `DRV-TEST-2026-42`
- WhatsApp-Reminder-Workflow gehaertet: Telefonnummernvalidierung, optionaler Opt-in-Check, Duplikatschutz ueber `LetzteErinnerung`, ueberfaellige Fristen als `critical`
- Lokaler Test `scripts/check-whatsapp-reminders.mjs` fuer die WhatsApp-Filterlogik ergaenzt
- n8n-Workflow-Check ergaenzt, damit alte WhatsApp-Platzhalter und fehlende Credential-/Template-Teile auffallen
- Preflight fuer echte Daten ergaenzt: prueft Projektstatus, Secret-Scan, Supabase-Testprotokoll, unkritischen Upload-Test und Gesamtcheck
- In-App-Preflight-Checkliste im Setup-Bereich ergaenzt, inklusive lokal gespeicherter Punkte und Reset-Schalter
- Dashboard-Kachel `Echte Daten` ergaenzt, die den Preflight-Stand mit Sprung in den Setup-Bereich zeigt
- Upload-Bereich um Preflight-Status und dynamischen Buttontext erweitert
- Upload bei offenem Preflight mit Bestaetigungsabfrage abgesichert
- Audit-Eintrag fuer Uploads trotz offenem Preflight ergaenzt
- Upload-Preflight-Hinweis klickbar gemacht, damit direkt die Setup-Checkliste geoeffnet wird
- Gefuehrte Upload-Kontrolle `Erstes echtes Dokument` ergaenzt: Dateiname/Bereich, Upload/Analyse, Pruefergebnis, Frist/Aufgabe und Drive/Sheet koennen einzeln bestaetigt werden
- Betriebsroutine im Setup-Bereich ergaenzt: Sheet-Backup, n8n-Export, Drive-Freigaben, Audit-Log und Loeschregel koennen abgehakt werden
- Betriebsroutine um Wiederherstellungstest erweitert, damit Backups nicht nur erstellt, sondern auch geprueft werden
- Dashboard-Kachel `Betrieb` ergaenzt, damit Backup-/Restore-Stand direkt auf der Startseite sichtbar ist
- Starter `Backup-Behörden-Cockpit.command` und Script `scripts/create-local-backup.mjs` ergaenzt, um ein lokales Projekt-Backup ohne Secrets und Laufzeitdaten zu erstellen

### Sicherheit und Betrieb

- `.gitignore` fuer echte `.env`-Dateien, Logs und lokale Laufzeitdaten ergaenzt
- Secret-Scan in den Gesamtcheck aufgenommen
- Datenschutz-, Backup- und Loeschkonzept ergaenzt
- Env-Vorlage `api/.env.example` ergaenzt

### Aktueller Checkstand

```text
portal-access tests ok
portal-env tests ok
portal-contract tests ok
portal-server tests ok
supabase setup checks ok
secret checks ok
cockpit checks ok
```
