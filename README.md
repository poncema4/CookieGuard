# CookieGuard
**Interactive Cookie & Session Security Lab**

## Overview
CookieGuard is a controlled web-security lab focused on cookies, sessions, and browser security controls. The application lets users authenticate, inspect cookie settings, run security scenarios, apply mitigations, and observe the difference.

## Problem
Cookie attributes such as `Secure`, `HttpOnly`, and `SameSite` are easy to treat as a checklist. CookieGuard connects those settings to actual web-application behavior so their security impact can be demonstrated.

## Objectives
- Inspect important cookie and session attributes.
- Identify selected configuration weaknesses.
- Demonstrate the purpose of `Secure`, `HttpOnly`, and `SameSite`.
- Demonstrate controlled XSS, CSRF, and HTTPS scenarios.
- Compare vulnerable and mitigated configurations.

## MVP Scope
- Small authenticated web application.
- Demo login and logout flow.
- Server-side session storage and session cookie.
- Cookie and session inspection.
- Security analysis with concise explanations.
- Controlled `HttpOnly` + XSS scenario.
- Controlled `SameSite` + CSRF scenario.
- `Secure` cookie + HTTPS scenario.
- Browser and request evidence for each result.

## Architecture / Workflow
```text
Browser
  ↓
Next.js Frontend (HTTPS)
  ↓
Node.js / TypeScript Backend (HTTPS)
  ├── Authentication / Session Logic
  ├── Cookie Inspection / Analysis
  └── Security Scenarios
  ↓
Results / Evidence
```

```text
Login
  ↓
Server creates session
  ↓
Secure + HttpOnly + SameSite cookie returned
  ↓
Inspect Session Cookie
  ↓
Review attributes and security explanations
  ↓
Authenticated requests use session over HTTPS
  ↓
Logout removes server session and expires cookies
```

```text
Security Control
      ↓
Run Controlled Scenario
      ↓
Observe Browser / Request Behavior
      ↓
Apply Mitigation
      ↓
Run Again
      ↓
Compare Results
```

## Local Development
CookieGuard uses HTTPS locally for the Secure-cookie lab. The frontend and backend use one mkcert development certificate stored under `certs/`. The certificate and private key are generated locally and are not committed to Git.

### Prerequisites
- Node.js 24 or a current Node.js release that supports `--use-system-ca`.
- npm.
- mkcert.
- Git.

### First-time certificate setup
Install and trust mkcert's local certificate authority once, then generate the CookieGuard certificate.

**Windows PowerShell**
```powershell
mkcert -install
.\scripts\generate-dev-certificate.ps1
```

**Linux Bash**
```bash
mkcert -install
chmod +x ./scripts/generate-dev-certificate.sh
./scripts/generate-dev-certificate.sh
```

The generated files are:
```text
certs/
├── localhost.pem
└── localhost-key.pem
```

### Start CookieGuard
From the repository root:

```text
CookieGuard/
```

Run:
```text
npm install
npm run dev
```

The root development runner starts both workspaces concurrently on Windows and Linux:
- Frontend: `https://localhost:3000`
- Backend: `https://localhost:4443`

The development runner also starts the frontend Node process with `--use-system-ca` so the Next.js HTTPS proxy can trust the local mkcert certificate. No `NODE_TLS_REJECT_UNAUTHORIZED=0` setting is required.

If you prefer to run the workspaces separately, use two terminals:

**Windows PowerShell**
```powershell
cd .\backend
npm run dev
```

```powershell
cd .\frontend
$env:NODE_OPTIONS="--use-system-ca"
npm run dev
```

**Linux Bash**
```bash
cd backend
npm run dev
```

```bash
cd frontend
NODE_OPTIONS="--use-system-ca" npm run dev
```

### HTTPS verification
Open:
```text
https://localhost:3000
```

Use the Secure + HTTPS Lab to confirm the HTTPS backend connection. After logging in, browser developer tools can be used to verify that the session cookie includes `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/`.

## Tech Stack
| Area | Technology |
|---|---|
| Language | TypeScript |
| Frontend | Next.js |
| Runtime / Package Manager | Node.js / npm |
| Backend | Node.js / TypeScript |
| Testing | Node.js test runner, Playwright, application tests |
| Web Testing | Burp Suite, browser developer tools |
| TLS | mkcert |
| Version Control | Git / GitHub |

## Project Structure
```text
CookieGuard/
├── frontend/
│   ├── app/
│   │   ├── xss-lab/
│   │   ├── csrf-lab/
│   │   ├── secure-lab/
│   │   └── icon.svg
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── https.ts
│   │   ├── session.ts
│   │   ├── cookie-inspection.ts
│   │   ├── xss-lab.ts
│   │   └── csrf-lab.ts
│   ├── tests/
│   │   ├── session.test.ts
│   │   ├── cookie-inspection.test.ts
│   │   ├── xss-lab.test.ts
│   │   ├── csrf-lab.test.ts
│   │   └── https.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
├── certs/
│   └── (generated locally; never committed)
├── scripts/
│   ├── dev.mjs
│   ├── generate-dev-certificate.ps1
│   └── generate-dev-certificate.sh
├── docs/
│   └── architecture.md
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Security Concepts
- HTTP and web application behavior
- Cookies and sessions
- Authentication and session management
- `Secure`, `HttpOnly`, and `SameSite`
- XSS and CSRF
- HTTPS/TLS
- Secure session design
- Web-security testing

## Expected Demonstration
Establish a session, inspect its cookie, review each security attribute, run a controlled security scenario, observe the result, apply the mitigation, and repeat the scenario to verify the change.

For the `HttpOnly` scenario, CookieGuard uses a separate demonstration cookie so the authenticated application session is not weakened. Vulnerable mode issues the lab cookie without `HttpOnly`; protected mode issues it with `HttpOnly`. The same controlled XSS payload is then used to compare what client-side JavaScript can read.

For the `SameSite` scenario, CookieGuard uses a separate CSRF lab cookie. A same-site POST can include the cookie, while a controlled cross-site POST is blocked when the cookie uses `SameSite=Lax` or `SameSite=Strict`.

For the `Secure` scenario, the local frontend and backend run over HTTPS using one locally trusted mkcert development certificate stored under `certs/`. The authenticated session cookie includes `Secure`, `HttpOnly`, and `SameSite=Lax`. Browser developer tools and the login response can be used to verify the resulting cookie attributes and HTTPS transport.

## Out of Scope
- Internet-wide or arbitrary website scanning
- Full penetration-testing automation
- Production deployment
- Enterprise vulnerability management
- Large vulnerability databases
- Generic security scoring

## Future Enhancements
- JWT security scenarios
- Additional authentication and session tests
- Security-header analysis
- Additional XSS and CSRF experiments
- Expanded automated browser testing

## Status
Phase 6 implementation and local verification complete. CookieGuard runs its backend and frontend over local HTTPS, enables the `Secure` session-cookie attribute, uses a shared local development certificate, and includes a Secure + HTTPS demonstration lab. The root development command supports concurrent Windows and Linux development workflows.
