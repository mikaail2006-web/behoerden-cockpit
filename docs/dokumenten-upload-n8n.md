# Dokumenten-Upload mit n8n

Diese Vorlage verbindet den Upload im Cockpit mit Google Drive und Google Sheets.

## Workflow importieren

Importiere in n8n:

`n8n/workflow-document-check-upload.json`

Danach im Workflow ersetzen:

- `GOOGLE_SHEET_ID_HERE` durch die echte Google-Sheet-ID
- `GOOGLE_DRIVE_EINGANG_FOLDER_ID_HERE` durch die Drive-Ordner-ID für den Eingang
- `REPLACE_WITH_GOOGLE_DRIVE_CREDENTIAL_ID` durch die Google-Drive-Credential
- `REPLACE_WITH_GOOGLE_SHEETS_CREDENTIAL_ID` durch die Google-Sheets-Credential

## Webhook

Der Workflow stellt bereit:

`POST /webhook/document-check`

Die App sendet `multipart/form-data`:

- `file`: hochgeladenes Dokument
- `area`: Bereich, z. B. `Pflegegrad 2`
- `documentType`: Dokumenttyp, z. B. `Arztbericht`
- `normalizedFileName`: automatisch erzeugter Dateiname
- `personName`: `Murat Kocyigit`
- `source`: `behoerden-cockpit`

## Antwort an die App

Die App erwartet JSON:

```json
{
  "title": "Arztbericht hochgeladen: 2026-05-31_Pflegegrad-2_Arztbericht_Murat-Kocyigit.pdf",
  "fileName": "2026-05-31_Pflegegrad-2_Arztbericht_Murat-Kocyigit.pdf",
  "risk": "mittel",
  "summary": "Das Dokument wurde gespeichert.",
  "findings": ["Google Drive Upload abgeschlossen"],
  "nextStep": "Cockpit-Daten neu laden."
}
```

## KI-Analyse anhängen

Für OCR und KI-Auswertung gibt es den Anschluss-Workflow:

`n8n/workflow-ocr-ki-analyse.json`

Er kann nach `Dokumente Zeile schreiben` gestartet werden und schreibt automatisch `KI_Analysen`, `Fristen` und `Aufgaben`.

## App verbinden

In der App unter `Setup` den Upload-Webhook eintragen:

`https://DEINE-N8N-DOMAIN/webhook/document-check`

Wenn kein Webhook eingetragen ist oder n8n nicht erreichbar ist, nutzt die App automatisch die lokale Simulation.
