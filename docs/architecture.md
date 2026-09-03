# CookieGuard Architecture

## Current Application Flow

CookieGuard is a local two-process application:

```text
Browser
   ↓ HTTPS
Next.js Frontend (localhost:3000)
   ↓ HTTPS rewrite for /api/*
Node.js / TypeScript Backend (configured HTTPS origin)
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

The displayed domain is `localhost` because the lab does not set a `Domain` attribute. That makes the cookie host-only; `localhost` is the current host rather than an explicit Domain attribute supplied by the application.

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

The CSRF lab uses a separate `cookieguard_csrf_lab` cookie and never changes the authenticated session cookie. The target origin and lab origin are intentionally different hosts so the browser must apply SameSite rules to the cross-site POST. The backend origin is centrally configured and supplied to the frontend rather than duplicated in individual lab links.

## Secure + HTTPS Flow

```text
Browser
   ↓ HTTPS
Next.js Frontend (localhost:3000)
   ↓ HTTPS
Node.js Backend (configured HTTPS origin)
   ↓
Set-Cookie: Secure; HttpOnly; SameSite=Lax
```

The backend and Next.js development server both use the shared local certificate and key. The certificate pair is generated with mkcert and stored in the single repository-level `certs/` directory.

The certificate and private key are machine-specific development material and are ignored by Git. The mkcert root CA private key is managed by mkcert outside the repository and must never be copied into the project or committed.

The session cookie includes `Secure`, which instructs the browser to send it only over HTTPS. HTTPS provides encrypted transport; the `Secure` attribute is the browser-side cookie control that prevents the session cookie from being sent over an HTTP connection.

## Development Configuration

The local backend origin is defined once in `scripts/dev-config.mjs`. The development runner, Next.js rewrite, backend listener, and CSRF lab consume that configuration instead of maintaining separate application origins.

The default local target uses HTTPS and the loopback address required by the CSRF experiment. The frontend remains on `localhost`, while the CSRF target uses the separate loopback host so the cross-site test is a real cross-site request.

## Local Development

1. Install mkcert and run `mkcert -install` once on the development machine.
2. Generate the shared certificate with `scripts/generate-dev-certificate.ps1` or `scripts/generate-dev-certificate.sh`.
3. Start the application with `npm run dev`.
4. Open the frontend at `https://localhost:3000`.
5. The backend HTTPS origin is controlled by `scripts/dev-config.mjs` and defaults to the local loopback target used by the labs.
6. The development runner configures Node to trust the local mkcert CA when the frontend proxies HTTPS requests to the backend.
7. Inspect the session cookie in browser developer tools and verify `Secure`, `HttpOnly`, and `SameSite=Lax`.
