"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Start() {
  const [step, setStep] = useState<"email" | "password" | "signup">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("password");
    setMsg("");
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("Opening your studio…");
    const { error } = await authClient.signIn.email({ email: email.trim(), password });
    setBusy(false);
    if (!error) {
      window.location.href = "/studio";
      return;
    }
    const message = error.message || String(error);
    if (/invalid|wrong|incorrect/i.test(message)) {
      setStep("signup");
      setMsg("No account with that password — finish creating yours below.");
      return;
    }
    setMsg(`Error: ${message}`);
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("Creating your account…");
    const { error } = await authClient.signUp.email({ email: email.trim(), name: name.trim() || email.trim(), password });
    setBusy(false);
    if (!error) {
      window.location.href = "/studio";
      return;
    }
    setMsg(`Error: ${error.message || String(error)}`);
  }

  const box: React.CSSProperties = { background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui", display: "grid", placeItems: "center", padding: 24 };
  const card: React.CSSProperties = { background: "#222E44", border: "1px solid #3A4A66", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440 };
  const input: React.CSSProperties = { width: "100%", height: 48, borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", padding: "0 14px", marginTop: 8 };
  const btn: React.CSSProperties = { width: "100%", height: 52, marginTop: 16, borderRadius: 12, border: "none", fontWeight: 800, fontSize: 16 };

  return (
    <main style={box}>
      <div style={card}>
        <b>Muzik2Go</b>
        <h1 style={{ fontSize: 28, margin: "8px 0" }}>Start your creation</h1>
        <p style={{ color: "#C7CDD6" }}>Put in your email to open your studio.</p>
        <form onSubmit={submitEmail} style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13 }}>Email</label>
          <input style={input} type="email" required value={email} onChange={(e) => { setEmail(e.target.value); }} placeholder="you@studio.com" />
          {step === "email" && <button style={{ ...btn, background: "#0AC8FF", color: "#062A3A" }}>Continue →</button>}
        </form>
        {step !== "email" && (
          <form onSubmit={signIn} style={{ marginTop: 12 }}>
            <label style={{ fontSize: 13 }}>Password</label>
            <input style={input} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            {step === "password" && <button disabled={busy} style={{ ...btn, background: "#0AC8FF", color: "#062A3A" }}>{busy ? "Opening…" : "Open my studio →"}</button>}
          </form>
        )}
        {step === "signup" && (
          <form onSubmit={signUp} style={{ marginTop: 12, borderTop: "1px solid #3A4A66", paddingTop: 16 }}>
            <label style={{ fontSize: 13 }}>Display name</label>
            <input style={input} required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your artist name" />
            <button disabled={busy} style={{ ...btn, background: "#C8F04A", color: "#243000" }}>{busy ? "Creating…" : "Create account & open studio →"}</button>
          </form>
        )}
        {msg && <p style={{ color: msg.startsWith("Error:") ? "#FF453A" : "#8A94A8", fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{msg}</p>}
        <a href="/" style={{ color: "#C7CDD6", fontSize: 13 }}>← Back</a>
      </div>
    </main>
  );
}
