import assert from "node:assert/strict";
import test from "node:test";
import {
  buildClearedCsrfLabCookie,
  createCsrfLabCookie,
  CSRF_LAB_COOKIE_NAME,
  isCsrfLabCookiePresent,
} from "../src/csrf-lab.js";

test("builds a secure Lax CSRF lab cookie", () => {
  const header = createCsrfLabCookie("Lax");
  assert.match(header, new RegExp(`^${CSRF_LAB_COOKIE_NAME}=csrf-[a-f0-9]{32}; Path=/; SameSite=Lax; Secure$`));
});

test("builds a secure Strict CSRF lab cookie", () => {
  const header = createCsrfLabCookie("Strict");
  assert.match(header, new RegExp(`^${CSRF_LAB_COOKIE_NAME}=csrf-[a-f0-9]{32}; Path=/; SameSite=Strict; Secure$`));
});

test("generates a fresh CSRF lab cookie value", () => {
  assert.notEqual(createCsrfLabCookie("Lax"), createCsrfLabCookie("Lax"));
});

test("detects the CSRF lab cookie", () => {
  assert.equal(isCsrfLabCookiePresent({ [CSRF_LAB_COOKIE_NAME]: "csrf-token" }), true);
  assert.equal(isCsrfLabCookiePresent({}), false);
});

test("builds a secure clearing header", () => {
  assert.equal(
    buildClearedCsrfLabCookie(),
    `${CSRF_LAB_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0; Secure`,
  );
});
