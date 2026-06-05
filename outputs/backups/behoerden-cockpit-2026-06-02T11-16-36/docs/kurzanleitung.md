# Kurzanleitung Behoerden-Cockpit

## 1. App starten

Per Doppelklick:

```text
Start-Behörden-Cockpit.command
```

Danach im Browser oeffnen:

```text
http://127.0.0.1:4173/index.html
```

## 2. Status pruefen

Per Doppelklick:

```text
Status-Behörden-Cockpit.command
```

Erwartung:

```text
cockpit checks ok
```

## 3. App pruefen

Per Doppelklick:

```text
Check-Behörden-Cockpit.command
```

Dieser Check prueft App, Portal-API, Supabase-Dateien, Secret-Schutz und Setup-Verweise.

## 4. Dokument hochladen

1. In der App `Check` oeffnen.
2. Dokument auswaehlen.
3. Bereich und Dokumenttyp pruefen.
4. Automatischen Dateinamen kontrollieren.
5. `Bescheid pruefen` klicken.
6. Ergebnis, naechsten Schritt, Frist und Aufgabe pruefen.

## 5. Vor echten sensiblen Daten

1. `Status-Behörden-Cockpit.command` ausfuehren.
2. `docs/echte-daten-starten.md` abarbeiten.
3. `docs/datenschutz-backup-loeschkonzept.md` lesen.
4. Drive-, Sheet- und n8n-Freigaben pruefen.
5. Erst ein unkritisches Testdokument hochladen.
6. Danach echte Bescheide oder Arztberichte hochladen.

## 6. Portal-Demo starten

Per Doppelklick:

```text
Start-Portal-Demo.command
```

Die Demo laeuft auf:

```text
http://127.0.0.1:4190
```

## 7. Supabase vorbereiten

Die Anleitung liegt hier:

```text
docs/supabase-testprojekt-runbook.md
```

Reihenfolge:

1. SQL-Migrationen ausfuehren.
2. Testnutzer anlegen.
3. Testprofile setzen.
4. Testdaten anlegen.
5. RLS pruefen.
6. Testdaten aufraeumen.

## 8. Naechste Aufgaben

Die kurze priorisierte Liste liegt hier:

```text
docs/naechste-schritte.md
```
