# Bescheid-Check

Der Bereich `Check` in der App simuliert den späteren Produktivablauf:

1. Dokument auswählen
2. Bereich und Dokumenttyp setzen
3. automatischen Dateinamen prüfen
4. KI-Analyse starten
5. Ergebnis anzeigen
6. automatisch Dokument, Frist, Aufgabe, KI-Analyse und Audit-Log ergänzen

## Automatische Dateinamen

Die App erzeugt beim Upload einen einheitlichen Namen:

`YYYY-MM-DD_Bereich_Dokumenttyp_Murat-Kocyigit_Originalname.ext`

Beispiel:

`2026-05-31_Pflegegrad-2_Arztbericht_Murat-Kocyigit_Aerztlicher-Bericht.pdf`

Der Originalname bleibt inhaltlich erkennbar, Umlaute und Sonderzeichen werden aber für Google Drive, n8n und spätere Exporte bereinigt.

## Spätere n8n-Umsetzung

Webhook:

`POST /document-check`

Importierbare Vorlage:

`n8n/workflow-document-check-upload.json`

OCR-/KI-Erweiterung:

`n8n/workflow-ocr-ki-analyse.json`

Eingaben:

- Datei
- Bereich
- Dokumenttyp
- automatisch erzeugter Dateiname
- optional `vorgang_id`

Ausgaben:

- erkannter Dokumenttyp
- Zusammenfassung
- Risiko
- Behörde und Aktenzeichen
- Fristvorschläge
- fehlende Nachweise
- nächster Schritt

## Zielstruktur

Der echte Workflow soll dieselben App-Daten aktualisieren wie die lokale Simulation:

- `Dokumente`
- `Fristen`
- `Aufgaben`
- `KI_Analysen`
- `Audit_Log`

## Hinweis

Der Bescheid-Check ist als Assistenzfunktion gedacht. Er soll Fristen, fehlende Unterlagen und nächste Schritte sichtbar machen, aber keine Rechtsberatung ersetzen.
