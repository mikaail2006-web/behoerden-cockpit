# Portal-Demo testen

Diese Anleitung prueft die lokale Portal-API-Demo aus `api/portal-server.example.mjs`.

## 1. Demo starten

Per Doppelklick:

```text
Start-Portal-Demo.command
```

Mit Supabase-Anbindung:

```text
Start-Portal-Demo-Supabase.command
```

Oder im Terminal:

```bash
./scripts/start-portal-demo.sh
```

Gezielt pruefen:

```text
Check-Portal-Demo.command
```

Oder im Terminal:

```bash
./scripts/check-portal-demo.sh
```

Die Demo laeuft auf:

```text
http://127.0.0.1:4190
```

## 2. Health pruefen

```bash
curl -sS -H 'x-demo-role: kunde' http://127.0.0.1:4190/api/health
```

Erwartung:

```json
{
  "ok": true,
  "mode": "demo",
  "service": "behoerden-cockpit-portal-api"
}
```

## 3. Eigenes Profil pruefen

```bash
curl -sS -H 'x-demo-role: kunde' http://127.0.0.1:4190/api/me
```

Erwartung:

- Antwort enthaelt `role: kunde`
- Antwort enthaelt `mode: demo` oder `mode: configured`

Wenn die Portal-Env vollstaendig ist, kann spaeter statt `x-demo-role` auch ein echter Supabase Access Token genutzt werden:

```bash
curl -sS -H 'Authorization: Bearer SUPABASE_ACCESS_TOKEN' http://127.0.0.1:4190/api/me
```

Erwartung:

- Profil kommt aus `public.profiles`
- `tenantId` entspricht dem Supabase-Testprofil

## 4. Rollenblockade pruefen

Kunde darf die Rechte-Matrix nicht lesen:

```bash
curl -sS -H 'x-demo-role: kunde' http://127.0.0.1:4190/api/permissions
```

Erwartung:

```json
{
  "error": "forbidden"
}
```

Admin darf die Rechte-Matrix lesen:

```bash
curl -sS -H 'x-demo-role: admin' http://127.0.0.1:4190/api/permissions
```

Erwartung:

- Antwort enthaelt `roles`
- Antwort enthaelt `endpoints`

## 5. Listen-Endpunkte pruefen

```bash
curl -sS -H 'x-demo-role: bearbeiter' http://127.0.0.1:4190/api/cases
curl -sS -H 'x-demo-role: bearbeiter' http://127.0.0.1:4190/api/documents
curl -sS -H 'x-demo-role: bearbeiter' http://127.0.0.1:4190/api/deadlines
curl -sS -H 'x-demo-role: bearbeiter' http://127.0.0.1:4190/api/tasks
curl -sS -H 'x-demo-role: bearbeiter' http://127.0.0.1:4190/api/audit-log
```

Erwartung:

- Im Demo-Modus kommen unkritische Demo-Daten.
- Mit vollstaendiger Env und Bearer Token kommen spaeter Supabase-Daten ueber RLS.

## 6. Update-Endpunkte pruefen

```bash
curl -sS -X PATCH -H 'content-type: application/json' -H 'x-demo-role: bearbeiter' \
  -d '{"status":"Erledigt","nextStep":"Archivieren"}' \
  http://127.0.0.1:4190/api/cases/demo-case

curl -sS -X PATCH -H 'content-type: application/json' -H 'x-demo-role: bearbeiter' \
  -d '{"status":"Erledigt"}' \
  http://127.0.0.1:4190/api/deadlines/demo-deadline

curl -sS -X PATCH -H 'content-type: application/json' -H 'x-demo-role: kunde' \
  -d '{"status":"Erledigt"}' \
  http://127.0.0.1:4190/api/tasks/demo-task
```

Erwartung:

- Bearbeiter darf Vorgang und Frist aktualisieren.
- Kunde darf eigene Aufgaben aktualisieren.
- Kunde darf keine Fristen aktualisieren.
- Ungueltiges JSON wird als `bad_request` beantwortet.

## 7. Bearer Token pruefen

Wenn Supabase-Testprofile angelegt sind und die Portal-Demo mit vollstaendiger Env laeuft:

Reihenfolge:

1. `Check-Portal-Env.command`
2. `Start-Portal-Demo-Supabase.command`
3. `Copy-Supabase-Access-Token.command`
4. `Check-Portal-Bearer.command`

```text
Start-Portal-Demo-Supabase.command
```

Dann Token holen:

```text
Copy-Supabase-Access-Token.command
```

Danach:

```text
Check-Portal-Bearer.command
```

Der Token wird nur temporaer in die Zwischenablage gelegt und nicht im Projekt gespeichert.
Bei Fehlern hilft `docs/live-test-fehlerhilfe.md`.

## 8. Demo stoppen

Das Terminalfenster der Demo mit `Ctrl+C` stoppen.
