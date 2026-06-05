const COCKPIT_ROOT_FOLDER_NAME = 'Behoerden-Cockpit Murat Kocyigit';
const COCKPIT_SPREADSHEET_NAME = 'Behoerden-Cockpit Datenbank';

const MAIN_FOLDERS = [
  '01_EM-Rente',
  '02_Pflegegrad',
  '03_GdB_100',
  '04_Wohngeld',
  '05_Kinderzuschlag',
  '06_Krankenkasse',
  '07_Arztberichte',
  '08_Parkerleichterungen',
  '09_Selbstständigkeit',
  '10_Steuern'
];

const SUB_FOLDERS = [
  '01_Eingang',
  '02_In_Bearbeitung',
  '03_Antraege',
  '04_Bescheide',
  '05_Widerspruch',
  '06_Nachweise',
  '07_Archiv'
];

const SHEETS = {
  Config: ['key', 'value', 'beschreibung'],
  Dashboard: ['bereich', 'offene_vorgaenge', 'offene_fristen', 'kritische_fristen', 'letzte_aktualisierung'],
  Vorgaenge: ['vorgang_id', 'bereich', 'status', 'prioritaet', 'behoerde', 'aktenzeichen', 'startdatum', 'naechster_schritt', 'fortschritt'],
  Dokumente: ['dokument_id', 'vorgang_id', 'bereich', 'dateiname', 'dokumenttyp', 'drive_url', 'eingangsdatum', 'ki_status'],
  Fristen: ['Fristdatum', 'Fristtitel', 'Bereich', 'BehoerdeName', 'VorgangsID', 'Telefon', 'Email', 'ErinnerungsTage', 'Status', 'NaechsterSchritt', 'Anmerkungen', '', 'LetzteErinnerung'],
  Checklisten: ['checklist_id', 'bereich', 'titel', 'beschreibung', 'status'],
  Kontakte: ['kontakt_id', 'organisation', 'ansprechpartner', 'bereich', 'typ', 'email', 'telefon'],
  Aufgaben: ['aufgabe_id', 'vorgang_id', 'titel', 'bereich', 'faelligkeit', 'prioritaet', 'status'],
  KI_Analysen: ['analyse_id', 'dokument_id', 'dokument_name', 'zusammenfassung', 'risiko', 'naechster_schritt'],
  Automationen: ['automation_id', 'name', 'status', 'beschreibung', 'last_run'],
  Portal_Nutzer: ['person_id', 'name', 'email', 'rolle', 'status'],
  Audit_Log: ['log_id', 'zeitpunkt', 'aktion', 'objekt', 'bereich', 'details', 'quelle', 'level'],
  Drive_Ordner: ['bereich', 'ordner_typ', 'ordner_name', 'ordner_id', 'ordner_url']
};

const START_DATA = {
  Config: [
    ['root_folder_id', '', 'Wird vom Setup automatisch gesetzt.'],
    ['root_folder_url', '', 'Wird vom Setup automatisch gesetzt.'],
    ['spreadsheet_id', '', 'Wird vom Setup automatisch gesetzt.'],
    ['spreadsheet_url', '', 'Wird vom Setup automatisch gesetzt.'],
    ['n8n_data_api_url', 'https://DEINE-N8N-DOMAIN/webhook/behoerden-cockpit-data', 'Webhook für die Cockpit-Datenquelle.'],
    ['n8n_document_check_url', 'https://DEINE-N8N-DOMAIN/webhook/document-check', 'Webhook für Dokumenten-Upload und Bescheid-Check.'],
    ['n8n_document_analysis_url', 'https://DEINE-N8N-DOMAIN/webhook/document-analysis', 'Webhook für OCR- und KI-Analyse.'],
    ['whatsapp_template_name', 'frist_erinnerung_de', 'Freigegebenes WhatsApp-Business-Template.'],
    ['whatsapp_recipient_phone', '', 'Zielnummer im internationalen Format, z. B. 491701234567.']
  ],
  Vorgaenge: [
    ['EMR-2026-001', 'EM-Rente', 'In Bearbeitung', 'critical', 'Deutsche Rentenversicherung', '', '2026-05-01', 'Ärztliche Unterlagen prüfen und Nachweislisten abgleichen', 62],
    ['PG-2026-002', 'Pflegegrad 2', 'Wartet', 'high', 'Pflegekasse', '', '2026-05-04', 'MD-Gutachten im Drive ablegen', 74],
    ['GDB-2026-003', 'GdB 100', 'Offen', 'medium', 'Versorgungsamt', '', '2026-05-08', 'Bescheid prüfen, Merkzeichen kontrollieren', 48],
    ['WG-2026-004', 'Wohngeld', 'Offen', 'medium', 'Wohngeldstelle', '', '2026-05-11', 'Einkommensnachweise ergänzen', 35],
    ['KK-2026-005', 'Krankenkasse', 'In Bearbeitung', 'low', 'Krankenkasse', '', '2026-05-18', 'Antwortfrist beobachten', 58]
  ],
  Dokumente: [
    ['DOC-001', 'EMR-2026-001', 'EM-Rente', 'DRV_Bescheid_EM_Rente.pdf', 'Bescheid', '', '2026-05-24', 'Analysiert'],
    ['DOC-002', 'PG-2026-002', 'Pflegegrad 2', 'MD_Gutachten_Pflegegrad.pdf', 'Gutachten', '', '2026-05-26', 'Analysiert'],
    ['DOC-003', 'WG-2026-004', 'Wohngeld', 'Wohngeld_Nachweise.zip', 'Nachweis', '', '2026-05-28', 'Nicht analysiert'],
    ['DOC-004', '', 'Arztberichte', 'Arztbericht_Neurologie.pdf', 'Arztbericht', '', '2026-05-30', 'In Analyse']
  ],
  Fristen: [
    ['2026-06-14', 'Bescheid Frist prüfen', 'EM-Rente', 'Deutsche Rentenversicherung', 'EMR-2026-001', '+491234567890', 'kontakt@drv.de', 7, 'Offen', 'Bescheid prüfen', '-', '', ''],
    ['2026-06-12', 'Widerspruchsfrist EM-Rente prüfen', 'EM-Rente', 'Deutsche Rentenversicherung', 'EMR-2026-001', '+491234567890', 'kontakt@drv.de', 7, 'Offen', 'Ärztliche Unterlagen prüfen', '-', '', ''],
    ['2026-06-18', 'Wohngeld Nachweise einreichen', 'Wohngeld', 'Wohngeldstelle', 'WG-2026-004', '+491234567891', 'kontakt@wohngeld.de', 7, 'Offen', 'Einkommensnachweise prüfen', '-', '', ''],
    ['2026-07-02', 'GdB Bescheid kontrollieren', 'GdB 100', 'Versorgungsamt', 'GDB-2026-003', '+491234567892', 'kontakt@versorgungsamt.de', 7, 'Offen', 'Merkzeichen und Bescheid prüfen', '-', '', '']
  ],
  Checklisten: [
    ['CL-001', 'EM-Rente', 'Aktuelle Arztberichte', 'Neurologie, Orthopädie und Hausarztberichte sammeln', 'Offen'],
    ['CL-002', 'EM-Rente', 'Versicherungsverlauf prüfen', 'DRV-Verlauf und Lücken kontrollieren', 'Offen'],
    ['CL-003', 'Pflegegrad 2', 'Pflegetagebuch', 'Hilfebedarf im Alltag dokumentieren', 'Erledigt'],
    ['CL-004', 'Wohngeld', 'Mietnachweis', 'Mietvertrag und aktuelle Miethöhe bereitlegen', 'Offen'],
    ['CL-005', 'Kinderzuschlag', 'Einkommensnachweise', 'Einnahmen, Kindergeld und Mietkosten prüfen', 'Offen']
  ],
  Aufgaben: [
    ['A-001', 'EMR-2026-001', 'Arztberichte für EM-Rente zusammenstellen', 'EM-Rente', '2026-06-05', 'high', 'Offen'],
    ['A-002', 'WG-2026-004', 'Einkommensnachweise für Wohngeld prüfen', 'Wohngeld', '2026-06-10', 'medium', 'Offen'],
    ['A-003', 'PG-2026-002', 'MD-Gutachten im Drive ablegen', 'Pflegegrad 2', '2026-06-03', 'medium', 'Erledigt']
  ],
  Kontakte: [
    ['K-001', 'Deutsche Rentenversicherung', 'Sachbearbeitung EM-Rente', 'EM-Rente', 'Behörde', 'kontakt@drv.example', '0800 1000 4800'],
    ['K-002', 'Pflegekasse', 'Leistungsabteilung Pflege', 'Pflegegrad 2', 'Kasse', 'pflegekasse@example.de', ''],
    ['K-003', 'Neurologische Praxis', 'Praxis-Team', 'Arztberichte', 'Praxis', 'praxis@example.de', '0211 000000']
  ],
  Audit_Log: [
    ['LOG-001', '2026-05-31 08:14', 'Dokument analysiert', 'DOC-001', 'EM-Rente', 'DRV_Bescheid_EM_Rente.pdf wurde klassifiziert und als analysiert markiert.', 'KI', 'info'],
    ['LOG-002', '2026-05-31 08:00', 'Fristenprüfung ausgeführt', 'Fristen', 'Alle Bereiche', 'Tägliche Prüfung fand eine kritische Frist innerhalb von 14 Tagen.', 'n8n', 'warning'],
    ['LOG-003', '2026-05-30 18:20', 'Kontakt angelegt', 'K-003', 'Arztberichte', 'Neurologische Praxis wurde als medizinischer Kontakt hinterlegt.', 'App', 'info']
  ],
  Automationen: [
    ['AUTO-001', 'Drive Dokumenteingang', 'active', 'Neue Dateien klassifizieren, analysieren und in den richtigen Ordner verschieben.', 'Bereit'],
    ['AUTO-002', 'Tägliche Fristenprüfung', 'active', 'Offene Fristen aus Google Sheets prüfen und Erinnerungen versenden.', 'Bereit'],
    ['AUTO-003', 'Portal Upload', 'info', 'Uploads aus dem Kundenportal als Drive-Eingang erfassen.', 'Bereit']
  ],
  KI_Analysen: [
    ['AN-001', 'DOC-001', 'DRV_Bescheid_EM_Rente.pdf', 'Erkannt wurden ein Bescheid zur EM-Rente, eine mögliche Widerspruchsfrist und fehlende medizinische Anlagen.', 'mittel', 'Arztberichte aus Neurologie und Orthopädie mit dem Bescheid verknüpfen, danach Fristentscheidung treffen.']
  ]
};

function setupBehoerdenCockpit() {
  const rootFolder = getOrCreateFolder_(DriveApp, COCKPIT_ROOT_FOLDER_NAME);
  const spreadsheet = getOrCreateSpreadsheet_();
  const existingConfig = readExistingConfig_(spreadsheet);
  const folderRows = createFolderTree_(rootFolder);

  setupSheets_(spreadsheet, folderRows, existingConfig);
  writeConfig_(spreadsheet, rootFolder);
  moveSpreadsheetToFolder_(spreadsheet, rootFolder);

  const result = {
    rootFolderId: rootFolder.getId(),
    rootFolderUrl: rootFolder.getUrl(),
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl()
  };

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function createFolderTree_(rootFolder) {
  const rows = [['Root', 'root', rootFolder.getName(), rootFolder.getId(), rootFolder.getUrl()]];

  MAIN_FOLDERS.forEach((mainFolderName) => {
    const mainFolder = getOrCreateFolder_(rootFolder, mainFolderName);
    rows.push([mainFolderName, 'hauptordner', mainFolder.getName(), mainFolder.getId(), mainFolder.getUrl()]);

    SUB_FOLDERS.forEach((subFolderName) => {
      const subFolder = getOrCreateFolder_(mainFolder, subFolderName);
      rows.push([mainFolderName, 'unterordner', subFolder.getName(), subFolder.getId(), subFolder.getUrl()]);
    });
  });

  return rows;
}

function setupSheets_(spreadsheet, folderRows, existingConfig) {
  Object.keys(SHEETS).forEach((sheetName) => {
    const sheet = getOrCreateSheet_(spreadsheet, sheetName);
    sheet.clear();
    sheet.getRange(1, 1, 1, SHEETS[sheetName].length).setValues([SHEETS[sheetName]]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, SHEETS[sheetName].length).setFontWeight('bold').setBackground('#dff2eb');
    sheet.autoResizeColumns(1, SHEETS[sheetName].length);
  });

  writeRows_(spreadsheet.getSheetByName('Vorgaenge'), START_DATA.Vorgaenge);
  writeRows_(spreadsheet.getSheetByName('Dokumente'), START_DATA.Dokumente);
  writeRows_(spreadsheet.getSheetByName('Fristen'), START_DATA.Fristen);
  writeRows_(spreadsheet.getSheetByName('Checklisten'), START_DATA.Checklisten);
  writeRows_(spreadsheet.getSheetByName('Kontakte'), START_DATA.Kontakte);
  writeRows_(spreadsheet.getSheetByName('Aufgaben'), START_DATA.Aufgaben);
  writeRows_(spreadsheet.getSheetByName('Audit_Log'), START_DATA.Audit_Log);
  writeRows_(spreadsheet.getSheetByName('Automationen'), START_DATA.Automationen);
  writeRows_(spreadsheet.getSheetByName('KI_Analysen'), START_DATA.KI_Analysen);
  writeRows_(spreadsheet.getSheetByName('Drive_Ordner'), folderRows);
  writeRows_(spreadsheet.getSheetByName('Config'), buildConfigRows_(existingConfig));

  const dashboardRows = MAIN_FOLDERS.map((folderName) => {
    const area = normalizeAreaName_(folderName);
    return [
      area,
      `=COUNTIFS(Vorgaenge!B:B,"${area}",Vorgaenge!C:C,"<>Erledigt")`,
      `=COUNTIFS(Fristen!C:C,"${area}",Fristen!I:I,"<>Erledigt")`,
      `=COUNTIFS(Fristen!C:C,"${area}",Fristen!I:I,"<>Erledigt",Fristen!A:A,"<="&TODAY()+3)`,
      new Date()
    ];
  });
  writeRows_(spreadsheet.getSheetByName('Dashboard'), dashboardRows);
  formatSheets_(spreadsheet);
}

function writeRows_(sheet, rows) {
  if (!rows || rows.length === 0) {
    return;
  }
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function readExistingConfig_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Config');
  if (!sheet || sheet.getLastRow() < 2) {
    return {};
  }
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  return values.reduce((config, row) => {
    if (row[0]) {
      config[row[0]] = row[1];
    }
    return config;
  }, {});
}

function buildConfigRows_(existingConfig) {
  return START_DATA.Config.map((row) => {
    const key = row[0];
    const existingValue = existingConfig[key];
    return [key, existingValue || row[1], row[2]];
  });
}

function getOrCreateFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function normalizeAreaName_(folderName) {
  return folderName
    .replace(/^\d+_/, '')
    .replace(/_/g, ' ')
    .replace('Pflegegrad', 'Pflegegrad 2')
    .replace('GdB 100', 'GdB 100');
}

function writeConfig_(spreadsheet, rootFolder) {
  const sheet = spreadsheet.getSheetByName('Config');
  const values = sheet.getDataRange().getValues();
  const updates = {
    root_folder_id: rootFolder.getId(),
    root_folder_url: rootFolder.getUrl(),
    spreadsheet_id: spreadsheet.getId(),
    spreadsheet_url: spreadsheet.getUrl()
  };

  values.forEach((row, index) => {
    const key = row[0];
    if (updates[key]) {
      sheet.getRange(index + 1, 2).setValue(updates[key]);
    }
  });
}

function formatSheets_(spreadsheet) {
  Object.keys(SHEETS).forEach((sheetName) => {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      return;
    }
    const existingFilter = sheet.getFilter();
    if (existingFilter) {
      existingFilter.remove();
    }
    sheet.getDataRange().createFilter();
    sheet.autoResizeColumns(1, sheet.getLastColumn());
  });
}

function getOrCreateSpreadsheet_() {
  const files = DriveApp.getFilesByName(COCKPIT_SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  return SpreadsheetApp.create(COCKPIT_SPREADSHEET_NAME);
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function moveSpreadsheetToFolder_(spreadsheet, folder) {
  const file = DriveApp.getFileById(spreadsheet.getId());
  folder.addFile(file);
  try {
    DriveApp.getRootFolder().removeFile(file);
  } catch (error) {
    Logger.log('Spreadsheet blieb zusätzlich im Root sichtbar: ' + error);
  }
}
