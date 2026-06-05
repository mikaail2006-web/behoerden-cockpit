# Naechste Schritte

Diese Liste ist die kurze Arbeitsreihenfolge ab dem aktuellen Stand.

## 1. WhatsApp produktiv machen

- WhatsApp Business Provider verbinden
- Template freigeben lassen
- Testfrist mit Empfaenger-Opt-in senden
- Versand im `Audit_Log` pruefen

## 2. n8n-KI-Endpunkt produktiv verbinden

- echten KI-Endpunkt in n8n eintragen
- KI-Credential in n8n hinterlegen
- Workflow `n8n/workflow-ocr-ki-analyse.json` importieren oder aktualisieren
- unkritischen Testbescheid an `/webhook/document-analysis` senden
- Prompt und Risikoausgabe feinjustieren

## 3. Vor echten sensiblen Daten

- `docs/datenschutz-backup-loeschkonzept.md` lesen
- Drive-, Sheet- und n8n-Freigaben pruefen
- lokale Downloads vermeiden
- Backup-Routine festlegen
- erst danach echte Bescheide oder Arztberichte hochladen

## Erledigt am 2026-06-02

- unkritische Test-PDF `outputs/test-bescheid-upload.pdf` erstellt
- Upload-Bruecke auf `http://127.0.0.1:4180/document-check` erfolgreich genutzt
- Datei als `2026-06-02_EM-Rente_Bescheid_Murat-Kocyigit_Test-Upload.pdf` gespeichert
- Ablage in Google Drive: `01_EM-Rente/04_Bescheide`
- Google-Sheet-Datenbank erfolgreich aktualisiert
- automatische Analyse erkannte Risiko `hoch` und Frist bis `2026-07-02`
- lokale OCR/KI-Regeln erweitert und mit `outputs/test-ki-regeln-bescheid.pdf` live getestet
- konkretes Fristdatum `2026-07-15`, Behörde `Deutsche Rentenversicherung` und Aktenzeichen `DRV-TEST-2026-42` wurden erkannt
- WhatsApp-Reminder-Logik gehaertet: Telefonnummernpruefung, Opt-in-Fallback, Duplikatschutz ueber `LetzteErinnerung`, ueberfaellige Fristen als `critical`
