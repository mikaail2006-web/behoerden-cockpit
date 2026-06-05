# FAQ Behoerden-Cockpit

## Die App oeffnet nicht

`Start-Behörden-Cockpit.command` per Doppelklick starten und danach diese Adresse oeffnen:

```text
http://127.0.0.1:4173/index.html
```

Wenn es weiterhin nicht geht: `Status-Behörden-Cockpit.command` ausfuehren.

## Der Upload funktioniert nicht

Pruefen:

- Upload-Bruecke laeuft auf `http://127.0.0.1:4180/document-check`
- Google Drive ist erreichbar
- Google Sheet ist erreichbar
- n8n- oder Bridge-URL ist im Setup korrekt gesetzt

## Ich will echte Daten hochladen

Vorher ausfuehren:

```text
Status-Behörden-Cockpit.command
```

Dann abarbeiten:

```text
docs/echte-daten-starten.md
```

## Ich habe die PIN vergessen

Die PIN schuetzt nur die lokale Browser-Sitzung. Im Setup-Bereich gibt es eine PIN-Aenderung und einen Reset. Fuer ein echtes Portal reicht diese PIN nicht; dort braucht es Supabase Auth oder einen vergleichbaren Server-Login.

## Welche Datei zeigt mir den aktuellen Stand?

Kurz:

```text
docs/ampelstatus.md
```

Ausfuehrlicher:

```text
docs/gesamtstatus.md
```

Maschinenlesbar:

```text
project-manifest.json
```

## Was ist der naechste technische Schritt?

Supabase-Testprojekt vorbereiten:

```text
docs/supabase-testprojekt-runbook.md
```

Kurze SQL-Reihenfolge:

```text
docs/supabase-copy-paste-reihenfolge.md
```

## Wo trage ich Supabase-Werte ein?

Nicht-geheime Werte in:

```text
docs/supabase-werte-vorlage.md
```

Echte Server-Secrets nur serverseitig in eine echte `.env`, nicht in App, Sheet oder Doku.

## Wo sind die n8n-Workflows erklaert?

```text
n8n/README.md
```

## Wo sind die Google-Setup-Dateien erklaert?

```text
google-apps-script/README.md
```
