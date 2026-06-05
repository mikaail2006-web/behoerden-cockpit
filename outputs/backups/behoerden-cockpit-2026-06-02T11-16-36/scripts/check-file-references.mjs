import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const scanRoots = ["README.md", "app/index.html", "docs", "supabase"];
const ignoredDirs = new Set(["node_modules", ".git"]);
const fileRefPattern = /`((?:app|api|docs|supabase|scripts|n8n|google-apps-script|data|outputs)\/[^`]+|[^`\s]+\.command|project-manifest\.json|package\.json)`/g;

async function listFiles(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];

  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(path, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...await listFiles(fullPath));
      }
    } else if (/\.(md|html|sql)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = [];
for (const root of scanRoots) {
  files.push(...await listFiles(root));
}

for (const file of files) {
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(fileRefPattern)) {
    const ref = match[1].trim();
    if (ref.includes(" ")) continue;
    if (ref.startsWith("http")) continue;
    assert.equal(existsSync(ref), true, `${file} verweist auf fehlende Datei: ${ref}`);
  }
}

console.log("file reference checks ok");
