# Unkritischer Upload-Test

Diese Checkliste kommt nach dem Supabase- und Portal-Live-Test. Keine echten sensiblen Dokumente verwenden.

## Ziel

Pruefen, ob Upload, Dateiname, Ablage, Sheet-Sync und Folgeaktionen zusammen funktionieren.

## Geeignetes Testdokument

- PDF ohne echte Gesundheitsdaten
- keine echten Aktenzeichen
- keine echten Ausweisnummern
- keine echten Diagnosen
- Beispielname oder Testname reicht

## Vor dem Upload

- [ ] `Status-Behörden-Cockpit.command` meldet `cockpit checks ok`
- [ ] App ist gestartet
- [ ] Upload-Bruecke ist gestartet, falls echter Drive-Upload genutzt wird
- [ ] Google Drive Zielordner ist erreichbar
- [ ] Google Sheet ist erreichbar
- [ ] Testdokument ist unkritisch

## Upload pruefen

- [ ] Bereich passend auswaehlen
- [ ] Dokumenttyp passend auswaehlen
- [ ] automatischen Dateinamen kontrollieren
- [ ] Dokument hochladen
- [ ] Pruefergebnis lesen

## Nach dem Upload

- [ ] Datei liegt im richtigen Drive-Ordner
- [ ] Datei hat den erwarteten Namen
- [ ] Google Sheet enthaelt Dokumente-Eintrag
- [ ] erkannte Frist wurde angelegt oder bewusst nicht angelegt
- [ ] Aufgabe wurde angelegt oder bewusst nicht angelegt
- [ ] Audit-/Aktivitaeten-Eintrag ist sichtbar

## Entscheidung

- [ ] Test bestanden
- [ ] Fehler in `docs/live-test-fehlerhilfe.md` oder `docs/abnahmeprotokoll.md` notiert
- [ ] Noch keine echten sensiblen Daten verwenden, solange offene Fehler bestehen
