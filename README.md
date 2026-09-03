# CookieGuard

**Interactive Cookie & Session Security Laboratory**

**Course:** App Security & Web Technology  
**Project:** Final Course MVP / Proof of Concept  
**Status:** Planned

## 1. Project Overview

CookieGuard is an interactive web-security laboratory focused on one of the most important parts of modern web applications: **cookies, sessions, and the controls that protect them**.

The project will use a controlled web application to let a user inspect cookie configuration, reproduce selected security problems, apply a mitigation, and observe the change in application behavior.

The emphasis is not on producing a vulnerability score. The emphasis is on answering a more useful question:

> **What security control is missing, what risk does that create, and what changes when the control is applied?**

The MVP will provide a small set of complete demonstrations rather than attempting to become a general-purpose web vulnerability scanner.

## 2. Course Alignment

CookieGuard is designed for **Seton Hall University — App Security & Web Technology**.

The project directly connects to course topics including:

- HTTP and web application fundamentals
- OWASP web application security concepts
- XSS
- CSRF
- Authentication and sessions
- Cookie security
- Session hijacking concepts
- Burp Suite-style request/response inspection
- HTTPS and secure transport
- Secure session design
- Input validation and output handling

## 3. Problem Statement

Cookie security is often reduced to a checklist of attributes such as `Secure`, `HttpOnly`, and `SameSite`. A checklist can identify a configuration problem, but it does not necessarily demonstrate the security consequence.

CookieGuard addresses that gap by connecting the configuration to an observable security scenario.

For example:

```text
Cookie without HttpOnly
        ↓
Controlled XSS scenario
        ↓
Client-side JavaScript can access the cookie
        ↓
Apply HttpOnly
        ↓
Repeat the experiment
        ↓
Cookie is no longer exposed through JavaScript
```

The same approach will be used for selected CSRF, HTTPS, and cookie-policy demonstrations.

## 4. Project Objectives

The MVP will aim to accomplish the following:

1. Build a controlled web application with authentication and session behavior.
2. Inspect and display cookie security attributes.
3. Identify important cookie/session configuration weaknesses.
4. Provide an explanation of the security significance of each finding.
5. Reproduce selected security scenarios in a controlled environment.
6. Apply a security mitigation and repeat the scenario.
7. Show the difference between the insecure and protected states.
8. Provide enough technical evidence that the behavior can be explained at the HTTP/browser level.

## 5. MVP Scope

### 5.1 Cookie Inspection

CookieGuard will inspect cookies associated with the controlled application and present relevant properties such as:

- Name
- Domain
- Path
- `Secure`
- `HttpOnly`
- `SameSite`
- Expiration / lifetime
- Session versus persistent behavior

### 5.2 Cookie Security Analysis

The application will identify selected security weaknesses, including cases such as:

- Missing `HttpOnly` on a sensitive cookie
- Missing `Secure` on a cookie intended for HTTPS
- Weak or missing `SameSite` protection
- Overly broad cookie scope where relevant
- Inadequately protected session cookies

Each finding will explain **why the configuration matters**, not just label it as insecure.

### 5.3 Interactive XSS / HttpOnly Demonstration

A controlled XSS experiment will demonstrate how JavaScript can interact with a cookie when `HttpOnly` is not enabled, followed by the same experiment with `HttpOnly` enabled.

The goal is to demonstrate the security boundary provided by the cookie attribute without targeting any real application.

### 5.4 Interactive CSRF / SameSite Demonstration

A controlled CSRF scenario will be used to demonstrate how browser cookie policy affects cross-site requests. The experiment will compare appropriate `SameSite` configurations and explain the resulting behavior.

### 5.5 Secure / HTTPS Demonstration

The project will demonstrate the relationship between HTTPS and the `Secure` cookie attribute using the controlled application. Where appropriate, the project will use browser developer tools and HTTP request/response inspection to make the behavior visible.

### 5.6 Educational Explanations

For each experiment, CookieGuard will explain:

- The security control
- The threat it addresses
- The insecure condition
- The observed behavior
- The mitigation
- The expected secure behavior

## 6. Planned Architecture

The MVP will use a clear separation between the user interface, application/API logic, and security-lab scenarios.

```text
                    Browser
                       |
                       v
              Next.js Frontend
                       |
                 HTTP / API
                       |
                       v
            Node.js / TypeScript Backend
                 /           \
                /             \
               v               v
       Cookie Analysis     Lab Scenarios
               |               |
               +-------+-------+
                       |
                       v
              Results / Evidence
                       |
                       v
                 User Interface
```

The exact implementation may evolve during development, but the separation of concerns will remain clear.

## 7. Tech Stack

| Area | Technology | Purpose |
|---|---|---|
| Frontend | **Next.js** | Interactive laboratory interface |
| Frontend Language | **TypeScript** | Typed UI/application code |
| Runtime | **Node.js** | Application runtime |
| Package Manager | **npm** | Dependency and script management |
| Backend/API | **Node.js + TypeScript** | Cookie analysis, session logic, and lab APIs |
| Web Framework | **Next.js API routes / server functionality** | HTTP/API handling where appropriate |
| Styling | **CSS / Next.js styling** | Clear laboratory interface |
| Testing | **Jest / React Testing Library** | Unit and component testing where useful |
| Browser Testing | **Playwright** | Repeatable web-security behavior tests |
| Web Security Testing | **Burp Suite** | Request/response inspection during development and demonstrations |
| TLS | **OpenSSL** | Local certificate generation and HTTPS testing where needed |
| Version Control | **Git / GitHub** | Source control and project history |

The MVP will favor a small TypeScript/Node.js stack so the application and its security demonstrations can be developed and understood as one coherent system.

## 8. Planned Repository Structure

The repository will be organized so that the interface, server-side logic, security experiments, tests, and documentation remain easy to locate.

```text
CookieGuard/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── cookies/
│   │   ├── sessions/
│   │   └── labs/
│   └── tests/
├── tests/
├── docs/
├── scripts/
└── README.md
```

The exact folders may be adjusted once implementation begins, but the repository will keep frontend, backend, tests, documentation, and supporting scripts separated by responsibility.

## 9. Security Model

CookieGuard will intentionally include controlled insecure configurations for demonstration purposes. These configurations will exist only inside the project laboratory.

The project will maintain a clear distinction between:

- **Vulnerable demonstration state** — intentionally weakened for testing.
- **Mitigated state** — configured according to the security objective being demonstrated.

The project will not be designed to scan or attack arbitrary third-party websites.

## 10. Expected Demonstration

A successful MVP demonstration should follow a sequence similar to this:

1. Open the controlled web application.
2. Authenticate and establish a session.
3. Inspect the session cookie.
4. Identify a missing or weak security attribute.
5. Run the corresponding laboratory experiment.
6. Observe the insecure behavior.
7. Apply the appropriate mitigation.
8. Repeat the experiment.
9. Observe the changed behavior.
10. Explain the security principle demonstrated.

This gives the project a concrete beginning, attack/test condition, mitigation, and observable result.

## 11. Course Concepts Demonstrated

The MVP is intended to demonstrate practical understanding of:

- HTTP request/response behavior
- Web application architecture
- Cookies and sessions
- Authentication/session management
- `Secure`
- `HttpOnly`
- `SameSite`
- XSS
- CSRF
- HTTPS/TLS
- Secure session design
- Web security testing
- Request/response inspection
- Input and output security considerations

## 12. Out of Scope for the MVP

The first version will intentionally avoid becoming a commercial web-security platform.

Out of scope for the MVP:

- Internet-wide or large-scale scanning
- Automated testing of arbitrary third-party websites
- Full penetration-testing automation
- Enterprise vulnerability management
- A universal security score
- Large-scale user/account management
- Production SaaS deployment
- A large vulnerability database

The project will first prove that the core laboratory demonstrations work reliably.

## 13. Future Enhancements

If the MVP is completed with sufficient time remaining, possible additions include:

- JWT security demonstrations
- Additional authentication/session experiments
- Security-header analysis
- More XSS and CSRF scenarios
- Additional cookie-scope demonstrations
- More automated browser tests
- Burp Suite workflow support
- Additional educational modules

These enhancements are secondary to the core MVP.

## 14. Project Definition

CookieGuard is ultimately a **web-security laboratory, not a score generator**. Its value comes from demonstrating the relationship between a web security weakness, the underlying browser/application behavior, and the mitigation that changes that behavior.

The finished MVP should be small enough to complete and explain thoroughly while providing a technically meaningful demonstration of application-security concepts from the course.