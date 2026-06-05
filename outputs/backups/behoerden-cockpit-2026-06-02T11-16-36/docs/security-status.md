# Security Status

Kurzer Sicherheitsstand fuer lokale App, Portal-Vorbereitung und echte Daten.

## Aktiv

- lokale PIN-Sperre fuer Browser-Sitzung
- In-App-Preflight-Checkliste fuer echte Daten
- Gefuehrte Einzelupload-Kontrolle fuer das erste echte Dokument
- Betriebsroutine fuer Backup, Wiederherstellung, Zugriff, Audit-Log und Loeschregel
- Upload-Hinweis und Bestaetigungsabfrage bei offenem Preflight
- Audit-Protokoll fuer Uploads trotz offenem Preflight
- `.gitignore` fuer echte `.env`-Dateien
- Secret-Scan mit `scripts/check-secrets.mjs`
- Env-Vorlage ohne echte Secrets: `api/.env.example`
- Portal-Rollenmatrix: `api/portal-permissions.json`
- Portal-Zugriffshilfe: `api/portal-access.mjs`
- Supabase RLS-SQL vorbereitet
- Datenschutz-, Backup- und Loeschkonzept vorhanden

## Regeln

- `SUPABASE_SERVICE_ROLE_KEY` nur serverseitig speichern.
- echte `.env` nicht in App, Doku, Google Sheet oder n8n-Notizen kopieren.
- Google-, n8n- und KI-Credentials nur in den jeweiligen Credential-Stores speichern.
- Gesundheits- und Behoerdendokumente nicht ueber oeffentliche Links teilen.
- Vor echten Daten `docs/echte-daten-starten.md` abarbeiten.
- Echte Dokumente erst nach vollstaendigem In-App-Preflight hochladen.

## Noch offen fuer Produktion

- echter Supabase-Login
- echte RLS-Pruefung mit Testnutzern
- serverseitige Portal-API
- produktiver KI/OCR-Endpunkt
- produktiver WhatsApp-Provider mit Opt-in
- AVV/Datenschutzpruefung der genutzten Anbieter

## Pruefen

```bash
./scripts/check-cockpit.sh
```

Erwartung:

```text
secret checks ok
cockpit checks ok
```
