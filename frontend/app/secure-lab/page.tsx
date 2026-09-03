"use client";

import { useState } from "react";

export default function SecureLabPage() {
  const [result, setResult] = useState("Not tested yet.");
  async function testHttps() {
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const data = (await response.json()) as { protocol?: string };
      setResult(response.ok && data.protocol === "https" ? "HTTPS connection confirmed." : "Unexpected protocol response.");
    } catch {
      setResult("HTTPS test failed. Confirm the backend and frontend are running with the Phase 6 commands.");
    }
  }

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 48, fontFamily: "sans-serif" }}>
      <a href="/">← Back to CookieGuard</a>
      <h1>Secure + HTTPS Lab</h1>
      <p>This controlled lab demonstrates why the Secure cookie attribute requires HTTPS and how transport encryption protects session traffic in transit.</p>
      <section style={{ marginTop: 28, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>1. Confirm HTTPS</h2>
        <p>CookieGuard now runs its local frontend and backend over HTTPS. Your browser may show a certificate warning because the development certificate is self-signed.</p>
        <button type="button" onClick={testHttps} style={{ padding: 10 }}>Test HTTPS Backend</button>
        <p role="status">{result}</p>
      </section>
      <section style={{ marginTop: 28, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>2. Inspect the session cookie</h2>
        <p>Log in, then inspect the session cookie in Edge DevTools under Application → Cookies. The expected attributes are:</p>
        <ul><li><strong>Secure:</strong> checked</li><li><strong>HttpOnly:</strong> checked</li><li><strong>SameSite:</strong> Lax</li><li><strong>Expires:</strong> Session</li></ul>
      </section>
      <section style={{ marginTop: 28, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>3. Observe the security change</h2>
        <p>Secure tells the browser to send the session cookie only over HTTPS. The earlier HTTP-only development configuration could not safely use Secure because browsers would withhold that cookie on HTTP requests.</p>
        <p>Open DevTools → Network → the login request and inspect the <code>Set-Cookie</code> response header. It should include <code>Secure</code> and <code>HttpOnly</code>.</p>
      </section>
      <section style={{ marginTop: 28 }}>
        <h2>What this demonstrates</h2>
        <p><strong>HTTPS encrypts the connection; Secure tells the browser not to send the cookie over an unencrypted HTTP connection.</strong> These controls work together but solve different problems.</p>
      </section>
    </main>
  );
}
