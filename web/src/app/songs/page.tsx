import SiteNav from "@/components/SiteNav";

// /songs — song projects list (renders real data once /api/projects is wired; empty until then).
export default function Songs() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/songs" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>My Songs</h1>
        <p style={{ color: "#C7CDD6" }}>No songs yet.</p>
        <a href="/studio" style={{ display: "inline-block", marginTop: 20, background: "#0AC8FF", color: "#062A3A", padding: "14px 28px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>+ Start a song</a>
      </section>
    </main>
  );
}
