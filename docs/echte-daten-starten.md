# Echte Daten starten

Diese Checkliste direkt vor dem ersten echten Bescheid, Arztbericht oder Ausweis verwenden.

## 1. Technik pruefen

- [ ] `Preflight-Echte-Daten.command` ausfuehren
- [ ] Ergebnis enthaelt `Preflight fuer echte Daten: technische Checks bestanden`
- [ ] `Status-Behörden-Cockpit.command` ausfuehren
- [ ] Ergebnis enthaelt `cockpit checks ok`
- [ ] App ist gestartet
- [ ] Upload-Bruecke ist gestartet, falls echter Drive-Upload genutzt wird
- [ ] PIN-Schutz ist aktiv
- [ ] In der App unter `Setup > Sicherheit` alle sechs Preflight-Punkte abhaken
- [ ] Dashboard-Freigabe zeigt `18/18`
- [ ] `Freigabebericht` herunterladen und ablegen

## 2. Zugriff pruefen

- [ ] Google Drive Root-Ordner nur fuer berechtigte Personen freigegeben
- [ ] Google Sheet nur fuer berechtigte Personen freigegeben
- [ ] n8n nur fuer berechtigte Personen freigegeben
- [ ] keine echte `.env` im Projektordner
- [ ] keine Service-Role-Keys im Browser, Sheet oder in Doku

## 3. Test mit unkritischem Dokument

- [ ] `docs/unkritischer-upload-test.md` abgearbeitet
- [ ] unkritisches PDF hochladen
- [ ] automatischen Dateinamen pruefen
- [ ] Drive-Ablage pruefen
- [ ] Sheet-Eintrag in `Dokumente` pruefen
- [ ] Frist/Aufgabe/Audit pruefen

## 4. Erstes echtes Dokument

- [ ] Bereich korrekt auswaehlen
- [ ] Dokumenttyp korrekt auswaehlen
- [ ] Dateiname vor Upload kontrollieren
- [ ] Upload-Hinweis zeigt `Freigabe vollständig`
- [ ] Button zeigt `Echtdaten prüfen`
- [ ] In der Upload-Kontrolle `Dateiname und Bereich geprüft` bestaetigen
- [ ] Ergebnis lesen
- [ ] In der Upload-Kontrolle `Prüfergebnis gelesen` bestaetigen
- [ ] Frist und naechsten Schritt sofort pruefen
- [ ] In der Upload-Kontrolle `Frist und Aufgabe kontrolliert` bestaetigen

## 5. Nach dem Upload

- [ ] Original lokal nicht unnoetig mehrfach speichern
- [ ] Aufgabe anlegen oder pruefen
- [ ] Frist kontrollieren
- [ ] Drive- und Sheet-Eintrag pruefen
- [ ] In der Upload-Kontrolle `Drive- und Sheet-Eintrag geprüft` bestaetigen
- [ ] Backup-Routine im Blick behalten
- [ ] bei Unsicherheit Dokument zunaechst archivieren statt loeschen

## Automatischer Preflight

Der technische Vorflugcheck prueft:

- Projektstatus `testbetrieb-unkritisch-bestanden`
- keine echte `.env` im Projektordner
- Secret-Scan bestanden
- Supabase-Testprotokoll bestanden
- unkritischer Upload-Test im Upload-Log vorhanden
- Gesamtcheck bestanden

Er ersetzt nicht die manuellen Freigabepruefungen fuer Drive, Sheet und n8n.

## In-App-Freigabe

Die App zeigt den Echte-Daten-Status an mehreren Stellen:

- Dashboard-Kachel `Echte Daten` mit erledigten Preflight-Punkten
- Setup-Checkliste mit sechs manuellen Freigabepunkten
- Reset-Schalter fuer die Preflight-Liste
- Upload-Hinweis im Check-Bereich
- Buttontext `Mit Preflight-Hinweis pruefen`, solange die Freigabe offen ist
- Upload-Kontrolle `Erstes echtes Dokument` fuer Dateiname, Ergebnis, Frist, Aufgabe, Drive und Sheet

Wenn trotz offener Freigabe ein Dokument geprueft wird, fragt die App vorher nach einer Bestaetigung. Wird fortgefahren, schreibt sie einen Audit-Eintrag mit dem aktuellen Stand aus Preflight, Betrieb und Integrationen.
