# WhatsApp-Fristenerinnerung mit n8n

Dieser Workflow prüft täglich offene Fristen und sendet eine WhatsApp-Erinnerung.

## Workflow importieren

Importiere:

`n8n/workflow-fristen-whatsapp-erinnerung.json`

Danach im Workflow ersetzen:

- `GOOGLE_SHEET_ID_HERE` durch die echte Google-Sheet-ID
- `REPLACE_WITH_GOOGLE_SHEETS_CREDENTIAL_ID` durch die Google-Sheets-Credential
- `REPLACE_WITH_WHATSAPP_CREDENTIAL_ID` durch die WhatsApp-Business-Credential
- `WHATSAPP_PHONE_NUMBER_ID` durch die Phone-Number-ID aus Meta
- `WHATSAPP_RECIPIENT_PHONE_HERE` durch die Zielnummer im internationalen Format

## Zeitplan

Der Workflow läuft täglich um 08:00 Uhr in der Zeitzone `Europe/Berlin`.

## Erinnerungstage

Es wird nur erinnert, wenn eine offene Frist in genau diesen Abständen liegt:

- 30 Tage
- 14 Tage
- 7 Tage
- 3 Tage
- 1 Tag
- 0 Tage

Erledigte Fristen werden ignoriert.

## Sicherheitsregeln

Der Workflow sendet nur, wenn:

- `Status` nicht `Erledigt` ist
- `Fristdatum` gueltig ist
- `Telefon` im internationalen Format vorhanden ist, z. B. `+491234567890`
- `LetzteErinnerung` nicht bereits am selben Tag gesetzt wurde
- falls eine Opt-in-Spalte vorhanden ist, der Wert `ja`, `yes`, `true`, `1`, `ok` oder `opt-in` ist

Ueberfaellige Fristen werden als `critical` eingestuft und maximal einmal pro Tag erneut erinnert.

## Nachrichtenvorlage

Für produktive WhatsApp-Business-Nachrichten sollte in Meta eine Template-Nachricht angelegt und freigegeben werden:

- Template-Name: `frist_erinnerung_de`
- Sprache: `de`
- Body: `{{1}}: {{2}} läuft {{3}} ab ({{4}}). Bitte Unterlagen prüfen und nächsten Schritt im Cockpit kontrollieren.`

Beispiel:

`EM-Rente: Widerspruchsfrist EM-Rente prüfen läuft in 14 Tagen ab (2026-06-12). Bitte Unterlagen prüfen und nächsten Schritt im Cockpit kontrollieren.`

## Protokollierung

Nach erfolgreichem Versand schreibt n8n eine Zeile in `Audit_Log`:

- Aktion: `WhatsApp-Erinnerung gesendet`
- Objekt: `frist_id`
- Bereich: Bereich der Frist
- Details: gesendeter Nachrichtentext
- Quelle: `n8n`
- Level: `info`, `medium`, `high` oder `critical`

## Testmodus

Für den ersten Test kann der WhatsApp-Node durch einen E-Mail-, Telegram- oder NoOp-Node ersetzt werden. Die Filterlogik und der Audit-Log bleiben gleich.

Die lokale Filterlogik kann ohne WhatsApp-Credential geprueft werden:

```bash
node scripts/check-whatsapp-reminders.mjs
```

Erwartetes Ergebnis:

```text
whatsapp reminder checks ok
```
