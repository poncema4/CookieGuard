export type CookieInspection = {
  name: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: "Lax" | "Strict" | "None";
  expiration: "Session" | string;
  persistent: boolean;
};

export const SESSION_COOKIE_NAME = "cookieguard_session";

export const SESSION_COOKIE_ATTRIBUTES: CookieInspection = {
  name: SESSION_COOKIE_NAME,
  domain: "localhost",
  path: "/",
  secure: false,
  httpOnly: true,
  sameSite: "Lax",
  expiration: "Session",
  persistent: false,
};

export const COOKIE_EXPLANATIONS: Record<keyof CookieInspection, string> = {
  name: "Identifies the CookieGuard session cookie.",
  domain: "Controls which host can receive the cookie. This lab uses localhost.",
  path: "Controls which URL paths receive the cookie. / makes it available to the application.",
  secure: "When enabled, the browser sends the cookie only over HTTPS. It is disabled because the current local lab runs over HTTP.",
  httpOnly: "Prevents client-side JavaScript from reading the cookie value, reducing session-cookie exposure during XSS.",
  sameSite: "Controls when the browser sends the cookie with cross-site requests. Lax provides a baseline CSRF protection for this session cookie.",
  expiration: "Session means the browser treats the cookie as a session cookie. An Expires or Max-Age value would make it persistent.",
  persistent: "Indicates whether the cookie has an explicit lifetime beyond the browser session.",
};

export function getCookieInspection() {
  return {
    cookie: SESSION_COOKIE_ATTRIBUTES,
    analysis: COOKIE_EXPLANATIONS,
  };
}
