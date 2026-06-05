#!/usr/bin/env bash
set -euo pipefail

DEFAULT_ORIGIN="http://127.0.0.1:4173"
DEFAULT_BUCKET="behoerden-documents"

read -r -p "Supabase Project URL: " SUPABASE_URL
read -r -p "Supabase publishable public key: " SUPABASE_ANON_KEY
read -r -p "Erlaubter App-Ursprung [$DEFAULT_ORIGIN]: " PORTAL_ALLOWED_ORIGIN
read -r -p "Storage Bucket [$DEFAULT_BUCKET]: " SUPABASE_STORAGE_BUCKET
read -r -p "n8n Upload Webhook URL [optional]: " N8N_DOCUMENT_UPLOAD_URL
read -r -p "n8n Daten-API URL [optional]: " N8N_DATA_API_URL

PORTAL_ALLOWED_ORIGIN="${PORTAL_ALLOWED_ORIGIN:-$DEFAULT_ORIGIN}"
SUPABASE_STORAGE_BUCKET="${SUPABASE_STORAGE_BUCKET:-$DEFAULT_BUCKET}"
N8N_DOCUMENT_UPLOAD_URL="${N8N_DOCUMENT_UPLOAD_URL:-https://deine-n8n-domain.example/webhook/document-check}"
N8N_DATA_API_URL="${N8N_DATA_API_URL:-https://deine-n8n-domain.example/webhook/behoerden-cockpit-data}"

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "Supabase URL und publishable public key sind Pflicht."
  exit 1
fi

ENV_TEXT=$(cat <<ENV
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=NUR_SERVERSEITIG_EINTRAGEN
SUPABASE_STORAGE_BUCKET=$SUPABASE_STORAGE_BUCKET
PORTAL_ALLOWED_ORIGIN=$PORTAL_ALLOWED_ORIGIN
N8N_DOCUMENT_UPLOAD_URL=$N8N_DOCUMENT_UPLOAD_URL
N8N_DATA_API_URL=$N8N_DATA_API_URL
ENV
)

if command -v pbcopy >/dev/null 2>&1; then
  printf "%s" "$ENV_TEXT" | pbcopy
  echo
  echo "Portal-Env-Vorlage wurde in die Zwischenablage kopiert."
  echo "Wichtig: SUPABASE_SERVICE_ROLE_KEY nur serverseitig in die echte .env eintragen."
else
  echo
  echo "$ENV_TEXT"
fi
