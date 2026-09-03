"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("Backend request failed");
        return response.json() as Promise<{ status: string }>;
      })
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Backend unavailable"));
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 48, fontFamily: "sans-serif" }}>
      <h1>CookieGuard</h1>
      <p>Interactive Cookie &amp; Session Security Lab</p>
      <hr />
      <h2>Development Environment</h2>
      <p>Frontend: running</p>
      <p>Backend: {status}</p>
    </main>
  );
}
