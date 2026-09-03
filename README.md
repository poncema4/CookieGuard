# CookieGuard
**Interactive Cookie & Session Security Lab**

## Overview
CookieGuard is a controlled web-security lab focused on cookies, sessions, and browser security controls. The application will let users inspect cookie settings, run security scenarios, apply mitigations, and observe the difference.

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
  ├── Cookie Analysis
  ├── Session Logic
  └── Security Scenarios
  ↓
Results / Evidence
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
| Testing | Playwright, application tests |
| Web Testing | Burp Suite, browser developer tools |
| TLS | OpenSSL |
| Version Control | Git / GitHub |

## Project Structure
```text
CookieGuard/
├── frontend/
│   ├── app/
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── scripts/
├── tests/
├── docs/
│   └── architecture.md
├── .gitignore
├── package.json
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
Establish a session, inspect its cookie, run a controlled security scenario, observe the result, apply the mitigation, and repeat the scenario to verify the change.

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
Phase 1 complete: project foundation and local development architecture established. Security functionality will be implemented in subsequent phases.
