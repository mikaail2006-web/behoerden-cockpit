# Production Readiness

Diese Datei beschreibt, was vor einem echten Portalbetrieb mit mehreren Nutzern erledigt sein muss.

## Muss vor Produktion fertig sein

- Supabase-Projekt produktiv angelegt
- Supabase Auth aktiviert
- Admin, Bearbeiter und Kunde als echte Rollen getestet
- RLS mit echten Sessions bestanden
- Storage-Bucket `behoerden-documents` privat
- serverseitige Portal-API mit Supabase JWT-Pruefung
- `SUPABASE_SERVICE_ROLE_KEY` nur serverseitig
- n8n Webhooks serverseitig geschuetzt
- KI/OCR-Endpunkt produktiv angebunden
- WhatsApp Provider produktiv angebunden
- Einwilligung/Opt-in fuer WhatsApp dokumentiert
- Backup- und Loeschprozess getestet

## Nicht fuer Produktion ausreichend

- lokale PIN allein
- lokale Datei-App ohne echten Server-Login
- Webhooks direkt aus dem Browser mit geheimen Tokens
- oeffentliche Drive-Links fuer sensible Dokumente
- Testnutzer oder Testdaten in produktiven Tabellen

## Produktionsabnahme

Vor Livegang ausfuellen:

```text
docs/abnahmeprotokoll.md
```

Vor echten Dokumenten abarbeiten:

```text
docs/echte-daten-starten.md
```

Die Fertigstellungsstufen liegen in:

```text
docs/fertigstellung.md
```

## Mindesttests

- `Status-Behörden-Cockpit.command`
- `docs/portal-demo-testen.md`
- `supabase/004_rls_test_queries.sql`
- Upload mit unkritischem Dokument
- Backup/Export-Test
- Loesch-/Archiv-Test

## Empfehlung

Erst mit einem Supabase-Testprojekt und unkritischen Dokumenten arbeiten. Danach eine kleine Pilotphase mit echten Daten, aber nur einem eng begrenzten Nutzerkreis.
Der Ablauf fuer diese Pilotphase liegt in `docs/pilotplan.md`.
