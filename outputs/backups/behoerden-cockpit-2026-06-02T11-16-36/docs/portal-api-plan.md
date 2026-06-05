# Portal API Plan

Dieser Plan beschreibt die spaeteren geschuetzten Server-Endpunkte fuer das Behoerden-Cockpit Portal.

Der maschinenlesbare API-Vertrag liegt in `api/portal-openapi.yaml`.
Die Rollen- und Endpunktfreigaben liegen in `api/portal-permissions.json`.
Die serverseitige Zugriffshilfe liegt in `api/portal-access.mjs` und kann mit `api/portal-access.test.mjs` geprueft werden.
Die serverseitige Env-Pruefung liegt in `api/portal-env.mjs` und kann mit `api/portal-env.test.mjs` geprueft werden.
Der Vertrag zwischen OpenAPI und Rollenmatrix wird mit `api/portal-contract.test.mjs` geprueft.
Ein minimales Server-Beispiel ohne Framework liegt in `api/portal-server.example.mjs`.
Das Server-Beispiel meldet beim Start, ob echte Env-Werte gesetzt sind oder ob es im Demo-Modus laeuft.
Die lokale Demo-Testanleitung liegt in `docs/portal-demo-testen.md`.
Die benoetigten Umgebungsvariablen sind in `api/.env.example` dokumentiert.

## Auth

Alle Endpunkte muessen einen gueltigen Supabase-User voraussetzen. Die Rolle kommt aus `profiles.role`, der Mandant aus `profiles.tenant_id`.

## Endpunkte

| Methode | Pfad | Rollen | Zweck |
| --- | --- | --- | --- |
| `GET` | `/api/me` | admin, bearbeiter, kunde | Profil, Rolle und Tenant laden |
| `GET` | `/api/health` | admin, bearbeiter, kunde | API-Status und Demo-/Konfigurationsmodus pruefen |
| `GET` | `/api/permissions` | admin, bearbeiter | Rollen- und Endpunktmatrix laden |
| `GET` | `/api/cases` | admin, bearbeiter, kunde | Vorgangsliste laden |
| `POST` | `/api/cases` | admin, bearbeiter | Vorgang anlegen |
| `PATCH` | `/api/cases/:id` | admin, bearbeiter | Vorgang aktualisieren |
| `GET` | `/api/documents` | admin, bearbeiter, kunde | Dokumente laden |
| `POST` | `/api/documents/upload` | admin, bearbeiter, kunde | Datei hochladen und analysieren |
| `GET` | `/api/deadlines` | admin, bearbeiter, kunde | Fristen laden |
| `PATCH` | `/api/deadlines/:id` | admin, bearbeiter | Frist aktualisieren |
| `GET` | `/api/tasks` | admin, bearbeiter, kunde | Aufgaben laden |
| `PATCH` | `/api/tasks/:id` | admin, bearbeiter, kunde | Aufgabe erledigen oder kommentieren |
| `POST` | `/api/messages` | admin, bearbeiter, kunde | Sichere Nachricht senden |
| `GET` | `/api/audit-log` | admin, bearbeiter | Aktivitaeten laden |

## Upload-Ablauf

1. Portal prueft Supabase-Session.
2. Datei wird in `behoerden-documents/{tenant_id}/{case_id}/...` gespeichert.
3. Metadaten werden in `documents` geschrieben.
4. Server ruft n8n/OCR/KI-Workflow auf.
5. Analyse aktualisiert `documents`, `deadlines`, `tasks` und `audit_log`.

## Sicherheitsregeln

- Kunden duerfen nur Daten ihres eigenen `tenant_id` lesen.
- Kunden duerfen keine Fristen oder Kontakte direkt bearbeiten.
- Drive/n8n Tokens duerfen nie im Browser liegen.
- `SUPABASE_SERVICE_ROLE_KEY` darf nur serverseitig genutzt werden.
- Jede Aenderung schreibt einen Eintrag in `audit_log`.
