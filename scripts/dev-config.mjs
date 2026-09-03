const DEFAULT_BACKEND_ORIGIN = "https://127.0.0.1:4443";

export const BACKEND_ORIGIN = process.env.COOKIEGUARD_BACKEND_ORIGIN ?? DEFAULT_BACKEND_ORIGIN;

if (!/^https:\/\//.test(BACKEND_ORIGIN)) {
  throw new Error("COOKIEGUARD_BACKEND_ORIGIN must use HTTPS.");
}
