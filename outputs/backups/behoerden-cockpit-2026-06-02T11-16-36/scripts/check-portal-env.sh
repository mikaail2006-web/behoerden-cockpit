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

read -r -p "Supabase Project URL: " SUPABASE_URL
read -r -p "Supabase publishable public key: " SUPABASE_ANON_KEY
read -r -p "Storage Bucket [behoerden-documents]: " SUPABASE_STORAGE_BUCKET
read -r -p "Erlaubter App-Ursprung [http://127.0.0.1:4173]: " PORTAL_ALLOWED_ORIGIN

SUPABASE_STORAGE_BUCKET="${SUPABASE_STORAGE_BUCKET:-behoerden-documents}"
PORTAL_ALLOWED_ORIGIN="${PORTAL_ALLOWED_ORIGIN:-http://127.0.0.1:4173}"

SUPABASE_URL="$SUPABASE_URL" \
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
SUPABASE_STORAGE_BUCKET="$SUPABASE_STORAGE_BUCKET" \
PORTAL_ALLOWED_ORIGIN="$PORTAL_ALLOWED_ORIGIN" \
"$NODE_BIN" --input-type=module -e '
import { validatePortalEnv } from "./api/portal-env.mjs";

const result = validatePortalEnv(process.env);

if (result.ok) {
  console.log("Portal-Env-Pruefung ok");
  console.log("Service Role Key wurde bewusst nicht abgefragt.");
} else {
  console.log("Portal-Env-Pruefung nicht bestanden");
  console.log(`Fehlend: ${result.missing.join(", ") || "-"}`);
  console.log(`Platzhalter: ${result.placeholders.join(", ") || "-"}`);
  process.exit(1);
}
'
