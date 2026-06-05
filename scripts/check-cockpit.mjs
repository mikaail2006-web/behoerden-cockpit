import { spawnSync } from "node:child_process";

const commands = [
  ["node", ["--check", "app/app.js"]],
  ["node", ["scripts/check-app-content.mjs"]],
  ["node", ["api/portal-access.test.mjs"]],
  ["node", ["api/portal-context.test.mjs"]],
  ["node", ["api/supabase-profile-loader.test.mjs"]],
  ["node", ["api/supabase-portal-repository.test.mjs"]],
  ["node", ["api/portal-env.test.mjs"]],
  ["node", ["api/portal-contract.test.mjs"]],
  ["node", ["api/portal-server.test.mjs"]],
  ["node", ["api/portal-server.smoke.test.mjs"]],
  ["node", ["scripts/check-whatsapp-reminders.mjs"]],
  ["node", ["scripts/check-n8n-workflows.mjs"]],
  ["node", ["scripts/check-manifest.mjs"]],
  ["node", ["scripts/status-cockpit.test.mjs"]],
  ["node", ["scripts/check-package-scripts.mjs"]],
  ["node", ["scripts/check-backup-script.mjs"]],
  ["node", ["scripts/check-docs.mjs"]],
  ["node", ["scripts/check-file-references.mjs"]],
  ["node", ["scripts/check-next-steps.mjs"]],
  ["node", ["scripts/check-supabase-setup.mjs"]],
  ["node", ["scripts/check-secrets.mjs"]]
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("cockpit checks ok");
