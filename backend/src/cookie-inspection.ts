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

type SessionCookieConfig = {
  name: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: "Lax" | "Strict" | "None";
  expiration: "Session" | string;
};

export const SESSION_COOKIE_NAME = "cookieguard_session";

// Single source of truth for the session-cookie settings used by the lab.
export const SESSION_COOKIE_CONFIG: SessionCookieConfig = {
  name: SESSION_COOKIE_NAME,
  path: "/",
  secure: false,
  httpOnly: true,
  sameSite: "Lax",
  expiration: "Session",
};

export const COOKIE_EXPLANATIONS: Record<keyof CookieInspection, string> = {
  name: "Identifies the CookieGuard session cookie.",
  domain: "The current lab uses a host-only cookie on localhost because no Domain attribute is set.",
  path: "Controls which URL paths receive the cookie. / makes it available to the application.",
  secure: "When enabled, the browser sends the cookie only over HTTPS. It is disabled because the current local lab runs over HTTP.",
  httpOnly: "Prevents client-side JavaScript from reading the cookie value, reducing session-cookie exposure during XSS.",
  sameSite: "Controls when the browser sends the cookie with cross-site requests. Lax provides a baseline CSRF protection for this session cookie.",
  expiration: "Session means the browser treats the cookie as a session cookie. An Expires or Max-Age value would make it persistent.",
  persistent: "Indicates whether the cookie has an explicit lifetime beyond the browser session.",
};

export function getCookieInspection(): { cookie: CookieInspection; analysis: typeof COOKIE_EXPLANATIONS } {
  return {
    cookie: {
      name: SESSION_COOKIE_CONFIG.name,
      domain: "localhost (host-only)",
      path: SESSION_COOKIE_CONFIG.path,
      secure: SESSION_COOKIE_CONFIG.secure,
      httpOnly: SESSION_COOKIE_CONFIG.httpOnly,
      sameSite: SESSION_COOKIE_CONFIG.sameSite,
      expiration: SESSION_COOKIE_CONFIG.expiration,
      persistent: SESSION_COOKIE_CONFIG.expiration !== "Session",
    },
    analysis: COOKIE_EXPLANATIONS,
  };
}

export function buildSessionCookie(sessionId: string): string {
  const attributes = [
    `Path=${SESSION_COOKIE_CONFIG.path}`,
    SESSION_COOKIE_CONFIG.httpOnly ? "HttpOnly" : "",
    SESSION_COOKIE_CONFIG.secure ? "Secure" : "",
    `SameSite=${SESSION_COOKIE_CONFIG.sameSite}`,
  ].filter(Boolean);

  return `${SESSION_COOKIE_CONFIG.name}=${encodeURIComponent(sessionId)}; ${attributes.join("; ")}`;
}

export function buildClearedSessionCookie(): string {
  return `${buildSessionCookie("")}; Max-Age=0`;
}

// Backward-compatible exported view for tests and callers that need the current settings.
export const SESSION_COOKIE_ATTRIBUTES = getCookieInspection().cookie;
