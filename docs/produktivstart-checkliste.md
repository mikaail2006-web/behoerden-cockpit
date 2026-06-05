# Produktivstart-Checkliste

Diese Checkliste führt vom lokalen Prototyp zum ersten echten Datenfluss mit Google Sheets, Google Drive und n8n.

## Phase 1: Google-Basis erstellen

- [ ] Google Apps Script öffnen
- [ ] neues Projekt erstellen
- [ ] Inhalt aus `google-apps-script/setup-behoerden-cockpit.gs` einfügen
- [ ] Funktion `setupBehoerdenCockpit` ausführen
- [ ] Berechtigungen bestätigen
- [ ] erzeugtes Google Sheet öffnen
- [ ] Tab `Config` prüfen
- [ ] Tab `Drive_Ordner` prüfen

Erwartetes Ergebnis:

- Google-Drive-Root-Ordner ist vorhanden
- alle 10 Hauptordner sind vorhanden
- alle Unterordner sind vorhanden
- Google Sheet enthält alle Tabs
- `Config` enthält `spreadsheet_id`
- `Drive_Ordner` enthält Ordner-IDs

## Phase 2: n8n Daten-API verbinden

- [ ] `n8n/workflow-cockpit-daten-api-import.json` in n8n importieren
- [ ] `GOOGLE_SHEET_ID_HERE` durch `spreadsheet_id` aus `Config` ersetzen
- [ ] Google-Sheets-Credential in n8n auswählen
- [ ] Workflow aktivieren
- [ ] Webhook `GET /webhook/behoerden-cockpit-data` testen
- [ ] Webhook-URL in der App unter `Setup` -> `Daten-URL` eintragen
- [ ] `Neu laden` klicken

Erwartetes Ergebnis:

- App zeigt `n8n verbunden`
- Dashboard lädt Daten aus Google Sheets
- Änderungen in Google Sheets erscheinen nach `Neu laden` in der App

## Phase 3: Dokumenten-Upload verbinden

- [ ] `n8n/workflow-document-check-upload.json` importieren
- [ ] `GOOGLE_SHEET_ID_HERE` ersetzen
- [ ] `GOOGLE_DRIVE_EINGANG_FOLDER_ID_HERE` durch eine `01_Eingang`-Ordner-ID aus `Drive_Ordner` ersetzen
- [ ] Google-Drive-Credential auswählen
- [ ] Google-Sheets-Credential auswählen
- [ ] Workflow aktivieren
- [ ] Webhook `POST /webhook/document-check` testen
- [ ] Webhook-URL in der App unter `Setup` -> `Upload-Webhook` eintragen
- [ ] Testdokument im Bereich `Check` hochladen

Erwartetes Ergebnis:

- Datei liegt in Google Drive
- Datei ist automatisch sauber benannt
- Tab `Dokumente` enthält neue Zeile
- App zeigt Upload-Ergebnis an

## Phase 4: KI-Analyse aktivieren

- [ ] `n8n/workflow-ocr-ki-analyse.json` importieren
- [ ] `GOOGLE_SHEET_ID_HERE` ersetzen
- [ ] Google-Sheets-Credential auswählen
- [ ] KI-Credential einrichten
- [ ] KI-Endpunkt und Modell ersetzen
- [ ] Test mit `extractedText` ausführen

Erwartetes Ergebnis:

- Tab `KI_Analysen` bekommt eine neue Zeile
- bei erkannter Frist entsteht eine Zeile in `Fristen`
- bei nächstem Schritt entsteht eine Zeile in `Aufgaben`

## Phase 5: WhatsApp-Erinnerungen aktivieren

- [ ] `n8n/workflow-fristen-whatsapp-erinnerung.json` importieren
- [ ] `GOOGLE_SHEET_ID_HERE` ersetzen
- [ ] WhatsApp-Credential einrichten
- [ ] `WHATSAPP_PHONE_NUMBER_ID` ersetzen
- [ ] WhatsApp-Template `frist_erinnerung_de` in Meta freigeben
- [ ] Telefonnummern in `Fristen.Telefon` im Format `+491234567890` pruefen
- [ ] Opt-in fuer Empfaenger dokumentieren
- [ ] Workflow testweise manuell ausführen
- [ ] Workflow aktivieren

Erwartetes Ergebnis:

- passende Fristen erzeugen WhatsApp-Erinnerungen
- Versand wird in `Audit_Log` protokolliert
- dieselbe Frist wird am selben Tag nicht doppelt gesendet

## Erste Abnahme

- [ ] Daten-API funktioniert
- [ ] Dokumenten-Upload funktioniert
- [ ] automatische Dateinamen funktionieren
- [ ] Google-Sheets-Einträge werden geschrieben
- [ ] App lädt Live-Daten
- [ ] Audit-Log enthält Automationsereignisse
- [ ] lokale Simulation kann weiterhin als Fallback genutzt werden

## Vor echten Daten

- [ ] `Check-Behörden-Cockpit.command` ausführen
- [ ] Datenschutz-, Backup- und Loeschkonzept lesen: `docs/datenschutz-backup-loeschkonzept.md`
- [ ] Drive-Freigaben prüfen
- [ ] Sheet-Freigaben prüfen
- [ ] n8n-Zugriff prüfen
- [ ] Testupload mit unkritischem Dokument erfolgreich
