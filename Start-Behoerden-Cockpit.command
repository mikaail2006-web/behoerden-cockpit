#!/usr/bin/env bash
# Start-Behoerden-Cockpit.command
# Doppelklick startet das Behoerden-Cockpit im Browser.

cd "$(dirname "$0")"

BUNDLED_NODE="/Users/muratkocyigit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [[ -x "$BUNDLED_NODE" ]]; then
  NODE_BIN="$BUNDLED_NODE"
else
  osascript -e 'display alert "Node.js nicht gefunden" message "Bitte installieren: https://nodejs.org"'
  exit 1
fi

APP_PORT="${APP_PORT:-4173}"
UPLOAD_PORT="${UPLOAD_PORT:-4180}"

cleanup() {
  [[ -n "${APP_PID:-}" ]] && kill "$APP_PID" 2>/dev/null || true
  [[ -n "${UPLOAD_PID:-}" ]] && kill "$UPLOAD_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

port_is_open() {
  python3 - "$1" <<'PY'
import socket, sys
port = int(sys.argv[1])
sock = socket.socket()
sock.settimeout(0.2)
try:
  sock.connect(("127.0.0.1", port))
except OSError:
  sys.exit(1)
else:
  sys.exit(0)
finally:
  sock.close()
PY
}

mkdir -p outputs

if port_is_open "$APP_PORT"; then
  echo "App laeuft bereits: http://127.0.0.1:${APP_PORT}/index.html"
else
  python3 -m http.server "$APP_PORT" -d app > outputs/app-server.log 2>&1 &
  APP_PID="$!"
  echo "App gestartet: http://127.0.0.1:${APP_PORT}/index.html"
fi

if port_is_open "$UPLOAD_PORT"; then
  echo "Upload-Bruecke laeuft bereits."
else
  "$NODE_BIN" scripts/document-upload-bridge.mjs > outputs/upload-bridge.log 2>&1 &
  UPLOAD_PID="$!"
  echo "Upload-Bruecke gestartet."
fi

sleep 1
open "http://127.0.0.1:${APP_PORT}/index.html"

echo ""
echo "Behoerden-Cockpit bereit. Stoppen mit Ctrl+C."
wait
