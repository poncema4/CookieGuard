# CookieGuard Testing & Evidence

## Purpose

Phase 7 verifies that CookieGuard's security controls, controlled experiments, and production build remain reproducible before the final UI/UX work.

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

Verify each experiment below. Record the result in the evidence checklist before moving to the next experiment.

### 1. Cookie inspection

1. Log in with the demo account shown by the application.
2. Open the cookie inspection area.
3. Confirm the session cookie shows:
   - `HttpOnly: true`
   - `Secure: true`
   - `SameSite: Lax`
   - `Path: /`
   - session expiration.
4. Open browser developer tools and inspect the cookie under the site's storage/application view.
5. Confirm the browser shows the same security attributes.

Expected result: the authenticated session cookie is protected by the expected browser security attributes.

### 2. HttpOnly + XSS experiment

1. Open the XSS lab.
2. Run protected mode.
3. Execute the lab payload.
4. Confirm the demonstration cookie is not exposed to client-side JavaScript.
5. Switch to vulnerable mode.
6. Execute the same payload again.
7. Confirm the separate demonstration cookie value is exposed.

Expected result: the same controlled payload produces different observable results when `HttpOnly` changes.

Important: this experiment uses a separate demonstration cookie so the authenticated application session is not intentionally weakened.

### 3. SameSite + CSRF experiment

1. Open the CSRF lab.
2. Run the same-site POST scenario.
3. Confirm the request is accepted.
4. Run the controlled cross-site POST scenario.
5. Confirm the request is blocked when the lab cookie uses `SameSite=Lax` or `SameSite=Strict`.

Expected result: same-site behavior succeeds while the controlled cross-site request is rejected by the configured cookie policy.

### 4. Secure + HTTPS experiment

1. Open the HTTPS lab.
2. Confirm the page reports an HTTPS connection.
3. Confirm the address begins with `https://`.
4. Inspect the session cookie in browser developer tools.
5. Confirm `Secure`, `HttpOnly`, and `SameSite=Lax` are present.
6. Open the browser Network panel and inspect the login request.
7. Confirm the request uses HTTPS and the response contains the expected `Set-Cookie` attributes.
8. Log out and confirm the session cookie is removed or expired.

Expected result: the application and authenticated session operate over HTTPS and the session cookie includes `Secure`.

## Evidence checklist

Capture concise screenshots only when they demonstrate a security result or make the final presentation easier to follow.

| Evidence | What to capture | Result |
|---|---|---|
| Test suite | Successful `npm run verify` output | ☐ |
| Cookie inspection | Session cookie attributes | ☐ |
| HttpOnly protected | XSS payload with protected result | ☐ |
| HttpOnly vulnerable | XSS payload with exposed lab-cookie result | ☐ |
| SameSite same-site | Accepted same-site POST | ☐ |
| SameSite cross-site | Blocked cross-site POST | ☐ |
| HTTPS | HTTPS lab confirmation | ☐ |
| Secure cookie | Browser cookie showing `Secure` | ☐ |
| HTTPS request | Network request + `Set-Cookie` response | ☐ |
| Logout | Cookie removal/expiration | ☐ |

## Evidence storage

Keep final screenshots and presentation evidence in the repository's `evidence/` directory. Do not commit local development certificates, private keys, browser profiles, credentials, or unrelated screenshots.

Recommended names:

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

The development server should be available at `https://localhost:3000`, with the backend at `https://localhost:4443`.

## Phase 7 completion criteria

Phase 7 is complete when:

- All backend tests pass.
- Backend and frontend production builds pass.
- The browser application loads over HTTPS.
- Cookie inspection matches the expected session configuration.
- The HttpOnly experiment produces the protected and vulnerable outcomes.
- The SameSite experiment produces the expected same-site and cross-site outcomes.
- The HTTPS experiment confirms HTTPS transport and the `Secure` cookie attribute.
- Final evidence is organized without secrets or certificates.

UI/UX redesign is intentionally outside this phase and is handled during the final UI/UX phase.
