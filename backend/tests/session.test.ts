import assert from "node:assert/strict";
import test from "node:test";
import { clearSessions, createSession, deleteSession, getSession } from "../src/session.js";

test("creates and retrieves a server-side session", () => {
  clearSessions();

  const session = createSession("demo");
  const stored = getSession(session.id);

  assert.equal(stored?.username, "demo");
  assert.equal(stored?.id, session.id);
  assert.ok(stored?.createdAt);
});

test("deletes a server-side session", () => {
  clearSessions();

  const session = createSession("demo");
  assert.equal(deleteSession(session.id), true);
  assert.equal(getSession(session.id), undefined);
  assert.equal(deleteSession(session.id), false);
});
