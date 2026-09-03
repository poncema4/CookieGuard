import { createSession, deleteSession, getSession } from "./session.js";
import { buildClearedSessionCookie, buildSessionCookie, getCookieInspection, SESSION_COOKIE_NAME } from "./cookie-inspection.js";
import { buildClearedXssLabCookie, createXssLabCookie, XSS_LAB_COOKIE_NAME } from "./xss-lab.js";
import { buildClearedCsrfLabCookie, createCsrfLabCookie, CSRF_LAB_COOKIE_NAME, isCsrfLabCookiePresent, type CsrfSameSite } from "./csrf-lab.js";
import { createHttpsServer } from "./https.js";
import type { IncomingMessage, ServerResponse } from "node:http";

const BACKEND_ORIGIN = process.env.COOKIEGUARD_BACKEND_ORIGIN;

if (!BACKEND_ORIGIN) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must be set before starting the backend.");
}

const BACKEND_PORT = Number(new URL(BACKEND_ORIGIN).port);

if (!/^https:\/\//.test(BACKEND_ORIGIN)) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must use HTTPS.");
}

if (!Number.isInteger(BACKEND_PORT) || BACKEND_PORT < 1 || BACKEND_PORT > 65535) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must include a valid port.");
}

function parseCookies(request: IncomingMessage): Record<string, string> {
  const header = request.headers.cookie;
  if (!header) return {};

  return Object.fromEntries(
    header.split(";").map((part) => {
      const separator = part.indexOf("=");
      if (separator === -1) return [part.trim(), ""];
      const name = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      return [name, decodeURIComponent(value)];
    }),
  );
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  let body = "";
  for await (const chunk of request) body += chunk;
  if (!body) return {};

  try {
    const parsed: unknown = JSON.parse(body);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown, headers: Record<string, string> = {}) {
  response.writeHead(statusCode, { "Content-Type": "application/json", ...headers });
  response.end(JSON.stringify(payload));
}

function sendHtml(response: ServerResponse, statusCode: number, html: string, headers: Record<string, string> = {}) {
  response.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8", ...headers });
  response.end(html);
}

function setSessionCookie(response: ServerResponse, sessionId: string) {
  response.setHeader("Set-Cookie", buildSessionCookie(sessionId));
}

const server = createHttpsServer(async (request, response) => {
  const url = new URL(request.url ?? "/", BACKEND_ORIGIN);
  const cookies = parseCookies(request);
  const session = getSession(cookies[SESSION_COOKIE_NAME]);

  if (url.pathname === "/api/health" && request.method === "GET") {
    sendJson(response, 200, { status: "running", protocol: "https" });
    return;
  }

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    const body = await readJson(request);
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (username !== "demo" || password !== "cookieguard") {
      sendJson(response, 401, { error: "Invalid username or password" });
      return;
    }
    const newSession = createSession(username);
    setSessionCookie(response, newSession.id);
    sendJson(response, 200, { authenticated: true, user: { username: newSession.username } });
    return;
  }

  if (url.pathname === "/api/auth/session" && request.method === "GET") {
    if (!session) { sendJson(response, 401, { authenticated: false }); return; }
    sendJson(response, 200, { authenticated: true, user: { username: session.username }, sessionCreatedAt: session.createdAt });
    return;
  }

  if (url.pathname === "/api/auth/logout" && request.method === "POST") {
    const deleted = deleteSession(cookies[SESSION_COOKIE_NAME]);
    response.setHeader("Set-Cookie", [buildClearedXssLabCookie(), buildClearedSessionCookie()]);
    sendJson(response, 200, { authenticated: false, loggedOut: true, sessionDeleted: deleted });
    return;
  }

  if (url.pathname === "/api/cookie-inspection" && request.method === "GET") {
    if (!session) { sendJson(response, 401, { error: "Authentication required" }); return; }
    sendJson(response, 200, { ...getCookieInspection(), session: { authenticated: true, username: session.username, createdAt: session.createdAt } });
    return;
  }

  if (url.pathname === "/api/xss-lab/cookie" && request.method === "POST") {
    if (!session) { sendJson(response, 401, { error: "Authentication required" }); return; }
    const body = await readJson(request);
    const httpOnly = body.httpOnly === true;
    response.setHeader("Set-Cookie", createXssLabCookie(httpOnly));
    sendJson(response, 200, { cookieName: XSS_LAB_COOKIE_NAME, httpOnly, mode: httpOnly ? "protected" : "vulnerable" });
    return;
  }

  if (url.pathname === "/api/xss-lab/cookie" && request.method === "DELETE") {
    if (!session) { sendJson(response, 401, { error: "Authentication required" }); return; }
    response.setHeader("Set-Cookie", buildClearedXssLabCookie());
    sendJson(response, 200, { cookieName: XSS_LAB_COOKIE_NAME, cleared: true });
    return;
  }

  if (url.pathname === "/api/csrf-lab/setup" && request.method === "GET") {
    const requested = url.searchParams.get("sameSite");
    const sameSite: CsrfSameSite = requested === "Strict" ? "Strict" : "Lax";
    response.setHeader("Set-Cookie", createCsrfLabCookie(sameSite));
    sendHtml(response, 200, `<!doctype html><html><body style="font-family:sans-serif;max-width:700px;margin:40px auto"><h1>CookieGuard SameSite + CSRF Lab</h1><p>Lab cookie <strong>${CSRF_LAB_COOKIE_NAME}</strong> is configured with <strong>SameSite=${sameSite}</strong>.</p><p>This cookie is intentionally separate from the authenticated session.</p><p>Return to the CookieGuard CSRF lab to run the controlled cross-site POST test.</p></body></html>`);
    return;
  }

  if (url.pathname === "/api/csrf-lab/action" && request.method === "POST") {
    if (!isCsrfLabCookiePresent(cookies)) {
      sendHtml(response, 403, "<!doctype html><html><body style=\"font-family:sans-serif;max-width:700px;margin:40px auto\"><h1>CSRF protection blocked the request</h1><p>The SameSite lab cookie was not sent with this cross-site POST.</p><p>Status: <strong>BLOCKED</strong></p></body></html>");
      return;
    }
    sendHtml(response, 200, "<!doctype html><html><body style=\"font-family:sans-serif;max-width:700px;margin:40px auto\"><h1>State-changing request accepted</h1><p>The SameSite lab cookie was sent with this POST.</p><p>Status: <strong>ACCEPTED</strong></p></body></html>");
    return;
  }

  if (url.pathname === "/api/csrf-lab/clear" && request.method === "GET") {
    response.setHeader("Set-Cookie", buildClearedCsrfLabCookie());
    sendHtml(response, 200, "<!doctype html><html><body style=\"font-family:sans-serif;max-width:700px;margin:40px auto\"><h1>CSRF lab cookie cleared</h1><p>Return to the CookieGuard CSRF lab.</p></body></html>");
    return;
  }

  if (url.pathname === "/api/csrf-lab/same-site" && request.method === "GET") {
    sendHtml(response, 200, "<!doctype html><html><body style=\"font-family:sans-serif;max-width:700px;margin:40px auto\"><h1>Same-site CSRF test</h1><p>This form submits from the target site itself, so the lab cookie is eligible to accompany the POST.</p><form method=\"POST\" action=\"/api/csrf-lab/action\"><button type=\"submit\">Submit same-site POST</button></form></body></html>");
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(BACKEND_PORT, () => {
  console.log(`CookieGuard backend listening on ${BACKEND_ORIGIN}`);
});
