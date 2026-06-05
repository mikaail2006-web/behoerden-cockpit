#!/usr/bin/env bash
cd "$(dirname "$0")"
./scripts/copy-portal-env-template.sh
echo
echo "Fenster kann geschlossen werden."
read -r -p "Enter druecken zum Schliessen..."
