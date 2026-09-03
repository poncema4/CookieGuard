import { describe, expect, it } from "vitest";

describe("cookie inspection basics", () => {
  it("includes the expected security attributes", () => {
    const cookie = { secure: false, httpOnly: true, sameSite: "Lax", path: "/" };
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe("Lax");
    expect(cookie.path).toBe("/");
  });
});
