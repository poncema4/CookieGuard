# CookieGuard Setup

This document contains the local development setup for CookieGuard on Windows and Linux.

## Prerequisites

- Node.js 20 or newer
- npm
- mkcert
- Git

CookieGuard does not require `NODE_TLS_REJECT_UNAUTHORIZED=0` or disabling TLS certificate verification.

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

The recommended development command starts the frontend and backend concurrently on both Windows and Linux:

```text
npm run dev
```

The root development runner reads the centralized backend origin from `scripts/dev-config.mjs` and automatically discovers the mkcert root CA when it is available. The frontend Node process receives `NODE_EXTRA_CA_CERTS` so its HTTPS proxy can trust the local backend certificate without disabling TLS verification.

The browser-facing frontend is:

- `https://localhost:3000`

The default backend origin is:

- `https://127.0.0.1:4443`

The backend origin is centrally configured rather than repeated across the application.

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

## Run Workspaces Separately

The root `npm run dev` command is preferred because it configures the frontend's trust for the local mkcert CA automatically.

If the services must be started independently, the frontend Node process must trust the mkcert root CA. Find the CA path with:

```text
mkcert -CAROOT
```

Then set `NODE_EXTRA_CA_CERTS` to the `rootCA.pem` file in that directory before starting the frontend. Do not use `NODE_TLS_REJECT_UNAUTHORIZED=0`.

The backend still requires `COOKIEGUARD_BACKEND_ORIGIN` to be set to the configured HTTPS origin when started independently.

## Expected Session Cookie

After a successful demo login, the authenticated session cookie should be:

```text
cookieguard_session=<value>; Path=/; HttpOnly; Secure; SameSite=Lax
```

The application does not set a `Domain` attribute, so the session cookie is host-only. It is a session cookie because no `Expires` or `Max-Age` lifetime is assigned during normal login.

## Certificate Notes

The local certificate is intentionally stored outside source-controlled application code:

```text
certs/
├── localhost.pem
└── localhost-key.pem
```

The certificate and private key are generated per development environment and are not committed to Git. The mkcert root CA private key is managed by mkcert outside the repository and must never be copied into the project or committed.
