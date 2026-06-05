#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="$ROOT_DIR/supabase/test_data_template.sql"

cd "$ROOT_DIR"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Fehlt: supabase/test_data_template.sql"
  exit 1
fi

if command -v pbcopy >/dev/null 2>&1; then
  pbcopy < "$SQL_FILE"
  echo "Supabase-Testdaten-SQL wurde in die Zwischenablage kopiert."
  echo
  echo "Naechster Schritt:"
  echo "1. Im Supabase SQL Editor als Admin oder Bearbeiter ausfuehren"
  echo "2. Ergebnis-IDs kontrollieren"
  echo "3. Danach RLS-Test mit allen drei Rollen pruefen"
else
  echo "pbcopy ist nicht verfuegbar. Datei manuell oeffnen:"
  echo "$SQL_FILE"
fi
