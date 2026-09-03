# CookieGuard Architecture

## Phase 1

CookieGuard starts as a local two-process application:

```text
Browser
   ↓
Next.js Frontend (localhost:3000)
   ↓
Next.js rewrite for /api/*
   ↓
Node.js / TypeScript Backend (localhost:4000)
```

The frontend currently exposes a minimal development page and checks the backend health endpoint. Security scenarios, authentication, cookies, and session behavior are intentionally deferred to later MVP phases.

## Local Development

The repository uses npm workspaces so the frontend and backend remain separate while sharing one root project configuration.
