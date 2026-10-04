import SiteNav from "@/components/SiteNav";

// /songs — My Songs: every song as a living project (title, stage, sections, takes, updated).
const SONGS = [
  { title: "My Love", stage: "demo", note: "Chorus development · Verse T2 · Chorus T4 · edited 2h ago" },
  { title: "Midnight Hum", stage: "idea", note: "Voice memo + lyric sketch · yesterday" },
  { title: "Streetlight", stage: "finished", note: "Polished + exported MP3 · last week" },
];

export default function Songs() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/songs" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>My Songs</h1>
        <p style={{ color: "#C7CDD6" }}>Living projects — idea → takes → analysis → improved → final.</p>
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {SONGS.map((s) => (
            <a key={s.title} href="/studio" style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, color: "#F2F5F9", textDecoration: "none" }}>
              <b>{s.title}</b> <span style={{ background: s.stage === "finished" ? "#C8F04A" : "#0AC8FF", color: "#062A3A", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{s.stage}</span>
              <p style={{ color: "#C7CDD6", fontSize: 14 }}>{s.note} →</p>
            </a>
          ))}
        </div>
        <a href="/studio" style={{ display: "inline-block", marginTop: 20, background: "#0AC8FF", color: "#062A3A", padding: "14px 28px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>+ Start a song</a>
      </section>
    </main>
  );
}
