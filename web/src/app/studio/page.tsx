import SiteNav from "@/components/SiteNav";

// /studio — working environment: Practice / Record / Develop / Improve sections, all navigable.
const SECTIONS = [
  { title: "Practice", desc: "Warm-ups + guided exercises + Ask Coach", bg: "#0AC8FF", fg: "#062A3A" },
  { title: "● Record", desc: "Acapella or over your beat · takes kept", bg: "#FF8A1A", fg: "#3A1E02" },
  { title: "Develop", desc: "Lyrics + structure + arrangement ideas", bg: "#222E44", fg: "#F2F5F9" },
  { title: "✦ Improve", desc: "Analyze → Polish → Original vs Improved", bg: "#5B7CFF", fg: "#fff" },
];

export default function Studio() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Welcome to your studio.</h1>
        <p style={{ color: "#C7CDD6" }}>Continue: <a href="/songs" style={{ color: "#0AC8FF" }}>My Love — Chorus development →</a></p>
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {SECTIONS.map((s) => (
            <div key={s.title} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
              <span style={{ background: s.bg, color: s.fg, padding: "6px 14px", borderRadius: 8, fontWeight: 800 }}>{s.title}</span>
              <p style={{ color: "#C7CDD6", fontSize: 14, marginTop: 8 }}>{s.desc} — in beta via mobile + API</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
