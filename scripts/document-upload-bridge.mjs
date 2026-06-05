import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const PORT = Number(process.env.PORT || 4180);
const execFileAsync = promisify(execFile);
const ROOT_FOLDER_ID = "1R0IZFaWM5B1mVLeIYwOqwnOo_L2Kutem";
const TOKEN = "2f6a43a6393e778ad0e881b79e74d3485a93d88988f87b8995412aeb61a200e0";
const SPREADSHEET_ID = "1FEnhO0S8fZzzoEKbXVLyX6mn6Su25GIZ4bJbtwd3eks";
const ROOT_FOLDER_URL = "https://drive.google.com/drive/folders/1R0IZFaWM5B1mVLeIYwOqwnOo_L2Kutem";
const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1FEnhO0S8fZzzoEKbXVLyX6mn6Su25GIZ4bJbtwd3eks/edit";
const PYTHON_BIN = "/Users/muratkocyigit/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";

const areaFolders = {
  "EM-Rente": "01_EM-Rente",
  "Pflegegrad 2": "02_Pflegegrad",
  "GdB 100": "03_GdB_100",
  Wohngeld: "04_Wohngeld",
  Kinderzuschlag: "05_Kinderzuschlag",
  Krankenkasse: "06_Krankenkasse",
  Arztberichte: "07_Arztberichte",
  Parkerleichterungen: "08_Parkerleichterungen",
  "Selbstständigkeit": "09_Selbstständigkeit",
  Steuern: "10_Steuern",
};

const typeFolders = {
  Antrag: "03_Antraege",
  Bescheid: "04_Bescheide",
  Widerspruch: "05_Widerspruch",
  Nachweis: "06_Nachweise",
  Arztbericht: "06_Nachweise",
  Dokument: "01_Eingang",
};

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
  "Steuern",
];

const sheetOrder = [
  "Dashboard",
  "Config",
  "Vorgaenge",
  "Vorgaenge_Detail",
  "Dokumente",
  "Fristen",
  "Checklisten",
  "Kontakte",
  "Aufgaben",
  "KI_Analysen",
  "Automationen",
  "Audit_Log",
  "Drive_Ordner",
];

const headers = {
  Dashboard: ["bereich", "offene_vorgaenge", "offene_fristen", "kritische_fristen", "letzte_aktualisierung"],
  Config: ["key", "value", "beschreibung"],
  Drive_Ordner: ["bereich", "ordner_typ", "ordner_name", "ordner_id", "ordner_url"],
};

const caseIdsByArea = {
  "EM-Rente": "EMR-2026-001",
  "Pflegegrad 2": "PG-2026-002",
  "GdB 100": "GDB-2026-003",
  Wohngeld: "WG-2026-004",
  Kinderzuschlag: "KIZ-2026-001",
  Krankenkasse: "KK-2026-005",
  Arztberichte: "ARZT-2026-001",
  Parkerleichterungen: "PARK-2026-001",
  "Selbstständigkeit": "SELBST-2026-001",
  Steuern: "ST-2026-001",
};

const authoritiesByArea = {
  "EM-Rente": "Deutsche Rentenversicherung",
  "Pflegegrad 2": "Pflegekasse",
  "GdB 100": "Versorgungsamt",
  Wohngeld: "Wohngeldstelle",
  Kinderzuschlag: "Familienkasse",
  Krankenkasse: "Krankenkasse",
  Arztberichte: "Arztpraxis",
  Parkerleichterungen: "Straßenverkehrsamt",
  "Selbstständigkeit": "Finanzamt",
  Steuern: "Finanzamt",
};

const contactDefaultsByArea = {
  "EM-Rente": { phone: "+491234567890", email: "kontakt@drv.de" },
  "Pflegegrad 2": { phone: "+491234567891", email: "kontakt@pflegekasse.de" },
  "GdB 100": { phone: "+491234567892", email: "kontakt@versorgungsamt.de" },
  Wohngeld: { phone: "+491234567893", email: "kontakt@wohngeld.de" },
  Kinderzuschlag: { phone: "+491234567894", email: "kontakt@familienkasse.de" },
  Krankenkasse: { phone: "+491234567895", email: "kontakt@krankenkasse.de" },
};

function jsonResponse(res, status, body) {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(body));
}

function statusPage(res) {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/html; charset=utf-8",
  });
  res.end(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Behörden-Cockpit Upload-Brücke</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f7f5; color: #17231f; }
    main { max-width: 760px; margin: 12vh auto; padding: 32px; }
    .panel { background: #fff; border: 1px solid #d9e3de; border-radius: 8px; padding: 28px; box-shadow: 0 16px 40px rgba(15, 46, 36, .08); }
    .badge { display: inline-block; padding: 7px 12px; border-radius: 999px; background: #e6f4ef; color: #0d7a5f; font-weight: 700; }
    h1 { margin: 18px 0 10px; font-size: clamp(28px, 4vw, 42px); line-height: 1.05; }
    p { color: #61706b; font-size: 18px; line-height: 1.55; }
    code { background: #eef3f1; padding: 3px 6px; border-radius: 5px; }
    a { color: #126b55; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <section class="panel">
      <span class="badge">Upload-Brücke läuft</span>
      <h1>Behörden-Cockpit Dienst ist aktiv</h1>
      <p>Diese Adresse ist der lokale Hintergrund-Dienst für echte Dokumenten-Uploads, Drive-Ablage, Analyse und Sheet-Sync.</p>
      <p>Die sichtbare App öffnest du weiter über <a href="http://127.0.0.1:4173/index.html">http://127.0.0.1:4173/index.html</a>.</p>
      <p>Upload-Endpunkt: <code>/document-check</code><br>Sync-Endpunkt: <code>/sync-sheet</code></p>
    </section>
  </main>
</body>
</html>`);
}

function sanitizeFilePart(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function colName(index) {
  let n = index + 1;
  let s = "";
  while (n) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function csvParse(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        value += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(value);
      value = "";
    } else if (ch === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (ch !== "\r") {
      value += ch;
    }
  }
  row.push(value);
  if (row.some((cell) => cell !== "")) rows.push(row);
  return rows;
}

async function readCsvSheet(name) {
  const text = await fs.readFile(path.resolve("data", "sheets", `${name}.csv`), "utf8");
  return csvParse(text);
}

function parseHeaderParams(header) {
  const params = {};
  for (const part of header.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawValue.length) continue;
    params[rawKey] = rawValue.join("=").replace(/^"|"$/g, "");
  }
  return params;
}

function parseMultipart(buffer, boundary) {
  const marker = Buffer.from(`--${boundary}`);
  const fields = {};
  let file = null;
  let offset = 0;

  while (offset < buffer.length) {
    const start = buffer.indexOf(marker, offset);
    if (start === -1) break;
    const partStart = start + marker.length;
    if (buffer.slice(partStart, partStart + 2).toString() === "--") break;
    const headerStart = partStart + 2;
    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), headerStart);
    if (headerEnd === -1) break;
    const bodyStart = headerEnd + 4;
    const next = buffer.indexOf(marker, bodyStart);
    if (next === -1) break;
    const rawBody = buffer.slice(bodyStart, Math.max(bodyStart, next - 2));
    const headers = buffer.slice(headerStart, headerEnd).toString("utf8").split("\r\n");
    const disposition = headers.find((line) => line.toLowerCase().startsWith("content-disposition")) || "";
    const contentType = headers.find((line) => line.toLowerCase().startsWith("content-type"))?.split(":").slice(1).join(":").trim() || "application/octet-stream";
    const params = parseHeaderParams(disposition);
    if (params.filename) {
      file = {
        fieldName: params.name,
        originalName: params.filename,
        contentType,
        buffer: rawBody,
      };
    } else if (params.name) {
      fields[params.name] = rawBody.toString("utf8");
    }
    offset = next;
  }

  return { fields, file };
}

async function readRequest(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

function caseIdForArea(area) {
  return caseIdsByArea[area] || "";
}

function authorityForArea(area) {
  return authoritiesByArea[area] || "";
}

function contactForArea(area) {
  return contactDefaultsByArea[area] || { phone: "", email: "" };
}

async function extractTextFromFile(file) {
  const isPdf = file.contentType?.includes("pdf") || file.originalName?.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "";

  const tmpPath = path.resolve("outputs", `ocr-${Date.now()}-${sanitizeFilePart(file.originalName)}.pdf`);
  const script = [
    "import sys",
    "from pypdf import PdfReader",
    "reader = PdfReader(sys.argv[1])",
    "text = []",
    "for page in reader.pages[:12]:",
    "    text.append(page.extract_text() or '')",
    "print('\\n'.join(text)[:20000])",
  ].join("\n");

  try {
    await fs.mkdir(path.dirname(tmpPath), { recursive: true });
    await fs.writeFile(tmpPath, file.buffer);
    const { stdout } = await execFileAsync(PYTHON_BIN, ["-c", script, tmpPath], {
      timeout: 20_000,
      maxBuffer: 1024 * 1024,
    });
    return stdout.trim();
  } catch {
    return "";
  } finally {
    await fs.rm(tmpPath, { force: true }).catch(() => {});
  }
}

function parseGermanDate(value) {
  const text = String(value || "").trim();
  let day;
  let month;
  let year;

  const iso = text.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    const german = text.match(/\b(\d{1,2})\.(\d{1,2})\.(20\d{2})\b/);
    if (!german) return "";
    day = Number(german[1]);
    month = Number(german[2]);
    year = Number(german[3]);
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
  return date.toISOString().slice(0, 10);
}

function findExplicitDeadline(text) {
  const lines = String(text || "").split(/\n+/);
  const datePattern = /(?:20\d{2}-\d{1,2}-\d{1,2}|\d{1,2}\.\d{1,2}\.20\d{2})/g;
  const deadlineWords = /frist|bis|spätestens|spaetestens|widerspruch|rechtsbehelf|antwort|rückmeldung|rueckmeldung|nachreich|einreichen/i;

  for (const line of lines) {
    if (!deadlineWords.test(line)) continue;
    const dates = line.match(datePattern) || [];
    for (const candidate of dates) {
      const parsed = parseGermanDate(candidate);
      if (parsed) return parsed;
    }
  }

  return "";
}

function findReferenceNumber(text) {
  const match = String(text || "").match(/(?:aktenzeichen|zeichen|kundennummer|versicherungsnummer|geschäftszeichen|geschaeftszeichen)\s*[:#-]?\s*([A-Z0-9ÄÖÜß./ -]{4,40})/i);
  return match ? match[1].trim().replace(/\s+/g, " ").slice(0, 40) : "";
}

function findAuthority(text, area) {
  const known = [
    "Deutsche Rentenversicherung",
    "Pflegekasse",
    "Versorgungsamt",
    "Wohngeldstelle",
    "Familienkasse",
    "Krankenkasse",
    "Finanzamt",
    "Straßenverkehrsamt",
    "Strassenverkehrsamt",
  ];
  const source = String(text || "");
  const found = known.find((name) => source.toLowerCase().includes(name.toLowerCase()));
  if (found === "Strassenverkehrsamt") return "Straßenverkehrsamt";
  return found || authorityForArea(area);
}

function uniqueList(values) {
  return [...new Set(values.filter(Boolean))];
}

function analyzeDocumentText({ text, area, documentType, normalizedFileName, originalFileName, incomingDate }) {
  const sourceText = String(text || "");
  const searchable = `${sourceText} ${normalizedFileName} ${originalFileName} ${area} ${documentType}`.toLowerCase();
  const findings = [];
  let risk = documentType === "Bescheid" ? "mittel" : "niedrig";
  let deadlineDays = documentType === "Bescheid" ? 14 : 21;
  let escalation = documentType === "Bescheid" ? "soon" : "ok";
  let priority = documentType === "Bescheid" ? "medium" : "low";

  if (/bewilligt|bewilligung|stattgegeben|genehmigt/.test(searchable)) {
    findings.push("Positive Entscheidung oder Bewilligung erkannt");
  }

  if (/widerspruch|rechtsbehelf|ablehnung|abgelehnt|nachforderung|frist|mahnung|anhörung|anhoerung|zahlungserinnerung/.test(searchable)) {
    risk = "hoch";
    deadlineDays = /widerspruch|rechtsbehelf/.test(searchable) ? 30 : 14;
    escalation = "critical";
    priority = "high";
    findings.push("Fristrelevante Begriffe erkannt");
  }

  if (/mahnung|vollstreckung|säumnis|saeumnis|letzte erinnerung|sofort/.test(searchable)) {
    risk = "kritisch";
    deadlineDays = 3;
    escalation = "critical";
    priority = "critical";
    findings.push("Kritisches Eskalationssignal erkannt");
  }

  if (/bescheid/.test(searchable)) findings.push("Dokumenttyp Bescheid erkannt");
  if (/nachweis|unterlage|anlage|beleg/.test(searchable)) findings.push("Mögliche fehlende oder erforderliche Nachweise erkannt");
  if (/arzt|befund|diagnose|bericht|gutachten/.test(searchable)) findings.push("Medizinische Unterlagen erkannt");
  if (/einkommen|steuer|bescheid|gewinn|rechnung|umsatz|elster/.test(searchable) && /selbst|finanzamt|steuer/.test(searchable)) {
    findings.push("Steuer- oder Selbstständigkeitsbezug erkannt");
  }
  if (!sourceText.trim()) findings.push("Text konnte nicht sicher ausgelesen werden; Analyse basiert auf Dateiname und Metadaten");

  const explicitDeadline = findExplicitDeadline(sourceText);
  const deadlineDate = explicitDeadline || addDays(incomingDate, deadlineDays);
  if (explicitDeadline) findings.push(`Konkretes Fristdatum erkannt: ${explicitDeadline}`);

  const caseId = caseIdForArea(area);
  const authority = findAuthority(sourceText, area);
  const referenceNumber = findReferenceNumber(sourceText);
  const summary = `${documentType} wurde dem Bereich ${area} zugeordnet. ${risk === "hoch" || risk === "kritisch" ? "Es wurden fristrelevante Signale erkannt." : "Frist und Nachweise sollten geprüft werden."}`;
  const referenceText = referenceNumber ? ` Aktenzeichen ${referenceNumber} gegenprüfen.` : "";
  const nextStep = `Dokument im Drive prüfen, Frist bis ${deadlineDate} bewerten und fehlende Nachweise ergänzen.${referenceText}`;

  return {
    risk,
    summary,
    findings: findings.length ? uniqueList(findings) : ["Google Drive Upload abgeschlossen", "Automatische Zuordnung erstellt"],
    nextStep,
    deadlineDate,
    deadlineTitle: `${documentType} Frist prüfen`,
    taskTitle: `Nachweise zu ${normalizedFileName} prüfen`,
    caseId,
    authority,
    referenceNumber,
    escalation,
    priority,
  };
}

async function getAccessToken() {
  const cfgPath = path.join(process.env.HOME, ".clasprc.json");
  const cfg = JSON.parse(await fs.readFile(cfgPath, "utf8"));
  const token = cfg.tokens.default;
  if (token.expiry_date && token.expiry_date > Date.now() + 60_000) return token.access_token;

  const body = new URLSearchParams({
    client_id: token.client_id,
    client_secret: token.client_secret,
    refresh_token: token.refresh_token,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body });
  if (!res.ok) throw new Error(`OAuth refresh failed: ${res.status} ${await res.text()}`);
  const fresh = await res.json();
  token.access_token = fresh.access_token;
  token.expiry_date = Date.now() + fresh.expires_in * 1000;
  await fs.writeFile(cfgPath, JSON.stringify(cfg, null, 2));
  return token.access_token;
}

async function google(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${options.method || "GET"} ${url} failed: ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

async function findChildFolder(token, parentId, name) {
  const q = [
    "mimeType='application/vnd.google-apps.folder'",
    "trashed=false",
    `name='${name.replaceAll("'", "\\'")}'`,
    `'${parentId}' in parents`,
  ].join(" and ");
  const result = await google(token, `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)&pageSize=1`);
  return result.files?.[0] || null;
}

async function resolveTargetFolder(token, area, documentType) {
  const mainName = areaFolders[area] || "01_EM-Rente";
  const subName = typeFolders[documentType] || "01_Eingang";
  const main = await findChildFolder(token, ROOT_FOLDER_ID, mainName);
  if (!main) throw new Error(`Hauptordner nicht gefunden: ${mainName}`);
  const sub = await findChildFolder(token, main.id, subName);
  if (!sub) throw new Error(`Unterordner nicht gefunden: ${mainName}/${subName}`);
  return { main, sub, path: `${mainName}/${subName}` };
}

async function uploadToDrive(token, file, fileName, folderId) {
  const boundary = `codex_upload_${Date.now()}`;
  const metadata = { name: fileName, parents: [folderId] };
  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\nContent-Type: ${file.contentType || "application/octet-stream"}\r\n\r\n`,
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([head, file.buffer, tail]);
  return google(token, "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,mimeType,createdTime", {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
}

async function logUpload(entry) {
  const outputPath = path.resolve("outputs/document-upload-log.json");
  let rows = [];
  try {
    rows = JSON.parse(await fs.readFile(outputPath, "utf8"));
  } catch {
    rows = [];
  }
  rows.unshift(entry);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(rows.slice(0, 200), null, 2));
}

async function readUploadLog() {
  try {
    return JSON.parse(await fs.readFile(path.resolve("outputs", "document-upload-log.json"), "utf8"));
  } catch {
    return [];
  }
}

async function readManualEntries() {
  try {
    return JSON.parse(await fs.readFile(path.resolve("outputs", "manual-entries.json"), "utf8"));
  } catch {
    return { cases: [], deadlines: [], tasks: [], contacts: [], checklists: [], auditLog: [], statusUpdates: [], itemUpdates: [] };
  }
}

async function logManualEntry(type, item) {
  const outputPath = path.resolve("outputs", "manual-entries.json");
  const entries = await readManualEntries();
  const key = {
    case: "cases",
    deadline: "deadlines",
    task: "tasks",
    contact: "contacts",
    checklist: "checklists",
    audit: "auditLog",
  }[type];
  if (!key) throw new Error(`Unbekannter Eintragstyp: ${type}`);
  entries[key] = [item, ...(entries[key] || [])].slice(0, 500);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(entries, null, 2));
}

async function logStatusUpdate(type, id, done) {
  const outputPath = path.resolve("outputs", "manual-entries.json");
  const entries = await readManualEntries();
  entries.statusUpdates = [
    { type, id, done: Boolean(done), updatedAt: new Date().toISOString() },
    ...(entries.statusUpdates || []).filter((item) => !(item.type === type && item.id === id)),
  ].slice(0, 1000);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(entries, null, 2));
}

async function logItemUpdate(type, item) {
  const outputPath = path.resolve("outputs", "manual-entries.json");
  const entries = await readManualEntries();
  entries.itemUpdates = [
    { type, item, updatedAt: new Date().toISOString() },
    ...(entries.itemUpdates || []).filter((entry) => !(entry.type === type && entry.item?.id === item.id)),
  ].slice(0, 1000);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(entries, null, 2));
}

function uploadToDocumentRow(upload) {
  return [
    upload.documentId,
    upload.analysis?.caseId || "",
    upload.area,
    upload.normalizedFileName,
    upload.documentType,
    upload.driveFile?.webViewLink || "",
    upload.incomingDate,
    upload.analysis ? "Analysiert" : "Nicht analysiert",
  ];
}

function uploadToPayloadDocument(upload) {
  return {
    id: upload.documentId,
    name: upload.normalizedFileName,
    area: upload.area,
    type: upload.documentType,
    status: upload.analysis ? "Analysiert" : "Nicht analysiert",
    date: upload.incomingDate,
    driveUrl: upload.driveFile?.webViewLink || "",
  };
}

function documentToRow(item) {
  return [
    item.id,
    item.caseId || "",
    item.area || "",
    item.name || "",
    item.type || "",
    item.driveUrl || "",
    item.date || "",
    item.status || "",
  ];
}

function uploadToPayloadAnalysis(upload) {
  if (!upload.analysis) return null;
  return {
    documentName: upload.normalizedFileName,
    summary: upload.analysis.summary,
    risk: upload.analysis.risk,
    nextStep: upload.analysis.nextStep,
  };
}

function uploadToPayloadDeadline(upload) {
  if (!upload.analysis?.deadlineDate) return null;
  return {
    id: `F-${upload.documentId.replace(/^DOC-/, "")}`,
    caseId: upload.analysis.caseId,
    title: upload.analysis.deadlineTitle,
    area: upload.area,
    date: upload.analysis.deadlineDate,
    escalation: upload.analysis.escalation,
    done: false,
  };
}

function uploadToPayloadTask(upload) {
  if (!upload.analysis?.deadlineDate) return null;
  return {
    id: `A-${upload.documentId.replace(/^DOC-/, "")}`,
    caseId: upload.analysis.caseId,
    title: upload.analysis.taskTitle,
    area: upload.area,
    dueDate: addDays(upload.incomingDate, 7),
    priority: upload.analysis.priority,
    done: false,
  };
}

function uploadToAnalysisRow(upload) {
  return [
    `AN-${upload.documentId.replace(/^DOC-/, "")}`,
    upload.documentId,
    upload.normalizedFileName,
    upload.analysis?.summary || "",
    upload.analysis?.risk || "",
    upload.analysis?.nextStep || "",
  ];
}

function uploadToDeadlineRow(upload) {
  const contact = contactForArea(upload.area);
  return [
    upload.analysis?.deadlineDate || "",
    upload.analysis?.deadlineTitle || `${upload.documentType} Frist prüfen`,
    upload.area,
    upload.analysis?.authority || authorityForArea(upload.area),
    upload.analysis?.caseId || "",
    contact.phone,
    contact.email,
    "7",
    "Offen",
    upload.analysis?.nextStep || `Dokument ${upload.normalizedFileName} prüfen`,
    upload.normalizedFileName,
    "",
    "",
  ];
}

function uploadToTaskRow(upload) {
  return [
    `A-${upload.documentId.replace(/^DOC-/, "")}`,
    upload.analysis?.caseId || "",
    upload.analysis?.taskTitle || `Dokument ${upload.normalizedFileName} prüfen`,
    upload.area,
    addDays(upload.incomingDate, 7),
    upload.analysis?.priority || "medium",
    "Offen",
  ];
}

function caseToRow(item) {
  return [item.id, item.area, item.status, item.priority, item.authority, item.reference || "", item.startDate || new Date().toISOString().slice(0, 10), item.next, item.progress || 0];
}

function deadlineToRow(item) {
  const contact = contactForArea(item.area);
  return [
    item.date,
    item.title,
    item.area,
    item.authority || authorityForArea(item.area),
    item.caseId,
    item.phone || contact.phone,
    item.email || contact.email,
    String(item.reminderDays || 7),
    item.done ? "Erledigt" : "Offen",
    item.nextStep || item.title,
    item.notes || "-",
    "",
    item.lastReminder || "",
  ];
}

function taskToRow(item) {
  return [item.id, item.caseId || "", item.title, item.area, item.dueDate, item.priority || "medium", item.done ? "Erledigt" : "Offen"];
}

function contactToRow(item) {
  return [item.id, item.organization, item.name, item.area, item.type, item.email || "", item.phone || ""];
}

function checklistToRow(item) {
  return [item.id, item.area, item.title, item.description || "", item.done ? "Erledigt" : "Offen"];
}

function auditToRow(item) {
  return [item.id, item.timestamp, item.action, item.object, item.area, item.details, item.source || "App", item.level || "info"];
}

function statusFor(type, id, manualEntries) {
  return (manualEntries.statusUpdates || []).find((item) => item.type === type && item.id === id);
}

function itemUpdateFor(type, id, manualEntries) {
  return (manualEntries.itemUpdates || []).find((entry) => entry.type === type && entry.item?.id === id)?.item || null;
}

function applyItemUpdatesToList(list, type, manualEntries) {
  return (list || []).map((item) => itemUpdateFor(type, item.id, manualEntries) || item);
}

function applyStatusUpdatesToPayload(cockpitPayload, manualEntries) {
  cockpitPayload.cases = applyItemUpdatesToList(cockpitPayload.cases || [], "case", manualEntries);
  cockpitPayload.deadlines = applyItemUpdatesToList(cockpitPayload.deadlines || [], "deadline", manualEntries);
  cockpitPayload.tasks = applyItemUpdatesToList(cockpitPayload.tasks || [], "task", manualEntries);
  cockpitPayload.contacts = applyItemUpdatesToList(cockpitPayload.contacts || [], "contact", manualEntries);
  cockpitPayload.checklists = applyItemUpdatesToList(cockpitPayload.checklists || [], "checklist", manualEntries);
  for (const type of ["deadlines", "tasks", "checklists"]) {
    cockpitPayload[type] = (cockpitPayload[type] || []).map((item) => {
      const update = statusFor(type.slice(0, -1), item.id, manualEntries);
      return update ? { ...item, done: update.done } : item;
    });
  }
}

function taskRowId(row) {
  return row[0];
}

function documentRowId(row) {
  return row[0];
}

function caseRowId(row) {
  return row[0];
}

function contactRowId(row) {
  return row[0];
}

function checklistRowId(row) {
  return row[0];
}

function deadlineRowId(row, index) {
  const date = row[0];
  const caseId = row[4];
  return `F-${caseId || index}-${date || "offen"}`;
}

function applyStatusUpdatesToRows(rows, type, idForRow, statusIndex, manualEntries) {
  return rows.map((row, index) => {
    if (index === 0) return row;
    const update = statusFor(type, idForRow(row, index), manualEntries);
    return update ? row.map((cell, cellIndex) => cellIndex === statusIndex ? (update.done ? "Erledigt" : "Offen") : cell) : row;
  });
}

function applyItemUpdatesToRows(rows, type, idForRow, itemToRow, manualEntries) {
  return rows.map((row, index) => {
    if (index === 0) return row;
    const update = itemUpdateFor(type, idForRow(row, index), manualEntries);
    if (update?.archived) return null;
    return update ? itemToRow(update) : row;
  }).filter(Boolean);
}

async function buildSpreadsheetWorkbook(uploadLog, manualEntries = { cases: [], deadlines: [], tasks: [], contacts: [], auditLog: [] }) {
  const wb = Workbook.create();
  for (const name of sheetOrder) wb.worksheets.add(name);

  uploadLog = uploadLog.map((upload) => {
    if (!upload?.normalizedFileName || upload.analysis) return upload;
    return {
      ...upload,
      analysis: analyzeDocumentText({
        text: upload.extractedTextPreview || "",
        area: upload.area,
        documentType: upload.documentType,
        normalizedFileName: upload.normalizedFileName,
        originalFileName: upload.originalFileName,
        incomingDate: upload.incomingDate,
      }),
    };
  });

  const now = new Date().toISOString();
  const cockpitPayload = JSON.parse(await fs.readFile(path.resolve("app", "cockpit-data.json"), "utf8"));
  const seenDocumentNames = new Set((cockpitPayload.documents || []).map((doc) => doc.name));
  const uploadedDocuments = uploadLog
    .filter((upload) => upload?.normalizedFileName && !seenDocumentNames.has(upload.normalizedFileName))
    .map(uploadToPayloadDocument);
  cockpitPayload.documents = [...uploadedDocuments, ...(cockpitPayload.documents || [])];
  cockpitPayload.documents = applyItemUpdatesToList(cockpitPayload.documents || [], "document", manualEntries).filter((item) => !item.archived);

  const seenAnalysisNames = new Set((cockpitPayload.analyses || []).map((item) => item.documentName));
  const uploadedAnalyses = uploadLog
    .filter((upload) => upload?.analysis && !seenAnalysisNames.has(upload.normalizedFileName))
    .map(uploadToPayloadAnalysis)
    .filter(Boolean);
  cockpitPayload.analyses = [...uploadedAnalyses, ...(cockpitPayload.analyses || [])];

  const seenDeadlineIds = new Set((cockpitPayload.deadlines || []).map((item) => item.id));
  const uploadedDeadlines = uploadLog
    .map(uploadToPayloadDeadline)
    .filter((item) => item && !seenDeadlineIds.has(item.id));
  cockpitPayload.deadlines = [...uploadedDeadlines, ...(cockpitPayload.deadlines || [])];

  const seenTaskIds = new Set((cockpitPayload.tasks || []).map((item) => item.id));
  const uploadedTasks = uploadLog
    .map(uploadToPayloadTask)
    .filter((item) => item && !seenTaskIds.has(item.id));
  cockpitPayload.tasks = [...uploadedTasks, ...(cockpitPayload.tasks || [])];

  const manualCases = applyItemUpdatesToList(manualEntries.cases || [], "case", manualEntries).filter((item) => !item.archived);
  const manualDeadlines = applyItemUpdatesToList(manualEntries.deadlines || [], "deadline", manualEntries).filter((item) => !item.archived);
  const manualTasks = applyItemUpdatesToList(manualEntries.tasks || [], "task", manualEntries).filter((item) => !item.archived);
  const manualContacts = applyItemUpdatesToList(manualEntries.contacts || [], "contact", manualEntries).filter((item) => !item.archived);
  const manualChecklists = applyItemUpdatesToList(manualEntries.checklists || [], "checklist", manualEntries).filter((item) => !item.archived);
  const manualAuditLog = manualEntries.auditLog || [];
  cockpitPayload.cases = [...manualCases, ...(cockpitPayload.cases || [])];
  cockpitPayload.deadlines = [...manualDeadlines, ...(cockpitPayload.deadlines || [])];
  cockpitPayload.tasks = [...manualTasks, ...(cockpitPayload.tasks || [])];
  cockpitPayload.contacts = [...manualContacts, ...(cockpitPayload.contacts || [])];
  cockpitPayload.checklists = [...manualChecklists, ...(cockpitPayload.checklists || [])];
  cockpitPayload.auditLog = [...manualAuditLog, ...(cockpitPayload.auditLog || [])];
  applyStatusUpdatesToPayload(cockpitPayload, manualEntries);
  cockpitPayload.cases = (cockpitPayload.cases || []).filter((item) => !item.archived);
  cockpitPayload.deadlines = (cockpitPayload.deadlines || []).filter((item) => !item.archived);
  cockpitPayload.tasks = (cockpitPayload.tasks || []).filter((item) => !item.archived);
  cockpitPayload.contacts = (cockpitPayload.contacts || []).filter((item) => !item.archived);
  cockpitPayload.checklists = (cockpitPayload.checklists || []).filter((item) => !item.archived);

  const baseDocuments = await readCsvSheet("Dokumente");
  const baseCases = await readCsvSheet("Vorgaenge");
  const baseDeadlines = await readCsvSheet("Fristen");
  const baseContacts = await readCsvSheet("Kontakte");
  const baseTasks = await readCsvSheet("Aufgaben");
  const baseAnalyses = await readCsvSheet("KI_Analysen");
  const baseAuditLog = await readCsvSheet("Audit_Log");
  const uploadedDocumentRows = uploadLog
    .filter((upload) => upload?.normalizedFileName)
    .map(uploadToDocumentRow);
  const documentRows = applyItemUpdatesToRows([baseDocuments[0], ...uploadedDocumentRows, ...baseDocuments.slice(1)], "document", documentRowId, documentToRow, manualEntries);
  const uploadedAnalysisRows = uploadLog
    .filter((upload) => upload?.analysis)
    .map(uploadToAnalysisRow);
  const uploadedDeadlineRows = uploadLog
    .filter((upload) => upload?.analysis)
    .map(uploadToDeadlineRow);
  const uploadedTaskRows = uploadLog
    .filter((upload) => upload?.analysis)
    .map(uploadToTaskRow);
  const configRows = [
    ["root_folder_id", ROOT_FOLDER_ID, "Google Drive Root-Ordner des Behörden-Cockpits."],
    ["root_folder_url", ROOT_FOLDER_URL, "Direktlink zum Root-Ordner."],
    ["spreadsheet_id", SPREADSHEET_ID, "Google-Sheet-ID."],
    ["spreadsheet_url", SPREADSHEET_URL, "Google-Sheet-Link."],
    ["n8n_data_api_url", "https://n8n.mkd-office.de/webhook/behoerden-cockpit-data", "Geschuetzter Webhook fuer Cockpit-Datenquelle."],
    ["document_upload_bridge_url", `http://127.0.0.1:${PORT}/document-check`, "Lokale Upload-Bruecke fuer echte Drive-Ablage."],
  ];

  const deadlineRows = applyItemUpdatesToRows([baseDeadlines[0], ...manualDeadlines.map(deadlineToRow), ...uploadedDeadlineRows, ...baseDeadlines.slice(1)], "deadline", deadlineRowId, deadlineToRow, manualEntries);
  const baseChecklists = await readCsvSheet("Checklisten");
  const checklistRows = applyItemUpdatesToRows([baseChecklists[0], ...manualChecklists.map(checklistToRow), ...baseChecklists.slice(1)], "checklist", checklistRowId, checklistToRow, manualEntries);
  const taskRows = applyItemUpdatesToRows([baseTasks[0], ...manualTasks.map(taskToRow), ...uploadedTaskRows, ...baseTasks.slice(1)], "task", taskRowId, taskToRow, manualEntries);

  const data = {
    Dashboard: [headers.Dashboard, ...areas.map((area) => [area, "", "", "", now])],
    Config: [headers.Config, ...configRows],
    Vorgaenge: [["payload"], [JSON.stringify(cockpitPayload)]],
    Vorgaenge_Detail: applyItemUpdatesToRows([baseCases[0], ...manualCases.map(caseToRow), ...baseCases.slice(1)], "case", caseRowId, caseToRow, manualEntries),
    Dokumente: documentRows,
    Fristen: applyStatusUpdatesToRows(deadlineRows, "deadline", deadlineRowId, 8, manualEntries),
    Checklisten: applyStatusUpdatesToRows(checklistRows, "checklist", checklistRowId, 4, manualEntries),
    Kontakte: applyItemUpdatesToRows([baseContacts[0], ...manualContacts.map(contactToRow), ...baseContacts.slice(1)], "contact", contactRowId, contactToRow, manualEntries),
    Aufgaben: applyStatusUpdatesToRows(taskRows, "task", taskRowId, 6, manualEntries),
    KI_Analysen: [baseAnalyses[0], ...uploadedAnalysisRows, ...baseAnalyses.slice(1)],
    Automationen: await readCsvSheet("Automationen"),
    Audit_Log: [baseAuditLog[0], ...manualAuditLog.map(auditToRow), ...baseAuditLog.slice(1)],
    Drive_Ordner: [headers.Drive_Ordner, ...uploadLog.map((upload) => [
      upload.area || "",
      "Upload",
      upload.targetPath || "",
      upload.driveFile?.id || "",
      upload.driveFile?.webViewLink || "",
    ])],
  };

  for (const name of sheetOrder) {
    const sheet = wb.worksheets.getItem(name);
    const rows = data[name]?.length ? data[name] : [[""]];
    const endCol = colName(rows[0].length - 1);
    sheet.getRange(`A1:${endCol}${rows.length}`).values = rows;
    sheet.getRange(`A1:${endCol}1`).format = {
      fill: "#1f4e79",
      font: { color: "#FFFFFF", bold: true },
    };
    sheet.getRange(`A:${endCol}`).format = { font: { name: "Aptos", size: 10 } };
  }

  const outPath = path.resolve("outputs", "behoerden-cockpit-datenbank-live.xlsx");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const output = await SpreadsheetFile.exportXlsx(wb);
  await output.save(outPath);
  return outPath;
}

async function replaceSpreadsheetFile(token, xlsxPath) {
  const boundary = `codex_sheet_update_${Date.now()}`;
  const metadata = {
    name: "Behoerden-Cockpit Datenbank",
    mimeType: "application/vnd.google-apps.spreadsheet",
  };
  const xlsx = await fs.readFile(xlsxPath);
  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`,
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([head, xlsx, tail]);
  return google(token, `https://www.googleapis.com/upload/drive/v3/files/${SPREADSHEET_ID}?uploadType=multipart&fields=id,name,webViewLink,modifiedTime`, {
    method: "PATCH",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
}

async function syncSpreadsheet(token) {
  const uploadLog = await readUploadLog();
  const manualEntries = await readManualEntries();
  const xlsxPath = await buildSpreadsheetWorkbook(uploadLog, manualEntries);
  return replaceSpreadsheetFile(token, xlsxPath);
}

async function handleUpload(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.searchParams.get("token") !== TOKEN) {
    jsonResponse(res, 401, { error: "Unauthorized" });
    return;
  }

  const contentType = req.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(.+)$/)?.[1];
  if (!boundary) {
    jsonResponse(res, 400, { error: "Multipart boundary fehlt" });
    return;
  }

  const { fields, file } = parseMultipart(await readRequest(req), boundary);
  if (!file) {
    jsonResponse(res, 400, { error: "Keine Datei im Upload gefunden" });
    return;
  }

  const area = fields.area || "EM-Rente";
  const documentType = fields.documentType || "Dokument";
  const originalFileName = file.originalName || fields.originalFileName || "Dokument.pdf";
  const extension = path.extname(originalFileName) || ".pdf";
  const incomingDate = new Date().toISOString().slice(0, 10);
  const normalizedFileName = fields.normalizedFileName || [
    incomingDate,
    sanitizeFilePart(area),
    sanitizeFilePart(documentType),
    "Murat-Kocyigit",
    sanitizeFilePart(path.basename(originalFileName, extension)),
  ].filter(Boolean).join("_") + extension.toLowerCase();

  const extractedText = await extractTextFromFile(file);
  const analysis = analyzeDocumentText({
    text: extractedText,
    area,
    documentType,
    normalizedFileName,
    originalFileName,
    incomingDate,
  });
  const token = await getAccessToken();
  const target = await resolveTargetFolder(token, area, documentType);
  const driveFile = await uploadToDrive(token, file, normalizedFileName, target.sub.id);
  const documentId = `DOC-${Date.now()}`;
  const sheetStatus = "pending_google_sheets_api";
  const upload = {
    documentId,
    area,
    documentType,
    normalizedFileName,
    originalFileName,
    incomingDate,
    driveFile,
    targetPath: target.path,
    spreadsheetId: SPREADSHEET_ID,
    sheetStatus,
    analysis,
    extractedTextPreview: extractedText.slice(0, 1500),
  };
  await logUpload(upload);
  const spreadsheet = await syncSpreadsheet(token);

  jsonResponse(res, 200, {
    title: `${documentType} gespeichert: ${normalizedFileName}`,
    fileName: normalizedFileName,
    risk: analysis.risk,
    summary: `${analysis.summary} Ablage: ${target.path}.`,
    findings: [
      "Google Drive Upload abgeschlossen",
      `Ablageordner: ${target.path}`,
      "Google-Sheet-Datenbank wurde aktualisiert",
      ...analysis.findings,
    ],
    nextStep: analysis.nextStep,
    deadlineDate: analysis.deadlineDate,
    authority: analysis.authority,
    referenceNumber: analysis.referenceNumber,
    driveUrl: driveFile.webViewLink,
    targetPath: target.path,
    sheetStatus: "updated",
    spreadsheetUrl: spreadsheet.webViewLink,
  });
}

async function handleManualEntry(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.searchParams.get("token") !== TOKEN) {
    jsonResponse(res, 401, { error: "Unauthorized" });
    return;
  }

  const body = JSON.parse((await readRequest(req)).toString("utf8") || "{}");
  const { type, item } = body;
  if (!type || !item || typeof item !== "object") {
    jsonResponse(res, 400, { error: "type und item sind erforderlich" });
    return;
  }

  await logManualEntry(type, item);
  const token = await getAccessToken();
  const spreadsheet = await syncSpreadsheet(token);
  jsonResponse(res, 200, { ok: true, type, item, spreadsheetUrl: spreadsheet.webViewLink });
}

async function handleStatusUpdate(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.searchParams.get("token") !== TOKEN) {
    jsonResponse(res, 401, { error: "Unauthorized" });
    return;
  }

  const body = JSON.parse((await readRequest(req)).toString("utf8") || "{}");
  const { type, id, done } = body;
  if (!type || !id) {
    jsonResponse(res, 400, { error: "type und id sind erforderlich" });
    return;
  }

  await logStatusUpdate(type, id, done);
  const token = await getAccessToken();
  const spreadsheet = await syncSpreadsheet(token);
  jsonResponse(res, 200, { ok: true, type, id, done: Boolean(done), spreadsheetUrl: spreadsheet.webViewLink });
}

async function handleItemUpdate(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.searchParams.get("token") !== TOKEN) {
    jsonResponse(res, 401, { error: "Unauthorized" });
    return;
  }

  const body = JSON.parse((await readRequest(req)).toString("utf8") || "{}");
  const { type, item } = body;
  if (!type || !item?.id) {
    jsonResponse(res, 400, { error: "type und item.id sind erforderlich" });
    return;
  }

  await logItemUpdate(type, item);
  const token = await getAccessToken();
  const spreadsheet = await syncSpreadsheet(token);
  jsonResponse(res, 200, { ok: true, type, item, spreadsheetUrl: spreadsheet.webViewLink });
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    jsonResponse(res, 204, {});
    return;
  }
  if (req.method === "GET" && (req.url === "/" || req.url?.startsWith("/?"))) {
    statusPage(res);
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/document-check")) {
    handleUpload(req, res).catch((error) => {
      console.error(error);
      jsonResponse(res, 500, { error: error.message });
    });
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/manual-entry")) {
    handleManualEntry(req, res).catch((error) => {
      console.error(error);
      jsonResponse(res, 500, { error: error.message });
    });
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/status-update")) {
    handleStatusUpdate(req, res).catch((error) => {
      console.error(error);
      jsonResponse(res, 500, { error: error.message });
    });
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/item-update")) {
    handleItemUpdate(req, res).catch((error) => {
      console.error(error);
      jsonResponse(res, 500, { error: error.message });
    });
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/sync-sheet")) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.searchParams.get("token") !== TOKEN) {
      jsonResponse(res, 401, { error: "Unauthorized" });
      return;
    }
    getAccessToken()
      .then((token) => syncSpreadsheet(token))
      .then((spreadsheet) => jsonResponse(res, 200, { ok: true, spreadsheet }))
      .catch((error) => {
        console.error(error);
        jsonResponse(res, 500, { error: error.message });
      });
    return;
  }
  jsonResponse(res, 404, { error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Document upload bridge listening on http://127.0.0.1:${PORT}`);
});
