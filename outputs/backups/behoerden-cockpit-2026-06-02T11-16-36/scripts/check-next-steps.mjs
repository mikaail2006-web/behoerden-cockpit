import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("project-manifest.json", "utf8"));
const nextStepsDoc = readFileSync("docs/naechste-schritte.md", "utf8");

const headings = nextStepsDoc
  .split("\n")
  .filter((line) => line.startsWith("## "))
  .map((line) => line.replace(/^##\s+\d+\.\s*/, "").trim());

assert.deepEqual(headings.slice(0, manifest.nextSteps.length), manifest.nextSteps);

console.log("next-step checks ok");
