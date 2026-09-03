"use client";

import { useRef, useState } from "react";

const XSS_PAYLOAD = `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" onload="document.getElementById('cookie-output').textContent = document.cookie">`;

type LabMode = "none" | "vulnerable" | "protected";

export default function XssLab() {
  const [mode, setMode] = useState<LabMode>("none");
  const [result, setResult] = useState("No XSS scenario has been run.");
  const [loading, setLoading] = useState(false);
  const payloadRef = useRef<HTMLDivElement>(null);

  async function configureCookie(httpOnly: boolean) {
    setLoading(true);
    setResult("Configuring lab cookie...");
    try {
      const response = await fetch("/api/xss-lab/cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ httpOnly }),
      });
      const data = (await response.json()) as { error?: string; mode?: LabMode };
      if (!response.ok) {
        setResult(data.error ?? "Unable to configure the lab cookie.");
        return;
      }
      setMode(data.mode ?? "none");
      setResult(httpOnly ? "Protected mode enabled. Run the same XSS payload." : "Vulnerable mode enabled. Run the XSS payload.");
    } catch {
      setResult("Backend unavailable.");
    } finally {
      setLoading(false);
    }
  }

  function runXss() {
    if (!payloadRef.current) return;
    setResult("Executing controlled XSS payload...");
    payloadRef.current.innerHTML = XSS_PAYLOAD;
  }

  async function clearLab() {
    setLoading(true);
    try {
      await fetch("/api/xss-lab/cookie", { method: "DELETE" });
      setMode("none");
      setResult("Lab cookie cleared.");
      if (payloadRef.current) payloadRef.current.replaceChildren();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 48, fontFamily: "sans-serif" }}>
      <p><a href="/">← Back to CookieGuard</a></p>
      <h1>HttpOnly + XSS Lab</h1>
      <p>Demonstrate how HttpOnly changes whether client-side JavaScript can read a lab cookie.</p>

      <section style={{ border: "1px solid #ccc", borderRadius: 8, padding: 20, marginTop: 24 }}>
        <h2>1. Choose Cookie Configuration</h2>
        <p>This lab uses a separate demonstration cookie. The authenticated session cookie is not modified.</p>
        <button type="button" onClick={() => void configureCookie(false)} disabled={loading} style={{ padding: 10, marginRight: 8 }}>
          Enable Vulnerable Mode
        </button>
        <button type="button" onClick={() => void configureCookie(true)} disabled={loading} style={{ padding: 10 }}>
          Enable Protected Mode
        </button>
        <p><strong>Current mode:</strong> {mode === "none" ? "Not configured" : mode}</p>
      </section>

      <section style={{ border: "1px solid #ccc", borderRadius: 8, padding: 20, marginTop: 20 }}>
        <h2>2. Run Controlled XSS</h2>
        <p>The payload below intentionally injects an image event handler that reads <code>document.cookie</code>.</p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 12, borderRadius: 6 }}>{XSS_PAYLOAD}</pre>
        <button type="button" onClick={runXss} disabled={mode === "none" || loading} style={{ padding: 10 }}>
          Run XSS Payload
        </button>
        <div ref={payloadRef} aria-hidden="true" />
        <h3>JavaScript-visible cookies</h3>
        <pre id="cookie-output" style={{ minHeight: 48, background: "#f5f5f5", padding: 12, borderRadius: 6, whiteSpace: "pre-wrap" }}>{result}</pre>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Expected Result</h2>
        <p><strong>Vulnerable mode:</strong> the lab cookie is not HttpOnly, so the XSS payload can read it through <code>document.cookie</code>.</p>
        <p><strong>Protected mode:</strong> the lab cookie is HttpOnly, so the same payload cannot read that cookie.</p>
        <button type="button" onClick={() => void clearLab()} disabled={loading} style={{ padding: 10 }}>Clear Lab Cookie</button>
      </section>
    </main>
  );
}
