import { randomBytes } from "node:crypto";

export const CSRF_LAB_COOKIE_NAME = "cookieguard_csrf_lab";
export type CsrfSameSite = "Lax" | "Strict";

export function createCsrfLabCookie(sameSite: CsrfSameSite): string {
  const value = `csrf-${randomBytes(16).toString("hex")}`;
  return `${CSRF_LAB_COOKIE_NAME}=${value}; Path=/; SameSite=${sameSite}`;
}

export function buildClearedCsrfLabCookie(): string {
  return `${CSRF_LAB_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export function isCsrfLabCookiePresent(cookies: Record<string, string>): boolean {
  return Boolean(cookies[CSRF_LAB_COOKIE_NAME]);
}
