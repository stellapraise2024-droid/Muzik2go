// Muzik2Go landing — first thing seen. Foil palette flat, no gradients.
// Hero: "Your Studio, Anywhere." + "Bring whatever you have. We help you take it further."
// CTA: "Start your creation" → /start (email gate).
export default function Landing() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #3A4A66" }}>
        <b>Muzik2Go</b>
        <a href="/start" style={{ background: "#0AC8FF", color: "#062A3A", padding: "10px 20px", borderRadius: 8, fontWeight: 800, textDecoration: "none" }}>Start your creation</a>
      </nav>
      <section style={{ padding: "72px 32px", maxWidth: 900, margin: "auto", textAlign: "center" }}>
        <span style={{ background: "#5B7CFF", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>AI STUDIO · VOICE · SONGS · RECORD</span>
        <h1 style={{ fontSize: 56, margin: "20px 0 12px", lineHeight: 1.05 }}>Your Studio,<br />Anywhere.</h1>
        <p style={{ color: "#C7CDD6", fontSize: 20 }}>Bring whatever you have — a hum, a lyric, a beat, a rough demo.<br />Muzik2Go helps you practice, record, analyze and finish it.</p>
        <div style={{ marginTop: 28 }}>
          <a href="/start" style={{ background: "#0AC8FF", color: "#062A3A", padding: "16px 36px", borderRadius: 12, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>Start your creation</a>
          <p style={{ color: "#8A94A8", fontSize: 13, marginTop: 12 }}>Free to start · Private by default · No studio needed</p>
        </div>
      </section>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, padding: "0 32px 64px", maxWidth: 1000, margin: "auto" }}>
        {[["Practice", "Warm-ups + AI vocal coach that explains, never just scores."], ["Record", "Acapella or over your beat. Takes kept, never overwritten."], ["Analyze", "Pitch + timing in plain language with 1-tap fix."], ["Finish", "Polish, Original vs Improved A/B, export WAV/MP3."]].map(([t, d]) => (
          <div key={t} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
            <b>{t}</b><p style={{ color: "#C7CDD6", fontSize: 14, marginTop: 6 }}>{d}</p>
          </div>
        ))}
      </section>
      <section style={{ textAlign: "center", padding: "0 32px 72px" }}>
        <p style={{ color: "#C7CDD6" }}>Create → Practice → Record → Analyze → Improve → Finish</p>
        <a href="/start" style={{ display: "inline-block", marginTop: 16, background: "#FF8A1A", color: "#3A1E02", padding: "14px 32px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>Start your creation</a>
      </section>
    </main>
  );
}
