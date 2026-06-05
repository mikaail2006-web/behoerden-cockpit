import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

assert.equal(existsSync("scripts/create-local-backup.mjs"), true, "Backup-Script fehlt");
assert.equal(existsSync("Backup-Behörden-Cockpit.command"), true, "Backup-Starter fehlt");

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

console.log("backup script checks ok");
