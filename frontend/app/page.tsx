"use client";

import { FormEvent, useEffect, useState } from "react";

type User = { username: string };
type SessionResponse = { authenticated: boolean; user?: User; sessionCreatedAt?: string };
type CookieInspection = {
  name: string; domain: string; path: string; secure: boolean; httpOnly: boolean;
  sameSite: string; expiration: string; persistent: boolean;
};
type InspectionResponse = {
  cookie: CookieInspection;
  analysis: Record<string, string>;
  session: { authenticated: boolean; username: string; createdAt: string };
};

const labels: Record<string, string> = {
  name: "Name", domain: "Domain", path: "Path", secure: "Secure",
  httpOnly: "HttpOnly", sameSite: "SameSite", expiration: "Expiration", persistent: "Persistent",
};

export default function Home() {
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("cookieguard");
  const [session, setSession] = useState<SessionResponse>({ authenticated: false });
  const [inspection, setInspection] = useState<InspectionResponse | null>(null);
  const [message, setMessage] = useState("Checking session...");
  const [loading, setLoading] = useState(false);

  async function loadSession() {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await response.json()) as SessionResponse;
      setSession(data);
      setMessage(data.authenticated ? "Session is active." : "No active session.");
    } catch { setMessage("Backend unavailable."); }
  }

  useEffect(() => { void loadSession(); }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("Signing in...");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = (await response.json()) as SessionResponse & { error?: string };
      if (!response.ok) { setMessage(data.error ?? "Login failed."); return; }
      setMessage("Login successful."); await loadSession();
    } catch { setMessage("Backend unavailable."); } finally { setLoading(false); }
  }

  async function handleLogout() {
    setLoading(true); setMessage("Signing out...");
    try { await fetch("/api/auth/logout", { method: "POST" }); setSession({ authenticated: false }); setInspection(null); setMessage("Logged out. Session ended."); }
    catch { setMessage("Backend unavailable."); } finally { setLoading(false); }
  }

  async function inspectCookie() {
    setLoading(true); setMessage("Inspecting session cookie...");
    try {
      const response = await fetch("/api/cookie-inspection", { cache: "no-store" });
      const data = (await response.json()) as InspectionResponse & { error?: string };
      if (!response.ok) { setMessage(data.error ?? "Cookie inspection failed."); return; }
      setInspection(data); setMessage("Cookie inspection complete.");
    } catch { setMessage("Backend unavailable."); } finally { setLoading(false); }
  }

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 48, fontFamily: "sans-serif" }}>
      <h1>CookieGuard</h1>
      <p>Interactive Cookie &amp; Session Security Lab</p><hr />
      {!session.authenticated ? (
        <section>
          <h2>Demo Login</h2><p>Use the local demo account to create a server-side session.</p>
          <form onSubmit={handleLogin} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
            <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }} /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }} /></label>
            <button type="submit" disabled={loading} style={{ padding: 10 }}>{loading ? "Working..." : "Log in"}</button>
          </form>
        </section>
      ) : (
        <>
          <section>
            <h2>Authenticated</h2>
            <p>Signed in as <strong>{session.user?.username}</strong>.</p>
            <p>Server session created: {session.sessionCreatedAt ?? "unknown"}</p>
            <button type="button" onClick={inspectCookie} disabled={loading} style={{ padding: 10, marginRight: 8 }}>{loading ? "Working..." : "Inspect Session Cookie"}</button>
            <button type="button" onClick={handleLogout} disabled={loading} style={{ padding: 10 }}>Log out</button>
          </section>
          {inspection && (
            <section style={{ marginTop: 32 }}>
              <h2>Cookie Inspection</h2>
              <p>These are the session-cookie attributes configured by the CookieGuard lab.</p>
              <div style={{ border: "1px solid #ccc", borderRadius: 8, overflow: "hidden" }}>
                {Object.entries(inspection.cookie).map(([key, value]) => (
                  <div key={key} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, padding: 12, borderBottom: "1px solid #eee" }}>
                    <strong>{labels[key] ?? key}</strong><span>{typeof value === "boolean" ? (value ? "Enabled" : "Disabled") : value}</span>
                  </div>
                ))}
              </div>
              <h3>Security Analysis</h3>
              {Object.entries(inspection.analysis).map(([key, text]) => <p key={key}><strong>{labels[key] ?? key}:</strong> {text}</p>)}
              <h3>Session</h3><p>Authenticated as <strong>{inspection.session.username}</strong>.</p>
            </section>
          )}
        </>
      )}
      <p role="status" style={{ marginTop: 24 }}>{message}</p>
    </main>
  );
}
