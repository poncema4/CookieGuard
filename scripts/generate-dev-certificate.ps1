$ErrorActionPreference = "Stop"

$certDir = Join-Path $PSScriptRoot "../certs"
New-Item -ItemType Directory -Force -Path $certDir | Out-Null

$certPath = Join-Path $certDir "localhost.pem"
$keyPath = Join-Path $certDir "localhost-key.pem"

if ((Test-Path $certPath) -and (Test-Path $keyPath)) {
  Write-Host "Development certificate already exists: $certPath"
  exit 0
}

if (-not (Get-Command mkcert -ErrorAction SilentlyContinue)) {
  throw "mkcert was not found on PATH. Install mkcert, run 'mkcert -install' once, then run this script again."
}

mkcert -cert-file $certPath -key-file $keyPath localhost 127.0.0.1 ::1

Write-Host "Created: $certPath"
Write-Host "Created: $keyPath"
Write-Host "This certificate is for the local CookieGuard HTTPS lab only."
