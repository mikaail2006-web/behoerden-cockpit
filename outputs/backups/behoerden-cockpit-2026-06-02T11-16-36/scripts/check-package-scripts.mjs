import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

for (const scriptName of [
  "check",
  "check:app",
  "status",
  "test:portal",
  "test:manifest",
  "test:status",
  "test:setup",
  "test:secrets",
  "backup",
  "start:portal-demo"
]) {
  assert.equal(Boolean(pkg.scripts?.[scriptName]), true, `package.json fehlt Script ${scriptName}`);
}

assert.equal(pkg.scripts.check.includes("scripts/check-cockpit.mjs"), true);
assert.equal(pkg.scripts.status.includes("scripts/status-cockpit.mjs"), true);
assert.equal(pkg.scripts.backup.includes("scripts/create-local-backup.mjs"), true);

console.log("package script checks ok");
