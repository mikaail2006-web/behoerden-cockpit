#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="$ROOT_DIR/supabase/004_rls_test_queries.sql"

cd "$ROOT_DIR"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Fehlt: supabase/004_rls_test_queries.sql"
  exit 1
fi

if command -v pbcopy >/dev/null 2>&1; then
  pbcopy < "$SQL_FILE"
  echo "Supabase-RLS-Test-SQL wurde in die Zwischenablage kopiert."
  echo
  echo "Naechster Schritt:"
  echo "1. Als Admin ausfuehren"
  echo "2. Als Bearbeiter ausfuehren"
  echo "3. Als Kunde ausfuehren"
  echo "4. Fremde tenant_id darf nicht sichtbar oder schreibbar sein"
else
  echo "pbcopy ist nicht verfuegbar. Datei manuell oeffnen:"
  echo "$SQL_FILE"
fi
