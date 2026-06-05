#!/usr/bin/env bash
cd "$(dirname "$0")"
./scripts/check-portal-bearer.sh
echo
echo "Fenster kann geschlossen werden."
read -r -p "Enter druecken zum Schliessen..."
