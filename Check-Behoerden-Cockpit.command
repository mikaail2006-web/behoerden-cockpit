#!/usr/bin/env bash
# Check-Behoerden-Cockpit.command
# Doppelklick prueft die App und zeigt den Status.

cd "$(dirname "$0")"

BUNDLED_NODE="/Users/muratkocyigit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [[ -x "$BUNDLED_NODE" ]]; then
  NODE_BIN="$BUNDLED_NODE"
else
  echo "Kein Node.js gefunden. Bitte installieren: https://nodejs.org"
  read -p "Enter druecken zum Beenden..."
  exit 1
fi

"$NODE_BIN" scripts/check-cockpit.mjs

echo ""
read -p "Enter druecken zum Beenden..."
