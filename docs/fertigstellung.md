# Fertigstellung

Diese Datei definiert, wann die App als fertig gilt.

## Stufe 1: Lokal fertig

Status: erreicht

- [x] lokale App startet
- [x] PIN-Schutz vorhanden
- [x] Dokumentenpruefung und automatische Dateinamen vorbereitet
- [x] Fristen, Aufgaben, Listen, Archiv und Kontakte vorhanden
- [x] Gesamtcheck meldet `cockpit checks ok`
- [x] Secret-Check meldet `secret checks ok`

## Stufe 2: Testbetrieb mit unkritischen Daten

Status: erreicht

- [x] Supabase-Testprojekt angelegt
- [x] `supabase/000_combined_portal_setup.sql` ausgefuehrt
- [x] Admin-, Bearbeiter- und Kunden-Testnutzer angelegt
- [x] `Copy-Supabase-Testprofile.command` ausgefuehrt beziehungsweise SQL-Testprofile angelegt
- [x] `Copy-Supabase-Testdaten.command` ausgefuehrt beziehungsweise SQL-Testdaten angelegt
- [x] RLS-Test fuer Admin, Bearbeiter und Kunde bestanden
- [x] Portal-Demo mit Supabase-Testdaten gestartet und getestet
- [x] Supabase Access Token genutzt
- [x] Portal-API Read/Write-Test bestanden
- [x] Test mit unkritischem Dokument erfolgreich
- [x] lokale OCR/KI-Regeln mit unkritischem Dokument erfolgreich getestet
- [x] WhatsApp-Reminder-Logik lokal gehaertet und getestet

## Stufe 3: Bereit fuer echte sensible Daten

Status: naechster Meilenstein

- [ ] `docs/echte-daten-starten.md` vollstaendig abgehakt
- [ ] `docs/abnahmeprotokoll.md` ausgefuellt
- [ ] Drive-Freigaben geprueft
- [ ] Sheet-Freigaben geprueft
- [ ] n8n-Zugriff geprueft
- [ ] Backup- und Loeschprozess bestaetigt
- [ ] keine Service-Role-Keys in Browser, App, Sheet oder Doku
- [ ] erster echter Upload nur mit kontrolliertem Einzel-Dokument

## Stufe 4: Produktiv/SaaS bereit

Status: offen

- [ ] produktiver Server fuer Portal-API
- [ ] echtes Hosting mit HTTPS
- [ ] Supabase Auth produktiv konfiguriert
- [ ] Monitoring und Fehlerprotokollierung
- [ ] Backup/Restore getestet
- [ ] WhatsApp Provider produktiv verbunden
- [ ] KI/OCR produktiv angebunden
- [ ] Datenschutz/AVV final geprueft
- [ ] Rollen- und Mandantentrennung mit echten Sessions abgenommen

## Aktuelle Einschaetzung

Die lokale App, Supabase-Teststrecke, Portal-API, unkritische Upload-Strecke und lokale OCR/KI-Regeln sind technisch getestet. Fuer echte sensible Daten fehlen vor allem die Sicherheitsabnahme, Freigaben, Backup-/Loeschprozess und die Entscheidung, welche echten Dokumente zuerst kontrolliert hochgeladen werden.
