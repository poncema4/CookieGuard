import { readFileSync } from "node:fs";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { createServer } from "node:https";
import { join } from "node:path";

export function createHttpsServer(
  handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>,
) {
  const certDir = join(process.cwd(), "..", "certs");
  const keyPath = process.env.COOKIEGUARD_TLS_KEY ?? join(certDir, "localhost-key.pem");
  const certPath = process.env.COOKIEGUARD_TLS_CERT ?? join(certDir, "localhost.pem");

  return createServer(
    {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    },
    handler,
  );
}
