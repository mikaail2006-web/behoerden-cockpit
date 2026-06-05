# n8n Workflows

Dieser Ordner enthaelt die vorbereiteten n8n-Workflows fuer das Behoerden-Cockpit.

## Workflows

| Datei | Zweck |
| --- | --- |
| `workflow-cockpit-daten-api-import.json` | liest Google-Sheets-Daten und liefert sie an die App |
| `workflow-document-check-upload.json` | nimmt Dokumente entgegen, speichert sie in Drive und schreibt Sheet-Zeilen |
| `workflow-ocr-ki-analyse.json` | analysiert Dokumenttexte und erzeugt Analyse, Frist und Aufgabe |
| `workflow-fristen-whatsapp-erinnerung.json` | prueft Fristen und erstellt WhatsApp-Erinnerungen |
| `behörden-cockpit-workflows.json` | Blueprint der Gesamt-Automationen |
| `code-node-map-sheets-to-cockpit.js` | Mapping-Code fuer n8n Code Nodes |
| `code-node-build-whatsapp-reminders.js` | lokal testbare Reminder-Logik fuer WhatsApp |

## Empfohlene Reihenfolge

1. `workflow-cockpit-daten-api-import.json`
2. `workflow-document-check-upload.json`
3. `workflow-ocr-ki-analyse.json`
4. `workflow-fristen-whatsapp-erinnerung.json`

## Wichtige Platzhalter

- `GOOGLE_SHEET_ID_HERE`
- `GOOGLE_DRIVE_EINGANG_FOLDER_ID_HERE`
- echte Google-Drive-Credential
- echte Google-Sheets-Credential
- echter KI-Endpunkt
- WhatsApp Business Credential
- WhatsApp Template `frist_erinnerung_de`
- WhatsApp Phone-Number-ID aus Meta

## Sicherheit

- Webhook- und API-Tokens nicht in die App oder in Google Sheets kopieren.
- Credentials nur in n8n Credentials speichern.
- Testwebhooks vor Produktivaktivierung mit unkritischen Dokumenten pruefen.
- Versand von WhatsApp-Erinnerungen nur mit Einwilligung/Opt-in nutzen.
- Telefonnummern nicht als Workflow-Placeholder setzen, sondern in `Fristen.Telefon` pflegen.

## Tests

Nach jedem Import pruefen:

- Workflow laesst sich speichern.
- Credentials sind gesetzt.
- Testausfuehrung liefert erwartete Daten.
- App zeigt nach `Neu laden` die aktualisierten Daten.
- `Audit_Log` enthaelt den Automationsschritt.
