import assert from "node:assert/strict";
import test from "node:test";
import {
  buildClearedXssLabCookie,
  buildXssLabCookie,
  createXssLabCookie,
  XSS_LAB_COOKIE_NAME,
} from "../src/xss-lab.js";

test("builds the vulnerable XSS lab cookie without HttpOnly", () => {
  const header = buildXssLabCookie("lab-token", false);
  assert.equal(header, `${XSS_LAB_COOKIE_NAME}=lab-token; Path=/; SameSite=Lax`);
  assert.doesNotMatch(header, /HttpOnly/);
});

test("builds the protected XSS lab cookie with HttpOnly", () => {
  const header = buildXssLabCookie("lab-token", true);
  assert.equal(header, `${XSS_LAB_COOKIE_NAME}=lab-token; Path=/; HttpOnly; SameSite=Lax`);
  assert.match(header, /HttpOnly/);
});

test("generates a fresh XSS lab cookie value", () => {
  const first = createXssLabCookie(true);
  const second = createXssLabCookie(true);
  assert.notEqual(first, second);
  assert.match(first, new RegExp(`^${XSS_LAB_COOKIE_NAME}=lab-[a-f0-9]{32};`));
  assert.match(second, new RegExp(`^${XSS_LAB_COOKIE_NAME}=lab-[a-f0-9]{32};`));
});

test("builds a clearing header for the XSS lab cookie", () => {
  assert.equal(
    buildClearedXssLabCookie(),
    `${XSS_LAB_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`,
  );
});
