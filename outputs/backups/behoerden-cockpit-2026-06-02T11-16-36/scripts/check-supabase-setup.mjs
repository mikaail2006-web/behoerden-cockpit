import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const supabaseSetupFiles = [
  "supabase/000_combined_portal_setup.sql",
  "supabase/001_portal_schema.sql",
  "supabase/002_storage_policies.sql",
  "supabase/003_seed_roles_examples.sql",
  "supabase/005_security_advisor_fix.sql",
  "supabase/006_create_test_auth_users.sql",
  "supabase/007_create_rls_test_data.sql",
  "supabase/008_rls_claims_smoke_test.sql",
  "supabase/009_rls_claims_summary_test.sql",
  "supabase/010_rls_final_status_test.sql",
  "supabase/011_fix_test_auth_login_tokens.sql",
  "supabase/004_rls_test_queries.sql",
  "supabase/test_profiles_template.sql",
  "supabase/test_data_template.sql",
  "supabase/test_data_cleanup.sql"
];

const requiredFiles = [
  ...supabaseSetupFiles,
  "api/.env.example",
  "scripts/copy-supabase-setup.sh",
  "scripts/copy-supabase-testprofiles.sh",
  "scripts/copy-supabase-testdata.sh",
  "scripts/copy-supabase-rls-test.sh",
  "scripts/copy-supabase-cleanup.sh",
  "scripts/copy-portal-env-template.sh",
  "scripts/check-portal-env.sh",
  "scripts/check-portal-demo.sh",
  "scripts/check-portal-bearer.sh",
  "scripts/copy-supabase-access-token.sh",
  "scripts/start-portal-demo-configured.sh",
  "scripts/heute-starten.sh",
  "scripts/start-portal-demo.sh",
  "scripts/start-supabase-vorbereitung.sh",
  "scripts/status-cockpit.sh",
  "scripts/status-cockpit.mjs",
  "Start-Portal-Demo.command",
  "Start-Supabase-Vorbereitung.command",
  "Copy-Supabase-Setup.command",
  "Copy-Supabase-Testprofile.command",
  "Copy-Supabase-Testdaten.command",
  "Copy-Supabase-RLS-Test.command",
  "Copy-Supabase-Cleanup.command",
  "Copy-Portal-Env.command",
  "Check-Portal-Env.command",
  "Start-Portal-Demo-Supabase.command",
  "Check-Portal-Demo.command",
  "Copy-Supabase-Access-Token.command",
  "Check-Portal-Bearer.command",
  "Heute-Starten.command",
  "project-manifest.json",
  "Status-Behörden-Cockpit.command",
  "docs/projektindex.md",
  "docs/kurzanleitung.md",
  "docs/aenderungsverlauf.md",
  "docs/portal-demo-testen.md",
  "docs/naechste-schritte.md",
  "docs/abnahmeprotokoll.md",
  "docs/supabase-testprojekt-runbook.md",
  "docs/supabase-testprotokoll.md",
  "docs/portal-api-supabase-anbindung.md",
  "docs/portal-env-pruefung.md",
  "docs/live-test-fehlerhilfe.md",
  "docs/portal-produktivstart-checkliste.md",
  "supabase/README.md"
];

for (const file of requiredFiles) {
  assert.equal(existsSync(file), true, `Fehlende Datei: ${file}`);
}

const indexHtml = readFileSync("app/index.html", "utf8");
assert.equal(indexHtml.includes("backup-starter-v1"), true, "App nutzt nicht die aktuelle Cache-Version backup-starter-v1");
for (const file of supabaseSetupFiles) {
  assert.equal(indexHtml.includes(file), true, `App verweist nicht auf ${file}`);
}

for (const file of [
  "Start-Behörden-Cockpit.command",
  "Heute-Starten.command",
  "Check-Behörden-Cockpit.command",
  "Status-Behörden-Cockpit.command",
  "Backup-Behörden-Cockpit.command",
  "Start-Supabase-Vorbereitung.command",
  "Copy-Supabase-Setup.command",
  "Copy-Supabase-Testprofile.command",
  "Copy-Supabase-Testdaten.command",
  "Copy-Supabase-RLS-Test.command",
  "Copy-Supabase-Cleanup.command",
  "Copy-Portal-Env.command",
  "Check-Portal-Env.command",
  "Start-Portal-Demo-Supabase.command",
  "Check-Portal-Demo.command",
  "Copy-Supabase-Access-Token.command",
  "Check-Portal-Bearer.command",
  "Start-Portal-Demo.command"
]) {
  assert.equal(indexHtml.includes(file), true, `App verweist nicht auf ${file}`);
}

const runbook = readFileSync("docs/supabase-testprojekt-runbook.md", "utf8");
for (const file of supabaseSetupFiles) {
  assert.equal(runbook.includes(file), true, `Runbook verweist nicht auf ${file}`);
}

const envExample = readFileSync("api/.env.example", "utf8");
for (const key of [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET",
  "PORTAL_ALLOWED_ORIGIN"
]) {
  assert.equal(envExample.includes(`${key}=`), true, `Env-Vorlage enthaelt ${key} nicht`);
}

const combinedSetup = readFileSync("supabase/000_combined_portal_setup.sql", "utf8");
for (const text of [
  "alter table public.role_permissions enable row level security",
  "role_permissions_read_authenticated"
]) {
  assert.equal(combinedSetup.includes(text), true, `Supabase-Gesamtsetup enthaelt ${text} nicht`);
}

const securityAdvisorFix = readFileSync("supabase/005_security_advisor_fix.sql", "utf8");
for (const text of [
  "alter table if exists public.role_permissions enable row level security",
  "drop policy if exists \"role_permissions_read_authenticated\" on public.role_permissions",
  "alter table public.fristen enable row level security"
]) {
  assert.equal(securityAdvisorFix.includes(text), true, `Security-Fix enthaelt ${text} nicht`);
}

const gitignore = readFileSync(".gitignore", "utf8");
for (const rule of [".env", ".env.*", "api/.env", "api/.env.*", "!api/.env.example"]) {
  assert.equal(gitignore.includes(rule), true, `.gitignore enthaelt ${rule} nicht`);
}

console.log("supabase setup checks ok");
