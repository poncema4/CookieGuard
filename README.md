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
│   │   ├── globals.css
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
│   ├── package.json
│   └── tsconfig.json
├── certs/
│   └── (generated locally; never committed)
├── scripts/
│   ├── dev-config.mjs
│   ├── dev.mjs
│   ├── verify.mjs
│   ├── generate-dev-certificate.ps1
│   └── generate-dev-certificate.sh
├── docs/
│   ├── architecture.md
│   ├── setup.md
│   └── testing.md
├── evidence/
│   └── README.md
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

## Verification
Run the automated verification from the repository root:

```text
npm run verify
```

The command runs the backend security/unit tests and production builds for both application layers. It should finish with `CookieGuard verification checks passed.`

For local development and browser-based testing, see the setup and testing documentation.

## Documentation
- [Architecture](docs/architecture.md)
- [Setup](docs/setup.md)
- [Testing & Evidence](docs/testing.md)
