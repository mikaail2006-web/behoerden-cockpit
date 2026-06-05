import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("project-manifest.json", "utf8"));

function collectFiles(value) {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectFiles);
  if (typeof value === "object") return Object.values(value).flatMap(collectFiles);
  return [];
}

assert.equal(manifest.name, "Behoerden-Cockpit");
assert.equal(Boolean(manifest.lastUpdated), true, "Manifest braucht lastUpdated");
assert.equal(Array.isArray(manifest.runtimeServices), true, "Manifest braucht runtimeServices");

for (const service of manifest.runtimeServices) {
  assert.equal(Boolean(service.name), true, "runtimeService braucht name");
  assert.equal(Number.isInteger(service.port), true, `${service.name} braucht port`);
  assert.equal(Boolean(service.url), true, `${service.name} braucht url`);
}

const files = collectFiles({
  entrypoints: manifest.entrypoints,
  coreDocs: manifest.coreDocs,
  portal: manifest.portal,
  supabase: manifest.supabase,
  checks: manifest.checks
});

for (const file of files) {
  assert.equal(existsSync(file), true, `Manifest verweist auf fehlende Datei: ${file}`);
}

console.log("manifest checks ok");
