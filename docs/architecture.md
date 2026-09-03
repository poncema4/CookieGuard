# CookieGuard Architecture

## Current Application Flow

CookieGuard is a local two-process application:

```text
Browser
   ↓ HTTPS
Next.js Frontend (localhost:3000)
   ↓ HTTPS rewrite for /api/*
Node.js / TypeScript Backend (localhost:4443)
```

Authentication creates a server-side session and returns a session cookie to the browser. Authenticated requests use that cookie to retrieve the session from the backend.

## Cookie Inspection Flow

```text
Authenticated Session
        ↓
Inspect Session Cookie
        ↓
Cookie Inspection API
        ↓
Cookie Attributes + Security Explanations
```

The inspection view covers the session cookie name, domain, path, Secure, HttpOnly, SameSite, expiration, and persistent status. Cookie settings are maintained from a single backend configuration so the inspection data and generated session-cookie header do not drift apart.

## HttpOnly + XSS Flow

```text
Authenticated Session
        ↓
HttpOnly + XSS Lab
        ↓
Choose Vulnerable or Protected Mode
        ↓
Backend issues separate lab cookie
        ↓
Run the same controlled XSS payload
        ↓
Compare document.cookie output
```

The XSS lab deliberately uses a separate `cookieguard_xss_lab` cookie. Vulnerable mode omits `HttpOnly`, allowing client-side JavaScript to read the demonstration cookie. Protected mode includes `HttpOnly`, so the same payload cannot read that cookie. The authenticated application session is not weakened by the experiment.

## SameSite + CSRF Flow

```text
CookieGuard CSRF Lab
        ↓
Configure separate lab cookie
        ↓
SameSite=Lax or SameSite=Strict
        ↓
Same-site POST → cookie eligible to accompany request
        ↓
Cross-site POST → cookie withheld
        ↓
Server returns ACCEPTED or BLOCKED
```

The CSRF lab uses a separate `cookieguard_csrf_lab` cookie and never changes the authenticated session cookie. The target origin and lab origin are intentionally different so the browser must apply SameSite rules to the cross-site POST.

## Secure + HTTPS Flow

```text
Browser
   ↓ HTTPS
Next.js Frontend (localhost:3000)
   ↓ HTTPS
Node.js Backend (localhost:4443)
   ↓
Set-Cookie: Secure; HttpOnly; SameSite=Lax
```

The backend listens on `https://localhost:4443` and the Next.js development server runs with the same local certificate and key. The certificate pair is generated with mkcert and stored in the single repository-level `certs/` directory.

The certificate and private key are machine-specific development material and are ignored by Git. The mkcert root CA private key is managed by mkcert outside the repository and must never be copied into the project or committed.

The session cookie includes `Secure`, which instructs the browser to send it only over HTTPS. HTTPS provides encrypted transport; the `Secure` attribute is the browser-side cookie control that prevents the session cookie from being sent over an HTTP connection.

## Current Development Configuration

The session cookie is configured with `Secure=true`, `HttpOnly=true`, `SameSite=Lax`, path `/`, and a session lifetime. The local frontend and backend both use HTTPS and the same locally trusted certificate for the Phase 6 lab.

## Local Development

1. Install mkcert and run `mkcert -install` once on the development machine.
2. Generate the shared certificate with `scripts/generate-dev-certificate.ps1` or `scripts/generate-dev-certificate.sh`.
3. Start the backend on `https://localhost:4443`.
4. Start the Next.js frontend using the shared certificate under `certs/`.
5. Configure Node to trust the local mkcert CA when the frontend proxies HTTPS requests to the backend.
6. Inspect the session cookie in browser developer tools and verify `Secure`, `HttpOnly`, and `SameSite=Lax`.
