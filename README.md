# CookieGuard

**Interactive Cookie & Session Security Laboratory**

**Course:** App Security & Web Technology  
**Project:** Final MVP / Proof of Concept

## Overview

CookieGuard is a controlled web-security lab focused on cookies, sessions, and the browser security controls that protect them.

The MVP will let a user inspect cookie settings, reproduce selected security scenarios, apply a mitigation, and observe the difference. The project is intentionally focused on demonstrating **why** a control matters rather than producing a generic security score.

## Project Goal

The main question CookieGuard addresses is:

> **What is wrong with this cookie or session configuration, what risk does it create, and what changes when the control is fixed?**

The MVP will provide a small web application with intentionally configurable security behavior and a simple interface for running the demonstrations.

## MVP Scope

- Inspect cookie attributes: `Secure`, `HttpOnly`, `SameSite`, `Domain`, `Path`, and expiration.
- Identify selected cookie/session security weaknesses.
- Explain the purpose and risk of each relevant control.
- Demonstrate **HttpOnly + XSS** in a controlled environment.
- Demonstrate **SameSite + CSRF** behavior.
- Demonstrate the relationship between **Secure cookies and HTTPS**.
- Compare vulnerable and mitigated configurations.

### Example Demonstration

```text
Weak Cookie Configuration
        ↓
Controlled Security Scenario
        ↓
Observe the Result
        ↓
Apply Mitigation
        ↓
Run the Scenario Again
        ↓
Compare the Result
```

## Planned Architecture

```text
Browser
  ↓
Next.js Frontend
  ↓
Node.js / TypeScript Backend
  ├── Cookie Analysis
  ├── Session Logic
  └── Security Lab Scenarios
```

The frontend, backend, experiments, and tests will remain separated by responsibility.

## Tech Stack

- **Language:** TypeScript
- **Frontend:** Next.js
- **Runtime / Package Manager:** Node.js / npm
- **Backend:** Node.js + TypeScript
- **Testing:** Playwright and application-level tests
- **Web Testing:** Burp Suite and browser developer tools
- **TLS:** OpenSSL for local HTTPS/certificate testing where needed
- **Version Control:** Git / GitHub

## Planned Repository Structure

```text
CookieGuard/
├── frontend/
├── backend/
├── tests/
├── docs/
├── scripts/
└── README.md
```

The exact files will be determined during implementation; the repository will remain organized by responsibility.

## Course Alignment

CookieGuard applies the course material on HTTP/web applications, XSS, CSRF, authentication and sessions, cookie security, session security, HTTPS, and web-security testing.

## Expected Demonstration

A successful MVP demonstration will show a user establishing a session, inspecting its cookie, running a controlled security scenario, applying a mitigation, and repeating the scenario to verify the change.

All testing will remain within the project's controlled environment. CookieGuard is not intended to scan or attack third-party websites.

## Out of Scope

- Internet-wide or arbitrary website scanning
- Full penetration-testing automation
- Production SaaS deployment
- Enterprise vulnerability management
- Large vulnerability databases
- Generic security scoring

## Status

This repository currently defines the project and MVP. Implementation will begin with the requirements and architecture, followed by the application and security demonstrations.
