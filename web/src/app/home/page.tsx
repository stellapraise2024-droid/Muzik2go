import SiteNav from "@/components/SiteNav";

// /home — dashboard: quick actions, continue working, recent work, progress snapshot.
const QUICK = [
  { href: "/studio/practice", label: "Practice", bg: "#0AC8FF", fg: "#062A3A" },
  { href: "/studio/record", label: "● Record", bg: "#FF8A1A", fg: "#3A1E02" },
  { href: "/songs", label: "My Songs", bg: "#222E44", fg: "#F2F5F9" },
  { href: "/studio/improve", label: "✦ Ask Coach", bg: "#5B7CFF", fg: "#fff" },
];

export default function Home() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/home" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Good to see you. Keep creating.</h1>
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          {QUICK.map((q) => (
            <a key={q.label} href={q.href} style={{ background: q.bg, color: q.fg, padding: "14px 24px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>{q.label}</a>
          ))}
        </div>
        <h2 style={{ marginTop: 32, fontSize: 20 }}>Continue working</h2>
        <a href="/songs" style={{ display: "block", marginTop: 12, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, color: "#F2F5F9", textDecoration: "none" }}>
          <b>My Songs →</b>
          <p style={{ color: "#C7CDD6", fontSize: 14 }}>No songs yet.</p>
        </a>
        <h2 style={{ marginTop: 32, fontSize: 20 }}>Your progress</h2>
        <a href="/journey" style={{ display: "block", marginTop: 12, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, color: "#F2F5F9", textDecoration: "none" }}>
          <p style={{ color: "#C7CDD6", fontSize: 14 }}>Your Journey →</p>
        </a>
      </section>
    </main>
  );
}
