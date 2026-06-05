import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

async function listMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdown(path));
    } else if (entry.name.endsWith(".md")) {
      files.push(path);
    }
  }
  return files;
}

const files = [
  "README.md",
  ...await listMarkdown("docs"),
  ...await listMarkdown("api"),
  ...await listMarkdown("n8n"),
  ...await listMarkdown("google-apps-script"),
  ...await listMarkdown("supabase")
];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  assert.equal(content.trim().length > 0, true, `${file} ist leer`);
  assert.equal(content.trimStart().startsWith("# "), true, `${file} braucht eine H1-Ueberschrift`);
}

console.log("docs checks ok");
