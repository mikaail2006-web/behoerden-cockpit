import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupRoot = path.join(root, "outputs", "backups");
const backupDir = path.join(backupRoot, `behoerden-cockpit-${timestamp}`);

const fixedIncludes = [
  "app",
  "api",
  "data",
  "docs",
  "google-apps-script",
  "n8n",
  "scripts",
  "supabase",
  "package.json",
  "project-manifest.json",
  "README.md"
];

const commandIncludes = readdirSync(root).filter((name) => name.endsWith(".command"));
const includes = [...fixedIncludes, ...commandIncludes].filter((name) => existsSync(path.join(root, name)));

const excludedNames = new Set([
  ".env",
  "node_modules",
  "outputs",
  ".DS_Store"
]);

function isExcluded(sourcePath) {
  const relative = path.relative(root, sourcePath);
  const parts = relative.split(path.sep);
  const fileName = parts.at(-1) || "";
  if (!relative || relative.startsWith("..")) return false;
  if (parts.some((part) => excludedNames.has(part))) return true;
  if (fileName.startsWith(".env")) return true;
  if (fileName.endsWith(".log")) return true;
  if (fileName.endsWith(".backup")) return true;
  return false;
}

mkdirSync(backupRoot, { recursive: true });
rmSync(backupDir, { recursive: true, force: true });
mkdirSync(backupDir, { recursive: true });

for (const item of includes) {
  const source = path.join(root, item);
  const target = path.join(backupDir, item);
  cpSync(source, target, {
    recursive: true,
    filter: (sourcePath) => !isExcluded(sourcePath)
  });
}

const manifest = [
  "# Lokales Behörden-Cockpit Backup",
  "",
  `Erstellt: ${new Date().toLocaleString("de-DE")}`,
  "",
  "Enthalten:",
  ...includes.map((item) => `- ${item}`),
  "",
  "Ausgeschlossen:",
  "- .env und .env.*",
  "- api/.env und api/.env.*",
  "- node_modules",
  "- outputs und lokale Laufzeitdaten",
  "- Logdateien",
  "- *.backup",
  "",
  "Hinweis:",
  "Google Drive, Google Sheets und n8n muessen zusaetzlich in den jeweiligen Oberflaechen exportiert werden."
].join("\n");

writeFileSync(path.join(backupDir, "BACKUP-MANIFEST.md"), manifest);

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
writeFileSync(path.join(backupDir, "BACKUP-STATUS.json"), JSON.stringify({
  name: packageJson.name,
  version: packageJson.version,
  createdAt: new Date().toISOString(),
  backupPath: backupDir,
  includes,
  excludes: [".env", "api/.env", "node_modules", "outputs", "*.log", "*.backup"]
}, null, 2));

console.log("Lokales Backup erstellt:");
console.log(backupDir);
console.log("");
console.log("Wichtig: Google Sheet, Drive und n8n separat exportieren.");
