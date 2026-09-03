"use client";
import { useState } from "react";

const TARGET_ORIGIN = process.env.NEXT_PUBLIC_COOKIEGUARD_BACKEND_ORIGIN ?? "https://127.0.0.1:4443";

export default function CsrfLabPage() {
  const [sameSite, setSameSite] = useState<"Lax" | "Strict">("Lax");

  return (
    <main className="page">
      <a className="back" href="/">← Back to overview</a>
      <div className="eyebrow">Experiment 02 · Request origin</div>
      <h1>SameSite + CSRF</h1>
      <p className="hero-copy">Change one browser policy and observe how it affects a cross-site state-changing request.</p>
      <div className="callout">
        <p>The lab cookie uses the separate backend target origin. Your real authenticated CookieGuard session remains untouched.</p>
      </div>

      <section className="section">
        <div className="panel">
          <div className="step">
            <span className="step-num">01</span>
            <div>
              <h2>Configure the lab cookie</h2>
              <p>Choose the SameSite policy, then open the configuration endpoint.</p>
              <div className="control-row">
                <select
                  className="select"
                  style={{ width: "auto" }}
                  value={sameSite}
                  onChange={(event) => setSameSite(event.target.value as "Lax" | "Strict")}
                >
                  <option value="Lax">SameSite=Lax</option>
                  <option value="Strict">SameSite=Strict</option>
                </select>
                <a
                  className="btn primary"
                  href={`${TARGET_ORIGIN}/api/csrf-lab/setup?sameSite=${sameSite}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Configure cookie →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="step">
            <span className="step-num">02</span>
            <div>
              <h2>Confirm same-site behavior</h2>
              <p>The target site's own form represents a same-site POST, where the cookie is eligible to accompany the request.</p>
              <a className="btn" href={`${TARGET_ORIGIN}/api/csrf-lab/same-site`} target="_blank" rel="noreferrer">
                Open same-site test →
              </a>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="step">
            <span className="step-num">03</span>
            <div style={{ width: "100%" }}>
              <h2>Run the cross-site POST</h2>
              <p>This form originates on CookieGuard and submits to the separate target origin.</p>
              <form method="POST" action={`${TARGET_ORIGIN}/api/csrf-lab/action`} target="_blank">
                <button className="btn primary" type="submit">Run cross-site POST</button>
              </form>
              <div className="status" style={{ marginTop: 16 }}>
                Expected with SameSite={sameSite}: <strong>BLOCKED</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="step">
            <span className="step-num">04</span>
            <div>
              <h2>Reset</h2>
              <p>Remove the separate lab cookie when finished.</p>
              <a className="btn" href={`${TARGET_ORIGIN}/api/csrf-lab/clear`} target="_blank" rel="noreferrer">
                Clear lab cookie →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
