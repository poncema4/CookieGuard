import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";

test("HTTPS development certificate paths use the shared certs directory", () => {
  const certDir = join(process.cwd(), "..", "certs");
  assert.match(join(certDir, "localhost.pem"), /certs[\\/]localhost\.pem$/);
  assert.match(join(certDir, "localhost-key.pem"), /certs[\\/]localhost-key\.pem$/);
});
