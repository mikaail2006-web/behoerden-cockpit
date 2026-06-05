const DEFAULT_DATA_SOURCE_URL = window.COCKPIT_DATA_URL || "cockpit-data.json";
const DATA_SOURCE_STORAGE_KEY = "behoerden-cockpit-data-url";
const DEFAULT_DOCUMENT_CHECK_URL = window.COCKPIT_DOCUMENT_CHECK_URL || "";
const DOCUMENT_CHECK_STORAGE_KEY = "behoerden-cockpit-document-check-url";
const SHOW_DONE_DEADLINES_STORAGE_KEY = "behoerden-cockpit-show-done-deadlines";
const SHOW_DONE_TASKS_STORAGE_KEY = "behoerden-cockpit-show-done-tasks";
const SHOW_DONE_CHECKLISTS_STORAGE_KEY = "behoerden-cockpit-show-done-checklists";
const PREFLIGHT_CHECKLIST_STORAGE_KEY = "behoerden-cockpit-preflight-checklist";
const FIRST_REAL_UPLOAD_STORAGE_KEY = "behoerden-cockpit-first-real-upload";
const OPS_CHECKLIST_STORAGE_KEY = "behoerden-cockpit-ops-checklist";
const LOCK_PIN_HASH_STORAGE_KEY = "behoerden-cockpit-pin-hash";
const LOCK_SESSION_STORAGE_KEY = "behoerden-cockpit-unlocked";
const LOCK_FAILED_ATTEMPTS_STORAGE_KEY = "behoerden-cockpit-failed-pin-attempts";
const LOCK_BLOCKED_UNTIL_STORAGE_KEY = "behoerden-cockpit-blocked-until";
const DEFAULT_LOCK_PIN_HASH = "264f23827fba6fe6ee01627eef32731951a004dee1f7d555e3fb0be9d141fd88";

const fallbackState = {
  areas: [],
  cases: [],
  documents: [],
  deadlines: [],
  checklists: [],
  tasks: [],
  contacts: [],
  auditLog: [],
  automations: [],
  analyses: []
};

let state = structuredClone(fallbackState);
let editingDeadlineId = "";
let editingTaskId = "";
let editingContactId = "";
let editingCaseId = "";
let editingChecklistId = "";
let followupDocumentId = "";
let showDoneDeadlines = getStoredBoolean(SHOW_DONE_DEADLINES_STORAGE_KEY, true);
let showDoneTasks = getStoredBoolean(SHOW_DONE_TASKS_STORAGE_KEY, true);
let showDoneChecklists = getStoredBoolean(SHOW_DONE_CHECKLISTS_STORAGE_KEY, true);
let lockCountdownTimer = null;

const els = {
  moduleStrip: document.querySelector("#moduleStrip"),
  metrics: document.querySelector("#metrics"),
  qualityStrip: document.querySelector("#qualityStrip"),
  lockScreen: document.querySelector("#lockScreen"),
  lockForm: document.querySelector("#lockForm"),
  lockTitle: document.querySelector("#lockTitle"),
  lockHint: document.querySelector("#lockHint"),
  lockPinInput: document.querySelector("#lockPinInput"),
  lockError: document.querySelector("#lockError"),
  caseList: document.querySelector("#caseList"),
  casesTable: document.querySelector("#casesTable"),
  checkAreaSelect: document.querySelector("#checkAreaSelect"),
  checkTypeSelect: document.querySelector("#checkTypeSelect"),
  documentUploadInput: document.querySelector("#documentUploadInput"),
  uploadFileLabel: document.querySelector("#uploadFileLabel"),
  checkUploadModeBadge: document.querySelector("#checkUploadModeBadge"),
  uploadModeHint: document.querySelector("#uploadModeHint"),
  uploadPreflightStatus: document.querySelector("#uploadPreflightStatus"),
  renamePreview: document.querySelector("#renamePreview"),
  checkResult: document.querySelector("#checkResult"),
  checkRiskBadge: document.querySelector("#checkRiskBadge"),
  documentCheckSubmitButton: document.querySelector("#documentCheckSubmitButton"),
  followupNote: document.querySelector("#followupNote"),
  checklistAreaFilter: document.querySelector("#checklistAreaFilter"),
  checklistSummary: document.querySelector("#checklistSummary"),
  checklistBoard: document.querySelector("#checklistBoard"),
  documentsTable: document.querySelector("#documentsTable"),
  deadlineSummary: document.querySelector("#deadlineSummary"),
  deadlineBoard: document.querySelector("#deadlineBoard"),
  taskSummary: document.querySelector("#taskSummary"),
  taskBoard: document.querySelector("#taskBoard"),
  contactGrid: document.querySelector("#contactGrid"),
  activityList: document.querySelector("#activityList"),
  archiveSummary: document.querySelector("#archiveSummary"),
  archiveList: document.querySelector("#archiveList"),
  automationGrid: document.querySelector("#automationGrid"),
  analysisBox: document.querySelector("#analysisBox"),
  areaFilter: document.querySelector("#areaFilter"),
  searchInput: document.querySelector("#searchInput"),
  searchCount: document.querySelector("#searchCount"),
  dataSourceBadge: document.querySelector("#dataSourceBadge"),
  dataSourceInput: document.querySelector("#dataSourceInput"),
  securityStatus: document.querySelector("#securityStatus"),
  preflightChecklist: document.querySelector("#preflightChecklist"),
  preflightReadiness: document.querySelector("#preflightReadiness"),
  firstRealUploadGuide: document.querySelector("#firstRealUploadGuide"),
  firstRealUploadStatus: document.querySelector("#firstRealUploadStatus"),
  opsChecklist: document.querySelector("#opsChecklist"),
  opsReadiness: document.querySelector("#opsReadiness"),
  uploadWebhookBadge: document.querySelector("#uploadWebhookBadge"),
  uploadWebhookInput: document.querySelector("#uploadWebhookInput"),
  deadlineModal: document.querySelector("#deadlineModal"),
  deadlineAreaInput: document.querySelector("#deadlineAreaInput"),
  deadlineTitleInput: document.querySelector("#deadlineTitleInput"),
  deadlineDateInput: document.querySelector("#deadlineDateInput"),
  deadlineNextStepInput: document.querySelector("#deadlineNextStepInput"),
  taskModal: document.querySelector("#taskModal"),
  taskAreaInput: document.querySelector("#taskAreaInput"),
  taskTitleInput: document.querySelector("#taskTitleInput"),
  taskDueDateInput: document.querySelector("#taskDueDateInput"),
  taskPriorityInput: document.querySelector("#taskPriorityInput"),
  contactModal: document.querySelector("#contactModal"),
  contactOrganizationInput: document.querySelector("#contactOrganizationInput"),
  contactNameInput: document.querySelector("#contactNameInput"),
  contactAreaInput: document.querySelector("#contactAreaInput"),
  contactEmailInput: document.querySelector("#contactEmailInput"),
  contactPhoneInput: document.querySelector("#contactPhoneInput"),
  caseModal: document.querySelector("#caseModal"),
  caseAreaInput: document.querySelector("#caseAreaInput"),
  caseStatusInput: document.querySelector("#caseStatusInput"),
  caseAuthorityInput: document.querySelector("#caseAuthorityInput"),
  caseNextInput: document.querySelector("#caseNextInput"),
  checklistModal: document.querySelector("#checklistModal"),
  checklistAreaInput: document.querySelector("#checklistAreaInput"),
  checklistTitleInput: document.querySelector("#checklistTitleInput"),
  checklistDescriptionInput: document.querySelector("#checklistDescriptionInput"),
  currentPinInput: document.querySelector("#currentPinInput"),
  newPinInput: document.querySelector("#newPinInput"),
  confirmPinInput: document.querySelector("#confirmPinInput"),
  resetPreflightButton: document.querySelector("#resetPreflightButton"),
  resetFirstRealUploadButton: document.querySelector("#resetFirstRealUploadButton"),
  resetOpsChecklistButton: document.querySelector("#resetOpsChecklistButton"),
  toast: document.querySelector("#toast")
};

const iconFallbacks = {
  "layout-dashboard": "▦",
  briefcase: "▣",
  "briefcase-business": "+",
  "scan-text": "▧",
  "clipboard-check": "☑",
  files: "▤",
  "calendar-clock": "◷",
  workflow: "⌁",
  "shield-check": "◇",
  "shield-alert": "!",
  lock: "▣",
  search: "⌕",
  download: "⇩",
  sparkles: "✦",
  "file-plus-2": "+",
  "calendar-plus": "+",
  play: "▶",
  "upload-cloud": "⇧",
  "message-square-lock": "□",
  "list-checks": "☑",
  "list-plus": "+",
  "eye-off": "◌",
  eye: "◉",
  contact: "◇",
  "user-plus": "+",
  mail: "@",
  phone: "☎",
  history: "↺",
  save: "✓",
  check: "✓",
  "message-circle": "○"
  ,
  settings: "⚙",
  plug: "⌁",
  "refresh-cw": "↻",
  "rotate-ccw": "↶",
  pencil: "✎",
  archive: "▥",
  undo: "↶",
  x: "×"
};

function toDateInputValue(date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 10);
}

function todayValue() {
  return toDateInputValue(new Date());
}

function dateAfter(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

function nowTimestamp() {
  const date = new Date();
  return `${toDateInputValue(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function daysUntil(dateString) {
  const today = new Date(`${todayValue()}T00:00:00`);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.ceil((target - today) / 86400000);
}

function dueLabel(dateString, done = false) {
  if (done) return "Erledigt";
  const days = daysUntil(dateString);
  if (days < 0) return `Überfällig seit ${Math.abs(days)} Tag${Math.abs(days) === 1 ? "" : "en"}`;
  if (days === 0) return "Heute";
  if (days === 1) return "Morgen";
  return `In ${days} Tagen`;
}

function dueLevel(dateString, fallback = "soon", done = false) {
  if (done) return "ok";
  const days = daysUntil(dateString);
  if (days < 0) return "critical";
  if (days <= 3) return "critical";
  return fallback;
}

function priorityWeight(priority) {
  return {
    critical: 0,
    high: 1,
    medium: 2,
    soon: 2,
    low: 3,
    ok: 4
  }[priority] ?? 2;
}

function sortByUrgency(items, dateKey, priorityKey = "priority") {
  return [...items].sort((a, b) => {
    if (Boolean(a.done) !== Boolean(b.done)) return a.done ? 1 : -1;
    const dayDiff = daysUntil(a[dateKey]) - daysUntil(b[dateKey]);
    if (dayDiff !== 0) return dayDiff;
    return priorityWeight(a[priorityKey]) - priorityWeight(b[priorityKey]);
  });
}

function priorityLabel(priority) {
  return {
    critical: "Kritisch",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig"
  }[priority] || priority;
}

function sanitizeFilePart(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getFileExtension(fileName) {
  const match = String(fileName || "").match(/\.([a-zA-Z0-9]{1,8})$/);
  return match ? `.${match[1].toLowerCase()}` : ".pdf";
}

function buildDocumentFileName({ originalName, area, type }) {
  const date = todayValue();
  const person = "Murat-Kocyigit";
  const sourceName = sanitizeFilePart(String(originalName || "").replace(/\.[^.]+$/, ""));
  const parts = [
    date,
    sanitizeFilePart(area),
    sanitizeFilePart(type),
    person,
    sourceName && sourceName.toLowerCase() !== "demo-bescheid" ? sourceName : ""
  ].filter(Boolean);
  return `${parts.join("_")}${getFileExtension(originalName)}`;
}

function updateRenamePreview() {
  const file = els.documentUploadInput.files[0];
  const fileName = file?.name || "Demo_Bescheid.pdf";
  els.renamePreview.textContent = buildDocumentFileName({
    originalName: fileName,
    area: els.checkAreaSelect.value || state.areas[0] || "EM-Rente",
    type: els.checkTypeSelect.value || "Bescheid"
  });
}

function setFollowupDocument(documentItem) {
  followupDocumentId = documentItem?.id || "";
  if (!documentItem) {
    els.followupNote.hidden = true;
    els.followupNote.innerHTML = "";
    return;
  }
  els.followupNote.hidden = false;
  els.followupNote.innerHTML = `
    <strong>Nachreichen für:</strong>
    <span>${documentItem.name}</span>
    <button class="mini-button" type="button" id="clearFollowupButton" title="Nachreichen lösen"><span data-icon="x"></span></button>
  `;
  renderIcons();
}

function clearFollowupDocument() {
  setFollowupDocument(null);
  showToast("Nachreichen gelöst");
}

function renderIcons() {
  if (window.lucide) {
    document.querySelectorAll("[data-icon]").forEach((icon) => {
      icon.setAttribute("data-lucide", icon.dataset.icon);
    });
    window.lucide.createIcons();
    return;
  }
  document.querySelectorAll("[data-icon]").forEach((icon) => {
    icon.textContent = iconFallbacks[icon.dataset.icon] || "•";
    icon.setAttribute("aria-hidden", "true");
  });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function isActive(item) {
  return !item.archived;
}

function activeItems(items) {
  return (items || []).filter(isActive);
}

async function loadData() {
  const dataSourceUrl = getDataSourceUrl();
  try {
    const response = await fetch(dataSourceUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Datenquelle nicht erreichbar: ${response.status}`);
    }
    const data = await response.json();
    state = {
      ...fallbackState,
      ...data,
      areas: data.areas || fallbackState.areas,
      cases: data.cases || fallbackState.cases,
      documents: data.documents || fallbackState.documents,
      deadlines: data.deadlines || fallbackState.deadlines,
      checklists: data.checklists || fallbackState.checklists,
      tasks: data.tasks || fallbackState.tasks,
      contacts: data.contacts || fallbackState.contacts,
      auditLog: data.auditLog || fallbackState.auditLog,
      automations: data.automations || fallbackState.automations,
      analyses: data.analyses || fallbackState.analyses
    };
    updateDataSourceStatus(dataSourceUrl, true);
  } catch (error) {
    console.warn(error);
    state = structuredClone(fallbackState);
    updateDataSourceStatus(dataSourceUrl, false);
    showToast("Datenquelle nicht geladen");
  }
}

function getDataSourceUrl() {
  return getStoredValue(DATA_SOURCE_STORAGE_KEY) || DEFAULT_DATA_SOURCE_URL;
}

function setDataSourceUrl(url) {
  const normalizedUrl = url.trim();
  if (!normalizedUrl || normalizedUrl === DEFAULT_DATA_SOURCE_URL) {
    removeStoredValue(DATA_SOURCE_STORAGE_KEY);
    return DEFAULT_DATA_SOURCE_URL;
  }
  setStoredValue(DATA_SOURCE_STORAGE_KEY, normalizedUrl);
  return normalizedUrl;
}

function updateDataSourceStatus(url, isLoaded) {
  if (els.dataSourceInput) {
    els.dataSourceInput.value = url === DEFAULT_DATA_SOURCE_URL ? "" : url;
  }
  if (!els.dataSourceBadge) {
    return;
  }
  const isLocalSource = url === "cockpit-data.json";
  els.dataSourceBadge.textContent = isLocalSource ? "Lokale Daten" : isLoaded ? "n8n verbunden" : "Nicht verbunden";
  els.dataSourceBadge.className = `badge ${isLoaded ? "ok" : "critical"}`;
}

function getDocumentCheckUrl() {
  return getStoredValue(DOCUMENT_CHECK_STORAGE_KEY) || DEFAULT_DOCUMENT_CHECK_URL;
}

function setDocumentCheckUrl(url) {
  const normalizedUrl = url.trim();
  if (!normalizedUrl || normalizedUrl === DEFAULT_DOCUMENT_CHECK_URL) {
    removeStoredValue(DOCUMENT_CHECK_STORAGE_KEY);
    return DEFAULT_DOCUMENT_CHECK_URL;
  }
  setStoredValue(DOCUMENT_CHECK_STORAGE_KEY, normalizedUrl);
  return normalizedUrl;
}

function getStoredValue(key) {
  try {
    return window.localStorage?.getItem(key) || "";
  } catch (error) {
    return "";
  }
}

function setStoredValue(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch (error) {
    console.warn("Lokaler Speicher nicht verfügbar", error);
  }
}

function getStoredBoolean(key, fallback) {
  const value = getStoredValue(key);
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function removeStoredValue(key) {
  try {
    window.localStorage?.removeItem(key);
  } catch (error) {
    console.warn("Lokaler Speicher nicht verfügbar", error);
  }
}

function readPreflightChecklist() {
  try {
    return JSON.parse(getStoredValue(PREFLIGHT_CHECKLIST_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function preflightDoneCount(values = readPreflightChecklist()) {
  return ["preflight", "drive", "sheet", "n8n", "backup", "upload"].filter((key) => values[key]).length;
}

function isPreflightReady() {
  return preflightDoneCount() === 6;
}

function writePreflightChecklist(values) {
  setStoredValue(PREFLIGHT_CHECKLIST_STORAGE_KEY, JSON.stringify(values));
}

function readFirstRealUploadGuide() {
  try {
    return JSON.parse(getStoredValue(FIRST_REAL_UPLOAD_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeFirstRealUploadGuide(values) {
  setStoredValue(FIRST_REAL_UPLOAD_STORAGE_KEY, JSON.stringify(values));
}

function firstRealUploadDoneCount(values = readFirstRealUploadGuide()) {
  return ["filename", "upload", "result", "deadline", "driveSheet"].filter((key) => values[key]).length;
}

function markFirstRealUploadStep(key) {
  const values = readFirstRealUploadGuide();
  values[key] = true;
  writeFirstRealUploadGuide(values);
  renderFirstRealUploadGuide();
}

function readOpsChecklist() {
  try {
    return JSON.parse(getStoredValue(OPS_CHECKLIST_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeOpsChecklist(values) {
  setStoredValue(OPS_CHECKLIST_STORAGE_KEY, JSON.stringify(values));
}

function opsDoneCount(values = readOpsChecklist()) {
  return ["sheetBackup", "n8nBackup", "driveAccess", "auditLog", "restoreTest", "deleteRule"].filter((key) => values[key]).length;
}

function logPreflightOverride({ fileName, area, type }) {
  const doneCount = preflightDoneCount();
  const auditItem = {
    id: `LOG-${String(state.auditLog.length + 1).padStart(3, "0")}`,
    timestamp: nowTimestamp(),
    action: "Upload trotz offenem Preflight bestätigt",
    object: fileName,
    area,
    details: `${type} wurde trotz offenem Echte-Daten-Preflight gestartet. Stand: ${doneCount}/6 Punkte erledigt.`,
    source: "App",
    level: "warning"
  };
  state.auditLog.unshift(auditItem);
  renderActivity();
  persistManualEntry("audit", auditItem).then((saved) => saved && showToast("Preflight-Ausnahme im Google Sheet protokolliert"));
}

function getSessionValue(key) {
  try {
    return window.sessionStorage?.getItem(key) || "";
  } catch (error) {
    return "";
  }
}

function setSessionValue(key, value) {
  try {
    window.sessionStorage?.setItem(key, value);
  } catch (error) {
    console.warn("Sitzungsspeicher nicht verfügbar", error);
  }
}

function removeSessionValue(key) {
  try {
    window.sessionStorage?.removeItem(key);
  } catch (error) {
    console.warn("Sitzungsspeicher nicht verfügbar", error);
  }
}

function updateDocumentCheckStatus() {
  const url = getDocumentCheckUrl();
  const preflightDone = preflightDoneCount();
  if (els.uploadWebhookInput) {
    els.uploadWebhookInput.value = url === DEFAULT_DOCUMENT_CHECK_URL ? "" : url;
  }
  if (els.checkUploadModeBadge) {
    els.checkUploadModeBadge.textContent = url ? "Live Upload" : "Fallback";
    els.checkUploadModeBadge.className = `badge ${url ? "ok" : "info"}`;
  }
  if (els.uploadModeHint) {
    els.uploadModeHint.textContent = url
      ? "Der Upload wird in Google Drive gespeichert, analysiert und mit Google Sheets synchronisiert."
      : "Upload-Fallback ist aktiv.";
  }
  if (els.uploadPreflightStatus) {
    const ready = preflightDone === 6;
    els.uploadPreflightStatus.textContent = ready
      ? "Echte Dokumente: Preflight vollständig. Einzelupload kontrolliert möglich."
      : `Echte Dokumente: noch gesperrt, Preflight ${preflightDone}/6. Bitte Setup > Sicherheit prüfen.`;
    els.uploadPreflightStatus.className = `upload-preflight-status ${ready ? "ready" : ""}`;
    els.uploadPreflightStatus.disabled = ready;
  }
  if (els.documentCheckSubmitButton) {
    els.documentCheckSubmitButton.innerHTML = preflightDone === 6
      ? `<span data-icon="sparkles"></span>Bescheid prüfen`
      : `<span data-icon="shield-alert"></span>Mit Preflight-Hinweis prüfen`;
  }
  if (!els.uploadWebhookBadge) {
    return;
  }
  els.uploadWebhookBadge.textContent = url ? "n8n Upload aktiv" : "Fallback";
  els.uploadWebhookBadge.className = `badge ${url ? "ok" : "info"}`;
}

async function pinHash(pin) {
  if (!window.crypto?.subtle) {
    return `plain:${pin}`;
  }
  const bytes = new TextEncoder().encode(`behoerden-cockpit:${pin}`);
  const hash = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isUnlocked() {
  return getSessionValue(LOCK_SESSION_STORAGE_KEY) === "true";
}

function lockBlockedSeconds() {
  const blockedUntil = Number(getSessionValue(LOCK_BLOCKED_UNTIL_STORAGE_KEY) || 0);
  const remaining = Math.ceil((blockedUntil - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

function recordFailedPinAttempt() {
  const attempts = Number(getSessionValue(LOCK_FAILED_ATTEMPTS_STORAGE_KEY) || 0) + 1;
  setSessionValue(LOCK_FAILED_ATTEMPTS_STORAGE_KEY, String(attempts));
  if (attempts >= 3) {
    setSessionValue(LOCK_BLOCKED_UNTIL_STORAGE_KEY, String(Date.now() + 30000));
    setSessionValue(LOCK_FAILED_ATTEMPTS_STORAGE_KEY, "0");
    return 30;
  }
  return 0;
}

function clearFailedPinAttempts() {
  removeSessionValue(LOCK_FAILED_ATTEMPTS_STORAGE_KEY);
  removeSessionValue(LOCK_BLOCKED_UNTIL_STORAGE_KEY);
}

function updateLockBlockedState() {
  const seconds = lockBlockedSeconds();
  const submitButton = els.lockForm.querySelector('button[type="submit"]');
  if (seconds) {
    els.lockError.textContent = `Zu viele Fehlversuche. Bitte ${seconds} Sekunden warten.`;
    els.lockPinInput.disabled = true;
    submitButton.disabled = true;
    if (!lockCountdownTimer) {
      lockCountdownTimer = window.setInterval(updateLockBlockedState, 1000);
    }
    return;
  }
  els.lockPinInput.disabled = false;
  submitButton.disabled = false;
  if (lockCountdownTimer) {
    window.clearInterval(lockCountdownTimer);
    lockCountdownTimer = null;
  }
}

function updateLockCopy() {
  const hasPin = Boolean(getStoredValue(LOCK_PIN_HASH_STORAGE_KEY) || DEFAULT_LOCK_PIN_HASH);
  els.lockTitle.textContent = hasPin ? "Cockpit entsperren" : "PIN einrichten";
  els.lockHint.textContent = hasPin
    ? "PIN eingeben, um das Behörden-Cockpit zu öffnen."
    : "Lege eine lokale PIN mit mindestens 4 Zeichen fest.";
  renderSecurityStatus();
}

function renderSecurityStatus() {
  if (!els.securityStatus) return;
  const hasPin = Boolean(getStoredValue(LOCK_PIN_HASH_STORAGE_KEY) || DEFAULT_LOCK_PIN_HASH);
  const unlocked = isUnlocked();
  const preflightValues = readPreflightChecklist();
  const preflightDone = preflightDoneCount(preflightValues);
  const opsDone = opsDoneCount();
  els.securityStatus.innerHTML = `
    <span class="summary-chip ${hasPin ? "" : "muted"}">PIN-Schutz: ${hasPin ? "aktiv" : "nicht eingerichtet"}</span>
    <span class="summary-chip ${unlocked ? "" : "muted"}">Sitzung: ${unlocked ? "entsperrt" : "gesperrt"}</span>
    <span class="summary-chip ${preflightDone === 6 ? "" : "muted"}">Echte-Daten-Check: ${preflightDone}/6</span>
    <span class="summary-chip ${opsDone === 6 ? "" : "muted"}">Betrieb: ${opsDone}/6</span>
  `;
}

function renderPreflightChecklist() {
  if (!els.preflightChecklist) return;
  const values = readPreflightChecklist();
  const doneCount = preflightDoneCount(values);
  els.preflightChecklist.querySelectorAll("[data-preflight-item]").forEach((input) => {
    input.checked = Boolean(values[input.dataset.preflightItem]);
  });
  if (els.preflightReadiness) {
    els.preflightReadiness.textContent = doneCount === 6
      ? "Bereit für kontrollierten Einzelupload eines echten Dokuments."
      : `Noch nicht für echte Dokumente freigegeben: ${doneCount}/6 Punkten erledigt.`;
    els.preflightReadiness.className = `preflight-readiness ${doneCount === 6 ? "ready" : ""}`;
  }
}

function renderFirstRealUploadGuide() {
  if (!els.firstRealUploadGuide) return;
  const values = readFirstRealUploadGuide();
  const doneCount = firstRealUploadDoneCount(values);
  const ready = isPreflightReady();
  els.firstRealUploadGuide.className = `first-real-guide ${ready ? "" : "locked"} ${doneCount === 5 ? "ready" : ""}`;
  els.firstRealUploadGuide.querySelectorAll("[data-first-real-item]").forEach((input) => {
    input.checked = Boolean(values[input.dataset.firstRealItem]);
    input.disabled = !ready;
  });
  if (els.firstRealUploadStatus) {
    els.firstRealUploadStatus.textContent = !ready
      ? "Erst aktiv, wenn der Echte-Daten-Preflight vollständig ist."
      : doneCount === 5
        ? "Erstes echtes Dokument vollständig kontrolliert."
        : `Kontrolle offen: ${doneCount}/5 Punkten erledigt.`;
  }
}

function renderOpsChecklist() {
  if (!els.opsChecklist) return;
  const values = readOpsChecklist();
  const doneCount = opsDoneCount(values);
  els.opsChecklist.querySelectorAll("[data-ops-item]").forEach((input) => {
    input.checked = Boolean(values[input.dataset.opsItem]);
  });
  if (els.opsReadiness) {
    els.opsReadiness.textContent = doneCount === 6
      ? "Betriebsroutine vollständig bestätigt."
      : `Betriebsroutine offen: ${doneCount}/6 Punkten erledigt.`;
    els.opsReadiness.className = `ops-readiness ${doneCount === 6 ? "ready" : ""}`;
  }
}

function unlockCockpit() {
  clearFailedPinAttempts();
  updateLockBlockedState();
  setSessionValue(LOCK_SESSION_STORAGE_KEY, "true");
  document.body.classList.remove("locked");
  els.lockPinInput.value = "";
  els.lockError.textContent = "";
  renderSecurityStatus();
  showToast("Cockpit entsperrt");
}

function lockCockpit() {
  removeSessionValue(LOCK_SESSION_STORAGE_KEY);
  document.body.classList.add("locked");
  updateLockCopy();
  renderSecurityStatus();
  updateLockBlockedState();
  window.setTimeout(() => els.lockPinInput.focus(), 50);
}

function initLock() {
  if (!getStoredValue(LOCK_PIN_HASH_STORAGE_KEY) && DEFAULT_LOCK_PIN_HASH) {
    setStoredValue(LOCK_PIN_HASH_STORAGE_KEY, DEFAULT_LOCK_PIN_HASH);
  }
  updateLockCopy();
  if (isUnlocked() && (getStoredValue(LOCK_PIN_HASH_STORAGE_KEY) || DEFAULT_LOCK_PIN_HASH)) {
    document.body.classList.remove("locked");
    renderSecurityStatus();
    return;
  }
  document.body.classList.add("locked");
  renderSecurityStatus();
  updateLockBlockedState();
  window.setTimeout(() => els.lockPinInput.focus(), 50);
}

function renderModules() {
  els.moduleStrip.innerHTML = state.areas.map((area) => {
    const match = activeItems(state.cases).find((item) => item.area === area);
    const progress = match?.progress || 18;
    return `
      <div class="module-pill">
        <strong>${area}</strong>
        <div class="status-line" aria-label="${progress}% vorbereitet"><span style="width:${progress}%"></span></div>
      </div>
    `;
  }).join("");
}

function renderMetrics() {
  const cases = activeItems(state.cases);
  const deadlines = activeItems(state.deadlines);
  const tasks = activeItems(state.tasks);
  const contacts = activeItems(state.contacts);
  const openDeadlines = deadlines.filter((item) => !item.done).length;
  const critical = deadlines.filter((item) => item.escalation === "critical" && !item.done).length;
  const analyzed = state.documents.filter((item) => item.status === "Analysiert").length;
  const openTasks = tasks.filter((item) => !item.done).length;
  const contactCount = contacts.length;
  const auditCount = state.auditLog.length;
  const archiveCount = archivedEntries().length;
  const metrics = [
    ["Aktive Vorgänge", cases.length, "über alle Behördenbereiche"],
    ["Offene Fristen", openDeadlines, `${critical} kritisch`],
    ["Analysierte Dokumente", analyzed, `${state.documents.length} im Register`],
    ["Offene Aufgaben", openTasks, `${contactCount} Kontakte · ${auditCount} Aktivitäten · ${archiveCount} Archiv`]
  ];
  els.metrics.innerHTML = metrics.map(([label, value, hint]) => `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${hint}</small>
    </div>
  `).join("");
}

function renderQualityStrip() {
  const criticalDeadlines = activeItems(state.deadlines).filter((item) => !item.done && item.escalation === "critical").length;
  const overdueTasks = activeItems(state.tasks).filter((item) => !item.done && daysUntil(item.dueDate) < 0).length;
  const incompleteContacts = activeItems(state.contacts).filter((item) => !item.email || !item.phone).length;
  const documentsWithoutDrive = state.documents.filter((item) => !item.driveUrl).length;
  const preflightDone = preflightDoneCount();
  const opsDone = opsDoneCount();
  const checks = [
    {
      label: "Kritische Fristen",
      value: criticalDeadlines,
      detail: criticalDeadlines ? "sofort prüfen" : "alles ruhig",
      level: criticalDeadlines ? "critical" : "ok",
      target: "deadlines",
      search: "kritisch"
    },
    {
      label: "Überfällige Aufgaben",
      value: overdueTasks,
      detail: overdueTasks ? "nachziehen" : "keine überfällig",
      level: overdueTasks ? "warning" : "ok",
      target: "tasks",
      search: "überfällig"
    },
    {
      label: "Kontaktlücken",
      value: incompleteContacts,
      detail: incompleteContacts ? "E-Mail/Telefon ergänzen" : "vollständig",
      level: incompleteContacts ? "warning" : "ok",
      target: "contacts",
      search: "Keine"
    },
    {
      label: "Drive-Link fehlt",
      value: documentsWithoutDrive,
      detail: documentsWithoutDrive ? "Dokumente prüfen" : "alles verlinkt",
      level: documentsWithoutDrive ? "warning" : "ok",
      target: "documents",
      search: "Kein Link"
    },
    {
      label: "Echte Daten",
      value: `${preflightDone}/6`,
      detail: preflightDone === 6 ? "Einzelupload möglich" : "Preflight offen",
      level: preflightDone === 6 ? "ok" : "warning",
      target: "setup",
      search: ""
    },
    {
      label: "Betrieb",
      value: `${opsDone}/6`,
      detail: opsDone === 6 ? "Routine bestätigt" : "Backup/Restore offen",
      level: opsDone === 6 ? "ok" : "warning",
      target: "setup",
      search: ""
    }
  ];
  els.qualityStrip.innerHTML = checks.map((item) => `
    <button class="quality-item ${item.level}" type="button" data-quality-target="${item.target}" data-quality-search="${item.search}">
      <div>
        <strong>${item.label}</strong>
        <span>${item.detail}</span>
      </div>
      <b>${item.value}</b>
    </button>
  `).join("");
}

function getFilteredCases() {
  const area = els.areaFilter.value;
  const query = els.searchInput.value.trim().toLowerCase();
  return activeItems(state.cases).filter((item) => {
    const areaMatch = area === "all" || item.area === area;
    const queryMatch = !query || `${item.area} ${item.authority} ${item.next} ${item.id}`.toLowerCase().includes(query);
    return areaMatch && queryMatch;
  });
}

function renderCases() {
  els.caseList.innerHTML = getFilteredCases().map((item) => `
    <article class="case-item">
      <div class="case-top">
        <div>
          <div class="case-title">${item.area}</div>
          <div class="meta">${item.authority} · ${item.id} · ${item.status}</div>
        </div>
        <span class="badge ${item.priority}">${priorityLabel(item.priority)}</span>
      </div>
      <p class="meta">${item.next}</p>
      <div class="case-actions">
        <button class="mini-button" title="Vorgang bearbeiten" data-edit-case="${item.id}"><span data-icon="pencil"></span></button>
        <button class="mini-button" title="Vorgang archivieren" data-archive-case="${item.id}"><span data-icon="archive"></span></button>
      </div>
    </article>
  `).join("") || `<p class="meta">Keine Vorgänge gefunden.</p>`;
}

function renderCasesTable() {
  const query = els.searchInput.value.trim().toLowerCase();
  const cases = activeItems(state.cases).filter((item) => {
    const haystack = `${item.id} ${item.area} ${item.authority} ${item.status} ${item.next}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  els.casesTable.innerHTML = cases.map((item) => `
    <article class="case-register-item">
      <div class="case-register-top">
        <div>
          <strong>${item.area}</strong>
          <div class="meta">${item.id} · ${item.authority}</div>
        </div>
        <div class="case-actions">
          <span class="badge ${item.priority}">${priorityLabel(item.priority)}</span>
          <button class="mini-button" title="Vorgang bearbeiten" data-edit-case="${item.id}"><span data-icon="pencil"></span></button>
          <button class="mini-button" title="Vorgang archivieren" data-archive-case="${item.id}"><span data-icon="archive"></span></button>
        </div>
      </div>
      <div class="case-register-details">
        <div><span>Status</span><strong>${item.status}</strong></div>
        <div><span>Behörde</span><strong>${item.authority}</strong></div>
        <div><span>Nächster Schritt</span><strong>${item.next}</strong></div>
        <div><span>Fortschritt</span>
        <div class="status-line" aria-label="${item.progress}% erledigt"><span style="width:${item.progress}%"></span></div>
        </div>
      </div>
    </article>
  `).join("") || `<p class="meta">Keine Vorgänge gefunden.</p>`;
}

function renderDocuments() {
  const query = els.searchInput.value.trim().toLowerCase();
  const docs = state.documents.filter((item) => {
    const linkLabel = item.driveUrl ? "Drive öffnen" : "Kein Link";
    return !query || `${item.name} ${item.area} ${item.type} ${item.status} ${linkLabel}`.toLowerCase().includes(query);
  });
  els.documentsTable.innerHTML = docs.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.area}</td>
      <td>${item.type}</td>
      <td><span class="badge ${item.status === "Analysiert" ? "ok" : "info"}">${item.status}</span></td>
      <td>${item.date}</td>
      <td>
        ${item.driveUrl ? `<a class="mini-link" href="${item.driveUrl}" target="_blank" rel="noopener">Drive öffnen</a>` : `<button class="mini-link" type="button" data-upload-missing-document="${item.id}">Kein Link · Nachreichen</button>`}
      </td>
    </tr>
  `).join("");
}

function renderListSummary(element, allItems, visibleItems, hiddenDone) {
  const open = allItems.filter((item) => !item.done).length;
  const done = allItems.filter((item) => item.done).length;
  element.innerHTML = `
    <span class="summary-chip">Offen: ${open}</span>
    <span class="summary-chip">Erledigt: ${done}</span>
    <span class="summary-chip">Sichtbar: ${visibleItems.length}</span>
    ${hiddenDone ? `<span class="summary-chip muted">Erledigte ausgeblendet</span>` : ""}
  `;
}

function renderDeadlines() {
  const query = els.searchInput.value.trim().toLowerCase();
  const allDeadlines = activeItems(state.deadlines);
  const items = sortByUrgency(allDeadlines.filter((item) => {
    if (!showDoneDeadlines && item.done) return false;
    const label = dueLabel(item.date, item.done);
    const escalationLabel = item.escalation === "critical" ? "kritisch" : item.escalation === "soon" ? "bald" : item.escalation;
    const overdueLabel = !item.done && daysUntil(item.date) < 0 ? "überfällig ueberfaellig" : "";
    return !query || `${item.title} ${item.area} ${item.caseId} ${item.date} ${label} ${escalationLabel} ${overdueLabel}`.toLowerCase().includes(query);
  }), "date", "escalation");
  renderListSummary(els.deadlineSummary, allDeadlines, items, !showDoneDeadlines);
  els.deadlineBoard.innerHTML = items.map((item) => {
    const label = dueLabel(item.date, item.done);
    const level = dueLevel(item.date, item.escalation, item.done);
    return `
      <article class="deadline-item">
        <div class="deadline-top">
          <div>
            <strong>${item.title}</strong>
            <div class="meta">${item.area} · ${item.caseId} · ${item.date}</div>
          </div>
          <span class="badge ${level}">${label}</span>
        </div>
        <div class="deadline-actions">
          <button class="mini-button" title="Frist bearbeiten" data-edit-deadline="${item.id}"><span data-icon="pencil"></span></button>
          <button class="mini-button" title="Frist archivieren" data-archive-deadline="${item.id}"><span data-icon="archive"></span></button>
          ${item.done ? "" : `<button class="mini-button" title="Als erledigt markieren" data-deadline="${item.id}"><span data-icon="check"></span></button>`}
          <button class="mini-button" title="WhatsApp Erinnerung testen" data-remind="${item.id}"><span data-icon="message-circle"></span></button>
        </div>
      </article>
    `;
  }).join("") || `<p class="meta">Keine Fristen gefunden.</p>`;
}

function renderChecklists() {
  const area = els.checklistAreaFilter.value || "all";
  const query = els.searchInput.value.trim().toLowerCase();
  const allChecklists = activeItems(state.checklists).filter((item) => area === "all" || item.area === area);
  const items = allChecklists.filter((item) => {
    if (!showDoneChecklists && item.done) return false;
    const areaMatch = area === "all" || item.area === area;
    const queryMatch = !query || `${item.area} ${item.title} ${item.description}`.toLowerCase().includes(query);
    return areaMatch && queryMatch;
  });
  renderListSummary(els.checklistSummary, allChecklists, items, !showDoneChecklists);
  els.checklistBoard.innerHTML = items.map((item) => `
    <article class="checklist-item ${item.done ? "done" : ""}">
      <div class="checklist-top">
        <div>
          <strong>${item.title}</strong>
          <div class="meta">${item.area} · ${item.description}</div>
        </div>
        <div class="checklist-actions">
          <button class="mini-button" title="Checklistenpunkt bearbeiten" data-edit-checklist="${item.id}"><span data-icon="pencil"></span></button>
          <button class="mini-button" title="Checklistenpunkt archivieren" data-archive-checklist="${item.id}"><span data-icon="archive"></span></button>
          ${item.done ? "" : `<button class="mini-button" title="Punkt erledigen" data-checklist="${item.id}"><span data-icon="check"></span></button>`}
        </div>
      </div>
    </article>
  `).join("") || `<p class="meta">Keine Checklisteneinträge gefunden.</p>`;
}

function renderTasks() {
  const query = els.searchInput.value.trim().toLowerCase();
  const allTasks = activeItems(state.tasks);
  const tasks = sortByUrgency(allTasks.filter((item) => {
    if (!showDoneTasks && item.done) return false;
    const overdueLabel = !item.done && daysUntil(item.dueDate) < 0 ? "überfällig ueberfaellig" : "";
    return !query || `${item.title} ${item.area} ${item.caseId} ${item.dueDate} ${item.priority} ${overdueLabel}`.toLowerCase().includes(query);
  }), "dueDate", "priority");
  renderListSummary(els.taskSummary, allTasks, tasks, !showDoneTasks);
  els.taskBoard.innerHTML = tasks.map((item) => `
    <article class="task-item ${item.done ? "done" : ""}">
      <div class="task-top">
        <div>
          <strong>${item.title}</strong>
          <div class="meta">${item.area} · ${item.caseId} · ${dueLabel(item.dueDate, item.done)} · ${item.dueDate}</div>
        </div>
        <span class="badge ${dueLevel(item.dueDate, item.priority, item.done)}">${item.done ? "Erledigt" : priorityLabel(item.priority)}</span>
      </div>
      <div class="task-actions">
        <button class="mini-button" title="Aufgabe bearbeiten" data-edit-task="${item.id}"><span data-icon="pencil"></span></button>
        <button class="mini-button" title="Aufgabe archivieren" data-archive-task="${item.id}"><span data-icon="archive"></span></button>
        ${item.done ? "" : `<button class="mini-button" title="Als erledigt markieren" data-task="${item.id}"><span data-icon="check"></span></button>`}
      </div>
    </article>
  `).join("") || `<p class="meta">Keine Aufgaben vorhanden.</p>`;
}

function renderContacts() {
  const query = els.searchInput.value.trim().toLowerCase();
  const contacts = activeItems(state.contacts).filter((item) => {
    const emailLabel = item.email ? item.email : "Keine E-Mail";
    const phoneLabel = item.phone ? item.phone : "Keine Telefonnummer";
    const haystack = `${item.name} ${item.organization} ${item.area} ${emailLabel} ${phoneLabel}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  els.contactGrid.innerHTML = contacts.map((item) => `
    <article class="contact-item">
      <div class="contact-top">
        <div>
          <strong>${item.organization}</strong>
          <div class="meta">${item.name} · ${item.area}</div>
        </div>
        <div class="contact-actions">
          <span class="badge info">${item.type}</span>
          <button class="mini-button" title="Kontakt bearbeiten" data-edit-contact="${item.id}"><span data-icon="pencil"></span></button>
          <button class="mini-button" title="Kontakt archivieren" data-archive-contact="${item.id}"><span data-icon="archive"></span></button>
        </div>
      </div>
      <div class="contact-lines">
        <div class="contact-line"><span data-icon="mail"></span>${item.email || "Keine E-Mail"}</div>
        <div class="contact-line"><span data-icon="phone"></span>${item.phone || "Keine Telefonnummer"}</div>
      </div>
    </article>
  `).join("") || `<p class="meta">Keine Kontakte gefunden.</p>`;
}

function renderActivity() {
  const query = els.searchInput.value.trim().toLowerCase();
  const entries = state.auditLog.filter((item) => {
    const haystack = `${item.action} ${item.object} ${item.details} ${item.area}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  els.activityList.innerHTML = entries.map((item) => `
    <article class="activity-item ${item.level || ""}">
      <div class="activity-top">
        <div>
          <strong>${item.action}</strong>
          <div class="meta">${item.timestamp} · ${item.object} · ${item.area}</div>
        </div>
        <span class="badge ${item.level === "critical" ? "critical" : item.level === "warning" ? "medium" : "info"}">${item.source}</span>
      </div>
      <p class="meta">${item.details}</p>
    </article>
  `).join("") || `<p class="meta">Keine Aktivitäten gefunden.</p>`;
}

function archivedEntries() {
  return [
    ...state.cases.filter((item) => item.archived).map((item) => ({
      type: "case",
      collection: "cases",
      label: "Vorgang",
      id: item.id,
      title: item.area,
      meta: `${item.authority || "Behörde"} · ${item.status || "Archiviert"}`,
      area: item.area
    })),
    ...state.deadlines.filter((item) => item.archived).map((item) => ({
      type: "deadline",
      collection: "deadlines",
      label: "Frist",
      id: item.id,
      title: item.title,
      meta: `${item.area} · ${item.date}`,
      area: item.area
    })),
    ...state.tasks.filter((item) => item.archived).map((item) => ({
      type: "task",
      collection: "tasks",
      label: "Aufgabe",
      id: item.id,
      title: item.title,
      meta: `${item.area} · fällig ${item.dueDate}`,
      area: item.area
    })),
    ...state.contacts.filter((item) => item.archived).map((item) => ({
      type: "contact",
      collection: "contacts",
      label: "Kontakt",
      id: item.id,
      title: item.organization,
      meta: `${item.name || "Ansprechpartner offen"} · ${item.area}`,
      area: item.area
    })),
    ...state.checklists.filter((item) => item.archived).map((item) => ({
      type: "checklist",
      collection: "checklists",
      label: "Checkliste",
      id: item.id,
      title: item.title,
      meta: `${item.area} · ${item.description || "Keine Beschreibung"}`,
      area: item.area
    }))
  ];
}

function renderArchive() {
  const query = els.searchInput.value.trim().toLowerCase();
  const allItems = archivedEntries();
  const items = allItems.filter((item) => {
    const haystack = `${item.label} ${item.id} ${item.title} ${item.meta} ${item.area}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  const counts = [
    ["Vorgänge", allItems.filter((item) => item.type === "case").length],
    ["Fristen", allItems.filter((item) => item.type === "deadline").length],
    ["Aufgaben", allItems.filter((item) => item.type === "task").length],
    ["Kontakte", allItems.filter((item) => item.type === "contact").length],
    ["Listen", allItems.filter((item) => item.type === "checklist").length]
  ];
  els.archiveSummary.innerHTML = counts.map(([label, value]) => `
    <div class="archive-summary-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
  els.archiveList.innerHTML = items.map((item) => `
    <article class="archive-item">
      <div class="archive-top">
        <div>
          <strong>${item.title}</strong>
          <div class="meta">${item.label} · ${item.id} · ${item.meta}</div>
        </div>
        <button class="mini-button" title="Wiederherstellen" data-restore-type="${item.type}" data-restore-collection="${item.collection}" data-restore-id="${item.id}"><span data-icon="undo"></span></button>
      </div>
    </article>
  `).join("") || `<p class="meta">Keine archivierten Einträge vorhanden.</p>`;
}

function renderAutomations() {
  els.automationGrid.innerHTML = state.automations.map((item) => `
    <article class="automation-item">
      <div class="automation-top">
        <strong>${item.name}</strong>
        <span class="badge ${item.status}">${item.status === "active" ? "Aktiv" : "Bereit"}</span>
      </div>
      <p>${item.description}</p>
      <div class="meta">Letzter Lauf: ${item.lastRun}</div>
    </article>
  `).join("");
}

function renderAnalysis() {
  const latest = state.analyses[0];
  if (!latest) {
    els.analysisBox.innerHTML = `<p class="meta">Noch keine KI-Analyse vorhanden.</p>`;
    return;
  }
  els.analysisBox.innerHTML = `
    <div class="analysis-card">
      <strong>Letzte Analyse: ${latest.documentName}</strong>
      <p>${latest.summary}</p>
      <span class="badge medium">Risiko ${latest.risk}</span>
    </div>
    <div class="analysis-card">
      <strong>Nächster Schritt</strong>
      <p>${latest.nextStep}</p>
      <span class="badge info">KI-Vorschlag</span>
    </div>
  `;
}

function fillAreaFilter() {
  const selectedArea = els.areaFilter.value || "all";
  const selectedCheckArea = els.checkAreaSelect.value || state.areas[0] || "";
  const selectedChecklistArea = els.checklistAreaFilter.value || "all";
  els.areaFilter.innerHTML = `<option value="all">Alle Bereiche</option>`;
  els.areaFilter.innerHTML += state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.checkAreaSelect.innerHTML = state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.deadlineAreaInput.innerHTML = state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.taskAreaInput.innerHTML = state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.contactAreaInput.innerHTML = state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.caseAreaInput.innerHTML = state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.checklistAreaInput.innerHTML = state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.checklistAreaFilter.innerHTML = `<option value="all">Alle Bereiche</option>`;
  els.checklistAreaFilter.innerHTML += state.areas.map((area) => `<option value="${area}">${area}</option>`).join("");
  els.areaFilter.value = state.areas.includes(selectedArea) ? selectedArea : "all";
  els.checkAreaSelect.value = state.areas.includes(selectedCheckArea) ? selectedCheckArea : state.areas[0] || "";
  els.deadlineAreaInput.value = state.areas.includes(els.deadlineAreaInput.value) ? els.deadlineAreaInput.value : state.areas[0] || "";
  els.taskAreaInput.value = state.areas.includes(els.taskAreaInput.value) ? els.taskAreaInput.value : state.areas[0] || "";
  els.contactAreaInput.value = state.areas.includes(els.contactAreaInput.value) ? els.contactAreaInput.value : state.areas[0] || "";
  els.caseAreaInput.value = state.areas.includes(els.caseAreaInput.value) ? els.caseAreaInput.value : state.areas[0] || "";
  els.checklistAreaInput.value = state.areas.includes(els.checklistAreaInput.value) ? els.checklistAreaInput.value : state.areas[0] || "";
  els.checklistAreaFilter.value = state.areas.includes(selectedChecklistArea) ? selectedChecklistArea : "all";
}

function openDeadlineModal(item = null) {
  editingDeadlineId = item?.id || "";
  if (item) {
    els.deadlineTitleInput.value = item.title || "";
    els.deadlineAreaInput.value = item.area || state.areas[0] || "";
    els.deadlineDateInput.value = item.date || dateAfter(14);
    els.deadlineNextStepInput.value = item.nextStep || item.title || "";
  } else {
    els.deadlineTitleInput.value = "Antwort prüfen";
    els.deadlineAreaInput.value = state.areas[0] || "";
    els.deadlineDateInput.value = dateAfter(14);
    els.deadlineNextStepInput.value = "Unterlagen prüfen und Rückmeldung vorbereiten";
  }
  els.deadlineModal.hidden = false;
  els.deadlineTitleInput.focus();
  renderIcons();
}

function closeDeadlineModal() {
  els.deadlineModal.hidden = true;
  editingDeadlineId = "";
}

function openTaskModal(item = null) {
  editingTaskId = item?.id || "";
  if (item) {
    els.taskTitleInput.value = item.title || "";
    els.taskAreaInput.value = item.area || state.areas[0] || "";
    els.taskDueDateInput.value = item.dueDate || dateAfter(7);
    els.taskPriorityInput.value = item.priority || "medium";
  } else {
    els.taskTitleInput.value = "Unterlage prüfen";
    els.taskAreaInput.value = state.areas[0] || "";
    els.taskDueDateInput.value = dateAfter(7);
    els.taskPriorityInput.value = "medium";
  }
  els.taskModal.hidden = false;
  els.taskTitleInput.focus();
  renderIcons();
}

function closeTaskModal() {
  els.taskModal.hidden = true;
  editingTaskId = "";
}

function openContactModal(item = null) {
  editingContactId = item?.id || "";
  if (item) {
    els.contactOrganizationInput.value = item.organization || "";
    els.contactNameInput.value = item.name || "";
    els.contactAreaInput.value = item.area || state.areas[0] || "";
    els.contactEmailInput.value = item.email || "";
    els.contactPhoneInput.value = item.phone || "";
  } else {
    els.contactOrganizationInput.value = "Neue Kontaktstelle";
    els.contactNameInput.value = "Ansprechpartner offen";
    els.contactAreaInput.value = state.areas[0] || "";
    els.contactEmailInput.value = "kontakt@example.de";
    els.contactPhoneInput.value = "";
  }
  els.contactModal.hidden = false;
  els.contactOrganizationInput.focus();
  renderIcons();
}

function closeContactModal() {
  els.contactModal.hidden = true;
  editingContactId = "";
}

function openCaseModal(item = null) {
  editingCaseId = item?.id || "";
  if (item) {
    els.caseAreaInput.value = item.area || state.areas[0] || "";
    els.caseStatusInput.value = item.status || "In Prüfung";
    els.caseAuthorityInput.value = item.authority || "";
    els.caseNextInput.value = item.next || "";
  } else {
    els.caseAreaInput.value = state.areas[0] || "";
    els.caseStatusInput.value = "In Prüfung";
    els.caseAuthorityInput.value = "Behörde";
    els.caseNextInput.value = "Unterlagen prüfen und nächsten Schritt planen";
  }
  els.caseModal.hidden = false;
  els.caseAuthorityInput.focus();
  renderIcons();
}

function closeCaseModal() {
  els.caseModal.hidden = true;
  editingCaseId = "";
}

function openChecklistModal(item = null) {
  editingChecklistId = item?.id || "";
  if (item) {
    els.checklistTitleInput.value = item.title || "";
    els.checklistAreaInput.value = item.area || state.areas[0] || "";
    els.checklistDescriptionInput.value = item.description || "";
  } else {
    els.checklistTitleInput.value = "Nachweis prüfen";
    els.checklistAreaInput.value = state.areas[0] || "";
    els.checklistDescriptionInput.value = "Unterlage im Drive ablegen und kontrollieren";
  }
  els.checklistModal.hidden = false;
  els.checklistTitleInput.focus();
  renderIcons();
}

function closeChecklistModal() {
  els.checklistModal.hidden = true;
  editingChecklistId = "";
}

function renderCheckResult(result) {
  if (!result) {
    els.checkResult.innerHTML = `<p class="meta">Noch kein Dokument geprüft.</p>`;
    els.checkRiskBadge.textContent = "Bereit";
    els.checkRiskBadge.className = "badge medium";
    return;
  }
  const riskClass = {
    kritisch: "critical",
    hoch: "high",
    mittel: "medium",
    niedrig: "low"
  }[String(result.risk || "").toLowerCase()] || "medium";
  const detailLines = [
    result.authority ? `Behörde: ${result.authority}` : "",
    result.referenceNumber ? `Aktenzeichen: ${result.referenceNumber}` : "",
    result.deadlineDate ? `Frist: ${result.deadlineDate}` : ""
  ].filter(Boolean);
  els.checkRiskBadge.textContent = `Risiko ${result.risk}`;
  els.checkRiskBadge.className = `badge ${riskClass}`;
  els.checkResult.innerHTML = `
    <div class="check-result-card">
      <strong>${result.title}</strong>
      <p>${result.summary}</p>
      <p class="meta">Gespeichert als: ${result.fileName}</p>
      ${detailLines.length ? `<p class="meta">${detailLines.join(" · ")}</p>` : ""}
      ${result.driveUrl ? `<a class="mini-link" href="${result.driveUrl}" target="_blank" rel="noopener">Drive öffnen</a>` : ""}
      <ul class="finding-list">
        ${result.findings.map((finding) => `<li>${finding}</li>`).join("")}
      </ul>
    </div>
    <div class="analysis-card">
      <strong>Nächster Schritt</strong>
      <p>${result.nextStep}</p>
      <span class="badge info">Aufgabe und Frist angelegt</span>
    </div>
  `;
}

function simulateDocumentCheck(fileName, area, type) {
  const normalizedFileName = buildDocumentFileName({ originalName: fileName, area, type });
  const docId = `DOC-${String(state.documents.length + 1).padStart(3, "0")}`;
  const deadlineId = `F-${String(state.deadlines.length + 1).padStart(3, "0")}`;
  const taskId = `A-${String(state.tasks.length + 1).padStart(3, "0")}`;
  const logId = `LOG-${String(state.auditLog.length + 1).padStart(3, "0")}`;
  const relatedCase = state.cases.find((item) => item.area === area) || state.cases[0];
  const caseId = relatedCase?.id || "VG-000";
  const result = {
    title: `${type} geprüft: ${normalizedFileName}`,
    fileName: normalizedFileName,
    risk: "mittel",
    summary: `Das Dokument wurde dem Bereich ${area} zugeordnet. Es wurden eine mögliche Antwortfrist und fehlende Nachweise erkannt.`,
    findings: [
      "Fristvorschlag: Prüfung innerhalb von 14 Tagen",
      "Benötigte Anlage: aktueller Nachweis oder ärztliche Unterlage",
      "Empfehlung: Vorgang und Dokument vor Versand gegenprüfen"
    ],
    nextStep: "Dokument im Drive ablegen, Frist prüfen und fehlende Nachweise ergänzen."
  };

  state.documents.unshift({ id: docId, name: normalizedFileName, area, type, status: "Analysiert", date: todayValue() });
  state.deadlines.unshift({ id: deadlineId, caseId, title: `${type} Frist prüfen`, area, date: dateAfter(14), escalation: "soon", done: false });
  state.tasks.unshift({ id: taskId, caseId, title: `Nachweise zu ${normalizedFileName} ergänzen`, area, dueDate: dateAfter(7), priority: "medium", done: false });
  state.analyses.unshift({ documentName: normalizedFileName, summary: result.summary, risk: result.risk, nextStep: result.nextStep });
  state.auditLog.unshift({
    id: logId,
    timestamp: nowTimestamp(),
    action: "Bescheid-Check ausgeführt",
    object: docId,
    area,
    details: `${fileName} wurde als ${normalizedFileName} analysiert. Frist, Aufgabe und KI-Analyse wurden erzeugt.`,
    source: "KI",
    level: "warning"
  });

  renderAll();
  renderCheckResult(result);
}

async function uploadDocumentCheck(file, area, type, normalizedFileName) {
  const uploadUrl = getDocumentCheckUrl();
  if (!uploadUrl) {
    simulateDocumentCheck(file?.name || "Demo_Bescheid.pdf", area, type);
    showToast("Bescheid-Check abgeschlossen");
    return;
  }

  const formData = new FormData();
  if (file) {
    formData.append("file", file, normalizedFileName);
  }
  formData.append("area", area);
  formData.append("documentType", type);
  formData.append("normalizedFileName", normalizedFileName);
  formData.append("personName", "Murat Kocyigit");
  formData.append("source", "behoerden-cockpit");

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    throw new Error(`Upload fehlgeschlagen: ${response.status}`);
  }
  const result = await response.json();
  const displayResult = {
    title: result.title || `${type} geprüft: ${result.fileName || normalizedFileName}`,
    fileName: result.fileName || normalizedFileName,
    risk: result.risk || "mittel",
    summary: result.summary || `Das Dokument wurde an n8n übertragen und dem Bereich ${area} zugeordnet.`,
    findings: result.findings || ["n8n Upload erfolgreich", "Google-Drive-Ablage vorbereitet", "Google-Sheets-Eintrag vorbereitet"],
    nextStep: result.nextStep || "Daten neu laden, sobald der n8n-Workflow den Sheets-Eintrag geschrieben hat.",
    driveUrl: result.driveUrl || "",
    authority: result.authority || "",
    referenceNumber: result.referenceNumber || "",
    deadlineDate: result.deadlineDate || ""
  };
  renderCheckResult(displayResult);
  showToast("Dokument an n8n übergeben");
  return result;
}

function getBridgeEndpoint(path) {
  const uploadUrl = getDocumentCheckUrl();
  if (!uploadUrl) return "";
  try {
    const url = new URL(uploadUrl);
    url.pathname = path;
    return url.toString();
  } catch (error) {
    return "";
  }
}

async function persistManualEntry(type, item) {
  const url = getBridgeEndpoint("/manual-entry");
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, item })
    });
    if (!response.ok) throw new Error(`Speichern fehlgeschlagen: ${response.status}`);
    return true;
  } catch (error) {
    console.warn(error);
    showToast("Lokal angezeigt, Sheet-Speicherung fehlgeschlagen");
    return false;
  }
}

async function persistStatusUpdate(type, id, done) {
  const url = getBridgeEndpoint("/status-update");
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, done })
    });
    if (!response.ok) throw new Error(`Status speichern fehlgeschlagen: ${response.status}`);
    return true;
  } catch (error) {
    console.warn(error);
    showToast("Status lokal geändert, Sheet-Speicherung fehlgeschlagen");
    return false;
  }
}

async function persistItemUpdate(type, item) {
  const url = getBridgeEndpoint("/item-update");
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, item })
    });
    if (!response.ok) throw new Error(`Änderung speichern fehlgeschlagen: ${response.status}`);
    return true;
  } catch (error) {
    console.warn(error);
    showToast("Änderung lokal gespeichert, Sheet-Speicherung fehlgeschlagen");
    return false;
  }
}

function archiveItem({ type, collection, id, label }) {
  const item = state[collection].find((entry) => entry.id === id);
  if (!item) return;
  const title = item.title || item.area || item.organization || item.id;
  const confirmed = window.confirm(`${label} archivieren?\n\n${title}\n\nDer Eintrag verschwindet aus den aktiven Listen und kann im Archiv wiederhergestellt werden.`);
  if (!confirmed) return;
  item.archived = true;
  item.archivedAt = new Date().toISOString();
  state[collection] = state[collection].map((entry) => entry.id === id ? item : entry);
  const auditItem = {
    id: `LOG-${String(state.auditLog.length + 1).padStart(3, "0")}`,
    timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    action: `${label} archiviert`,
    object: item.id,
    area: item.area || "Cockpit",
    details: `${label} wurde im Cockpit archiviert und aus den aktiven Listen ausgeblendet.`,
    source: "App",
    level: "info"
  };
  state.auditLog.unshift(auditItem);
  renderAll();
  showToast(`${label} archiviert`);
  persistItemUpdate(type, item).then((saved) => saved && showToast(`${label} im Google Sheet archiviert`));
  persistManualEntry("audit", auditItem);
}

function restoreItem({ type, collection, id }) {
  const item = state[collection].find((entry) => entry.id === id);
  if (!item) return;
  item.archived = false;
  item.restoredAt = new Date().toISOString();
  state[collection] = state[collection].map((entry) => entry.id === id ? item : entry);
  const label = {
    case: "Vorgang",
    deadline: "Frist",
    task: "Aufgabe",
    contact: "Kontakt",
    checklist: "Checklistenpunkt"
  }[type] || "Eintrag";
  const auditItem = {
    id: `LOG-${String(state.auditLog.length + 1).padStart(3, "0")}`,
    timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    action: `${label} wiederhergestellt`,
    object: item.id,
    area: item.area || "Cockpit",
    details: `${label} wurde aus dem Archiv zurück in die aktive Liste geholt.`,
    source: "App",
    level: "info"
  };
  state.auditLog.unshift(auditItem);
  renderAll();
  showToast(`${label} wiederhergestellt`);
  persistItemUpdate(type, item).then((saved) => saved && showToast(`${label} im Google Sheet wiederhergestellt`));
  persistManualEntry("audit", auditItem);
}

function openView(viewId) {
  const button = document.querySelector(`.nav-button[data-view="${viewId}"]`);
  const view = document.querySelector(`#${viewId}`);
  if (!button || !view) return;
  document.querySelectorAll(".nav-button").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".view").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  view.classList.add("active");
}

function renderSearchDependentViews() {
  renderCases();
  renderCasesTable();
  renderDocuments();
  renderDeadlines();
  renderChecklists();
  renderTasks();
  renderContacts();
  renderActivity();
  renderArchive();
  renderIcons();
  renderSearchCount();
}

function countVisibleItemsForView(viewId) {
  const selectors = {
    dashboard: "#caseList .case-item",
    cases: "#casesTable .case-register-item",
    checklists: "#checklistBoard .checklist-item",
    documents: "#documentsTable tr",
    deadlines: "#deadlineBoard .deadline-item",
    tasks: "#taskBoard .task-item",
    contacts: "#contactGrid .contact-item",
    activity: "#activityList .activity-item",
    archive: "#archiveList .archive-item",
    automation: "#automationGrid .automation-item"
  };
  const selector = selectors[viewId];
  return selector ? document.querySelectorAll(selector).length : 0;
}

function renderSearchCount() {
  const activeView = document.querySelector(".view.active")?.id || "dashboard";
  const query = els.searchInput.value.trim();
  const count = countVisibleItemsForView(activeView);
  if (!query && activeView !== "checklists") {
    els.searchCount.textContent = "Alle Einträge";
    return;
  }
  els.searchCount.textContent = query ? `${count} Treffer` : `${count} sichtbar`;
}

function updateDoneToggleButtons() {
  const deadlineButton = document.querySelector("#toggleDoneDeadlinesButton");
  const taskButton = document.querySelector("#toggleDoneTasksButton");
  const checklistButton = document.querySelector("#toggleDoneChecklistsButton");
  if (deadlineButton) {
    deadlineButton.innerHTML = `<span data-icon="${showDoneDeadlines ? "eye-off" : "eye"}"></span>${showDoneDeadlines ? "Erledigte ausblenden" : "Erledigte anzeigen"}`;
  }
  if (taskButton) {
    taskButton.innerHTML = `<span data-icon="${showDoneTasks ? "eye-off" : "eye"}"></span>${showDoneTasks ? "Erledigte ausblenden" : "Erledigte anzeigen"}`;
  }
  if (checklistButton) {
    checklistButton.innerHTML = `<span data-icon="${showDoneChecklists ? "eye-off" : "eye"}"></span>${showDoneChecklists ? "Erledigte ausblenden" : "Erledigte anzeigen"}`;
  }
}

function markFollowupUploaded(uploadResult = {}) {
  if (!followupDocumentId) return;
  if (!uploadResult.driveUrl) return;
  const item = state.documents.find((entry) => entry.id === followupDocumentId);
  if (!item) return;
  item.status = "Nachgereicht";
  item.driveUrl = uploadResult.driveUrl || item.driveUrl || "";
  item.name = uploadResult.fileName || item.name;
  state.documents = state.documents.map((entry) => entry.id === item.id ? item : entry);
  setFollowupDocument(null);
  renderDocuments();
  renderMetrics();
  renderQualityStrip();
  renderSearchCount();
  persistItemUpdate("document", item).then((saved) => saved && showToast("Nachgereichten Drive-Link gespeichert"));
}

function exportCsv() {
  const rows = [
    ["Typ", "Bereich", "Titel", "Status", "Datum"],
    ...activeItems(state.cases).map((item) => ["Vorgang", item.area, item.next, item.status, ""]),
    ...state.documents.map((item) => ["Dokument", item.area, item.name, item.status, item.date]),
    ...activeItems(state.deadlines).map((item) => ["Frist", item.area, item.title, item.done ? "Erledigt" : "Offen", item.date]),
    ...activeItems(state.checklists).map((item) => ["Checkliste", item.area, item.title, item.done ? "Erledigt" : "Offen", ""]),
    ...activeItems(state.tasks).map((item) => ["Aufgabe", item.area, item.title, item.done ? "Erledigt" : "Offen", item.dueDate]),
    ...activeItems(state.contacts).map((item) => ["Kontakt", item.area, item.organization, item.type, item.email]),
    ...state.auditLog.map((item) => ["Aktivität", item.area, item.action, item.object, item.timestamp])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "behoerden-cockpit-export.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV-Export erstellt");
}

function bindEvents() {
  els.lockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const blockedSeconds = lockBlockedSeconds();
    if (blockedSeconds) {
      els.lockError.textContent = `Zu viele Fehlversuche. Bitte ${blockedSeconds} Sekunden warten.`;
      return;
    }
    const pin = els.lockPinInput.value.trim();
    if (pin.length < 4) {
      els.lockError.textContent = "PIN muss mindestens 4 Zeichen haben.";
      return;
    }
    const storedHash = getStoredValue(LOCK_PIN_HASH_STORAGE_KEY);
    const hash = await pinHash(pin);
    if (!storedHash) {
      setStoredValue(LOCK_PIN_HASH_STORAGE_KEY, hash);
      unlockCockpit();
      return;
    }
    if (hash === storedHash) {
      unlockCockpit();
      return;
    }
    const waitSeconds = recordFailedPinAttempt();
    els.lockError.textContent = waitSeconds
      ? `Zu viele Fehlversuche. Bitte ${waitSeconds} Sekunden warten.`
      : "PIN ist nicht korrekt.";
    updateLockBlockedState();
    els.lockPinInput.select();
  });

  document.querySelector("#lockButton").addEventListener("click", lockCockpit);

  document.querySelector("#pinChangeForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const currentPin = els.currentPinInput.value.trim();
    const newPin = els.newPinInput.value.trim();
    const confirmPin = els.confirmPinInput.value.trim();
    if (newPin.length < 4) {
      showToast("Neue PIN muss mindestens 4 Zeichen haben");
      return;
    }
    if (newPin !== confirmPin) {
      showToast("Neue PIN stimmt nicht überein");
      return;
    }
    const storedHash = getStoredValue(LOCK_PIN_HASH_STORAGE_KEY);
    const currentHash = await pinHash(currentPin);
    if (storedHash && currentHash !== storedHash) {
      showToast("Aktuelle PIN ist nicht korrekt");
      els.currentPinInput.select();
      return;
    }
    const nextHash = await pinHash(newPin);
    setStoredValue(LOCK_PIN_HASH_STORAGE_KEY, nextHash);
    els.currentPinInput.value = "";
    els.newPinInput.value = "";
    els.confirmPinInput.value = "";
    updateLockCopy();
    showToast("PIN geändert");
  });

  document.querySelector("#resetPinButton").addEventListener("click", () => {
    const confirmed = window.confirm("PIN wirklich zurücksetzen?\n\nDas Cockpit wird gesperrt. Danach kannst du eine neue PIN einrichten.");
    if (!confirmed) return;
    removeStoredValue(LOCK_PIN_HASH_STORAGE_KEY);
    removeSessionValue(LOCK_SESSION_STORAGE_KEY);
    els.currentPinInput.value = "";
    els.newPinInput.value = "";
    els.confirmPinInput.value = "";
    updateLockCopy();
    lockCockpit();
    showToast("PIN zurückgesetzt");
  });

  if (els.preflightChecklist) {
    els.preflightChecklist.addEventListener("change", (event) => {
      const input = event.target.closest("[data-preflight-item]");
      if (!input) return;
      const values = readPreflightChecklist();
      values[input.dataset.preflightItem] = input.checked;
      writePreflightChecklist(values);
      renderSecurityStatus();
      renderPreflightChecklist();
      renderFirstRealUploadGuide();
      updateDocumentCheckStatus();
      showToast(input.checked ? "Preflight-Punkt abgehakt" : "Preflight-Punkt offen");
    });
  }

  if (els.firstRealUploadGuide) {
    els.firstRealUploadGuide.addEventListener("change", (event) => {
      const input = event.target.closest("[data-first-real-item]");
      if (!input) return;
      const values = readFirstRealUploadGuide();
      values[input.dataset.firstRealItem] = input.checked;
      writeFirstRealUploadGuide(values);
      renderFirstRealUploadGuide();
      showToast(input.checked ? "Einzelupload-Kontrolle abgehakt" : "Einzelupload-Kontrolle offen");
    });
  }

  if (els.opsChecklist) {
    els.opsChecklist.addEventListener("change", (event) => {
      const input = event.target.closest("[data-ops-item]");
      if (!input) return;
      const values = readOpsChecklist();
      values[input.dataset.opsItem] = input.checked;
      writeOpsChecklist(values);
      renderOpsChecklist();
      renderSecurityStatus();
      showToast(input.checked ? "Betriebspunkt abgehakt" : "Betriebspunkt offen");
    });
  }

  els.uploadPreflightStatus?.addEventListener("click", () => {
    openView("setup");
    renderSearchCount();
    showToast("Preflight-Liste geöffnet");
  });

  els.resetPreflightButton?.addEventListener("click", () => {
    const confirmed = window.confirm("Preflight-Abhakliste wirklich zurücksetzen?");
    if (!confirmed) return;
    removeStoredValue(PREFLIGHT_CHECKLIST_STORAGE_KEY);
    renderPreflightChecklist();
    renderFirstRealUploadGuide();
    renderSecurityStatus();
    updateDocumentCheckStatus();
    showToast("Preflight zurückgesetzt");
  });

  els.resetFirstRealUploadButton?.addEventListener("click", () => {
    const confirmed = window.confirm("Kontrollliste für den ersten echten Einzelupload zurücksetzen?");
    if (!confirmed) return;
    removeStoredValue(FIRST_REAL_UPLOAD_STORAGE_KEY);
    renderFirstRealUploadGuide();
    showToast("Einzelupload-Kontrolle zurückgesetzt");
  });

  els.resetOpsChecklistButton?.addEventListener("click", () => {
    const confirmed = window.confirm("Betriebsroutine wirklich zurücksetzen?");
    if (!confirmed) return;
    removeStoredValue(OPS_CHECKLIST_STORAGE_KEY);
    renderOpsChecklist();
    renderSecurityStatus();
    showToast("Betriebsroutine zurückgesetzt");
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      openView(button.dataset.view);
      renderSearchCount();
    });
  });

  els.qualityStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quality-target]");
    if (!button) return;
    openView(button.dataset.qualityTarget);
    els.searchInput.value = button.dataset.qualitySearch || "";
    renderSearchDependentViews();
    showToast("Qualitätsbereich geöffnet");
  });

  els.areaFilter.addEventListener("change", renderCases);
  els.searchInput.addEventListener("input", () => {
    renderSearchDependentViews();
  });

  document.querySelector("#exportButton").addEventListener("click", exportCsv);
  document.querySelector("#clearSearchButton").addEventListener("click", () => {
    els.searchInput.value = "";
    els.areaFilter.value = "all";
    els.checklistAreaFilter.value = "all";
    renderSearchDependentViews();
    els.searchInput.focus();
    showToast("Filter zurückgesetzt");
  });

  els.followupNote.addEventListener("click", (event) => {
    if (event.target.closest("#clearFollowupButton")) {
      clearFollowupDocument();
    }
  });

  document.querySelector("#addCaseButton").addEventListener("click", () => {
    openCaseModal();
  });

  document.querySelector("#closeCaseModalButton").addEventListener("click", closeCaseModal);
  document.querySelector("#cancelCaseModalButton").addEventListener("click", closeCaseModal);
  els.caseModal.addEventListener("click", (event) => {
    if (event.target === els.caseModal) closeCaseModal();
  });

  const openCaseFromButton = (button) => {
    const item = state.cases.find((entry) => entry.id === button.dataset.editCase);
    if (item) openCaseModal(item);
  };
  const archiveCaseFromButton = (button) => {
    archiveItem({ type: "case", collection: "cases", id: button.dataset.archiveCase, label: "Vorgang" });
  };
  els.caseList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-case]");
    const archiveButton = event.target.closest("[data-archive-case]");
    if (editButton) openCaseFromButton(editButton);
    if (archiveButton) archiveCaseFromButton(archiveButton);
  });
  els.casesTable.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-case]");
    const archiveButton = event.target.closest("[data-archive-case]");
    if (editButton) openCaseFromButton(editButton);
    if (archiveButton) archiveCaseFromButton(archiveButton);
  });

  document.querySelector("#caseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const area = els.caseAreaInput.value;
    const existing = editingCaseId ? state.cases.find((entry) => entry.id === editingCaseId) : null;
    const item = {
      id: existing?.id || `VG-${String(state.cases.length + 1).padStart(3, "0")}`,
      area,
      authority: els.caseAuthorityInput.value.trim() || "Behörde",
      status: els.caseStatusInput.value,
      priority: existing?.priority || "medium",
      next: els.caseNextInput.value.trim() || "Nächsten Schritt planen",
      progress: existing?.progress || 12
    };
    if (existing) {
      state.cases = state.cases.map((entry) => entry.id === item.id ? item : entry);
    } else {
      state.cases.unshift(item);
    }
    renderModules();
    renderMetrics();
    renderCases();
    renderCasesTable();
    renderIcons();
    closeCaseModal();
    showToast(existing ? "Vorgang aktualisiert" : "Vorgang angelegt");
    const persist = existing ? persistItemUpdate("case", item) : persistManualEntry("case", item);
    persist.then((saved) => saved && showToast(existing ? "Vorgangsänderung im Google Sheet gespeichert" : "Vorgang im Google Sheet gespeichert"));
  });

  els.documentUploadInput.addEventListener("change", () => {
    const file = els.documentUploadInput.files[0];
    els.uploadFileLabel.textContent = file ? file.name : "PDF, Foto oder Brief auswählen";
    updateRenamePreview();
  });

  els.checkAreaSelect.addEventListener("change", updateRenamePreview);
  els.checkTypeSelect.addEventListener("change", updateRenamePreview);

  document.querySelector("#documentCheckForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = els.documentUploadInput.files[0];
    const fileName = file?.name || "Demo_Bescheid.pdf";
    const area = els.checkAreaSelect.value;
    const type = els.checkTypeSelect.value;
    if (file && !isPreflightReady()) {
      const confirmed = window.confirm("Der Echte-Daten-Preflight ist noch nicht vollständig.\n\nBitte nur mit einem unkritischen Testdokument fortfahren. Upload trotzdem starten?");
      if (!confirmed) {
        showToast("Upload abgebrochen: Preflight offen");
        return;
      }
      logPreflightOverride({ fileName, area, type });
    }
    const normalizedFileName = buildDocumentFileName({ originalName: fileName, area, type });
    if (file && isPreflightReady()) {
      markFirstRealUploadStep("filename");
    }
    try {
      const uploadResult = await uploadDocumentCheck(file, area, type, normalizedFileName);
      if (file && isPreflightReady()) {
        markFirstRealUploadStep("upload");
      }
      markFollowupUploaded(uploadResult);
    } catch (error) {
      console.warn(error);
      simulateDocumentCheck(fileName, area, type);
      if (file && isPreflightReady()) {
        markFirstRealUploadStep("upload");
      }
      showToast("n8n nicht erreichbar, Upload-Fallback genutzt");
    }
  });

  document.querySelector("#analyzeButton").addEventListener("click", async () => {
    await loadData();
    renderDocuments();
    renderAnalysis();
    renderMetrics();
    showToast("Analysen neu geladen");
  });

  document.querySelector("#addDocumentButton").addEventListener("click", () => {
    document.querySelector('[data-view="check"]').click();
    els.documentUploadInput.focus();
    showToast("Upload-Bereich geöffnet");
  });

  els.documentsTable.addEventListener("click", (event) => {
    const button = event.target.closest("[data-upload-missing-document]");
    if (!button) return;
    const documentItem = state.documents.find((item) => item.id === button.dataset.uploadMissingDocument);
    openView("check");
    setFollowupDocument(documentItem);
    if (documentItem?.area && state.areas.includes(documentItem.area)) {
      els.checkAreaSelect.value = documentItem.area;
    }
    if (documentItem?.type) {
      const matchingType = Array.from(els.checkTypeSelect.options).find((option) => option.value === documentItem.type || option.textContent === documentItem.type);
      if (matchingType) els.checkTypeSelect.value = matchingType.value;
    }
    updateRenamePreview();
    els.documentUploadInput.focus();
    renderSearchCount();
    showToast("Upload zum Nachreichen geöffnet");
  });

  document.querySelector("#addDeadlineButton").addEventListener("click", () => {
    openDeadlineModal();
  });

  document.querySelector("#toggleDoneDeadlinesButton").addEventListener("click", () => {
    showDoneDeadlines = !showDoneDeadlines;
    setStoredValue(SHOW_DONE_DEADLINES_STORAGE_KEY, String(showDoneDeadlines));
    renderDeadlines();
    updateDoneToggleButtons();
    renderSearchCount();
    renderIcons();
    showToast(showDoneDeadlines ? "Erledigte Fristen sichtbar" : "Erledigte Fristen ausgeblendet");
  });

  document.querySelector("#closeDeadlineModalButton").addEventListener("click", closeDeadlineModal);
  document.querySelector("#cancelDeadlineModalButton").addEventListener("click", closeDeadlineModal);
  els.deadlineModal.addEventListener("click", (event) => {
    if (event.target === els.deadlineModal) closeDeadlineModal();
  });

  document.querySelector("#deadlineForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const area = els.deadlineAreaInput.value;
    const relatedCase = state.cases.find((entry) => entry.area === area) || state.cases[0];
    const existing = editingDeadlineId ? state.deadlines.find((entry) => entry.id === editingDeadlineId) : null;
    const item = {
      id: existing?.id || `F-${String(state.deadlines.length + 1).padStart(3, "0")}`,
      caseId: relatedCase?.id || "",
      title: els.deadlineTitleInput.value.trim() || "Frist prüfen",
      area,
      date: els.deadlineDateInput.value,
      escalation: daysUntil(els.deadlineDateInput.value) <= 3 ? "critical" : "soon",
      done: existing?.done || false,
      nextStep: els.deadlineNextStepInput.value.trim() || els.deadlineTitleInput.value.trim() || "Frist prüfen"
    };
    if (existing) {
      state.deadlines = state.deadlines.map((entry) => entry.id === item.id ? item : entry);
    } else {
      state.deadlines.unshift(item);
    }
    renderDeadlines();
    renderMetrics();
    renderIcons();
    closeDeadlineModal();
    showToast(existing ? "Frist aktualisiert" : "Neue Frist angelegt");
    const persist = existing ? persistItemUpdate("deadline", item) : persistManualEntry("deadline", item);
    persist.then((saved) => saved && showToast(existing ? "Friständerung im Google Sheet gespeichert" : "Frist im Google Sheet gespeichert"));
  });

  els.checklistAreaFilter.addEventListener("change", () => {
    renderChecklists();
    renderIcons();
  });

  document.querySelector("#toggleDoneChecklistsButton").addEventListener("click", () => {
    showDoneChecklists = !showDoneChecklists;
    setStoredValue(SHOW_DONE_CHECKLISTS_STORAGE_KEY, String(showDoneChecklists));
    renderChecklists();
    updateDoneToggleButtons();
    renderSearchCount();
    renderIcons();
    showToast(showDoneChecklists ? "Erledigte Listenpunkte sichtbar" : "Erledigte Listenpunkte ausgeblendet");
  });

  document.querySelector("#addChecklistButton").addEventListener("click", openChecklistModal);
  document.querySelector("#closeChecklistModalButton").addEventListener("click", closeChecklistModal);
  document.querySelector("#cancelChecklistModalButton").addEventListener("click", closeChecklistModal);
  els.checklistModal.addEventListener("click", (event) => {
    if (event.target === els.checklistModal) closeChecklistModal();
  });

  document.querySelector("#checklistForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const existing = editingChecklistId ? state.checklists.find((entry) => entry.id === editingChecklistId) : null;
    const item = {
      id: existing?.id || `CL-${String(state.checklists.length + 1).padStart(3, "0")}`,
      area: els.checklistAreaInput.value,
      title: els.checklistTitleInput.value.trim() || "Checklistenpunkt",
      description: els.checklistDescriptionInput.value.trim(),
      done: existing?.done || false
    };
    if (existing) {
      state.checklists = state.checklists.map((entry) => entry.id === item.id ? item : entry);
    } else {
      state.checklists.unshift(item);
    }
    renderChecklists();
    renderMetrics();
    renderIcons();
    closeChecklistModal();
    showToast(existing ? "Checklistenpunkt aktualisiert" : "Checklistenpunkt angelegt");
    const persist = existing ? persistItemUpdate("checklist", item) : persistManualEntry("checklist", item);
    persist.then((saved) => saved && showToast(existing ? "Checklistenänderung im Google Sheet gespeichert" : "Checklistenpunkt im Google Sheet gespeichert"));
  });

  document.querySelector("#checklistBoard").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-checklist]");
    const archiveButton = event.target.closest("[data-archive-checklist]");
    const button = event.target.closest("[data-checklist]");
    if (editButton) {
      const item = state.checklists.find((entry) => entry.id === editButton.dataset.editChecklist);
      if (item) openChecklistModal(item);
      return;
    }
    if (archiveButton) {
      archiveItem({ type: "checklist", collection: "checklists", id: archiveButton.dataset.archiveChecklist, label: "Checklistenpunkt" });
      return;
    }
    if (!button) {
      return;
    }
    const item = state.checklists.find((entry) => entry.id === button.dataset.checklist);
    item.done = true;
    renderChecklists();
    renderIcons();
    showToast("Checklistenpunkt erledigt");
    persistStatusUpdate("checklist", item.id, true).then((saved) => saved && showToast("Checklistenstatus gespeichert"));
  });

  document.querySelector("#deadlineBoard").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-deadline]");
    const archiveButton = event.target.closest("[data-archive-deadline]");
    const doneButton = event.target.closest("[data-deadline]");
    const remindButton = event.target.closest("[data-remind]");
    if (editButton) {
      const deadline = state.deadlines.find((item) => item.id === editButton.dataset.editDeadline);
      if (deadline) openDeadlineModal(deadline);
      return;
    }
    if (archiveButton) {
      archiveItem({ type: "deadline", collection: "deadlines", id: archiveButton.dataset.archiveDeadline, label: "Frist" });
      return;
    }
    if (doneButton) {
      const deadline = state.deadlines.find((item) => item.id === doneButton.dataset.deadline);
      deadline.done = true;
      renderDeadlines();
      renderMetrics();
      renderIcons();
      showToast("Frist als erledigt markiert");
      persistStatusUpdate("deadline", deadline.id, true).then((saved) => saved && showToast("Friststatus gespeichert"));
    }
    if (remindButton) {
      const deadline = state.deadlines.find((item) => item.id === remindButton.dataset.remind);
      const auditItem = {
        id: `LOG-${String(state.auditLog.length + 1).padStart(3, "0")}`,
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        action: "Erinnerung vorbereitet",
        object: deadline?.id || "Frist",
        area: deadline?.area || "Fristen",
        details: `${deadline?.title || "Frist"} wurde für die nächste n8n-Erinnerungsrunde markiert.`,
        source: "App",
        level: "info"
      };
      state.auditLog.unshift(auditItem);
      renderActivity();
      showToast("Erinnerung für n8n vorbereitet");
      persistManualEntry("audit", auditItem).then((saved) => saved && showToast("Erinnerung im Google Sheet protokolliert"));
    }
  });

  document.querySelector("#addTaskButton").addEventListener("click", () => {
    openTaskModal();
  });

  document.querySelector("#toggleDoneTasksButton").addEventListener("click", () => {
    showDoneTasks = !showDoneTasks;
    setStoredValue(SHOW_DONE_TASKS_STORAGE_KEY, String(showDoneTasks));
    renderTasks();
    updateDoneToggleButtons();
    renderSearchCount();
    renderIcons();
    showToast(showDoneTasks ? "Erledigte Aufgaben sichtbar" : "Erledigte Aufgaben ausgeblendet");
  });

  document.querySelector("#closeTaskModalButton").addEventListener("click", closeTaskModal);
  document.querySelector("#cancelTaskModalButton").addEventListener("click", closeTaskModal);
  els.taskModal.addEventListener("click", (event) => {
    if (event.target === els.taskModal) closeTaskModal();
  });

  document.querySelector("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const area = els.taskAreaInput.value;
    const relatedCase = state.cases.find((entry) => entry.area === area) || state.cases[0];
    const existing = editingTaskId ? state.tasks.find((entry) => entry.id === editingTaskId) : null;
    const item = {
      id: existing?.id || `A-${String(state.tasks.length + 1).padStart(3, "0")}`,
      caseId: relatedCase?.id || "",
      title: els.taskTitleInput.value.trim() || "Aufgabe prüfen",
      area,
      dueDate: els.taskDueDateInput.value,
      priority: els.taskPriorityInput.value,
      done: existing?.done || false
    };
    if (existing) {
      state.tasks = state.tasks.map((entry) => entry.id === item.id ? item : entry);
    } else {
      state.tasks.unshift(item);
    }
    renderTasks();
    renderMetrics();
    renderIcons();
    closeTaskModal();
    showToast(existing ? "Aufgabe aktualisiert" : "Aufgabe angelegt");
    const persist = existing ? persistItemUpdate("task", item) : persistManualEntry("task", item);
    persist.then((saved) => saved && showToast(existing ? "Aufgabenänderung im Google Sheet gespeichert" : "Aufgabe im Google Sheet gespeichert"));
  });

  document.querySelector("#taskBoard").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-task]");
    const archiveButton = event.target.closest("[data-archive-task]");
    const taskButton = event.target.closest("[data-task]");
    if (editButton) {
      const task = state.tasks.find((item) => item.id === editButton.dataset.editTask);
      if (task) openTaskModal(task);
      return;
    }
    if (archiveButton) {
      archiveItem({ type: "task", collection: "tasks", id: archiveButton.dataset.archiveTask, label: "Aufgabe" });
      return;
    }
    if (!taskButton) {
      return;
    }
    const task = state.tasks.find((item) => item.id === taskButton.dataset.task);
    task.done = true;
    renderTasks();
    renderMetrics();
    renderIcons();
    showToast("Aufgabe als erledigt markiert");
    persistStatusUpdate("task", task.id, true).then((saved) => saved && showToast("Aufgabenstatus gespeichert"));
  });

  document.querySelector("#addContactButton").addEventListener("click", () => {
    openContactModal();
  });

  document.querySelector("#closeContactModalButton").addEventListener("click", closeContactModal);
  document.querySelector("#cancelContactModalButton").addEventListener("click", closeContactModal);
  els.contactModal.addEventListener("click", (event) => {
    if (event.target === els.contactModal) closeContactModal();
  });

  els.contactGrid.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-contact]");
    const archiveButton = event.target.closest("[data-archive-contact]");
    if (archiveButton) {
      archiveItem({ type: "contact", collection: "contacts", id: archiveButton.dataset.archiveContact, label: "Kontakt" });
      return;
    }
    if (!editButton) return;
    const contact = state.contacts.find((item) => item.id === editButton.dataset.editContact);
    if (contact) openContactModal(contact);
  });

  document.querySelector("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const existing = editingContactId ? state.contacts.find((entry) => entry.id === editingContactId) : null;
    const item = {
      id: existing?.id || `K-${String(state.contacts.length + 1).padStart(3, "0")}`,
      organization: els.contactOrganizationInput.value.trim() || "Kontaktstelle",
      name: els.contactNameInput.value.trim() || "Ansprechpartner offen",
      area: els.contactAreaInput.value,
      type: existing?.type || "Behörde",
      email: els.contactEmailInput.value.trim(),
      phone: els.contactPhoneInput.value.trim()
    };
    if (existing) {
      state.contacts = state.contacts.map((entry) => entry.id === item.id ? item : entry);
    } else {
      state.contacts.unshift(item);
    }
    renderContacts();
    renderMetrics();
    renderIcons();
    closeContactModal();
    showToast(existing ? "Kontakt aktualisiert" : "Kontakt angelegt");
    const persist = existing ? persistItemUpdate("contact", item) : persistManualEntry("contact", item);
    persist.then((saved) => saved && showToast(existing ? "Kontaktänderung im Google Sheet gespeichert" : "Kontakt im Google Sheet gespeichert"));
  });

  document.querySelector("#addAuditButton").addEventListener("click", () => {
    const item = {
      id: `LOG-${String(state.auditLog.length + 1).padStart(3, "0")}`,
      timestamp: nowTimestamp(),
      action: "Manueller Prüfeintrag",
      object: "Cockpit",
      area: "Setup",
      details: "Manuell im Cockpit angelegter Protokolleintrag.",
      source: "App",
      level: "info"
    };
    state.auditLog.unshift(item);
    renderActivity();
    renderMetrics();
    showToast("Aktivität protokolliert");
    persistManualEntry("audit", item).then((saved) => saved && showToast("Aktivität im Google Sheet gespeichert"));
  });

  els.archiveList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-restore-id]");
    if (!button) return;
    restoreItem({
      type: button.dataset.restoreType,
      collection: button.dataset.restoreCollection,
      id: button.dataset.restoreId
    });
  });

  document.querySelector("#runAutomationButton").addEventListener("click", async () => {
    await loadData();
    state.automations = state.automations.map((item) => ({ ...item, lastRun: item.lastRun || "Status geprüft" }));
    renderAutomations();
    showToast("Automationsstatus aktualisiert");
  });

  document.querySelector("#portalForm").addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Portal-Einstellungen gespeichert");
  });

  document.querySelector("#dataSourceForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const url = setDataSourceUrl(els.dataSourceInput.value);
    await loadData();
    renderAll();
    showToast(url === DEFAULT_DATA_SOURCE_URL ? "Lokale Datenquelle aktiv" : "Datenquelle gespeichert");
  });

  document.querySelector("#resetDataSourceButton").addEventListener("click", async () => {
    setDataSourceUrl("");
    await loadData();
    renderAll();
    showToast("Lokale Datenquelle aktiv");
  });

  document.querySelector("#reloadDataButton").addEventListener("click", async () => {
    await loadData();
    renderAll();
    showToast("Daten neu geladen");
  });

  document.querySelector("#uploadWebhookForm").addEventListener("submit", (event) => {
    event.preventDefault();
    setDocumentCheckUrl(els.uploadWebhookInput.value);
    updateDocumentCheckStatus();
    showToast(getDocumentCheckUrl() ? "Upload-Webhook gespeichert" : "Upload-Fallback aktiv");
  });

  document.querySelector("#resetUploadWebhookButton").addEventListener("click", () => {
    setDocumentCheckUrl("");
    updateDocumentCheckStatus();
    showToast("Upload-Fallback aktiv");
  });
}

async function init() {
  await loadData();
  bindEvents();
  renderAll();
  initLock();
}

function renderAll() {
  fillAreaFilter();
  renderModules();
  renderMetrics();
  renderQualityStrip();
  renderCases();
  renderCasesTable();
  renderDocuments();
  renderDeadlines();
  renderChecklists();
  renderTasks();
  renderContacts();
  renderActivity();
  renderArchive();
  renderAutomations();
  renderAnalysis();
  renderCheckResult();
  updateRenamePreview();
  updateDocumentCheckStatus();
  renderSecurityStatus();
  renderPreflightChecklist();
  renderFirstRealUploadGuide();
  renderOpsChecklist();
  updateDoneToggleButtons();
  renderIcons();
  renderSearchCount();
}

init();
