# CookieGuard Testing & Evidence

## Purpose
This guide verifies that CookieGuard's security controls, controlled experiments, and production build remain reproducible.

## Automated verification

Run the complete local verification from the repository root:

```text
npm run verify
```

The verification runner executes:

1. Backend unit and security tests.
2. Backend TypeScript build.
3. Frontend production build.

The command must finish with `CookieGuard verification checks passed.` and no failing test or build step.

The backend test suite covers:

| Area | Test file | Purpose |
|---|---|---|
| Session | `backend/tests/session.test.ts` | Session creation, lookup, and cleanup behavior |
| Cookie inspection | `backend/tests/cookie-inspection.test.ts` | Cookie attributes and generated `Set-Cookie` behavior |
| HttpOnly / XSS | `backend/tests/xss-lab.test.ts` | Vulnerable and protected XSS lab behavior |
| SameSite / CSRF | `backend/tests/csrf-lab.test.ts` | Same-site acceptance and cross-site blocking behavior |
| HTTPS | `backend/tests/https.test.ts` | Shared local certificate path and HTTPS configuration expectations |

## Manual browser verification

Start the application with:

```text
npm run dev
```

Open:

```text
https://localhost:3000
```

### Cookie inspection

1. Log in with the demo account shown by the application.
2. Open the cookie inspection area.
3. Confirm the session cookie shows `HttpOnly: true`, `Secure: true`, `SameSite: Lax`, `Path: /`, and session expiration.
4. Confirm the displayed domain is `localhost` and no `Domain` attribute is set, meaning the cookie is host-only.
5. Open browser developer tools and inspect the cookie under the site's storage/application view.
6. Confirm the browser shows the same security attributes.

Expected result: the authenticated session cookie is protected by the expected browser security attributes and is host-only for the current host.

### HttpOnly + XSS

1. Open the XSS lab.
2. Run protected mode and execute the lab payload.
3. Confirm the demonstration cookie is not exposed to client-side JavaScript.
4. Switch to vulnerable mode and execute the same payload again.
5. Confirm the separate demonstration cookie value is exposed.
6. Confirm the lab cookie remains `Secure` in both modes; only `HttpOnly` changes between the two experiment states.

Expected result: the same controlled payload produces different observable results when `HttpOnly` changes. The authenticated application session remains protected because the experiment uses a separate demonstration cookie.

### SameSite + CSRF

1. Open the CSRF lab.
2. Configure `SameSite=Lax` and run the same-site POST scenario.
3. Confirm the same-site request is accepted.
4. Inspect the request in the browser Network panel and confirm the expected lab-cookie behavior.
5. Run the controlled cross-site POST and observe the result shown by the lab; cookie handling can vary by browser for Lax, including temporary POST-related behavior.
6. Inspect the cross-site request in Network and confirm the protected/blocked result.
7. Repeat with `SameSite=Strict` and confirm the controlled cross-site request is blocked.

Expected result: same-site behavior succeeds, while the controlled cross-site result follows the configured SameSite policy. `Strict` provides the deterministic blocked case used by the experiment, while `Lax` is intentionally documented with the browser-specific caveat.

### Secure + HTTPS

1. Open the HTTPS lab.
2. Confirm the page reports an HTTPS connection and the address begins with `https://`.
3. Inspect the session cookie in browser developer tools.
4. Confirm `Secure`, `HttpOnly`, and `SameSite=Lax` are present.
5. Open the browser Network panel and inspect the login request.
6. Confirm the request uses HTTPS and the response contains the expected `Set-Cookie` attributes.
7. Log out and confirm the session cookie is removed or expired.

Expected result: the application and authenticated session operate over HTTPS and the session cookie includes `Secure`.

### Baseline response hardening

The baseline response-hardening checks are covered by automated security tests and code-level verification; a separate screenshot is **not required** for the final evidence set.

1. Inspect a normal application response in browser developer tools if you want an additional manual check.
2. Confirm the frontend sends `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, and the configured `Permissions-Policy`.
3. Confirm backend API/HTML responses use `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`.
4. Confirm malformed cookie values do not cause an application error.
5. Confirm oversized JSON request bodies are bounded and do not cause unbounded request-body accumulation.

Expected result: baseline browser hardening is present without changing the security-lab workflows. These checks do not require an additional `response-hardening.png` screenshot for submission.

## Evidence checklist

Capture concise screenshots only when they demonstrate a security result or make the final presentation easier to follow.

| Evidence | What to capture |
|---|---|
| Test suite | Successful `npm run verify` output |
| Cookie inspection | Session cookie attributes |
| HttpOnly protected | XSS payload with protected result |
| HttpOnly vulnerable | XSS payload with exposed lab-cookie result |
| SameSite same-site | Accepted same-site POST, preferably with Network details |
| SameSite cross-site | Cross-site POST result showing the configured policy and Network status |
| HTTPS | HTTPS confirmation |
| Secure cookie | Browser cookie showing `Secure` |
| HTTPS request | Network request + `Set-Cookie` response |
| Logout | Cookie removal/expiration |

The baseline response-hardening checks are intentionally documented and automated rather than represented by a separate required screenshot.

## Evidence storage

Keep final screenshots and presentation evidence in the repository's `evidence/` directory. Do not commit local development certificates, private keys, browser profiles, credentials, or unrelated screenshots.

Recommended final names:

```text
evidence/
├── test-suite.png
├── cookie-inspection.png
├── xss-protected.png
├── xss-vulnerable.png
├── csrf-same-site.png
├── csrf-cross-site.png
├── https-confirmed.png
├── secure-cookie.png
├── https-network.png
└── logout-cookie-cleared.png
```

Only keep evidence that directly supports the project demonstration.

## Cross-platform verification

The same verification commands are intended for Windows PowerShell and Linux Bash:

```text
npm install
npm run verify
npm run dev
```

The browser-facing development server should be available at `https://localhost:3000`. The backend origin is centrally configured in `scripts/dev-config.mjs`; its default is an HTTPS loopback target used by the labs.

## Verification criteria

The project is ready for presentation when all automated checks pass, the browser application loads over HTTPS, cookie inspection matches the expected session configuration, the XSS and CSRF experiments produce their protected and policy-dependent outcomes, baseline response hardening is present, and the HTTPS experiment confirms transport and cookie security. Evidence should be organized without secrets or certificates.
