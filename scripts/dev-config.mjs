const DEFAULT_BACKEND_ORIGIN = "https://127.0.0.1:4443";

export const BACKEND_ORIGIN = process.env.COOKIEGUARD_BACKEND_ORIGIN ?? DEFAULT_BACKEND_ORIGIN;
export const BACKEND_PORT = Number(new URL(BACKEND_ORIGIN).port);

if (!/^https:\/\//.test(BACKEND_ORIGIN)) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must use HTTPS.");
}

if (!Number.isInteger(BACKEND_PORT) || BACKEND_PORT < 1 || BACKEND_PORT > 65535) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must include a valid port.");
}
