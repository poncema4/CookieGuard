# CookieGuard Architecture

## Current Application Flow

CookieGuard is a local two-process application:

```text
Browser
   ↓
Next.js Frontend (localhost:3000)
   ↓
Next.js rewrite for /api/*
   ↓
Node.js / TypeScript Backend (localhost:4000)
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

The Phase 3 inspection view covers the session cookie name, domain, path, Secure, HttpOnly, SameSite, expiration, and persistent status. Cookie settings are maintained from a single backend configuration so the inspection data and generated session-cookie header do not drift apart.

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
CookieGuard CSRF Lab (localhost:3000)
        ↓
Configure separate lab cookie on 127.0.0.1:4000
        ↓
SameSite=Lax or SameSite=Strict
        ↓
Same-site POST → cookie eligible to accompany request
        ↓
Cross-site POST from localhost → cookie withheld
        ↓
Server returns ACCEPTED or BLOCKED
```

The CSRF lab uses a separate `cookieguard_csrf_lab` cookie and never changes the authenticated session cookie. The target is intentionally hosted on `127.0.0.1:4000` while the lab page is hosted on `localhost:3000`, creating a controlled cross-site boundary. A state-changing POST from the target origin can include the lab cookie, while the cross-site POST is blocked when the cookie uses `SameSite=Lax` or `SameSite=Strict`.

## Current Development Configuration

The local lab uses HTTP on `localhost`, so the session cookie is currently configured without `Secure`. `HttpOnly` is enabled, `SameSite=Lax` is enabled, the path is `/`, and the cookie is a session cookie without an explicit persistent lifetime.

The HTTP/`Secure` behavior will be changed and demonstrated in the dedicated HTTPS phase rather than in the current XSS or CSRF phases.

## Local Development

The repository uses npm workspaces so the frontend and backend remain separate while sharing one root project configuration.
