"use client";

import { FormEvent, useEffect, useState } from "react";

type User = { username: string };
type SessionResponse = { authenticated: boolean; user?: User; sessionCreatedAt?: string };
type CookieInspection = { name: string; domain: string; path: string; secure: boolean; httpOnly: boolean; sameSite: string; expiration: string; persistent: boolean };
type InspectionResponse = { cookie: CookieInspection; analysis: Record<string, string>; session: { authenticated: boolean; username: string; createdAt: string } };
const labels: Record<string, string> = { name:"Name", domain:"Domain", path:"Path", secure:"Secure", httpOnly:"HttpOnly", sameSite:"SameSite", expiration:"Expiration", persistent:"Persistent" };

export default function Home() {
  const [username,setUsername]=useState("demo"); const [password,setPassword]=useState("cookieguard");
  const [session,setSession]=useState<SessionResponse>({authenticated:false}); const [inspection,setInspection]=useState<InspectionResponse|null>(null);
  const [message,setMessage]=useState("Checking session..."); const [loading,setLoading]=useState(false);
  async function loadSession(){try{const response=await fetch("/api/auth/session",{cache:"no-store"});if(response.status===401){setSession({authenticated:false});setInspection(null);setMessage("No active session.");return}if(!response.ok){setMessage("Unable to check session.");return}const data=(await response.json()) as SessionResponse;setSession(data);setMessage(data.authenticated?"Session is active.":"No active session.")}catch{setMessage("Backend unavailable.")}}
  useEffect(()=>{void loadSession()},[]);
  async function handleLogin(event:FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage("Signing in...");try{const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});const data=(await response.json()) as SessionResponse&{error?:string};if(!response.ok){setMessage(data.error??"Login failed.");return}setMessage("Login successful.");await loadSession()}catch{setMessage("Backend unavailable.")}finally{setLoading(false)}}
  async function handleLogout(){setLoading(true);setMessage("Signing out...");try{await fetch("/api/auth/logout",{method:"POST"});setSession({authenticated:false});setInspection(null);setMessage("Logged out. Session ended.")}catch{setMessage("Backend unavailable.")}finally{setLoading(false)}}
  async function inspectCookie(){setLoading(true);setMessage("Inspecting session cookie...");try{const response=await fetch("/api/cookie-inspection",{cache:"no-store"});const data=(await response.json()) as InspectionResponse&{error?:string};if(!response.ok){setMessage(data.error??"Cookie inspection failed.");return}setInspection(data);setMessage("Cookie inspection complete.")}catch{setMessage("Backend unavailable.")}finally{setLoading(false)}}
  return <main className="page">
    <section>
      <div className="eyebrow">Web session security laboratory</div>
      <h1>See the cookie.<br/>Understand the risk.</h1>
      <p className="hero-copy">CookieGuard turns browser security controls into controlled experiments. Create a session, inspect what the browser receives, then explore how individual controls change real application behavior.</p>
      <div className="hero-meta"><span className="pill ok">● Local lab</span><span className="pill">HTTPS enabled</span><span className="pill">No external services</span></div>
    </section>

    <section className="section">
      <div className="section-head"><div><div className="eyebrow">Session</div><h2>Start with a real browser session</h2></div><p>The authenticated session uses a server-side record and a protected browser cookie.</p></div>
      {!session.authenticated ? <div className="panel login"><form onSubmit={handleLogin} style={{display:"grid",gap:14}}><label className="field">Username<input className="input" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username"/></label><label className="field">Password<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label><button className="btn primary" type="submit" disabled={loading}>{loading?"Signing in…":"Create session"}</button></form></div> : <div className="panel"><div className="split"><div><div className="eyebrow">Authenticated</div><h2>{session.user?.username}</h2><p>Session created {session.sessionCreatedAt ?? "unknown"}.</p></div><div><div className="control-row"><button className="btn primary" onClick={()=>void inspectCookie()} disabled={loading}>{loading?"Working…":"Inspect session cookie"}</button><button className="btn danger" onClick={()=>void handleLogout()} disabled={loading}>Log out</button></div><div className="status" role="status">{message}</div></div></div></div>}
    </section>

    <section className="section"><div className="section-head"><div><div className="eyebrow">Experiments</div><h2>Choose a security control</h2></div><p>Each lab isolates one browser security mechanism so the before-and-after behavior is easy to observe.</p></div>
      <div className="lab-grid">
        <a className="lab-card" href="/xss-lab"><span className="lab-index">01 / COOKIE ACCESS</span><h3>HttpOnly + XSS</h3><p>Compare the same XSS payload against a readable and protected demonstration cookie.</p><span className="card-arrow">→</span></a>
        <a className="lab-card" href="/csrf-lab"><span className="lab-index">02 / REQUEST ORIGIN</span><h3>SameSite + CSRF</h3><p>Observe why a cross-site state-changing request loses access to a SameSite cookie.</p><span className="card-arrow">→</span></a>
        <a className="lab-card" href="/secure-lab"><span className="lab-index">03 / TRANSPORT</span><h3>Secure + HTTPS</h3><p>Connect transport encryption with the browser rule that protects cookies in transit.</p><span className="card-arrow">→</span></a>
      </div>
    </section>

    {inspection && <section className="section"><div className="section-head"><div><div className="eyebrow">Inspection result</div><h2>Session cookie configuration</h2></div><p>Values below are returned by the backend configuration used by the authenticated session.</p></div><div className="panel"><div className="data-table">{Object.entries(inspection.cookie).map(([key,value])=><div className="data-row" key={key}><span className="data-key">{labels[key]??key}</span><span className="data-value">{typeof value==="boolean"?(value?"Enabled":"Disabled"):value}</span></div>)}</div><div className="section" style={{marginTop:28}}><h3>Security analysis</h3>{Object.entries(inspection.analysis).map(([key,text])=><p key={key}><strong>{labels[key]??key}:</strong> {text}</p>)}</div></div></section>}
    <p className="status" role="status">{message}</p>
  </main>;
}
