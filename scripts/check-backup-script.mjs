import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

assert.equal(existsSync("scripts/create-local-backup.mjs"), true, "Backup-Script fehlt");
assert.equal(existsSync("scripts/test-local-backup-restore.mjs"), true, "Restore-Test-Script fehlt");
assert.equal(existsSync("Backup-Behörden-Cockpit.command"), true, "Backup-Starter fehlt");
assert.equal(existsSync("Restore-Test-Behörden-Cockpit.command"), true, "Restore-Test-Starter fehlt");

const source = readFileSync("scripts/create-local-backup.mjs", "utf8");
for (const text of [
  "outputs",
  "node_modules",
  ".env",
  "api/.env",
  "BACKUP-MANIFEST.md",
  "Google Drive, Google Sheets und n8n muessen zusaetzlich"
]) {
  assert.equal(source.includes(text), true, `Backup-Script prueft ${text} nicht`);
}

const starter = readFileSync("Backup-Behörden-Cockpit.command", "utf8");
assert.equal(starter.includes("scripts/create-local-backup.mjs"), true, "Backup-Starter ruft falsches Script auf");

const restoreSource = readFileSync("scripts/test-local-backup-restore.mjs", "utf8");
for (const text of [
  "BACKUP-MANIFEST.md",
  "BACKUP-STATUS.json",
  "Ausgeschlossene Datei im Backup gefunden",
  "Lokaler Wiederherstellungstest bestanden"
]) {
  assert.equal(restoreSource.includes(text), true, `Restore-Test prueft ${text} nicht`);
}

const restoreStarter = readFileSync("Restore-Test-Behörden-Cockpit.command", "utf8");
assert.equal(restoreStarter.includes("scripts/test-local-backup-restore.mjs"), true, "Restore-Test-Starter ruft falsches Script auf");

console.log("backup script checks ok");
