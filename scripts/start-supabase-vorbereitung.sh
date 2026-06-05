#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "Supabase-Vorbereitung Behörden-Cockpit"
echo "======================================"
echo
echo "1. Status pruefen"
./scripts/check-cockpit.sh
echo
echo "2. Heute oeffnen/abarbeiten"
echo "- docs/heute-tun.md"
echo "- docs/supabase-copy-paste-reihenfolge.md"
echo "- docs/supabase-testprojekt-runbook.md"
echo "- docs/supabase-werte-vorlage.md"
echo
echo "3. Einfachste SQL-Uebergabe"
echo "- Copy-Supabase-Setup.command starten"
echo "- danach im Supabase SQL Editor einfuegen und ausfuehren"
echo "- danach drei Auth-Testnutzer erstellen"
echo "- Copy-Supabase-Testprofile.command starten und die drei Auth User IDs einfuegen"
echo "- Copy-Supabase-Testdaten.command starten und als Admin/Bearbeiter ausfuehren"
echo "- Copy-Supabase-RLS-Test.command je Rolle ausfuehren"
echo "- Copy-Supabase-Cleanup.command nach dem Test ausfuehren"
echo
echo "4. SQL-Reihenfolge, falls einzeln gewuenscht"
echo "- supabase/000_combined_portal_setup.sql"
echo
echo "Einzeldateien:"
echo "- supabase/001_portal_schema.sql"
echo "- supabase/002_storage_policies.sql"
echo "- supabase/003_seed_roles_examples.sql"
echo "- supabase/test_profiles_template.sql"
echo "- supabase/test_data_template.sql"
echo "- supabase/004_rls_test_queries.sql"
echo "- supabase/test_data_cleanup.sql"
echo
echo "Naechster Schritt: Supabase-Testprojekt anlegen, Gesamtsetup kopieren und drei Testnutzer erstellen."
