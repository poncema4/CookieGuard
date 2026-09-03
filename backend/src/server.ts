import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createSession, deleteSession, getSession } from "./session.js";

const port = 4000;
const SESSION_COOKIE = "cookieguard_session";

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
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax`,
  );
}

function clearSessionCookie(response: ServerResponse) {
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const cookies = parseCookies(request);
  const session = getSession(cookies[SESSION_COOKIE]);

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
    const deleted = deleteSession(cookies[SESSION_COOKIE]);
    clearSessionCookie(response);
    sendJson(response, 200, { authenticated: false, loggedOut: true, sessionDeleted: deleted });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`CookieGuard backend listening on http://localhost:${port}`);
});
