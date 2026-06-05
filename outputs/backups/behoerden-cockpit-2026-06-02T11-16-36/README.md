# Behörden-Cockpit für Murat Kocyigit

Lokale Projektgrundlage für ein Behörden-Cockpit auf Basis von Google Drive, Google Sheets, n8n und KI.

## Inhalte

- `docs/technische-architektur.md` - vollständige Zielarchitektur, Datenmodell, Automations- und Sicherheitskonzept
- `docs/projektindex.md` - Datei-Landkarte fuer App, Portal, Supabase, n8n und Betrieb
- `docs/ampelstatus.md` - kurze Gruen/Gelb/Rot-Uebersicht
- `docs/faq.md` - schnelle Antworten fuer typische Bedien- und Betriebsfragen
- `docs/heute-tun.md` - konkrete kurze Arbeitsliste fuer den naechsten Termin
- `docs/kommunikationsvorlagen.md` - Vorlagen fuer Telefonnotiz, E-Mail und Nachforderung
- `docs/dokumenten-checklisten.md` - typische Unterlagen je Behoerdenbereich
- `project-manifest.json` - maschinenlesbare Projektuebersicht
- `api/README.md` - Uebersicht der Portal-API-Bausteine
- `app/index.html` - klickbarer Cockpit-Prototyp
- `app/config.js` - Datenquellen-Konfiguration
- `app/cockpit-data.json` - lokale Datenquelle im späteren API-Format
- `app/styles.css` - UI-Styling
- `app/app.js` - Cockpit-Logik mit Vorgängen, Checklisten, Dokumenten, Fristen, Aufgaben, Kontakten, Aktivitäten und Datenquellen-Umschaltung
- `data/google-sheets-schema.csv` - Tabellenstruktur für Google Sheets
- `data/n8n-id-mapping.csv` - Mapping-Tabelle für Config-Werte, Drive-Ordner-IDs und n8n-Platzhalter
- `data/sheets/` - Startdaten je Google-Sheets-Tab
- `n8n/behörden-cockpit-workflows.json` - Workflow-Blueprint für n8n
- `n8n/workflow-cockpit-daten-api-import.json` - importierbarer n8n Daten-API-Workflow
- `n8n/README.md` - Uebersicht und Aktivierungsreihenfolge der n8n-Workflows
- `n8n/workflow-document-check-upload.json` - importierbarer n8n Workflow für Dokumenten-Upload, Drive-Ablage und Sheets-Eintrag
- `n8n/workflow-ocr-ki-analyse.json` - importierbarer n8n Workflow für OCR-/KI-Auswertung, Fristen und Aufgaben
- `n8n/workflow-fristen-whatsapp-erinnerung.json` - importierbarer n8n Workflow für tägliche Fristenprüfung und WhatsApp-Erinnerungen
- `n8n/code-node-map-sheets-to-cockpit.js` - Mapping-Code für n8n Code Nodes
- `docs/datenanbindung.md` - Anleitung zur Anbindung von Google Sheets oder n8n
- `docs/n8n-daten-api-einrichten.md` - konkrete Einrichtung der n8n Daten-API
- `docs/n8n-id-mapping.md` - Zuordnung der Google-Setup-Werte zu den n8n-Workflows
- `docs/bescheid-check.md` - Ablauf für Upload und KI-Bescheidprüfung
- `docs/dokumenten-upload-n8n.md` - Einrichtung des echten Upload-Webhooks
- `docs/ocr-ki-analyse-n8n.md` - Einrichtung der OCR- und KI-Analyse
- `docs/whatsapp-fristen-erinnerung-n8n.md` - Einrichtung der WhatsApp-Fristenerinnerungen
- `google-apps-script/setup-behoerden-cockpit.gs` - Script zum automatischen Anlegen von Google Drive, Google Sheets, Config-Tab, Dashboard-Formeln und Ordner-IDs
- `google-apps-script/README.md` - Uebersicht fuer Google Drive/Sheets Setup
- `docs/google-apps-script-setup.md` - Anleitung zum Ausführen des Google-Setups
- `docs/produktivstart-checkliste.md` - Schrittfolge vom Google-Setup bis zum ersten echten Upload-Test
- `docs/betriebsuebergabe.md` - kompakte Übersicht für Live-Start, Tests und Fallback
- `docs/kurzanleitung.md` - kurzer Einstieg fuer Start, Check, Upload und Supabase
- `docs/aenderungsverlauf.md` - kompakter Verlauf der wichtigsten Projektbausteine
- `docs/portal-demo-testen.md` - lokale Portal-API-Demo pruefen
- `docs/supabase-copy-paste-reihenfolge.md` - kurze SQL-Reihenfolge fuer Supabase
- `docs/supabase-werte-vorlage.md` - Vorlage fuer nicht-geheime Supabase-Projektwerte
- `docs/naechste-schritte.md` - kurze priorisierte Aufgabenliste ab aktuellem Stand
- `docs/echte-daten-starten.md` - letzte Checkliste vor echten sensiblen Dokumenten
- `docs/security-status.md` - kurzer Sicherheitsstand fuer Secrets, RLS und echte Daten
- `docs/production-readiness.md` - Mindestanforderungen vor echtem Portalbetrieb
- `docs/pilotplan.md` - kontrollierte Pilotphase vor vollstaendigem Produktivbetrieb
- `docs/abnahmeprotokoll.md` - Checkliste vor echten Daten oder Übergabe

## App starten

Produktivnah lokal mit echtem Drive-Upload:

```bash
./scripts/start-cockpit.sh
```

Danach öffnen:

`http://127.0.0.1:4173/index.html`

Der Starter startet:

- die lokale App
- die geschützte Upload-Brücke
- den echten Google-Drive-Upload
- den Sheet-Sync über die bestehende Cockpit-Datenbank

Stoppen mit `Ctrl+C`.

## App pruefen

Per Doppelklick:

```text
Check-Behörden-Cockpit.command
```

Statusbericht per Doppelklick:

```text
Status-Behörden-Cockpit.command
```

Supabase-Vorbereitung per Doppelklick:

```text
Start-Supabase-Vorbereitung.command
```

Oder im Terminal:

```bash
./scripts/check-cockpit.sh
```

```bash
./scripts/status-cockpit.sh
```

Der Check prueft:

- App-Syntax
- wichtige App-Setup-Texte
- Portal-Rollen
- API-Endpunkte
- Portal-Env-Konfiguration
- Gleichlauf zwischen OpenAPI und Rechte-Matrix
- Portal-Server-Demo-Anbindung
- Manifest-Dateiverweise
- npm-Skripte
- Markdown-Dokumente
- Datei-Verweise in Doku und App
- naechste Schritte gegen Manifest
- Supabase-Dateien und Setup-Verweise
- Schutzregeln fuer echte `.env`-Dateien
- einfache Secret-Muster im Projekt

Der Statusbericht zeigt zusaetzlich, ob App, Upload-Bruecke und Portal-Demo gerade lokal erreichbar sind.

Nur statisch ohne echten Upload:

`app/index.html`

Später kann sie an Google Sheets, Google Drive, n8n Webhooks, WhatsApp Business API und einen KI-Dienst angebunden werden.

## Lokale Kommandos

```bash
npm run check
```

Prueft die App-Syntax und die Portal-Zugriffsvertraege.

Falls `npm` lokal nicht im Pfad liegt:

```bash
node scripts/check-cockpit.mjs
```

```bash
npm run start:portal-demo
```

Startet das minimale Portal-API-Beispiel auf `http://127.0.0.1:4190`.

Per Doppelklick:

```text
Start-Portal-Demo.command
```

Oder ohne npm:

```bash
./scripts/start-portal-demo.sh
```

```bash
npm run test:portal
```

Prueft Rollen, Endpunkte und den Gleichlauf zwischen OpenAPI und Rechte-Matrix.
