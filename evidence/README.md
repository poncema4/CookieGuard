# CookieGuard Evidence

This directory contains only final presentation or verification evidence for CookieGuard.

## Final evidence set

Capture concise screenshots that directly demonstrate the security experiments described in `docs/testing.md`:

- `test-suite.png` — successful `npm run verify` output.
- `cookie-inspection.png` — authenticated session cookie attributes.
- `xss-protected.png` — protected lab-cookie result with `HttpOnly` enabled.
- `xss-vulnerable.png` — vulnerable lab-cookie result with `HttpOnly` disabled.
- `csrf-same-site.png` — accepted same-site POST.
- `csrf-cross-site.png` — blocked cross-site POST / policy result.
- `https-confirmed.png` — HTTPS connection confirmation.
- `secure-cookie.png` — session cookie showing `Secure` and `HttpOnly`.
- `https-network.png` — HTTPS login request and `Set-Cookie` response.
- `logout-cookie-cleared.png` — logout with cookie removal/expiration.

Keep only the evidence needed by the final presentation or assignment submission. Evidence should show the security result clearly rather than large amounts of surrounding UI.

## Do not store

- Development certificates or private keys
- Credentials or session secrets
- Browser profiles or personal data
- Unrelated screenshots
- Large generated files

## Submission rule

Evidence should be reproducible from the final implementation and should match the behavior documented in `docs/testing.md`. Do not capture or commit any secret values, private keys, or personal browser data.
