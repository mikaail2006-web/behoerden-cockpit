#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="$ROOT_DIR/supabase/000_combined_portal_setup.sql"

cd "$ROOT_DIR"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Fehlt: supabase/000_combined_portal_setup.sql"
  exit 1
fi

if command -v pbcopy >/dev/null 2>&1; then
  pbcopy < "$SQL_FILE"
  echo "Supabase-Gesamtsetup wurde in die Zwischenablage kopiert."
  echo
  echo "Naechster Schritt:"
  echo "1. Supabase SQL Editor oeffnen"
  echo "2. Inhalt einfuegen"
  echo "3. Run ausfuehren"
else
  echo "pbcopy ist nicht verfuegbar. Datei manuell oeffnen:"
  echo "$SQL_FILE"
fi
