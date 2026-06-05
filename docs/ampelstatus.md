# Ampelstatus

Kurzer Entscheidungsstand fuer das Behoerden-Cockpit.

## Gruen

- lokale Cockpit-App
- PIN-Schutz fuer lokale Browser-Sitzung
- Dokumentenpruefung mit automatischem Dateinamen
- Google Drive/Sheets Struktur vorbereitet
- n8n Workflow-Dateien vorbereitet
- Portal-API-Vertrag vorbereitet
- Rollen- und Rechte-Matrix vorbereitet
- Portal-API-Demo mit Auth-Kontext, Supabase-Profil-Loader und Repository vorbereitet
- Portal-Demo-Endpunkte fuer Listen und Status-Updates vorbereitet
- Portal-Demo-Smoke-Test vorbereitet
- Supabase SQL-Dateien vorbereitet
- Statusbericht und Gesamtcheck
- Datenschutz-, Backup- und Loeschkonzept

## Gelb

- Supabase-Testprojekt muss noch real angelegt werden
- Testnutzer Admin/Bearbeiter/Kunde muessen noch in Supabase erstellt werden
- RLS muss mit echten Supabase-Sessions geprueft werden
- Portal-API muss mit echtem Supabase Access Token getestet werden
- produktiver Serverbetrieb muss noch eingerichtet werden
- KI/OCR-Endpunkt muss produktiv ersetzt werden
- WhatsApp Provider und Template muessen produktiv verbunden werden

## Rot vor echten Daten

- keine echten sensiblen Daten hochladen, bevor `docs/echte-daten-starten.md` abgearbeitet ist
- keine Service-Role-Keys in Browser, App, Sheet oder Doku speichern
- keine oeffentlichen Drive-Freigaben fuer Gesundheits- oder Behoerdendokumente

## Naechste Entscheidung

Mit `docs/supabase-testprojekt-runbook.md` starten und danach `docs/abnahmeprotokoll.md` fuer den ersten echten Datenlauf nutzen.
Vor einem echten Portalbetrieb zusaetzlich `docs/production-readiness.md` pruefen.
