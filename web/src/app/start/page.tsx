"use client";
import { useState } from "react";

// /start — email gate: email → Start → if exists open /studio, else reveal name+password → create → /studio.
export default function Start() {
  const [email, setEmail] = useState("");
  const [needsSignup, setNeedsSignup] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Checking...");
    const r = await fetch("/api/auth-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const j = await r.json();
    if (j.exists) { window.location.href = "/studio"; return; }
    setNeedsSignup(true);
    setMsg("New here — finish your account to open your studio.");
  }

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Creating...");
    // TODO: better-auth signUp.email({email, password, name}) → on success /studio
    window.location.href = "/studio";
  }

  const box: React.CSSProperties = { background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui", display: "grid", placeItems: "center", padding: 24 };
  const card: React.CSSProperties = { background: "#222E44", border: "1px solid #3A4A66", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440 };
  const input: React.CSSProperties = { width: "100%", height: 48, borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", padding: "0 14px", marginTop: 8 };

  return (
    <main style={box}>
      <div style={card}>
        <b>Muzik2Go</b>
        <h1 style={{ fontSize: 28, margin: "8px 0" }}>Start your creation</h1>
        <p style={{ color: "#C7CDD6" }}>Put in your email to open your studio.</p>
        <form onSubmit={submitEmail} style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13 }}>Email</label>
          <input style={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
          {!needsSignup && <button style={{ width: "100%", height: 52, marginTop: 16, borderRadius: 12, border: "none", background: "#0AC8FF", color: "#062A3A", fontWeight: 800, fontSize: 16 }}>Continue →</button>}
        </form>
        {needsSignup && (
          <form onSubmit={createAccount} style={{ marginTop: 16, borderTop: "1px solid #3A4A66", paddingTop: 16 }}>
            <label style={{ fontSize: 13 }}>Display name</label>
            <input style={input} required value={name} onChange={(e) => setName(e.target.value)} placeholder="Stella" />
            <label style={{ fontSize: 13, display: "block", marginTop: 12 }}>Password</label>
            <input style={input} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <button style={{ width: "100%", height: 52, marginTop: 16, borderRadius: 12, border: "none", background: "#C8F04A", color: "#243000", fontWeight: 800, fontSize: 16 }}>Create account & open studio →</button>
          </form>
        )}
        <p style={{ color: "#8A94A8", fontSize: 12, marginTop: 12 }}>{msg}</p>
        <a href="/" style={{ color: "#C7CDD6", fontSize: 13 }}>← Back</a>
      </div>
    </main>
  );
}
