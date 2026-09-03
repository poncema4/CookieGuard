import { readFileSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:https";
import { join } from "node:path";

export function createHttpsServer(
  handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>,
) {
  const certDir = join(process.cwd(), "certs");
  const keyPath = process.env.COOKIEGUARD_TLS_KEY ?? join(certDir, "localhost.key");
  const certPath = process.env.COOKIEGUARD_TLS_CERT ?? join(certDir, "localhost.crt");

  return createServer(
    {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    },
    handler,
  );
}
