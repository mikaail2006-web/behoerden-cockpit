#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUNDLED_NODE="/Users/muratkocyigit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

cd "$ROOT_DIR"

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [[ -x "$BUNDLED_NODE" ]]; then
  NODE_BIN="$BUNDLED_NODE"
else
  echo "Kein Node.js gefunden."
  exit 1
fi

read -r -p "Portal API URL [http://127.0.0.1:4190]: " PORTAL_API_URL
read -r -s -p "Supabase Access Token: " SUPABASE_ACCESS_TOKEN
echo

PORTAL_API_URL="${PORTAL_API_URL:-http://127.0.0.1:4190}"

if [[ -z "$SUPABASE_ACCESS_TOKEN" ]]; then
  echo "Access Token fehlt."
  exit 1
fi

PORTAL_API_URL="$PORTAL_API_URL" \
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" \
"$NODE_BIN" --input-type=module -e '
const baseUrl = process.env.PORTAL_API_URL.replace(/\/+$/, "");
const token = process.env.SUPABASE_ACCESS_TOKEN;
const paths = ["/api/me", "/api/cases", "/api/documents", "/api/deadlines", "/api/tasks"];

for (const path of paths) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  const text = await response.text();
  console.log(`${response.status} ${path}`);
  if (!response.ok) {
    console.log(text);
    process.exit(1);
  }
}

console.log("Portal-Bearer-Test ok");
'
