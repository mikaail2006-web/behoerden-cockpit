#!/usr/bin/env bash
cd "$(dirname "$0")"
./scripts/start-supabase-vorbereitung.sh
echo
echo "Fenster kann geschlossen werden."
read -r -p "Enter druecken zum Schliessen..."
