import assert from "node:assert/strict";
import test from "node:test";
import {
  buildClearedSessionCookie,
  buildSessionCookie,
  COOKIE_EXPLANATIONS,
  getCookieInspection,
  SESSION_COOKIE_ATTRIBUTES,
  SESSION_COOKIE_NAME,
} from "../src/cookie-inspection.js";

test("exposes the expected session cookie attributes", () => {
  const { cookie } = getCookieInspection();
  assert.equal(cookie.name, SESSION_COOKIE_NAME);
  assert.equal(cookie.domain, "localhost");
  assert.equal(cookie.path, "/");
  assert.equal(cookie.secure, true);
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.sameSite, "Lax");
  assert.equal(cookie.expiration, "Session");
  assert.equal(cookie.persistent, false);
});

test("provides an explanation for every inspected attribute", () => {
  for (const attribute of Object.keys(SESSION_COOKIE_ATTRIBUTES) as Array<keyof typeof SESSION_COOKIE_ATTRIBUTES>) {
    assert.ok(COOKIE_EXPLANATIONS[attribute]);
  }
});

test("builds the same secure cookie attributes used by the login response", () => {
  const header = buildSessionCookie("test-session");
  assert.equal(header, `${SESSION_COOKIE_NAME}=test-session; Path=/; HttpOnly; Secure; SameSite=Lax`);
  assert.match(header, /Path=\//);
  assert.match(header, /HttpOnly/);
  assert.match(header, /Secure/);
  assert.match(header, /SameSite=Lax/);
});

test("builds a session-cookie clearing header with matching security attributes", () => {
  assert.equal(
    buildClearedSessionCookie(),
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );
});

test("documents that Secure requires HTTPS in the current lab", () => {
  assert.equal(SESSION_COOKIE_ATTRIBUTES.secure, true);
  assert.match(COOKIE_EXPLANATIONS.secure, /HTTPS/i);
});
