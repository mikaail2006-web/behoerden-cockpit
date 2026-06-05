# Portal API

Dieser Ordner enthaelt die vorbereiteten Bausteine fuer die spaetere geschuetzte Portal-API.

## Dateien

| Datei | Zweck |
| --- | --- |
| `portal-openapi.yaml` | maschinenlesbarer API-Vertrag |
| `portal-permissions.json` | Rollen- und Endpunktmatrix |
| `portal-access.mjs` | prueft Rolle, Methode und Pfad |
| `portal-context.mjs` | erstellt Portal-Kontext aus Bearer Token und Profil |
| `supabase-profile-loader.mjs` | laedt Supabase Auth-Nutzer und Profil |
| `supabase-portal-repository.mjs` | liest und aktualisiert Portal-Daten ueber Supabase REST |
| `portal-env.mjs` | prueft benoetigte Umgebungsvariablen |
| `portal-server.example.mjs` | minimale lokale Demo-API |
| `.env.example` | Vorlage fuer serverseitige Konfiguration |
| `../docs/portal-api-supabase-anbindung.md` | naechster Schritt zur echten Supabase-Anbindung |

## Tests

```bash
node api/portal-access.test.mjs
node api/portal-context.test.mjs
node api/supabase-profile-loader.test.mjs
node api/supabase-portal-repository.test.mjs
node api/portal-env.test.mjs
node api/portal-contract.test.mjs
node api/portal-server.test.mjs
node api/portal-server.smoke.test.mjs
```

Oder gesammelt:

```bash
node scripts/check-cockpit.mjs
```

## Demo starten

```bash
./scripts/start-portal-demo.sh
```

Danach:

```text
http://127.0.0.1:4190/api/health
```

## Naechster Backend-Schritt

1. echte Supabase-Werte serverseitig in `.env` setzen
   - optional mit `Copy-Portal-Env.command` vorbereiten
2. Supabase Client nur im Server initialisieren
3. JWT aus `Authorization` pruefen
4. Rolle und `tenant_id` aus `profiles` laden
5. `portal-context.mjs` pro Request nutzen
6. `portal-access.mjs` vor jeder Handler-Logik nutzen
7. Datenzugriffe ueber RLS-geschuetzte Supabase-Queries ausfuehren

`SUPABASE_SERVICE_ROLE_KEY` gehoert nur auf den Server und nie in Browser, App, Sheet oder Doku.
