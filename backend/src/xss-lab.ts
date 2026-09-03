import { randomBytes } from "node:crypto";

export const XSS_LAB_COOKIE_NAME = "cookieguard_xss_lab";

export function buildXssLabCookie(value: string, httpOnly: boolean): string {
  const attributes = [
    "Path=/",
    httpOnly ? "HttpOnly" : "",
    "SameSite=Lax",
  ].filter(Boolean);

  return `${XSS_LAB_COOKIE_NAME}=${encodeURIComponent(value)}; ${attributes.join("; ")}`;
}

export function buildClearedXssLabCookie(): string {
  return `${XSS_LAB_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export function createXssLabCookie(httpOnly: boolean): string {
  const value = `lab-${randomBytes(16).toString("hex")}`;
  return buildXssLabCookie(value, httpOnly);
}
