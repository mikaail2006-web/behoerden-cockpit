import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const backupRoot = path.join(root, "outputs", "backups");

assert.equal(existsSync(backupRoot), true, "Kein lokaler Backup-Ordner gefunden. Erst Backup-Behörden-Cockpit.command ausfuehren.");

const backups = readdirSync(backupRoot)
  .filter((name) => name.startsWith("behoerden-cockpit-"))
  .map((name) => path.join(backupRoot, name))
  .filter((entryPath) => statSync(entryPath).isDirectory())
  .sort();

assert.ok(backups.length > 0, "Kein lokales Backup gefunden. Erst Backup-Behörden-Cockpit.command ausfuehren.");

const latestBackup = backups.at(-1);
const requiredEntries = [
  "BACKUP-MANIFEST.md",
  "BACKUP-STATUS.json",
  "app/index.html",
  "app/app.js",
  "docs/datenschutz-backup-loeschkonzept.md",
  "scripts/create-local-backup.mjs",
  "package.json",
  "project-manifest.json"
];

for (const entry of requiredEntries) {
  assert.equal(existsSync(path.join(latestBackup, entry)), true, `Backup unvollstaendig: ${entry} fehlt`);
}

const status = JSON.parse(readFileSync(path.join(latestBackup, "BACKUP-STATUS.json"), "utf8"));
assert.equal(status.name, "behoerden-cockpit", "Backup-Status enthaelt falschen Projektnamen");
assert.ok(Array.isArray(status.includes), "Backup-Status enthaelt keine Include-Liste");
assert.ok(status.includes.includes("app"), "App fehlt in Backup-Include-Liste");
assert.ok(status.includes.includes("docs"), "Docs fehlen in Backup-Include-Liste");

const manifest = readFileSync(path.join(latestBackup, "BACKUP-MANIFEST.md"), "utf8");
for (const text of [
  "Lokales Behörden-Cockpit Backup",
  "Ausgeschlossen:",
  "Google Drive, Google Sheets und n8n"
]) {
  assert.equal(manifest.includes(text), true, `Backup-Manifest unvollstaendig: ${text}`);
}

const forbiddenPaths = [
  ".env",
  "api/.env",
  "node_modules",
  "outputs"
];

for (const entry of forbiddenPaths) {
  assert.equal(existsSync(path.join(latestBackup, entry)), false, `Ausgeschlossene Datei im Backup gefunden: ${entry}`);
}

function listFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
    } else {
      files.push(entryPath);
    }
  }
  return files;
}

for (const file of listFiles(latestBackup)) {
  const relative = path.relative(latestBackup, file);
  assert.equal(relative.endsWith(".log"), false, `Logdatei im Backup gefunden: ${relative}`);
  assert.equal(relative.endsWith(".backup"), false, `Backup-Kopie im Backup gefunden: ${relative}`);
  assert.equal(path.basename(relative).startsWith(".env"), false, `Env-Datei im Backup gefunden: ${relative}`);
}

console.log("Lokaler Wiederherstellungstest bestanden:");
console.log(latestBackup);
console.log("");
console.log("Naechster manueller Restore-Test: Google Sheet exportieren, n8n JSON exportieren, App mit Backup-Kopie starten.");
