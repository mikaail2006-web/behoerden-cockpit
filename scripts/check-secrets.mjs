import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const ignoredDirs = new Set(["node_modules", ".git", "outputs"]);
const allowedFiles = new Set([
  "api/.env.example",
  ".gitignore",
  "scripts/check-secrets.mjs",
  "docs/datenschutz-backup-loeschkonzept.md"
]);

const riskyPatterns = [
  { name: "Supabase service role JWT", pattern: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/ },
  { name: "OpenAI API key", pattern: /sk-[a-zA-Z0-9]{20,}/ },
  { name: "Google OAuth refresh token", pattern: /1\/\/[a-zA-Z0-9_-]{20,}/ },
  { name: "Private key block", pattern: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
  { name: "Service role key assignment", pattern: /SUPABASE_SERVICE_ROLE_KEY=(?!NUR_SERVERSEITIG_EINTRAGEN)/ }
];

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...await listFiles(path));
      }
    } else {
      files.push(path);
    }
  }

  return files;
}

assert.equal(existsSync("api/.env"), false, "api/.env darf nicht im Projekt liegen");
assert.equal(existsSync(".env"), false, ".env darf nicht im Projekt liegen");

const files = await listFiles(".");
for (const file of files) {
  const normalized = file.replace(/^\.\//, "");
  if (allowedFiles.has(normalized)) continue;
  if (!/\.(js|mjs|json|md|sql|yaml|yml|html|css|csv|txt|gs)$/i.test(file)) continue;

  const content = readFileSync(file, "utf8");
  for (const { name, pattern } of riskyPatterns) {
    assert.equal(pattern.test(content), false, `${name} gefunden in ${normalized}`);
  }
}

console.log("secret checks ok");
