import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { Socket } from "node:net";

const manifest = JSON.parse(readFileSync("project-manifest.json", "utf8"));

function collectFiles(value) {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectFiles);
  if (typeof value === "object") return Object.values(value).flatMap(collectFiles);
  return [];
}

const importantFiles = [
  "project-manifest.json",
  ...collectFiles({
    entrypoints: manifest.entrypoints,
    coreDocs: manifest.coreDocs,
    portal: manifest.portal,
    supabase: manifest.supabase,
    n8n: manifest.n8n,
    google: manifest.google
  })
].filter((file, index, files) => files.indexOf(file) === index);

const completionStatus = [
  {
    stage: "Stufe 1",
    label: "Lokal fertig",
    status: "erreicht",
    next: "abgeschlossen"
  },
  {
    stage: "Stufe 2",
    label: "Testbetrieb mit unkritischen Daten",
    status: "erreicht",
    next: "abgeschlossen"
  },
  {
    stage: "Stufe 3",
    label: "Bereit fuer echte sensible Daten",
    status: "naechster Meilenstein",
    next: "Sicherheits- und Abnahmechecklisten abarbeiten"
  },
  {
    stage: "Stufe 4",
    label: "Produktiv/SaaS bereit",
    status: "offen",
    next: "Hosting, Monitoring, Datenschutz und produktive Integrationen abschliessen"
  }
];

function statusIcon(ok) {
  return ok ? "OK" : "FEHLT";
}

function portStatus(port) {
  return new Promise((resolve) => {
    const socket = new Socket();
    socket.setTimeout(250);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
    socket.connect(port, "127.0.0.1");
  });
}

console.log("Behoerden-Cockpit Status");
console.log("========================");
console.log(`Projekt: ${manifest.name}`);
console.log(`Status: ${manifest.status}`);
console.log(`Stand: ${manifest.lastUpdated}`);
console.log("");

console.log("Fertigstellung");
for (const item of completionStatus) {
  console.log(`${item.stage.padEnd(8)} ${item.status.padEnd(22)} ${item.label}`);
}
const nextMissing = completionStatus.find((item) => item.status !== "erreicht");
console.log(`Naechster fehlender Meilenstein: ${nextMissing?.next || "keiner"}`);
console.log("Details: docs/fertigstellung.md");
console.log("");

console.log("Heute");
console.log("- Startliste: Heute-Starten.command");
console.log("- Details: docs/heute-starten.md");
console.log("- Fehlerhilfe: docs/live-test-fehlerhilfe.md");
console.log("");

for (const file of importantFiles) {
  console.log(`${statusIcon(existsSync(file)).padEnd(6)} ${file}`);
}

console.log("");
console.log("Laufzeit");
const runtimeChecks = [
  ...(manifest.runtimeServices || [])
];

for (const { name, port, url } of runtimeChecks) {
  const online = await portStatus(port);
  console.log(`${(online ? "ONLINE" : "OFFLINE").padEnd(8)} ${name.padEnd(14)} ${url}`);
}

console.log("");
console.log("Gesamtcheck");
const check = spawnSync("node", ["scripts/check-cockpit.mjs"], { encoding: "utf8" });
process.stdout.write(check.stdout);
process.stderr.write(check.stderr);

if (check.status !== 0) {
  process.exit(check.status || 1);
}

console.log("");
console.log("Naechster Schritt");
for (const step of manifest.nextSteps.slice(0, 3)) {
  console.log(`- ${step}`);
}
