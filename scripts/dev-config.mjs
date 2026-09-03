import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const configPath = fileURLToPath(new URL("./dev-config.json", import.meta.url));
const { backendOrigin } = JSON.parse(readFileSync(configPath, "utf8"));

export const BACKEND_ORIGIN = process.env.COOKIEGUARD_BACKEND_ORIGIN ?? backendOrigin;
export const BACKEND_PORT = Number(new URL(BACKEND_ORIGIN).port);

if (!/^https:\/\//.test(BACKEND_ORIGIN)) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must use HTTPS.");
}

if (!Number.isInteger(BACKEND_PORT) || BACKEND_PORT < 1 || BACKEND_PORT > 65535) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must include a valid port.");
}
