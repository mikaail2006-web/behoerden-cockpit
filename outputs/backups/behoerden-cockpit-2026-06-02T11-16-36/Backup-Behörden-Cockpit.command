#!/usr/bin/env bash
cd "$(dirname "$0")"
node scripts/create-local-backup.mjs
echo
echo "Fenster kann geschlossen werden."
read -r -p "Enter druecken zum Schliessen..."
