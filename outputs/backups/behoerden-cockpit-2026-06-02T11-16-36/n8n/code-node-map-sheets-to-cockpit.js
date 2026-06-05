const rowsBySheet = {};

for (const item of items) {
  const sheetName = item.json.sheetName || item.json.tab || item.json.source || "unknown";
  rowsBySheet[sheetName] = rowsBySheet[sheetName] || [];
  rowsBySheet[sheetName].push(item.json);
}

const areas = [
  "EM-Rente",
  "Pflegegrad 2",
  "GdB 100",
  "Wohngeld",
  "Kinderzuschlag",
  "Krankenkasse",
  "Arztberichte",
  "Parkerleichterungen",
  "Selbstständigkeit",
  "Steuern"
];

const cases = (rowsBySheet.Vorgaenge || []).map((row) => ({
  id: row.vorgang_id,
  area: row.bereich,
  authority: row.behoerde,
  status: row.status,
  priority: row.prioritaet,
  next: row.naechster_schritt,
  progress: Number(row.fortschritt || 0)
}));

const documents = (rowsBySheet.Dokumente || []).map((row) => ({
  id: row.dokument_id,
  name: row.dateiname,
  area: row.bereich,
  type: row.dokumenttyp,
  status: row.ki_status,
  date: row.eingangsdatum,
  driveUrl: row.drive_url
}));

function deadlineEscalation(row) {
  if (row.eskalation) return row.eskalation;
  const dateValue = row.Fristdatum || row.fristdatum;
  if (!dateValue) return "ok";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(`${dateValue}T00:00:00`);
  const days = Math.ceil((deadline - today) / 86400000);
  if (days <= 3) return "critical";
  if (days <= Number(row.ErinnerungsTage || 7)) return "soon";
  return "ok";
}

const deadlines = (rowsBySheet.Fristen || [])
  .map((row, index) => {
    const date = row.Fristdatum || row.fristdatum;
    const caseId = row.VorgangsID || row.vorgang_id || "";
    return {
      id: row.frist_id || `F-${caseId || index + 1}-${date || "offen"}`,
      caseId,
      title: row.Fristtitel || row.titel || "Frist prüfen",
      area: row.Bereich || row.bereich || "",
      date,
      escalation: deadlineEscalation(row),
      done: String(row.Status || row.status || "").toLowerCase() === "erledigt",
      authority: row.BehoerdeName || "",
      phone: row.Telefon || "",
      email: row.Email || "",
      nextStep: row.NaechsterSchritt || "",
      lastReminder: row.LetzteErinnerung || ""
    };
  })
  .filter((row) => row.date);

const checklists = (rowsBySheet.Checklisten || []).map((row) => ({
  id: row.checklist_id,
  area: row.bereich,
  title: row.titel,
  description: row.beschreibung,
  done: row.status === "Erledigt"
}));

const tasks = (rowsBySheet.Aufgaben || []).map((row) => ({
  id: row.aufgabe_id,
  caseId: row.vorgang_id,
  title: row.titel,
  area: row.bereich,
  dueDate: row.faelligkeit,
  priority: row.prioritaet,
  done: row.status === "Erledigt"
}));

const contacts = (rowsBySheet.Kontakte || []).map((row) => ({
  id: row.kontakt_id,
  organization: row.organisation,
  name: row.ansprechpartner,
  area: row.bereich,
  type: row.typ,
  email: row.email,
  phone: row.telefon
}));

const auditLog = (rowsBySheet.Audit_Log || []).map((row) => ({
  id: row.log_id,
  timestamp: row.zeitpunkt,
  action: row.aktion,
  object: row.objekt,
  area: row.bereich,
  details: row.details,
  source: row.quelle,
  level: row.level
}));

const automations = (rowsBySheet.Automationen || []).map((row) => ({
  name: row.name,
  status: row.status,
  description: row.beschreibung,
  lastRun: row.last_run
}));

const analyses = (rowsBySheet.KI_Analysen || []).map((row) => ({
  documentName: row.dokument_name,
  summary: row.zusammenfassung,
  risk: row.risiko,
  nextStep: row.naechster_schritt
}));

return [
  {
    json: {
      areas,
      cases,
      documents,
      deadlines,
      checklists,
      tasks,
      contacts,
      auditLog,
      automations,
      analyses
    }
  }
];
