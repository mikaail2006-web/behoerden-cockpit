# Betriebsuebergabe Behörden-Cockpit

Stand: 2026-05-31

## Fertig vorbereitet

- lokale Cockpit-App mit Dashboard, Vorgängen, Dokumenten, Fristen, Aufgaben, Kontakten, Aktivitäten, Checklisten und Setup
- automatischer Dateiname beim Upload
- lokale Bescheid-Check-Simulation
- Google-Apps-Script für Drive-Ordner, Google Sheet, Startdaten, Config und Ordner-IDs
- n8n Daten-API für Google-Sheets-Daten
- n8n Dokumenten-Upload mit Google Drive und Google Sheets
- n8n OCR-/KI-Analyse für Zusammenfassung, Risiko, Frist und Aufgabe
- n8n WhatsApp-Fristenerinnerungen
- ID-Mapping und Produktivstart-Checkliste
- Datenschutz-, Backup- und Loeschkonzept

## Wichtigste Dateien

- App: `app/index.html`
- Google Setup: `google-apps-script/setup-behoerden-cockpit.gs`
- Startcheckliste: `docs/produktivstart-checkliste.md`
- Datenschutz/Backup: `docs/datenschutz-backup-loeschkonzept.md`
- ID-Mapping: `docs/n8n-id-mapping.md`
- Daten-API Workflow: `n8n/workflow-cockpit-daten-api-import.json`
- Upload Workflow: `n8n/workflow-document-check-upload.json`
- KI Workflow: `n8n/workflow-ocr-ki-analyse.json`
- WhatsApp Workflow: `n8n/workflow-fristen-whatsapp-erinnerung.json`

## Reihenfolge für den Live-Start

1. Google Apps Script ausführen.
2. Google Sheet öffnen.
3. `Config` prüfen.
4. `Drive_Ordner` prüfen.
5. n8n Daten-API importieren.
6. `spreadsheet_id` ersetzen.
7. Google-Sheets-Credential setzen.
8. Daten-Webhook testen.
9. Daten-URL in der App unter `Setup` eintragen.
10. Upload-Workflow importieren.
11. Sheet-ID, Drive-Ordner-ID und Credentials ersetzen.
12. Upload-Webhook in der App unter `Setup` eintragen.
13. Erstes Testdokument hochladen.

## Erster Live-Test

Erwartet:

- App zeigt `n8n verbunden`
- Dashboard lädt Google-Sheets-Daten
- Upload erzeugt sauberen Dateinamen
- Datei landet in Google Drive
- neue Zeile erscheint in `Dokumente`
- Upload-Ergebnis erscheint im Cockpit

## Danach

Als nächstes produktiv aktivieren:

1. OCR-/KI-Analyse mit echtem KI-Endpunkt
2. WhatsApp-Business-Template `frist_erinnerung_de`
3. täglicher Fristenworkflow
4. echte Testfrist für WhatsApp-Versand

## Fallback

Wenn n8n nicht erreichbar ist, läuft die App weiter mit:

- lokaler Datenquelle `app/cockpit-data.json`
- lokaler Upload-/Bescheid-Check-Simulation
