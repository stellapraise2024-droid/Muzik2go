// /studio — opened after email exists OR account created. 5 tabs per IA.
export default function Studio() {
  const tabs = ["HOME", "STUDIO", "SONGS", "JOURNEY", "COMMUNITY"];
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <nav style={{ display: "flex", gap: 8, padding: 16, borderBottom: "1px solid #3A4A66" }}>
        {tabs.map((t, i) => (
          <span key={t} style={{ padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: i === 1 ? "#0AC8FF" : "#222E44", color: i === 1 ? "#062A3A" : "#C7CDD6" }}>{t}</span>
        ))}
      </nav>
      <section style={{ padding: 32, maxWidth: 800, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Welcome to your studio.</h1>
        <p style={{ color: "#C7CDD6" }}>Continue: My Love — Chorus development →</p>
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <a href="#" style={{ background: "#0AC8FF", color: "#062A3A", padding: "14px 24px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>Practice</a>
          <a href="#" style={{ background: "#FF8A1A", color: "#3A1E02", padding: "14px 24px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>● Record</a>
          <a href="#" style={{ background: "#5B7CFF", color: "#fff", padding: "14px 24px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>✦ Ask Coach</a>
        </div>
      </section>
    </main>
  );
}
