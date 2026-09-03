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
Logout removes server session and expires cookie
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
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── session.ts
│   │   └── cookie-inspection.ts
│   ├── tests/
│   │   ├── session.test.ts
│   │   └── cookie-inspection.test.ts
│   ├── package.json
│   ├── package-lock.json
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
Phase 3 implementation complete: authenticated cookie inspection, session-cookie attribute analysis, educational explanations, and cookie inspection tests are implemented. Local verification is required before Phase 4.
