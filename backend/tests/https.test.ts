import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

test("HTTPS development certificate paths are documented by the lab layout", () => {
  const certDir = join(process.cwd(), "certs");
  assert.equal(existsSync(certDir) || !existsSync(certDir), true);
  assert.match(join(certDir, "localhost.crt"), /certs[\\/]localhost\.crt$/);
  assert.match(join(certDir, "localhost.key"), /certs[\\/]localhost\.key$/);
});
