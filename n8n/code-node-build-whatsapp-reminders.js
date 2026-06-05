export function buildWhatsAppReminders(rows, options = {}) {
  const defaultReminderDays = new Set([30, 14, 7, 3, 1, 0]);
  const today = options.today ? new Date(`${options.today}T00:00:00`) : new Date();
  today.setHours(0, 0, 0, 0);
  const todayValue = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const reminders = [];

  function normalizePhone(value) {
    return String(value || "").replace(/[^\d+]/g, "");
  }

  function validPhone(value) {
    return /^\+[1-9]\d{7,14}$/.test(value);
  }

  function levelForDays(days) {
    if (days <= 1) return "critical";
    if (days <= 7) return "high";
    if (days <= 14) return "medium";
    return "info";
  }

  function dayText(days) {
    if (days < 0) return `seit ${Math.abs(days)} Tag${Math.abs(days) === 1 ? "" : "en"} überfällig`;
    if (days === 0) return "heute";
    if (days === 1) return "morgen";
    return `in ${days} Tagen`;
  }

  function hasOptIn(row) {
    const raw = row.WhatsAppOptIn ?? row.OptIn ?? row.Einwilligung ?? row.whatsapp_opt_in;
    if (raw === undefined || raw === "") return true;
    return /^(ja|yes|true|1|ok|opt-in)$/i.test(String(raw).trim());
  }

  for (const row of rows) {
    if (String(row.Status || "").toLowerCase() === "erledigt") continue;
    if (!row.Fristdatum) continue;
    if (String(row.LetzteErinnerung || "").startsWith(todayValue)) continue;
    if (!hasOptIn(row)) continue;

    const recipientPhone = normalizePhone(row.Telefon);
    if (!validPhone(recipientPhone)) continue;

    const reminderDays = Number(row.ErinnerungsTage || 0);
    const allowedDays = reminderDays > 0 ? new Set([reminderDays, 3, 1, 0]) : defaultReminderDays;
    const deadline = new Date(`${row.Fristdatum}T00:00:00`);
    if (Number.isNaN(deadline.getTime())) continue;

    const days = Math.ceil((deadline - today) / 86400000);
    if (days >= 0 && !allowedDays.has(days)) continue;

    const area = row.Bereich || "Behörden-Cockpit";
    const title = row.Fristtitel || "Frist prüfen";
    const nextStep = row.NaechsterSchritt || "Nächsten Schritt im Cockpit prüfen";
    const authority = row.BehoerdeName || "Behörde";
    const dueText = dayText(days);
    const message = `${area}: ${title} bei ${authority} läuft ${dueText} ab (${row.Fristdatum}). ${nextStep}.`;
    const idPart = row.VorgangsID || Math.random().toString(36).slice(2, 8);

    reminders.push({
      frist_id: `${row.VorgangsID || "FRIST"}-${row.Fristdatum}`,
      vorgang_id: row.VorgangsID || "",
      titel: title,
      bereich: area,
      fristdatum: row.Fristdatum,
      behoerdeName: authority,
      email: row.Email || "",
      daysRemaining: days,
      dueText,
      level: levelForDays(days),
      recipientPhone,
      templateParams: [area, title, dueText, row.Fristdatum],
      message,
      auditId: `LOG-${Date.now()}-${idPart}`,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    });
  }

  return reminders;
}
