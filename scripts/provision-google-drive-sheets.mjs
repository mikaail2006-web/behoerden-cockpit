import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const cwd = process.cwd();
const rootFolderName = "Behoerden-Cockpit Murat Kocyigit";
const spreadsheetName = "Behoerden-Cockpit Datenbank";
const mainFolders = [
  "01_EM-Rente",
  "02_Pflegegrad",
  "03_GdB_100",
  "04_Wohngeld",
  "05_Kinderzuschlag",
  "06_Krankenkasse",
  "07_Arztberichte",
  "08_Parkerleichterungen",
  "09_Selbstständigkeit",
  "10_Steuern",
];
const subFolders = [
  "01_Eingang",
  "02_In_Bearbeitung",
  "03_Antraege",
  "04_Bescheide",
  "05_Widerspruch",
  "06_Nachweise",
  "07_Archiv",
];
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
  const file = path.join(cwd, "data", "sheets", `${name}.csv`);
  const text = await fs.readFile(file, "utf8");
  return csvParse(text);
}

function driveUrl(id) {
  return `https://drive.google.com/drive/folders/${id}`;
}

async function getToken() {
  const cfgPath = path.join(process.env.HOME, ".clasprc.json");
  const cfg = JSON.parse(await fs.readFile(cfgPath, "utf8"));
  const token = cfg.tokens.default;
  if (token.expiry_date && token.expiry_date > Date.now() + 60_000) {
    return token.access_token;
  }
  const body = new URLSearchParams({
    client_id: token.client_id,
    client_secret: token.client_secret,
    refresh_token: token.refresh_token,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
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

async function findFolder(token, name, parentId = "root") {
  const q = [
    "mimeType='application/vnd.google-apps.folder'",
    "trashed=false",
    `name='${name.replaceAll("'", "\\'")}'`,
    `'${parentId}' in parents`,
  ].join(" and ");
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)&pageSize=1`;
  const result = await google(token, url);
  return result.files?.[0] || null;
}

async function ensureFolder(token, name, parentId = "root") {
  const existing = await findFolder(token, name, parentId);
  if (existing) return existing;
  return google(token, "https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId === "root" ? undefined : [parentId],
    }),
  });
}

async function buildWorkbook(folderRows, rootFolder) {
  const wb = Workbook.create();
  for (const name of sheetOrder) wb.worksheets.add(name);

  const now = new Date().toISOString();
  const configRows = [
    ["root_folder_id", rootFolder.id, "Google Drive Root-Ordner des Behörden-Cockpits."],
    ["root_folder_url", rootFolder.webViewLink || driveUrl(rootFolder.id), "Direktlink zum Root-Ordner."],
    ["spreadsheet_id", "", "Google-Sheet-ID nach Import."],
    ["spreadsheet_url", "", "Google-Sheet-Link nach Import."],
    ["n8n_data_api_url", "https://n8n.mkd-office.de/webhook/behoerden-cockpit-data", "Webhook fuer Cockpit-Datenquelle."],
    ["n8n_document_check_url", "https://n8n.mkd-office.de/webhook/document-check", "Webhook fuer Dokumenten-Upload und Bescheid-Check."],
    ["n8n_document_analysis_url", "https://n8n.mkd-office.de/webhook/document-analysis", "Webhook fuer OCR- und KI-Analyse."],
    ["whatsapp_template_name", "frist_erinnerung_de", "WhatsApp Business Template."],
    ["whatsapp_recipient_phone", "", "Zielnummer im internationalen Format."],
  ];
  const dashboardRows = areas.map((area) => [area, "", "", "", now]);

  const data = {
    Config: [headers.Config, ...configRows],
    Dashboard: [headers.Dashboard, ...dashboardRows],
    Drive_Ordner: [headers.Drive_Ordner, ...folderRows],
  };
  const cockpitPayload = JSON.parse(await fs.readFile(path.join(cwd, "app", "cockpit-data.json"), "utf8"));
  data.Vorgaenge = [["payload"], [JSON.stringify(cockpitPayload)]];
  data.Vorgaenge_Detail = await readCsvSheet("Vorgaenge");
  for (const name of ["Dokumente", "Fristen", "Checklisten", "Kontakte", "Aufgaben", "KI_Analysen", "Automationen", "Audit_Log"]) {
    data[name] = await readCsvSheet(name);
  }

  for (const name of sheetOrder) {
    const sheet = wb.worksheets.getItem(name);
    const rows = data[name];
    const endCol = colName(rows[0].length - 1);
    sheet.getRange(`A1:${endCol}${rows.length}`).values = rows;
    sheet.getRange(`A1:${endCol}1`).format = {
      fill: "#1f4e79",
      font: { color: "#FFFFFF", bold: true },
    };
    sheet.getRange(`A:${endCol}`).format = { font: { name: "Aptos", size: 10 } };
  }

  const dash = wb.worksheets.getItem("Dashboard");
  dash.getRange(`B2:B${areas.length + 1}`).formulas = areas.map((area) => [`=COUNTIFS(Vorgaenge!B:B,A${areas.indexOf(area) + 2},Vorgaenge!C:C,"<>Erledigt")`]);
  dash.getRange(`C2:C${areas.length + 1}`).formulas = areas.map((area) => [`=COUNTIFS(Fristen!D:D,A${areas.indexOf(area) + 2},Fristen!F:F,"<>Erledigt")`]);
  dash.getRange(`D2:D${areas.length + 1}`).formulas = areas.map((area) => [`=COUNTIFS(Fristen!D:D,A${areas.indexOf(area) + 2},Fristen!G:G,"critical")`]);

  await fs.mkdir(path.join(cwd, "outputs"), { recursive: true });
  const outPath = path.join(cwd, "outputs", "behoerden-cockpit-datenbank.xlsx");
  const output = await SpreadsheetFile.exportXlsx(wb);
  await output.save(outPath);
  return outPath;
}

async function uploadSpreadsheet(token, xlsxPath, parentId) {
  const boundary = `codex_${Date.now()}`;
  const metadata = {
    name: spreadsheetName,
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: [parentId],
  };
  const xlsx = await fs.readFile(xlsxPath);
  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`,
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([head, xlsx, tail]);
  return google(token, "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
}

const token = await getToken();
const root = await ensureFolder(token, rootFolderName);
const folderRows = [];
for (const main of mainFolders) {
  const mainFolder = await ensureFolder(token, main, root.id);
  folderRows.push([main, "Hauptordner", main, mainFolder.id, mainFolder.webViewLink || driveUrl(mainFolder.id)]);
  for (const sub of subFolders) {
    const subFolder = await ensureFolder(token, sub, mainFolder.id);
    folderRows.push([main, "Unterordner", sub, subFolder.id, subFolder.webViewLink || driveUrl(subFolder.id)]);
  }
}
const xlsxPath = await buildWorkbook(folderRows, root);
const spreadsheet = await uploadSpreadsheet(token, xlsxPath, root.id);
await fs.writeFile(
  path.join(cwd, "outputs", "google-provision-result.json"),
  JSON.stringify({ root, spreadsheet, xlsxPath }, null, 2),
);
console.log(JSON.stringify({ root, spreadsheet, xlsxPath }, null, 2));
