#!/usr/bin/env bash
set -euo pipefail

BUNDLED_NODE="/Users/muratkocyigit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [[ -x "$BUNDLED_NODE" ]]; then
  NODE_BIN="$BUNDLED_NODE"
else
  echo "Kein Node.js gefunden."
  exit 1
fi

read -r -p "Supabase Project URL: " SUPABASE_URL
read -r -p "Supabase publishable public key: " SUPABASE_ANON_KEY
read -r -p "Testnutzer E-Mail: " SUPABASE_EMAIL
read -r -s -p "Testnutzer Passwort: " SUPABASE_PASSWORD
echo

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" || -z "$SUPABASE_EMAIL" || -z "$SUPABASE_PASSWORD" ]]; then
  echo "Supabase URL, publishable public key, E-Mail und Passwort sind Pflicht."
  exit 1
fi

SUPABASE_URL="$SUPABASE_URL" \
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
SUPABASE_EMAIL="$SUPABASE_EMAIL" \
SUPABASE_PASSWORD="$SUPABASE_PASSWORD" \
"$NODE_BIN" --input-type=module -e '
const supabaseUrl = process.env.SUPABASE_URL.replace(/\/+$/, "");
const anonKey = process.env.SUPABASE_ANON_KEY;
const email = process.env.SUPABASE_EMAIL;
const password = process.env.SUPABASE_PASSWORD;

const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    "content-type": "application/json"
  },
  body: JSON.stringify({ email, password })
});

const payload = await response.json().catch(() => ({}));
if (!response.ok || !payload.access_token) {
  console.log(`Token konnte nicht geladen werden: ${response.status}`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(1);
}

const token = payload.access_token;
if (process.platform === "darwin") {
  const { spawnSync } = await import("node:child_process");
  const copy = spawnSync("pbcopy", { input: token });
  if (copy.status === 0) {
    console.log("Supabase Access Token wurde in die Zwischenablage kopiert.");
  } else {
    console.log(token);
  }
} else {
  console.log(token);
}

console.log("Token nicht speichern. Direkt fuer Check-Portal-Bearer.command verwenden.");
'
