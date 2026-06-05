# Heute starten

Kurzer Ablauf ab dem erreichten Stand am 2026-06-02.

Als Terminalanzeige per Doppelklick:

```text
Heute-Starten.command
```

## 1. Basis pruefen

```text
Status-Behörden-Cockpit.command
```

## 2. Stand pruefen

- Supabase-Testprojekt, RLS und Portal-API sind getestet.
- unkritischer Upload-Test ist bestanden.
- lokale OCR/KI-Regeln sind getestet.
- WhatsApp-Reminder-Logik ist lokal getestet.

Details:

```text
docs/supabase-testprotokoll.md
docs/unkritischer-upload-test.md
docs/ocr-ki-analyse-n8n.md
docs/whatsapp-fristen-erinnerung-n8n.md
```

## 3. Naechste produktive Integrationen

- WhatsApp Business Credential und Phone-Number-ID in n8n eintragen
- WhatsApp-Template `frist_erinnerung_de` in Meta freigeben
- externen KI-Endpunkt und Modell in n8n eintragen
- jeweils nur mit unkritischen Testdaten pruefen

## 4. Vor echten sensiblen Daten

- `docs/echte-daten-starten.md` abhaken
- `docs/abnahmeprotokoll.md` ausfuellen
- Drive-, Sheet-, n8n- und Supabase-Zugriffe pruefen
- keine echten sensiblen Dokumente hochladen, bevor diese Punkte erledigt sind
