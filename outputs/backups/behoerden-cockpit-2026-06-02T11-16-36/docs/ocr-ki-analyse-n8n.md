# OCR und KI-Analyse mit n8n

Dieser Workflow ergänzt den Dokumenten-Upload um die eigentliche Auswertung.

## Workflow importieren

Importiere:

`n8n/workflow-ocr-ki-analyse.json`

Danach im Workflow ersetzen:

- `GOOGLE_SHEET_ID_HERE` durch die echte Google-Sheet-ID
- `REPLACE_WITH_GOOGLE_SHEETS_CREDENTIAL_ID` durch die Google-Sheets-Credential
- `REPLACE_WITH_AI_API_CREDENTIAL_ID` durch die KI-API-Credential
- `https://api.example-ai-provider.test/v1/analyze` durch den echten KI-Endpunkt
- `REPLACE_WITH_MODEL` durch das gewünschte Analysemodell

## Webhook

Der Workflow stellt bereit:

`POST /webhook/document-analysis`

Eingaben:

- `documentId`
- `fileName`
- `area`
- `documentType`
- `caseId`
- `extractedText`

Für den ersten produktiven Test reicht `extractedText`. Danach kann vor den Node `Analyse vorbereiten` ein OCR-Schritt gesetzt werden, z. B. Google Document AI, Google Drive OCR, ein PDF-Parser oder ein externer OCR-Dienst.

## KI-Ausgabe

Die KI soll ausschließlich JSON liefern:

```json
{
  "summary": "kurze Zusammenfassung",
  "risk": "niedrig|mittel|hoch|kritisch",
  "authority": "erkannte Behörde",
  "referenceNumber": "Aktenzeichen",
  "deadlineDate": "YYYY-MM-DD",
  "deadlineTitle": "Titel der Frist",
  "missingEvidence": ["fehlender Nachweis"],
  "tasks": ["konkrete Aufgabe"],
  "nextStep": "nächster sinnvoller Schritt",
  "findings": ["wichtige Beobachtung"]
}
```

## Geschriebene Tabellen

Der Workflow schreibt automatisch:

- `KI_Analysen`
- `Fristen`
- `Aufgaben`

Die Antwort an die App enthält `summary`, `risk`, `findings`, `nextStep`, `deadlineDate`, `authority` und `referenceNumber`.

## Anschluss an den Upload

Nach `Google Drive Upload` oder nach `Dokumente Zeile schreiben` kann ein weiterer HTTP-Request-Node den Analyse-Webhook aufrufen. Dabei werden Dateiname, Bereich, Dokumenttyp und der per OCR erkannte Text übergeben.

## Lokaler Regeltest am 2026-06-02

Die lokale Upload-Bruecke kann ohne externen KI-Key bereits eine robuste Erstpruefung durchfuehren:

- PDF-Textauszug mit `pypdf`
- konkrete Fristdaten aus Frist-/Widerspruchs-/Nachreichungszeilen
- Behörde aus bekannten Behördennamen
- Aktenzeichen aus typischen Feldern wie `Aktenzeichen`, `Zeichen`, `Kundennummer`
- Risiko `hoch` bei Widerspruch, Rechtsbehelf, Nachforderung, Frist, Mahnung oder Anhörung
- Risiko `kritisch` bei Mahnung, Vollstreckung, Säumnis oder sofortiger Eskalation

Getestet mit `outputs/test-ki-regeln-bescheid.pdf`:

- erkannte Frist: `2026-07-15`
- erkannte Behörde: `Deutsche Rentenversicherung`
- erkanntes Aktenzeichen: `DRV-TEST-2026-42`
- Drive-Ablage: `01_EM-Rente/04_Bescheide`
- Sheet-Sync: erfolgreich
