# Pilotplan

Dieser Plan beschreibt eine kleine kontrollierte Pilotphase vor dem vollstaendigen Produktivbetrieb.

## Ziel

Mit wenigen echten, aber kontrollierten Daten pruefen:

- Upload-Strecke
- Drive/Sheets-Sync
- Fristen und Aufgaben
- Datenschutzroutine
- Backup/Export
- spaetere Portal- und Supabase-Anbindung

## Umfang

Pilot nur mit:

- einem Nutzerkreis
- wenigen Dokumenten
- klaren Testfaellen
- vorheriger Sicherung
- dokumentierter Auswertung

## Vor Start

- [ ] `Status-Behörden-Cockpit.command` ist gruen
- [ ] `docs/echte-daten-starten.md` ist abgearbeitet
- [ ] `docs/security-status.md` ist gelesen
- [ ] Drive- und Sheet-Freigaben sind geprueft
- [ ] Backup/Export wurde einmal getestet

## Pilot-Testfaelle

1. unkritisches Testdokument hochladen
2. echter Bescheid mit niedrigerem Risiko hochladen
3. automatisch erzeugte Frist pruefen
4. automatisch erzeugte Aufgabe pruefen
5. Dokument im Drive wiederfinden
6. Sheet-Eintraege pruefen
7. Audit-Log pruefen
8. Archivieren und Wiederherstellen testen
9. Export/Backup erstellen

## Abbruchkriterien

Pilot stoppen, wenn:

- Dokumente im falschen Drive-Ordner landen
- Fristen falsch oder nicht nachvollziehbar entstehen
- Sheet-Sync unklar ist
- Zugriff oder Freigaben nicht eindeutig sind
- Secret- oder Token-Risiko sichtbar wird

## Abschluss

Nach dem Pilot:

- `docs/abnahmeprotokoll.md` ausfuellen
- offene Punkte in `docs/naechste-schritte.md` uebertragen
- bei erfolgreichem Pilot Supabase-Testprojekt und Portal-API als naechsten Ausbau starten
