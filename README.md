# CookieGuard

**Interactive Cookie & Session Security Laboratory**

> **Course:** App Security & Web Technology  
> **Project Type:** Final Course MVP / Proof of Concept  
> **Status:** Planned MVP

## Overview

CookieGuard is an interactive web security laboratory designed to make cookie and session security understandable through direct experimentation rather than a static security checklist or score.

The project will provide a controlled web application environment where users can inspect cookie attributes, observe insecure session behavior, change security controls, and immediately see how those changes affect the application's behavior.

The central idea is simple:

> **Instead of only telling a user that a cookie is insecure, CookieGuard demonstrates why the security control matters.**

The MVP will focus specifically on web application cookies, sessions, authentication-related behavior, and the security controls that protect them.

## Course

**Seton Hall University — App Security & Web Technology**

CookieGuard is designed around the course topics involving web application security, authentication and sessions, cookie security, XSS, CSRF, HTTPS, Burp Suite-style inspection, and secure session design.

## Problem

Cookie and session security is often presented as a list of attributes such as `Secure`, `HttpOnly`, and `SameSite`. While the attributes are important, simply identifying a missing flag does not demonstrate what the control actually prevents.

CookieGuard addresses this learning gap by creating a controlled environment where security properties can be changed and their effects observed.

For example, the MVP should be able to demonstrate the difference between a session cookie with and without `HttpOnly`, or show how changing `SameSite` affects a controlled CSRF scenario.

## Project Goal

The goal of CookieGuard is to build a small but functional web security laboratory that connects **web vulnerabilities, security controls, and observable application behavior**.

The MVP should allow a user to:

1. Interact with a controlled web application.
2. Inspect cookies and their security attributes.
3. Identify insecure or missing cookie controls.
4. Understand why each control matters.
5. Run controlled security experiments.
6. Compare insecure and secure configurations.
7. Observe the behavioral difference after a mitigation is applied.

## MVP Scope

The MVP will concentrate on the following capabilities.

### 1. Cookie Inspection

CookieGuard will display relevant properties of cookies used by the controlled application, including:

- Cookie name
- Domain
- Path
- `Secure`
- `HttpOnly`
- `SameSite`
- Expiration / lifetime information
- Session-related purpose where applicable

### 2. Security Analysis

The application will evaluate cookie configuration against the security concepts being demonstrated and explain notable weaknesses.

Examples include:

- Missing `HttpOnly`
- Missing `Secure`
- Weak or missing `SameSite` policy
- Inappropriate cookie scope
- Session cookies lacking appropriate protection

The purpose is educational analysis rather than producing a generic numerical security score.

### 3. Interactive Security Experiments

The most important part of the MVP is the ability to demonstrate security controls in action.

Planned demonstrations include:

#### HttpOnly and XSS

A controlled XSS scenario will demonstrate the risk of exposing a session-related cookie to client-side JavaScript. The experiment will then enable `HttpOnly` and demonstrate the resulting protection.

#### SameSite and CSRF

A controlled CSRF scenario will compare cookie behavior under different `SameSite` configurations and demonstrate how browser cookie policy affects cross-site requests.

#### Secure Cookies and HTTPS

The project will demonstrate the relationship between the `Secure` attribute and HTTPS by comparing protected and improperly configured cookie behavior in a controlled environment.

### 4. Educational Explanations

Each finding or experiment will explain:

- What the security control is.
- What threat it addresses.
- What happens when the control is missing or weakened.
- What the secure configuration should accomplish.
- How the observed behavior relates to the underlying web-security concept.

## Planned Workflow

```text
Controlled Web Application
          |
          v
     Cookie / Session
       Observation
          |
          v
     CookieGuard Analysis
          |
          +--------------------+
          |                    |
          v                    v
   Security Finding     Interactive Experiment
          |                    |
          +---------+----------+
                    |
                    v
          Explain Security Control
                    |
                    v
          Apply Secure Configuration
                    |
                    v
            Observe Difference
```

## Security Concepts Demonstrated

The MVP is intended to demonstrate practical understanding of:

- HTTP and web application behavior
- Cookies and sessions
- Authentication and session management
- `Secure`
- `HttpOnly`
- `SameSite`
- Reflected/stored/DOM XSS concepts where applicable to the controlled demonstrations
- CSRF
- HTTPS and secure transport
- Secure session design
- Input and output security considerations
- Web security testing and observation

## Design Principles

CookieGuard will follow several principles throughout development:

### Demonstration over Scoring

The project will not revolve around a generic security score. Findings should be actionable and connected to observable behavior.

### Controlled Testing

All security experiments will run against applications and scenarios intentionally created for the project. The project is not intended to scan or attack arbitrary third-party websites.

### Secure-by-Design Where Appropriate

The application will intentionally contain controlled insecure configurations for educational demonstrations while keeping the overall laboratory environment isolated and clearly separated from real-world targets.

### Clear Separation of Vulnerability and Mitigation

Where practical, demonstrations will show both states:

```text
Insecure Configuration
        ↓
Security Behavior / Vulnerability
        ↓
Apply Mitigation
        ↓
Secure Configuration
        ↓
Changed Behavior
```

## Planned MVP Architecture

The final implementation details will be selected during development, but the MVP is expected to contain three primary areas:

- **Controlled Web Application** — provides authentication, sessions, cookies, and intentionally configurable security behavior.
- **CookieGuard Analysis Layer** — inspects cookie/session properties and produces security explanations.
- **Interactive Laboratory Interface** — allows users to select experiments, change security configurations, and observe results.

The architecture will remain intentionally small enough to function as a course MVP while still demonstrating real application-security concepts.

## Expected Demonstration

A final MVP demonstration should be able to show a sequence similar to:

1. Log into the controlled application.
2. Inspect the issued session cookie.
3. Identify a missing security attribute.
4. Run the corresponding controlled experiment.
5. Observe the insecure behavior.
6. Enable the appropriate security control.
7. Repeat the experiment.
8. Observe the mitigation taking effect.
9. Explain why the security control changed the result.

This demonstration is intended to show understanding rather than simply display a vulnerability label.

## Out of Scope for the MVP

To keep the project aligned with the professor's MVP/proof-of-concept requirement, the initial version will intentionally avoid becoming a full commercial web-security platform.

The following are not required for the MVP:

- Large-scale Internet-wide scanning
- Automated vulnerability discovery across arbitrary websites
- Production SaaS deployment
- Comprehensive penetration-testing automation
- A large vulnerability database
- Complex user management
- Enterprise-scale monitoring
- A universal security score

Additional capabilities may be considered only after the core laboratory works reliably.

## Future Enhancements

Potential future enhancements, if time permits, include:

- Additional session and authentication experiments
- JWT security demonstrations
- Security-header analysis
- Burp Suite integration or export workflows
- Additional XSS/CSRF scenarios
- More advanced cookie scope demonstrations
- Automated test cases for security configurations
- Additional educational modules

These enhancements are secondary to completing and demonstrating the core MVP.

## Development Philosophy

CookieGuard will be developed incrementally. The project will prioritize a small number of complete, understandable security demonstrations over a large collection of partially implemented features.

The finished MVP should be something that can be demonstrated live and explained technically from the underlying HTTP request and response behavior through the security control and resulting application behavior.

## Academic Context

This repository represents the project concept and implementation for **App Security & Web Technology**. The project is intended to demonstrate practical application of course concepts through an original proof of concept.

Implementation, testing, documentation, and final presentation materials will be developed as the project progresses.
