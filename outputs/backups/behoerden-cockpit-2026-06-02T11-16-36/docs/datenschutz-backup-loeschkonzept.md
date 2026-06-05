# Datenschutz, Backup und Loeschkonzept

Diese Datei ist die Betriebsroutine fuer echte Sozial-, Gesundheits- und Behoerdendaten im Behoerden-Cockpit.

## Grundregeln

- Nur notwendige Dokumente speichern.
- Keine Zugangsdaten, Tokens oder privaten Schluessel in der App, in Google Sheets oder in n8n-Notizen ablegen.
- `api/.env.example` ist nur eine Vorlage; echte `.env`-Dateien nicht in die App kopieren oder teilen.
- Echte `.env`-Dateien sind in `.gitignore` ausgeschlossen und gehoeren nur auf den Server.
- Dokumente nur in den vorgesehenen Drive-Ordnern speichern.
- Freigaben regelmaessig pruefen und nur konkret benoetigte Personen berechtigen.
- Medizinische Dokumente, Bescheide und Ausweise nicht per ungesichertem Link teilen.

## Backup-Routine

Woechentlich pruefen:

- Google Drive Root-Ordner ist vorhanden und erreichbar.
- Google Sheet laesst sich oeffnen.
- Export der wichtigsten Tabs als `.xlsx` ist moeglich.
- n8n Workflows sind exportiert oder dokumentiert.
- Letzter erfolgreicher Upload steht im `Audit_Log`.

Diese Punkte koennen in der App unter `Setup > Betriebsroutine` abgehakt werden.

Monatlich sichern:

- Google Sheet als Excel exportieren.
- n8n Workflows als JSON exportieren.
- `Config`-Tab und `Drive_Ordner`-Tab als PDF oder CSV sichern.
- Lokale Projektdateien mit aktuellem Stand archivieren.
- Lokales Projekt-Backup per `Backup-Behörden-Cockpit.command` erstellen.
- Wiederherstellung kurz testen: Backup oeffnen, Datenstand vergleichen und n8n-Workflow-Export pruefen.

Der lokale Backup-Starter legt ein Paket unter `outputs/backups/` an. Er schliesst `.env`, `api/.env`, `node_modules`, `outputs`, Logs und `*.backup` aus.

## Wiederherstellung

1. Google Drive Root-Ordner pruefen.
2. Letztes Google-Sheet-Backup oeffnen.
3. n8n Workflows aus JSON erneut importieren.
4. Sheet-ID und Ordner-IDs in n8n ersetzen.
5. App starten und Daten-URL neu laden.
6. Testdokument hochladen.
7. `Audit_Log`, `Dokumente`, `Fristen` und `Aufgaben` kontrollieren.

Der Wiederherstellungstest ist in der App ein eigener Punkt der Betriebsroutine.

## Loeschprozess

Wenn ein Vorgang oder Dokument geloescht werden soll:

1. In der App zunaechst archivieren, nicht sofort endgueltig loeschen.
2. Pruefen, ob gesetzliche oder vertragliche Aufbewahrungspflichten bestehen.
3. Falls endgueltig loeschen erlaubt ist:
   - Drive-Datei loeschen
   - Sheet-Zeile entfernen oder als `Geloescht` markieren
   - zugehoerige Fristen und Aufgaben schliessen
   - Loeschung im `Audit_Log` dokumentieren
4. Papierkopien und lokale Downloads ebenfalls beruecksichtigen.

Die App erinnert in der Betriebsroutine an die Regel: erst archivieren, dann Aufbewahrungspflichten pruefen, danach erst endgueltig loeschen.

## Zugriffskontrolle

Mindestens monatlich pruefen:

- Wer hat Zugriff auf Google Drive?
- Wer hat Zugriff auf Google Sheets?
- Wer hat Zugriff auf n8n?
- Sind alte Testnutzer entfernt?
- Sind Portalrollen korrekt gesetzt?
- Ist die lokale PIN weiterhin nur als Zusatzschutz verstanden?

## Erste echte Datenfreigabe

Vor dem Einpflegen echter Daten:

- `Check-Behörden-Cockpit.command` ausfuehren.
- PIN-Schutz aktiv pruefen.
- Drive- und Sheet-Freigaben pruefen.
- Testupload mit unkritischem Dokument durchfuehren.
- Danach erst echte Bescheide, Arztberichte oder Ausweise hochladen.
