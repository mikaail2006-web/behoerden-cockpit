# Abnahmeprotokoll Behoerden-Cockpit

Dieses Protokoll vor echten sensiblen Daten, vor einer Uebergabe oder nach groesseren Aenderungen ausfuellen.

## Basis

- [ ] `Preflight-Echte-Daten.command` ausgefuehrt
- [ ] Preflight meldet `technische Checks bestanden`
- [ ] `Status-Behörden-Cockpit.command` ausgefuehrt
- [ ] Gesamtcheck meldet `cockpit checks ok`
- [ ] App startet ueber `Start-Behörden-Cockpit.command`
- [ ] PIN-Schutz ist aktiv
- [ ] PIN ist bekannt und sicher abgelegt

## Daten und Upload

- [ ] Datenquelle zeigt den erwarteten Status
- [ ] Testdokument mit unkritischen Daten hochgeladen
- [ ] automatische Dateibenennung korrekt
- [ ] Datei liegt im richtigen Google-Drive-Ordner
- [ ] Google Sheet enthaelt neuen Dokumente-Eintrag
- [ ] Audit-Log enthaelt Upload-Eintrag

## Fristen und Aufgaben

- [ ] erkannte Frist ist korrekt angelegt
- [ ] Aufgabe ist korrekt angelegt
- [ ] erledigt/nicht erledigt kann gespeichert werden
- [ ] Archivieren und Wiederherstellen funktioniert

## Portal und Supabase

- [ ] `docs/supabase-testprojekt-runbook.md` ausgefuehrt
- [ ] Admin-Testnutzer funktioniert
- [ ] Bearbeiter-Testnutzer funktioniert
- [ ] Kunden-Testnutzer funktioniert
- [ ] RLS-Test mit `supabase/004_rls_test_queries.sql` bestanden
- [ ] Testdaten mit `supabase/test_data_cleanup.sql` entfernt

## Sicherheit und Datenschutz

- [ ] keine echte `.env` im Projektordner
- [ ] `api/.env.example` enthaelt nur Platzhalter
- [ ] Drive-Freigaben geprueft
- [ ] Sheet-Freigaben geprueft
- [ ] n8n-Zugriff geprueft
- [ ] `docs/datenschutz-backup-loeschkonzept.md` gelesen

## Ergebnis

Abnahme am:

Verantwortlich:

Bemerkungen:
