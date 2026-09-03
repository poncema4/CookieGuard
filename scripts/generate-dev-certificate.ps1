$ErrorActionPreference = "Stop"

$certDir = Join-Path $PSScriptRoot "../backend/certs"
New-Item -ItemType Directory -Force -Path $certDir | Out-Null

$certPath = Join-Path $certDir "localhost.crt"
$keyPath = Join-Path $certDir "localhost.key"

if ((Test-Path $certPath) -and (Test-Path $keyPath)) {
  Write-Host "Development certificate already exists: $certPath"
  exit 0
}

if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) {
  throw "OpenSSL was not found on PATH. Install OpenSSL and run this script again."
}

openssl req -x509 -newkey rsa:2048 -sha256 -nodes -days 365 `
  -keyout $keyPath `
  -out $certPath `
  -subj "/CN=localhost" `
  -addext "subjectAltName=DNS:localhost"

Write-Host "Created: $certPath"
Write-Host "Created: $keyPath"
Write-Host "This certificate is for the local CookieGuard HTTPS lab only."
