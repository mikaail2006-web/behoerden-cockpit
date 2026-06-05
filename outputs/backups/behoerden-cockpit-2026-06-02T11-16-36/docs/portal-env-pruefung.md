# Portal Env Pruefung

Diese Pruefung kontrolliert die nicht-geheimen Portal-Konfigurationswerte, ohne sie im Projekt zu speichern.

## Nutzung

1. `Check-Portal-Env.command` starten.
2. Supabase Project URL eingeben.
3. Supabase publishable public key eingeben.
4. Storage Bucket bestaetigen oder anpassen.
5. App-Ursprung bestaetigen oder anpassen.

## Ergebnis

Wenn die Pruefung `Portal-Env-Pruefung ok` meldet, sind die oeffentlichen Werte fuer die spaetere serverseitige Portal-Konfiguration plausibel.

## Wichtig

- Der Service Role Key wird bewusst nicht abgefragt.
- Es wird keine echte `.env` geschrieben.
- Echte Secrets gehoeren nur auf den Server.
- Fuer produktive Nutzung danach `docs/portal-api-supabase-anbindung.md` beachten.
