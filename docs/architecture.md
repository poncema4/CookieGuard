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

The Phase 3 inspection view covers the session cookie name, domain, path, Secure, HttpOnly, SameSite, expiration, and persistent status. It also explains the security purpose and current development limitation of each attribute.

## Current Development Configuration

The local lab uses HTTP on `localhost`, so the session cookie is currently configured without `Secure`. `HttpOnly` is enabled, `SameSite=Lax` is enabled, the path is `/`, and the cookie is a session cookie without an explicit persistent lifetime.

The HTTP/`Secure` behavior will be changed and demonstrated in the dedicated HTTPS phase rather than in Phase 3.

## Local Development

The repository uses npm workspaces so the frontend and backend remain separate while sharing one root project configuration.
