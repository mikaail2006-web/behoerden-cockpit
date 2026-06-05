# Behörden-Cockpit Gesamtstatus

## Lokale App

- Dashboard mit Vorgängen, Dokumenten, Fristen, Aufgaben, Kontakten und Aktivitäten
- Dokumentenprüfung mit automatischem Dateinamen
- Live-Upload-Brücke zu Google Drive und Google Sheets
- Datenqualitätsleiste mit Sprungmarken
- Dashboard-Kachel fuer Betriebsroutine mit Backup-/Restore-Stand
- Dashboard-Freigabebalken fuer Echtdaten-Status aus Preflight, Betrieb und Integrationen
- Freigabebericht-Export fuer den aktuellen 18-Punkte-Stand
- Echte-Daten-Preflight mit Dashboard-Kachel und Setup-Checkliste
- Betriebsroutine fuer Backup, Wiederherstellung, Freigaben, Audit-Log und Loeschregel
- lokaler Backup-Starter ohne `.env`, `outputs`, Logs und `node_modules`
- lokaler Restore-Test fuer letztes Backup-Paket
- Archivieren und Wiederherstellen
- PIN-Sperre für lokale Browser-Sitzung
- Upload-Schutz mit Hinweis, Bestaetigung und Audit-Protokoll bei offenem Preflight
- Filter, Zähler und Fokusmodus für erledigte Einträge

## Google Drive und Sheets

- Drive-Ordnerstruktur für Behördenbereiche vorbereitet
- Google-Sheet-Dashboard angebunden
- Fristen-Sheet mit produktiver Spaltenstruktur
- Dokumente, Aufgaben, Fristen, Kontakte und Audit-Log werden synchronisiert

## n8n

- Daten-API vorbereitet
- Dokumenten-Upload-Workflow vorbereitet
- OCR/KI-Analyse-Workflow vorbereitet
- lokale OCR/KI-Regeln live mit unkritischem Upload getestet
- WhatsApp-Fristenerinnerung vorbereitet und Reminder-Logik lokal getestet
- Produktiv-Integrationen-Checkliste fuer WhatsApp, KI/OCR, n8n-Credentials und End-to-End-Test
- Unkritischer Produktiv-Testlauf in der App protokollierbar, inklusive Testupload-Sprung und Audit-Log

## Portal/SaaS Vorbereitung

- Rollenmodell: Admin, Bearbeiter, Kunde
- Rechte-Matrix in der App
- Supabase SQL-Migrationen
- Supabase Storage Policies
- Supabase-Testprojekt Runbook
- Supabase-Testprofil-Vorlage
- Supabase-Testdaten-Vorlage
- Supabase-Testdaten-Cleanup
- Supabase-Testprojekt ausgefuehrt
- RLS-Test fuer Admin, Bearbeiter und Kunde bestanden
- Portal-API mit Supabase-Testdaten gelesen und geschrieben
- Portal API Plan
- OpenAPI-Vertrag fuer Portal-Endpunkte
- Rollen- und Endpunktmatrix fuer Portal-API
- Serverseitige Zugriffshilfe fuer Portal-Rollen
- API-Umgebungsvariablen-Vorlage
- API-Umgebungsvariablen-Pruefung
- Vertragstest fuer OpenAPI und Rollenmatrix
- Minimales Portal-API-Serverbeispiel
- Produktivstart-Checkliste
- Datenschutz-, Backup- und Loeschkonzept
- Abnahmeprotokoll fuer echte Daten und Uebergabe

## Noch offen

- echte Nutzerkonten einrichten
- Produktiven Serverbetrieb einrichten
- WhatsApp Business Credential, Phone-Number-ID und Template produktiv verbinden
- externen KI-Endpunkt produktiv verbinden
- WhatsApp-Provider produktiv verbinden
- Datenschutz/AVV final prüfen
- Backup- und Loeschroutine im Betrieb regelmaessig ausfuehren

## Empfohlener nächster Schritt

Den Echte-Daten-Preflight in der App komplett abhaken und ein erstes echtes Dokument einzeln kontrolliert hochladen. Danach unter `Automationen` den unkritischen Produktiv-Testlauf starten, n8n/WhatsApp/KI/Sheets pruefen und den Testlauf protokollieren.

Der Projektindex liegt in `docs/projektindex.md`.
Der kurze Einstieg liegt in `docs/kurzanleitung.md`.
Der aktuelle Änderungsverlauf liegt in `docs/aenderungsverlauf.md`.
Die kurze priorisierte Arbeitsliste liegt in `docs/naechste-schritte.md`.
