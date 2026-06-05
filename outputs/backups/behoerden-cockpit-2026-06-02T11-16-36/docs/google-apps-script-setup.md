# Google Apps Script Setup

Dieses Script erstellt die produktive Grundstruktur in Google Drive und Google Sheets.

## Datei

`google-apps-script/setup-behoerden-cockpit.gs`

## Was das Script erstellt

- Root-Ordner `Behoerden-Cockpit Murat Kocyigit`
- 10 Hauptordner für die Behördenbereiche
- je Hauptordner 7 Unterordner:
  - `01_Eingang`
  - `02_In_Bearbeitung`
  - `03_Antraege`
  - `04_Bescheide`
  - `05_Widerspruch`
  - `06_Nachweise`
  - `07_Archiv`
- Google Sheet `Behoerden-Cockpit Datenbank`
- Tabs für Config, Dashboard, Vorgänge, Dokumente, Fristen, Checklisten, Kontakte, Aufgaben, KI-Analysen, Automationen, Portal-Nutzer, Audit-Log und Drive-Ordner
- Startdaten für die aktuelle Cockpit-Demo
- Drive-Ordner-IDs und URLs im Tab `Drive_Ordner`
- Root-Ordner-ID, Spreadsheet-ID und Webhook-Platzhalter im Tab `Config`
- Dashboard-Formeln für offene Vorgänge, offene Fristen und kritische Fristen je Bereich

## Ausführen

1. Öffne [Google Apps Script](https://script.google.com/).
2. Neues Projekt erstellen.
3. Inhalt aus `google-apps-script/setup-behoerden-cockpit.gs` einfügen.
4. Funktion `setupBehoerdenCockpit` auswählen.
5. Einmal ausführen und Google-Berechtigungen bestätigen.
6. In den Logs stehen danach:
   - `rootFolderUrl`
   - `spreadsheetUrl`
7. Öffne das erzeugte Google Sheet und prüfe den Tab `Config`.

## Danach

1. Die `spreadsheet_id` aus `Config` in die n8n-Workflows eintragen.
2. Die passende `01_Eingang`-Ordner-ID aus `Drive_Ordner` in den Upload-Workflow eintragen.
3. Die n8n-Workflows importieren.
4. In der App unter `Setup` die n8n-Webhook-URLs eintragen.

Die genaue Zuordnung steht in:

`docs/n8n-id-mapping.md`

Die vollständige Abfolge bis zum ersten echten Upload-Test steht in:

`docs/produktivstart-checkliste.md`

## Hinweis

Das Script ist wiederholbar. Bereits vorhandene Ordner, Sheets und Tabs werden wiederverwendet, nicht doppelt angelegt. Inhalte der Tabellen-Tabs werden beim erneuten Ausführen allerdings neu aufgebaut.

Bereits eingetragene Werte im Tab `Config`, zum Beispiel n8n-Webhooks oder WhatsApp-Zielnummer, bleiben erhalten. Automatisch erzeugte IDs und URLs werden aktualisiert.
