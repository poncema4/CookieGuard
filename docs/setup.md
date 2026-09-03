# CookieGuard Setup

This document contains the local development setup for CookieGuard on Windows and Linux.

## Prerequisites

- Node.js 24 or a current Node.js release that supports `--use-system-ca`
- npm
- mkcert
- Git

## First-Time Certificate Setup

CookieGuard uses HTTPS locally for the Secure-cookie lab. The frontend and backend share one mkcert development certificate stored under `certs/`.

The certificate and private key are generated locally and are ignored by Git.

### Windows PowerShell

Install and trust mkcert's local certificate authority once:

```powershell
mkcert -install
```

From the repository root, generate the CookieGuard certificate:

```powershell
.\scripts\generate-dev-certificate.ps1
```

### Linux Bash

Install and trust mkcert's local certificate authority once:

```bash
mkcert -install
```

From the repository root, make the certificate script executable if needed and generate the certificate:

```bash
chmod +x ./scripts/generate-dev-certificate.sh
./scripts/generate-dev-certificate.sh
```

The generated files are:

```text
certs/
├── localhost.pem
└── localhost-key.pem
```

The certificate covers the local hostnames used by the lab, including `localhost` and `127.0.0.1`.

## Install Dependencies

From the repository root on either platform:

```text
npm install
```

## Start CookieGuard

The root development command starts the frontend and backend concurrently on both Windows and Linux.

```text
npm run dev
```

The application uses one centrally configured backend origin from `scripts/dev-config.mjs`. By default, it uses an HTTPS loopback target so the CSRF experiment can use a genuinely separate host from the frontend.

The browser-facing frontend is:

- `https://localhost:3000`

The backend target is controlled by the central configuration rather than repeated across the application. The default target is `https://127.0.0.1:4443`.

The root development runner automatically starts the frontend Node process with `--use-system-ca` so the Next.js HTTPS proxy can trust the local mkcert certificate.

No `NODE_TLS_REJECT_UNAUTHORIZED=0` setting is required.

## Run Workspaces Separately

If the services need to be started independently, use two terminals.

### Windows PowerShell

Terminal 1:

```powershell
cd .\backend
npm run dev
```

Terminal 2:

```powershell
cd .\frontend
$env:NODE_OPTIONS="--use-system-ca"
npm run dev
```

### Linux Bash

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
NODE_OPTIONS="--use-system-ca" npm run dev
```

## Verify HTTPS

Open:

```text
https://localhost:3000
```

Use the **Secure + HTTPS Lab** to confirm the HTTPS backend connection.

After logging in, browser developer tools can be used to verify that the session cookie includes:

- `Secure`
- `HttpOnly`
- `SameSite=Lax`
- `Path=/`
- Session expiration
- Host-only behavior because no `Domain` attribute is set

The login response can also be inspected in the browser Network tab to verify the `Set-Cookie` header.

## Certificate Notes

The local certificate is intentionally stored outside source-controlled application code:

```text
certs/
├── localhost.pem
└── localhost-key.pem
```

The certificate and private key are generated per development environment and are not committed to Git.
