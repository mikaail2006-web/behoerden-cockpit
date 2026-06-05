# n8n Daten-API einrichten

Diese Anleitung verbindet das Cockpit mit Google Sheets.

## 1. Google Sheet vorbereiten

Lege ein Google Sheet mit diesen Tabs an:

- `Vorgaenge`
- `Dokumente`
- `Fristen`
- `Checklisten`
- `Kontakte`
- `Aufgaben`
- `Audit_Log`
- `Automationen`
- `KI_Analysen`

Importiere die passenden CSV-Dateien aus `data/sheets/` jeweils in den gleichnamigen Tab.

## 2. n8n Workflow importieren

Importiere:

`n8n/workflow-cockpit-daten-api-import.json`

Danach im Workflow ersetzen:

- `GOOGLE_SHEET_ID_HERE` durch die echte Google-Sheet-ID
- `REPLACE_WITH_CREDENTIAL_ID` durch die Google-Sheets-Credential in n8n

## 3. Workflow testen

Der Webhook heißt:

`GET /webhook/behoerden-cockpit-data`

Die Antwort muss JSON mit diesen Feldern liefern:

- `areas`
- `cases`
- `documents`
- `deadlines`
- `checklists`
- `contacts`
- `tasks`
- `auditLog`
- `automations`
- `analyses`

## 4. Cockpit auf n8n umstellen

In `app/config.js` die Datenquelle ändern:

```js
window.COCKPIT_DATA_URL = "https://DEINE-N8N-DOMAIN/webhook/behoerden-cockpit-data";
```

Danach die App neu laden.

## Hinweis

Der Workflow ist absichtlich einfach gehalten. Für Produktivbetrieb sollten noch Zugriffsschutz, ein API-Key und genauere CORS-Regeln ergänzt werden.
