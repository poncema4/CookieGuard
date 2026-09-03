"use client";

import { FormEvent, useEffect, useState } from "react";

type User = { username: string };
type SessionResponse = {
  authenticated: boolean;
  user?: User;
  sessionCreatedAt?: string;
};

export default function Home() {
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("cookieguard");
  const [session, setSession] = useState<SessionResponse>({ authenticated: false });
  const [message, setMessage] = useState("Checking session...");
  const [loading, setLoading] = useState(false);

  async function loadSession() {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await response.json()) as SessionResponse;
      setSession(data);
      setMessage(data.authenticated ? "Session is active." : "No active session.");
    } catch {
      setMessage("Backend unavailable.");
    }
  }

  useEffect(() => {
    void loadSession();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Signing in...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as SessionResponse & { error?: string };

      if (!response.ok) {
        setMessage(data.error ?? "Login failed.");
        return;
      }

      setMessage("Login successful.");
      await loadSession();
    } catch {
      setMessage("Backend unavailable.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setMessage("Signing out...");

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession({ authenticated: false });
      setMessage("Logged out. Session ended.");
    } catch {
      setMessage("Backend unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 48, fontFamily: "sans-serif" }}>
      <h1>CookieGuard</h1>
      <p>Interactive Cookie &amp; Session Security Lab</p>
      <hr />

      {!session.authenticated ? (
        <section>
          <h2>Demo Login</h2>
          <p>Use the local demo account to create a server-side session.</p>
          <form onSubmit={handleLogin} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
            <label>
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
            <button type="submit" disabled={loading} style={{ padding: 10 }}>
              {loading ? "Working..." : "Log in"}
            </button>
          </form>
        </section>
      ) : (
        <section>
          <h2>Authenticated</h2>
          <p>Signed in as <strong>{session.user?.username}</strong>.</p>
          <p>Server session created: {session.sessionCreatedAt ?? "unknown"}</p>
          <button type="button" onClick={handleLogout} disabled={loading} style={{ padding: 10 }}>
            {loading ? "Working..." : "Log out"}
          </button>
        </section>
      )}

      <p role="status" style={{ marginTop: 24 }}>{message}</p>
    </main>
  );
}
