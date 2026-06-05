# Supabase Testprotokoll

Dieses Protokoll nach dem Supabase-Testlauf ausfuellen. Es ist fuer das Testprojekt gedacht, bevor echte Portal-Daten genutzt werden.

## Projekt

| Punkt | Eintrag |
| --- | --- |
| Datum | `2026-06-02` |
| Supabase Projekt | `szopcvtlzxbfwfhazhnc` |
| Tester | `Murat Kocyigit` |
| Ergebnis | `Setup, RLS, Portal-API und Upload-Test bestanden` |

## 1. Setup

- [x] `Copy-Supabase-Setup.command` ausgefuehrt
- [x] SQL im Supabase SQL Editor ausgefuehrt
- [x] Tabellen `profiles`, `cases`, `documents`, `deadlines`, `tasks`, `audit_log` vorhanden
- [x] Storage Bucket `behoerden-documents` vorhanden
- [x] Bucket ist nicht oeffentlich
- [x] `supabase/005_security_advisor_fix.sql` ausgefuehrt
- [x] Supabase Advisor meldet keine Security- oder Performance-Issues

## 2. Testprofile

- [x] Admin-Testnutzer in Supabase Auth angelegt
- [x] Bearbeiter-Testnutzer in Supabase Auth angelegt
- [x] Kunde-Testnutzer in Supabase Auth angelegt
- [x] `supabase/006_create_test_auth_users.sql` ausgefuehrt
- [x] Profile sind in `public.profiles` sichtbar
- [x] Rollen sind korrekt: `admin`, `bearbeiter`, `kunde`

## 3. Testdaten

- [x] `supabase/007_create_rls_test_data.sql` ausgefuehrt
- [x] Testvorgang wurde angelegt
- [x] Testdokument wurde angelegt
- [x] Testfrist wurde angelegt
- [x] Testaufgabe wurde angelegt
- [x] Audit-Eintrag wurde angelegt

## 4. RLS-Pruefung

- [x] `supabase/010_rls_final_status_test.sql` als Admin simuliert
- [x] `supabase/010_rls_final_status_test.sql` als Bearbeiter simuliert
- [x] `supabase/010_rls_final_status_test.sql` als Kunde simuliert
- [x] Jede Rolle sieht nur die eigene `tenant_id`
- [x] Fremde `tenant_id` kann nicht gelesen werden
- [x] Fremde `tenant_id` kann nicht geschrieben werden
- [x] Kunde sieht keine fremden Mandantendaten

## 5. Cleanup

- [ ] `Copy-Supabase-Cleanup.command` ausgefuehrt
- [ ] Testvorgang entfernt
- [ ] Testdokument entfernt
- [ ] Testfrist entfernt
- [ ] Testaufgabe entfernt
- [ ] Audit-Testeintrag entfernt

## Ergebnisnotizen

Was hat funktioniert?

- Supabase-Gesamtsetup wurde im SQL Editor erfolgreich ausgefuehrt.
- Security-Advisor-Fix wurde erfolgreich ausgefuehrt.
- Supabase Advisor meldet danach `no issues`.
- Drei Testnutzer und Profile wurden erfolgreich angelegt.
- RLS-Fremdmandant-Test wurde fuer Admin, Bearbeiter und Kunde bestanden.
- Portal-API wurde mit echtem Supabase Admin-Access-Token getestet.
- `/api/me`, `/api/cases`, `/api/documents`, `/api/deadlines` und `/api/tasks` liefern Status 200.
- Listen-Endpunkte liefern je 1 Supabase-Testdatensatz.
- PATCH fuer Vorgang, Frist und Aufgabe wurde erfolgreich mit Supabase-Testdaten ausgefuehrt.
- Echte Upload-Strecke wurde mit unkritischer Test-PDF erfolgreich getestet.
- Upload wurde in Google Drive unter `01_EM-Rente/04_Bescheide` abgelegt.
- Google-Sheet-Datenbank wurde durch den Upload aktualisiert.
- Automatische Analyse erkannte Risiko `hoch` und Frist bis `2026-07-02`.

Was muss nachgebessert werden?

- KI/OCR-Auswertung produktiv feinjustieren.
- WhatsApp-Erinnerungen produktiv anbinden.

Freigabe fuer naechsten Schritt:

- [x] Portal-API darf an Supabase-Testprojekt angebunden werden
- [ ] Noch keine echten Kundendaten verwenden
