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
Next.js Frontend
  ↓
Node.js / TypeScript Backend
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
Session cookie returned to browser
  ↓
Inspect Session Cookie
  ↓
Review attributes and security explanations
  ↓
Authenticated requests use session
  ↓
Logout removes server session and expires cookies
```

```text
Weak Configuration
      ↓
Run Scenario
      ↓
Observe Behavior
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
| TLS | OpenSSL |
| Version Control | Git / GitHub |

## Project Structure
```text
CookieGuard/
├── frontend/
│   ├── app/
│   │   ├── xss-lab/
│   │   ├── csrf-lab/
│   │   └── icon.svg
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── session.ts
│   │   ├── cookie-inspection.ts
│   │   ├── xss-lab.ts
│   │   └── csrf-lab.ts
│   ├── tests/
│   │   ├── session.test.ts
│   │   ├── cookie-inspection.test.ts
│   │   ├── xss-lab.test.ts
│   │   └── csrf-lab.test.ts
│   ├── package.json
│   └── tsconfig.json
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

For the `SameSite` scenario, CookieGuard uses a separate CSRF lab cookie on `127.0.0.1:4000`. A same-site POST can include the cookie, while a controlled cross-site POST from the frontend origin is blocked when the cookie uses `SameSite=Lax` or `SameSite=Strict`.

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
Phase 5 implementation complete: the controlled SameSite + CSRF lab, separate CSRF lab cookie, same-site/cross-site POST workflow, and backend tests are implemented. Local verification is required before Phase 6.
