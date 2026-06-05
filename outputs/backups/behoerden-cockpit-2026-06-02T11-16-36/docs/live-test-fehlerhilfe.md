# Live-Test Fehlerhilfe

Kurze Hilfe fuer den Supabase- und Portal-Live-Test.

## Portal zeigt weiter `mode: demo`

Ursache:

- Portal wurde mit `Start-Portal-Demo.command` statt `Start-Portal-Demo-Supabase.command` gestartet.
- Supabase URL oder publishable public key fehlen.

Loesung:

1. Portal-Demo stoppen.
2. `Start-Portal-Demo-Supabase.command` starten.
3. Supabase URL und publishable public key neu eingeben.
4. `/api/health` erneut pruefen.

## `unauthorized`

Ursache:

- Bearer Token fehlt oder ist abgelaufen.
- Testnutzer existiert nicht mehr.
- Profil in `public.profiles` fehlt.

Loesung:

1. `Copy-Supabase-Access-Token.command` neu ausfuehren.
2. `Check-Portal-Bearer.command` erneut starten.
3. Falls es weiter fehlschlaegt: `Copy-Supabase-Testprofile.command` erneut mit den Auth User IDs ausfuehren.

## `forbidden`

Ursache:

- Rolle darf den Endpunkt nicht nutzen.
- Kunde versucht Fristen, Vorgang oder Audit-Log zu bearbeiten/lesen.

Loesung:

- Fuer `/api/permissions` und `/api/audit-log` Bearbeiter oder Admin testen.
- Fuer Kundenrolle nur erlaubte Endpunkte testen: `/api/me`, `/api/cases`, `/api/documents`, `/api/deadlines`, `/api/tasks`, eigene Aufgaben-PATCH.

## Listen sind leer

Ursache:

- Testdaten wurden noch nicht angelegt.
- RLS zeigt nur den eigenen Mandanten.
- Der eingeloggte Testnutzer hat eine andere `tenant_id`.

Loesung:

1. `Copy-Supabase-Testdaten.command` ausfuehren.
2. Mit demselben Testnutzer erneut `Copy-Supabase-Access-Token.command` ausfuehren.
3. `Check-Portal-Bearer.command` erneut starten.

## RLS-Test schlaegt fehl

Ursache:

- Profile wurden mit falschen Auth User IDs angelegt.
- Testnutzer liegen in unterschiedlichen Mandanten, obwohl gleicher Mandant erwartet war.

Loesung:

1. Auth User IDs in Supabase Auth kopieren.
2. `Copy-Supabase-Testprofile.command` erneut ausfuehren.
3. Danach `Copy-Supabase-RLS-Test.command` wiederholen.

## Token oder Passwort versehentlich sichtbar

Sofortmassnahmen:

1. Terminalfenster schliessen.
2. Token nicht in Doku, App, Sheet oder Chat kopieren.
3. Wenn ein Token oeffentlich wurde: Testnutzer-Passwort in Supabase neu setzen.
