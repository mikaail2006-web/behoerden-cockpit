# Portal Produktivstart Checkliste

## Auth und Rollen

- Supabase-Testprojekt nach `docs/supabase-testprojekt-runbook.md` vorbereitet
- Supabase Auth aktiviert
- Admin-Konto angelegt
- Bearbeiter-Konto angelegt
- Kundenrolle getestet
- Passwort-Reset getestet
- Row-Level-Security fuer alle Portal-Tabellen aktiv
- RLS-Test mit `supabase/004_rls_test_queries.sql` fuer Admin, Bearbeiter und Kunde bestanden

## Daten

- Tabellenmigrationen ausgefuehrt
- Storage-Bucket `behoerden-documents` privat
- Tenant-Pfade getestet
- Beispielkunde kann nur eigene Daten sehen
- Fremder `tenant_id` kann weder gelesen noch geschrieben werden
- Audit-Log schreibt bei Upload, Aenderung und Erinnerung

## Upload und Automationen

- Upload-Endpunkt serverseitig geschuetzt
- n8n Token nicht im Browser sichtbar
- OCR/KI-Workflow mit Testdokument erfolgreich
- Fristen werden nach Analyse korrekt angelegt
- Aufgaben werden nach Analyse korrekt angelegt

## Kommunikation

- WhatsApp-Provider produktiv verbunden
- E-Mail-Absender verifiziert
- Erinnerungstexte geprueft
- Opt-in/Einwilligung dokumentiert

## Datenschutz

- Backup-Strategie geklaert
- Zugriff auf Drive/Supabase begrenzt
- Auftragsverarbeitung und Anbieter geprueft
- Export/Loeschprozess fuer Kundendaten definiert
