import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    process.exit(result.status || 1);
  }
  return result.stdout;
}

const manifest = JSON.parse(readFileSync("project-manifest.json", "utf8"));
const testProtocol = readFileSync("docs/supabase-testprotokoll.md", "utf8");
const abnahme = readFileSync("docs/abnahmeprotokoll.md", "utf8");
const echteDaten = readFileSync("docs/echte-daten-starten.md", "utf8");
const uploads = existsSync("outputs/document-upload-log.json")
  ? JSON.parse(readFileSync("outputs/document-upload-log.json", "utf8"))
  : [];

assert.equal(manifest.status, "testbetrieb-unkritisch-bestanden", "Projektstatus muss Testbetrieb mit unkritischen Daten bestanden melden");
assert.equal(existsSync(".env"), false, ".env darf nicht im Projektordner liegen");
assert.equal(existsSync("api/.env"), false, "api/.env darf nicht im Projektordner liegen");
assert.equal(testProtocol.includes("Setup, RLS, Portal-API und Upload-Test bestanden"), true, "Supabase-Testprotokoll ist nicht auf bestanden gesetzt");
assert.equal(uploads.some((item) => item?.normalizedFileName?.includes("Test-Upload") || item?.normalizedFileName?.includes("KI-Regeltest")), true, "Kein unkritischer Upload-Test im Upload-Log gefunden");
assert.equal(abnahme.includes("## Sicherheit und Datenschutz"), true, "Abnahmeprotokoll unvollstaendig");
assert.equal(echteDaten.includes("## 4. Erstes echtes Dokument"), true, "Echte-Daten-Checkliste unvollstaendig");

run("node", ["scripts/check-secrets.mjs"]);
run("node", ["scripts/check-cockpit.mjs"]);

console.log("");
console.log("Preflight fuer echte Daten: technische Checks bestanden");
console.log("");
console.log("Manuell vor dem ersten echten Dokument bestaetigen:");
console.log("- Drive-Freigaben nur fuer berechtigte Personen");
console.log("- Google-Sheet-Freigaben nur fuer berechtigte Personen");
console.log("- n8n-Zugriff nur fuer berechtigte Personen");
console.log("- Backup-/Loeschroutine verstanden");
console.log("- erstes echtes Dokument einzeln und kontrolliert hochladen");
