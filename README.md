# CookieGuard

**Interactive Cookie & Session Security Lab**

**Course:** App Security & Web Technology  
**Project:** Final MVP / Proof of Concept

## Overview

CookieGuard is a controlled web-security lab focused on cookies, sessions, and the browser controls that protect them. The application will let a user inspect cookie settings, run selected security scenarios, apply a mitigation, and compare the result.

## Problem

Cookie security is often treated as a checklist of attributes such as `Secure`, `HttpOnly`, and `SameSite`. CookieGuard connects those settings to observable behavior so the security impact of each control can be demonstrated.

## Objectives

- Inspect important cookie and session attributes.
- Identify selected configuration weaknesses.
- Demonstrate the security impact of `HttpOnly`, `SameSite`, and `Secure`.
- Show controlled XSS, CSRF, and HTTPS-related scenarios.
- Compare an intentionally weak configuration with its mitigated state.

## MVP Scope

The MVP will include:

- A small authenticated web application.
- Cookie/session inspection.
- Cookie security analysis and explanations.
- A controlled `HttpOnly` + XSS demonstration.
- A controlled `SameSite` + CSRF demonstration.
- A `Secure` cookie + HTTPS demonstration.
- Browser/request evidence that supports each result.

## Architecture / Workflow

```text
Browser
  ↓
Next.js Frontend
  ↓
Node.js / TypeScript Backend
  ├── Cookie Analysis
  ├── Session Logic
  └── Security Lab Scenarios
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

- **Language:** TypeScript
- **Frontend:** Next.js
- **Runtime / Package Manager:** Node.js / npm
- **Backend:** Node.js + TypeScript
- **Testing:** Playwright and application tests
- **Web Testing:** Burp Suite and browser developer tools
- **TLS:** OpenSSL for local HTTPS testing
- **Version Control:** Git / GitHub

## Project Structure

```text
CookieGuard/
├── frontend/
├── backend/
├── tests/
├── docs/
├── scripts/
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

A user will establish a session, inspect the session cookie, run a controlled security scenario, observe the result, apply the appropriate mitigation, and repeat the scenario to verify the change.

All testing will remain inside the controlled lab environment.

## Out of Scope

- Internet-wide or arbitrary website scanning
- Full penetration-testing automation
- Production SaaS deployment
- Enterprise vulnerability management
- Large vulnerability databases
- Generic security scoring

## Future Enhancements

- JWT security demonstrations
- Additional authentication/session scenarios
- Security-header analysis
- Additional XSS and CSRF experiments
- More automated browser tests
- Additional educational modules

## Status

Planned MVP. Implementation will begin with the application requirements and architecture.