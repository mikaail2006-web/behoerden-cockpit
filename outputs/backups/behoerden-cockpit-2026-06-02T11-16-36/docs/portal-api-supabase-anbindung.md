# Portal API Supabase Anbindung

Diese Datei beschreibt den Schritt nach dem bestandenen Supabase-Testlauf.

## Ziel

Die lokale Portal-Demo wird spaeter zu einer echten serverseitigen API erweitert. Supabase-Werte duerfen dabei nur auf dem Server liegen, nicht im Browser und nicht in `app/`.

## Reihenfolge

1. `docs/supabase-testprotokoll.md` fertig ausfuellen.
2. Supabase Project URL und publishable public key aus Supabase kopieren.
3. `Copy-Portal-Env.command` starten.
4. Werte eingeben.
5. Optional `Check-Portal-Env.command` starten und die Werte pruefen.
6. Kopierte Vorlage serverseitig als echte `.env` verwenden.
7. `SUPABASE_SERVICE_ROLE_KEY` nur serverseitig manuell ergaenzen.
8. Portal-API starten und `api/portal-env.mjs` pruefen lassen.
9. Lokal alternativ `Start-Portal-Demo-Supabase.command` ohne gespeicherte `.env` starten.
10. Optional `Copy-Supabase-Access-Token.command` fuer einen Testnutzer starten.
11. `Check-Portal-Bearer.command` mit echtem Supabase Access Token ausfuehren.

## Sicherheitsregeln

- `SUPABASE_SERVICE_ROLE_KEY` nie in `app/`, Google Sheets, n8n-Workflow-JSON oder Doku speichern.
- Browser nutzt nur Supabase Auth Session oder serverseitige API-Endpunkte.
- n8n Webhooks bleiben hinter Tokens oder serverseitigen Endpunkten.
- Datenzugriff erfolgt ueber RLS-geschuetzte Supabase-Queries.

## Naechste technische Umsetzung

- Supabase JWT aus `Authorization` Header pruefen.
- Nutzerprofil aus `public.profiles` laden.
- Supabase-Profil mit `api/supabase-profile-loader.mjs` laden.
- Request-Kontext mit `api/portal-context.mjs` erstellen.
- Rolle mit `api/portal-access.mjs` pruefen.
- Demo-Server akzeptiert bis zur Produktiv-API weiter `x-demo-role`, bei vollstaendiger Env aber auch `Authorization: Bearer ...`.
- `Start-Portal-Demo-Supabase.command` startet die Demo mit Supabase URL und publishable public key, ohne `.env` zu schreiben.
- `tenant_id` aus Profil fuer Datenzugriffe verwenden.
- Listen-Endpunkte ueber `api/supabase-portal-repository.mjs` anbinden.
- Status-Updates fuer Vorgaenge, Fristen und Aufgaben ueber erlaubte Feldlisten im Repository ausfuehren.
- Lokale Demo liefert fuer Listen-Endpunkte Fallback-Daten, solange kein Bearer-Kontext genutzt wird.
- Lokale Demo simuliert PATCH-Antworten, echte Bearer-Anfragen gehen ans Supabase-Repository.
- Bearer-Token-Test mit `Check-Portal-Bearer.command` prueft `/api/me` und Listen-Endpunkte.
- `Copy-Supabase-Access-Token.command` holt den Token nur temporaer und speichert ihn nicht.
- Uploads in Storage unter `{tenant_id}/...` speichern.
