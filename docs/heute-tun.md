# Heute tun

Kurze Arbeitsliste fuer den naechsten konkreten Termin.

## Stand: 2026-06-02

Die lokale App und Portal-API-Demo sind vorbereitet. Heute geht es um den echten Supabase-Test mit unkritischen Daten.
Die kompakte Klick-Reihenfolge liegt in `docs/heute-starten.md`.

## Ziel heute

Supabase-Testprojekt ausfuehren, Portal Live-Test pruefen und danach entscheiden, ob die App fuer einen unkritischen Upload-Test bereit ist.

## Schritte

1. `Status-Behörden-Cockpit.command` ausfuehren.
2. Supabase-Testprojekt anlegen.
3. `Copy-Supabase-Setup.command` ausfuehren und SQL im Supabase SQL Editor starten.
4. drei Testnutzer anlegen: admin, bearbeiter, kunde.
5. `Copy-Supabase-Testprofile.command` ausfuehren.
6. `Copy-Supabase-Testdaten.command` ausfuehren.
7. `Copy-Supabase-RLS-Test.command` mit allen drei Rollen pruefen.
8. `Start-Portal-Demo-Supabase.command` starten.
9. `Copy-Supabase-Access-Token.command` fuer einen Testnutzer ausfuehren.
10. `Check-Portal-Bearer.command` ausfuehren.
11. Ergebnis in `docs/supabase-testprotokoll.md` dokumentieren.

## Wenn Zeit bleibt

- unkritisches Test-PDF hochladen
- `docs/unkritischer-upload-test.md` abhaken
- Drive-Ablage und Google-Sheet-Eintraege pruefen
- `docs/abnahmeprotokoll.md` vorbereiten

## Nicht heute

- keine echten sensiblen Dokumente hochladen, bevor `docs/echte-daten-starten.md` abgearbeitet ist
- keine Service-Role-Keys in App, Sheet oder Doku kopieren
