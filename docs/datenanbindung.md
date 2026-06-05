# Datenanbindung für das Behörden-Cockpit

Die App lädt ihre Daten aus `app/cockpit-data.json`. Diese Datei ist absichtlich wie eine API-Antwort aufgebaut. Später kann dieselbe Struktur von Google Sheets, Google Apps Script, n8n oder einer eigenen Datenbank geliefert werden.

## Aktuelle lokale Quelle

`app/config.js`

```js
window.COCKPIT_DATA_URL = "cockpit-data.json";
```

Alternativ kann die Datenquelle direkt in der App unter `Setup` eingetragen werden. Diese URL wird im Browser lokal gespeichert und übersteuert `app/config.js`, bis sie wieder mit `Lokal nutzen` zurückgesetzt wird.

## Später mit n8n

Wenn n8n einen Webhook bereitstellt, muss nur die URL in `app/config.js` geändert werden:

```js
window.COCKPIT_DATA_URL = "https://n8n.example/webhook/behoerden-cockpit-data";
```

Der Webhook sollte JSON in dieser Form liefern:

```json
{
  "areas": ["EM-Rente"],
  "cases": [],
  "documents": [],
  "deadlines": [],
  "checklists": [],
  "tasks": [],
  "contacts": [],
  "auditLog": [],
  "automations": [],
  "analyses": []
}
```

## Mapping aus Google Sheets

- `Vorgaenge` wird zu `cases`
- `Dokumente` wird zu `documents`
- `Fristen` wird zu `deadlines`
- `Checklisten` wird zu `checklists`
- `Aufgaben` wird zu `tasks`
- `Kontakte` wird zu `contacts`
- `Audit_Log` wird zu `auditLog`
- `Automationen` wird zu `automations`
- `KI_Analysen` wird zu `analyses`

## Minimaler n8n Ablauf

1. Webhook `GET /behoerden-cockpit-data`
2. Google Sheets: Tabs `Vorgaenge`, `Dokumente`, `Fristen`, `Checklisten`, `Kontakte`, `Aufgaben`, `Audit_Log`, `Automationen`, `KI_Analysen` lesen
3. Code Node: Zeilen in die App-Struktur mappen
4. Respond to Webhook: JSON zurückgeben

## Wichtig

Für Browserzugriff auf n8n muss der Webhook CORS erlauben. Alternativ kann die App später über einen kleinen Backend-Proxy laufen.
