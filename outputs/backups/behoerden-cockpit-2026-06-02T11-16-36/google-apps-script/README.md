# Google Apps Script Setup

Dieser Ordner enthaelt die Scripts fuer das Google-Drive- und Google-Sheets-Setup des Behoerden-Cockpits.

## Dateien

| Datei | Zweck |
| --- | --- |
| `setup-behoerden-cockpit.gs` | vollstaendiges Setup fuer Drive, Sheets, Config, Dashboard und Startdaten |
| `setup-compact.gs` | kompaktere Setup-Variante |
| `appsscript.json` | Apps-Script-Manifest mit benoetigten Berechtigungen |

## Ziel

Das Setup erzeugt:

- Google-Drive-Root-Ordner
- 10 Hauptbereiche fuer Behoerdenthemen
- Unterordner fuer Eingang, Bescheide, Nachweise, Kommunikation und Archiv
- Google Sheet mit Tabs fuer Vorgaenge, Dokumente, Fristen, Aufgaben, Kontakte, Audit und Config
- Config-Werte fuer n8n, App und Drive-Ordner

## Ausfuehrung

1. Neues Google-Apps-Script-Projekt oeffnen.
2. Inhalt aus `setup-behoerden-cockpit.gs` einfuegen.
3. `appsscript.json` uebernehmen.
4. Funktion `setupBehoerdenCockpit` ausfuehren.
5. Berechtigungen bestaetigen.
6. Ergebnis im erzeugten Google Sheet pruefen.

## Danach pruefen

- Tab `Config` enthaelt `spreadsheet_id`
- Tab `Drive_Ordner` enthaelt Ordner-IDs
- alle 10 Hauptordner sind vorhanden
- App kann Daten aus Sheet/n8n laden
- Upload-Bruecke kann Drive-Dateien ablegen

Weitere Details: `docs/google-apps-script-setup.md`.
