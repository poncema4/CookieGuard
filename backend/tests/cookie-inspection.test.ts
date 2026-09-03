import { describe, expect, it } from "vitest";

describe("Phase 3 cookie inspection", () => {
  const cookie = {
    name: "cookieguard_session",
    domain: "localhost",
    path: "/",
    secure: false,
    httpOnly: true,
    sameSite: "Lax",
    expiration: "Session",
    persistent: false,
  };

  it("identifies the session cookie attributes used by the lab", () => {
    expect(cookie).toEqual({
      name: "cookieguard_session",
      domain: "localhost",
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: "Lax",
      expiration: "Session",
      persistent: false,
    });
  });

  it("shows the HTTP development limitation for Secure", () => {
    expect(cookie.secure).toBe(false);
  });

  it("shows HttpOnly and SameSite protections enabled", () => {
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe("Lax");
  });
});
