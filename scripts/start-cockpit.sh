#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="/Users/muratkocyigit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
APP_PORT="${APP_PORT:-4173}"
UPLOAD_PORT="${UPLOAD_PORT:-4180}"

cd "$ROOT_DIR"

cleanup() {
  if [[ -n "${APP_PID:-}" ]] && kill -0 "$APP_PID" 2>/dev/null; then
    kill "$APP_PID" 2>/dev/null || true
  fi
  if [[ -n "${UPLOAD_PID:-}" ]] && kill -0 "$UPLOAD_PID" 2>/dev/null; then
    kill "$UPLOAD_PID" 2>/dev/null || true
  fi
}

port_is_open() {
  python3 - "$1" <<'PY'
import socket
import sys

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

trap cleanup EXIT INT TERM

if port_is_open "$APP_PORT"; then
  echo "App server already running: http://127.0.0.1:${APP_PORT}/index.html"
else
  python3 -m http.server "$APP_PORT" -d app > outputs/app-server.log 2>&1 &
  APP_PID="$!"
  echo "Started app server: http://127.0.0.1:${APP_PORT}/index.html"
fi

if port_is_open "$UPLOAD_PORT"; then
  echo "Upload bridge already running: http://127.0.0.1:${UPLOAD_PORT}/document-check"
else
  "$NODE_BIN" scripts/document-upload-bridge.mjs > outputs/upload-bridge.log 2>&1 &
  UPLOAD_PID="$!"
  echo "Started upload bridge: http://127.0.0.1:${UPLOAD_PORT}/document-check"
fi

echo
echo "Behörden-Cockpit bereit."
echo "App öffnen: http://127.0.0.1:${APP_PORT}/index.html"
echo "Logs: outputs/app-server.log und outputs/upload-bridge.log"
echo "Stoppen: Ctrl+C"

while true; do
  sleep 3600
done
