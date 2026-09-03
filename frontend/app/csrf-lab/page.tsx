"use client";

import { useState } from "react";

const TARGET_ORIGIN = "http://127.0.0.1:4000";

export default function CsrfLabPage() {
  const [sameSite, setSameSite] = useState<"Lax" | "Strict">("Lax");

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 48, fontFamily: "sans-serif" }}>
      <a href="/">← Back to CookieGuard</a>
      <h1>SameSite + CSRF Lab</h1>
      <p>
        This controlled lab shows how SameSite changes whether a browser sends a
        cookie with a cross-site state-changing POST request.
      </p>

      <section style={{ marginTop: 28, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>1. Configure the lab cookie</h2>
        <p>
          The CSRF lab uses a separate cookie on <code>127.0.0.1:4000</code> so the
          real CookieGuard authentication session is never weakened.
        </p>
        <label>
          SameSite mode:{" "}
          <select value={sameSite} onChange={(event) => setSameSite(event.target.value as "Lax" | "Strict")}>
            <option value="Lax">Lax</option>
            <option value="Strict">Strict</option>
          </select>
        </label>
        <p>
          <a href={`${TARGET_ORIGIN}/api/csrf-lab/setup?sameSite=${sameSite}`} target="_blank" rel="noreferrer">
            Configure SameSite={sameSite} cookie
          </a>
        </p>
      </section>

      <section style={{ marginTop: 28, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>2. Confirm a same-site POST</h2>
        <p>
          Open the target site's own form. The POST originates from the same site,
          so the lab cookie is eligible to accompany the request.
        </p>
        <a href={`${TARGET_ORIGIN}/api/csrf-lab/same-site`} target="_blank" rel="noreferrer">
          Open same-site test
        </a>
      </section>

      <section style={{ marginTop: 28, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>3. Run the cross-site POST</h2>
        <p>
          The form below is served by <code>localhost:3000</code> but submits to
          <code>127.0.0.1:4000</code>. That makes it a controlled cross-site request.
        </p>
        <form method="POST" action={`${TARGET_ORIGIN}/api/csrf-lab/action`} target="_blank">
          <button type="submit" style={{ padding: 10 }}>Run Cross-Site POST</button>
        </form>
        <p style={{ marginTop: 16 }}>
          Expected result with <strong>SameSite={sameSite}</strong>: the lab cookie is
          not sent with the cross-site POST, so the server should return
          <strong> BLOCKED</strong>.
        </p>
      </section>

      <section style={{ marginTop: 28, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>4. Clear the lab cookie</h2>
        <a href={`${TARGET_ORIGIN}/api/csrf-lab/clear`} target="_blank" rel="noreferrer">
          Clear CSRF lab cookie
        </a>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>What this demonstrates</h2>
        <ul>
          <li>SameSite=Lax prevents the lab cookie from being sent with a cross-site POST.</li>
          <li>SameSite=Strict also prevents the lab cookie from being sent cross-site.</li>
          <li>A same-site POST can still include the cookie.</li>
          <li>The real <code>cookieguard_session</code> remains unchanged throughout the lab.</li>
        </ul>
      </section>
    </main>
  );
}
