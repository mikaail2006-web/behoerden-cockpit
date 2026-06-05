import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("scripts/status-cockpit.mjs", "utf8");

assert.equal(source.includes("project-manifest.json"), true);
assert.equal(source.includes("manifest.nextSteps"), true);
assert.equal(source.includes("manifest.status"), true);
assert.equal(source.includes("manifest.runtimeServices"), true);
assert.equal(source.includes("manifest.n8n"), true);
assert.equal(source.includes("manifest.google"), true);
assert.equal(source.includes("Laufzeit"), true);
assert.equal(source.includes("completionStatus"), true);
assert.equal(source.includes("Fertigstellung"), true);
assert.equal(source.includes("docs/fertigstellung.md"), true);
assert.equal(source.includes("Heute-Starten.command"), true);
assert.equal(source.includes("docs/live-test-fehlerhilfe.md"), true);

console.log("status-cockpit tests ok");
