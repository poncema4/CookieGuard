#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CERT_DIR="${SCRIPT_DIR}/../certs"
CERT_PATH="${CERT_DIR}/localhost.pem"
KEY_PATH="${CERT_DIR}/localhost-key.pem"

mkdir -p "$CERT_DIR"

if [[ -f "$CERT_PATH" && -f "$KEY_PATH" ]]; then
  echo "Development certificate already exists: $CERT_PATH"
  exit 0
fi

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert was not found on PATH. Install mkcert, run 'mkcert -install' once, then run this script again." >&2
  exit 1
fi

mkcert -cert-file "$CERT_PATH" -key-file "$KEY_PATH" localhost 127.0.0.1 ::1

echo "Created: $CERT_PATH"
echo "Created: $KEY_PATH"
echo "This certificate is for the local CookieGuard HTTPS lab only."
