import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { request as httpsRequest } from "node:https";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const backendOrigin = process.env.COOKIEGUARD_BACKEND_ORIGIN ?? "https://127.0.0.1:4443";

function findMkcertCaFile() {
  const candidates: string[] = [];

  try {
    const root = execFileSync("mkcert", ["-CAROOT"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (root) candidates.push(join(root, "rootCA.pem"));
  } catch {
    // Fall back to the standard Linux location below.
  }

  candidates.push(
    join(process.env.XDG_DATA_HOME ?? join(process.env.HOME ?? "", ".local", "share"), "mkcert", "rootCA.pem"),
    join(process.env.HOME ?? "", ".local", "share", "mkcert", "rootCA.pem"),
  );

  return candidates.find((file) => existsSync(file));
}

function proxyHeaders(request: Request) {
  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");

  if (contentType) headers["content-type"] = contentType;
  if (cookie) headers.cookie = cookie;

  return headers;
}

async function proxy(request: Request, path: string[]) {
  const target = new URL(`/${path.join("/")}`, backendOrigin);
  target.search = new URL(request.url).search;
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : Buffer.from(await request.arrayBuffer());
  const caFile = findMkcertCaFile();

  return new Promise<Response>((resolve) => {
    const client = httpsRequest(
      target,
      {
        method: request.method,
        headers: proxyHeaders(request),
        ...(caFile ? { ca: readFileSync(caFile) } : {}),
      },
      (upstream) => {
        const chunks: Buffer[] = [];
        upstream.on("data", (chunk: Buffer) => chunks.push(chunk));
        upstream.on("end", () => {
          const headers = new Headers();
          const contentType = upstream.headers["content-type"];
          const cacheControl = upstream.headers["cache-control"];
          if (contentType) headers.set("content-type", Array.isArray(contentType) ? contentType.join(", ") : contentType);
          if (cacheControl) headers.set("cache-control", Array.isArray(cacheControl) ? cacheControl.join(", ") : cacheControl);

          const setCookie = upstream.headers["set-cookie"];
          if (setCookie) {
            for (const cookie of setCookie) headers.append("set-cookie", cookie);
          }

          const location = upstream.headers.location;
          if (location) headers.set("location", location);

          const passthroughHeaders: string[] = ["www-authenticate"];
          for (const key of passthroughHeaders) {
            const value = upstream.headers[key];
            if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
          }

          resolve(new Response(Buffer.concat(chunks), { status: upstream.statusCode ?? 502, headers }));
        });
      },
    );

    client.on("error", (error: NodeJS.ErrnoException) => {
      console.error("CookieGuard API proxy error:", error);
      resolve(Response.json(
        { error: "Backend unavailable", detail: error.code ?? error.message },
        { status: 502 },
      ));
    });

    if (body) client.write(body);
    client.end();
  });
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}
