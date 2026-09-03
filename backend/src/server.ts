import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createSession, deleteSession, getSession } from "./session.js";
import { buildClearedSessionCookie, buildSessionCookie, getCookieInspection, SESSION_COOKIE_NAME } from "./cookie-inspection.js";
import { buildClearedXssLabCookie, createXssLabCookie, XSS_LAB_COOKIE_NAME } from "./xss-lab.js";

const port = 4000;

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
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function setSessionCookie(response: ServerResponse, sessionId: string) {
  response.setHeader("Set-Cookie", buildSessionCookie(sessionId));
}

function clearSessionCookie(response: ServerResponse) {
  response.setHeader("Set-Cookie", buildClearedSessionCookie());
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const cookies = parseCookies(request);
  const session = getSession(cookies[SESSION_COOKIE_NAME]);

  if (url.pathname === "/api/health" && request.method === "GET") {
    sendJson(response, 200, { status: "running" });
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
    sendJson(response, 200, {
      authenticated: true,
      user: { username: newSession.username },
    });
    return;
  }

  if (url.pathname === "/api/auth/session" && request.method === "GET") {
    if (!session) {
      sendJson(response, 401, { authenticated: false });
      return;
    }

    sendJson(response, 200, {
      authenticated: true,
      user: { username: session.username },
      sessionCreatedAt: session.createdAt,
    });
    return;
  }

  if (url.pathname === "/api/auth/logout" && request.method === "POST") {
    const deleted = deleteSession(cookies[SESSION_COOKIE_NAME]);
    clearSessionCookie(response);
    response.setHeader("Set-Cookie", [buildClearedXssLabCookie(), buildClearedSessionCookie()]);
    sendJson(response, 200, { authenticated: false, loggedOut: true, sessionDeleted: deleted });
    return;
  }

  if (url.pathname === "/api/cookie-inspection" && request.method === "GET") {
    if (!session) {
      sendJson(response, 401, { error: "Authentication required" });
      return;
    }

    sendJson(response, 200, {
      ...getCookieInspection(),
      session: {
        authenticated: true,
        username: session.username,
        createdAt: session.createdAt,
      },
    });
    return;
  }

  if (url.pathname === "/api/xss-lab/cookie" && request.method === "POST") {
    if (!session) {
      sendJson(response, 401, { error: "Authentication required" });
      return;
    }

    const body = await readJson(request);
    const httpOnly = body.httpOnly === true;
    response.setHeader("Set-Cookie", createXssLabCookie(httpOnly));
    sendJson(response, 200, {
      cookieName: XSS_LAB_COOKIE_NAME,
      httpOnly,
      mode: httpOnly ? "protected" : "vulnerable",
    });
    return;
  }

  if (url.pathname === "/api/xss-lab/cookie" && request.method === "DELETE") {
    if (!session) {
      sendJson(response, 401, { error: "Authentication required" });
      return;
    }

    response.setHeader("Set-Cookie", buildClearedXssLabCookie());
    sendJson(response, 200, { cookieName: XSS_LAB_COOKIE_NAME, cleared: true });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`CookieGuard backend listening on http://localhost:${port}`);
});
