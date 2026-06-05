# n8n ID-Mapping nach dem Google-Setup

Nach dem Ausführen von `setupBehoerdenCockpit` stehen die wichtigsten Werte im Google Sheet in den Tabs `Config` und `Drive_Ordner`.

## Werte aus `Config`

| Config-Key | Eintragen in | Platzhalter |
| --- | --- | --- |
| `spreadsheet_id` | alle n8n-Workflows mit Google Sheets | `GOOGLE_SHEET_ID_HERE` |
| `n8n_data_api_url` | App unter `Setup` -> Daten-URL | `https://DEINE-N8N-DOMAIN/webhook/behoerden-cockpit-data` |
| `n8n_document_check_url` | App unter `Setup` -> Upload-Webhook | `https://DEINE-N8N-DOMAIN/webhook/document-check` |
| `n8n_document_analysis_url` | Analyse-Anschluss oder HTTP-Request-Node | `https://DEINE-N8N-DOMAIN/webhook/document-analysis` |
| `whatsapp_template_name` | WhatsApp-Workflow | `frist_erinnerung_de` |
| `whatsapp_recipient_phone` | Fristen-Tab `Telefon` | Telefonnummer pro Frist im Format `+491234567890` |

## Werte aus `Drive_Ordner`

Für den Upload-Workflow wird ein Eingangordner benötigt.

Empfohlen für den ersten Test:

| Bereich | Ordnername | Eintragen in | Platzhalter |
| --- | --- | --- | --- |
| `01_EM-Rente` | `01_Eingang` | `n8n/workflow-document-check-upload.json` | `GOOGLE_DRIVE_EINGANG_FOLDER_ID_HERE` |

Später kann n8n anhand des Bereichs automatisch den passenden `01_Eingang`-Ordner aus `Drive_Ordner` suchen.

## n8n-Credentials

Diese Platzhalter kommen nicht aus Google Sheets, sondern aus n8n:

| Platzhalter | Bedeutung |
| --- | --- |
| `REPLACE_WITH_CREDENTIAL_ID` | Google-Sheets-Credential für die Daten-API |
| `REPLACE_WITH_GOOGLE_SHEETS_CREDENTIAL_ID` | Google-Sheets-Credential für Upload, KI und WhatsApp-Audit |
| `REPLACE_WITH_GOOGLE_DRIVE_CREDENTIAL_ID` | Google-Drive-Credential für Datei-Upload |
| `REPLACE_WITH_AI_API_CREDENTIAL_ID` | KI-API-Credential |
| `REPLACE_WITH_WHATSAPP_CREDENTIAL_ID` | WhatsApp-Business-Token |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone-Number-ID aus Meta |
| `REPLACE_WITH_MODEL` | gewähltes KI-Modell |

## Reihenfolge

1. Google Apps Script ausführen.
2. `spreadsheet_id` aus `Config` kopieren.
3. n8n-Credentials für Google Sheets und Google Drive anlegen.
4. `workflow-cockpit-daten-api-import.json` importieren und `GOOGLE_SHEET_ID_HERE` ersetzen.
5. Webhook-URL der Daten-API in der App unter `Setup` eintragen.
6. `workflow-document-check-upload.json` importieren und Sheet-ID, Drive-Ordner-ID und Credentials ersetzen.
7. Upload-Webhook in der App unter `Setup` eintragen.
8. Danach KI-Analyse und WhatsApp-Erinnerungen aktivieren.
