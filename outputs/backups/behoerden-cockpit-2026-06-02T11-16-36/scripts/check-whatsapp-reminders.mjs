import assert from "node:assert/strict";
import { buildWhatsAppReminders } from "../n8n/code-node-build-whatsapp-reminders.js";

const base = {
  Fristdatum: "2026-06-09",
  Fristtitel: "Bescheid Frist prüfen",
  Bereich: "EM-Rente",
  BehoerdeName: "Deutsche Rentenversicherung",
  VorgangsID: "EMR-2026-001",
  Telefon: "+49 123 4567890",
  ErinnerungsTage: "7",
  Status: "Offen",
  NaechsterSchritt: "Bescheid prüfen",
};

const reminders = buildWhatsAppReminders([base], { today: "2026-06-02" });
assert.equal(reminders.length, 1);
assert.equal(reminders[0].recipientPhone, "+491234567890");
assert.equal(reminders[0].dueText, "in 7 Tagen");
assert.equal(reminders[0].level, "high");
assert.deepEqual(reminders[0].templateParams, ["EM-Rente", "Bescheid Frist prüfen", "in 7 Tagen", "2026-06-09"]);

assert.equal(buildWhatsAppReminders([{ ...base, Status: "Erledigt" }], { today: "2026-06-02" }).length, 0);
assert.equal(buildWhatsAppReminders([{ ...base, Telefon: "123456" }], { today: "2026-06-02" }).length, 0);
assert.equal(buildWhatsAppReminders([{ ...base, WhatsAppOptIn: "nein" }], { today: "2026-06-02" }).length, 0);
assert.equal(buildWhatsAppReminders([{ ...base, LetzteErinnerung: "2026-06-02 08:00" }], { today: "2026-06-02" }).length, 0);

const overdue = buildWhatsAppReminders([{ ...base, Fristdatum: "2026-06-01" }], { today: "2026-06-02" });
assert.equal(overdue.length, 1);
assert.equal(overdue[0].dueText, "seit 1 Tag überfällig");
assert.equal(overdue[0].level, "critical");

console.log("whatsapp reminder checks ok");
