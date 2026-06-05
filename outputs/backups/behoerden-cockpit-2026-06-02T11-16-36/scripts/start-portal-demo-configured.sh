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
read -r -p "App-Origin [http://127.0.0.1:4173]: " PORTAL_ALLOWED_ORIGIN

SUPABASE_STORAGE_BUCKET="${SUPABASE_STORAGE_BUCKET:-behoerden-documents}"
PORTAL_ALLOWED_ORIGIN="${PORTAL_ALLOWED_ORIGIN:-http://127.0.0.1:4173}"

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "Supabase URL und publishable public key sind Pflicht."
  exit 1
fi

echo
echo "Portal-Demo startet mit Supabase-Konfiguration."
echo "Service Role Key wird nicht benoetigt und nicht abgefragt."
echo

SUPABASE_URL="$SUPABASE_URL" \
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
SUPABASE_STORAGE_BUCKET="$SUPABASE_STORAGE_BUCKET" \
PORTAL_ALLOWED_ORIGIN="$PORTAL_ALLOWED_ORIGIN" \
"$NODE_BIN" api/portal-server.example.mjs
