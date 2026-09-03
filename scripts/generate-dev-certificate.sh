#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CERT_DIR="${SCRIPT_DIR}/../backend/certs"
CERT_PATH="${CERT_DIR}/localhost.crt"
KEY_PATH="${CERT_DIR}/localhost.key"

mkdir -p "$CERT_DIR"

if [[ -f "$CERT_PATH" && -f "$KEY_PATH" ]]; then
  echo "Development certificate already exists: $CERT_PATH"
  exit 0
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "OpenSSL was not found on PATH. Install OpenSSL and run this script again." >&2
  exit 1
fi

openssl req -x509 -newkey rsa:2048 -sha256 -nodes -days 365 \
  -keyout "$KEY_PATH" \
  -out "$CERT_PATH" \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost"

echo "Created: $CERT_PATH"
echo "Created: $KEY_PATH"
echo "This certificate is for the local CookieGuard HTTPS lab only."
