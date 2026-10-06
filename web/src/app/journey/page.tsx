import SiteNav from "@/components/SiteNav";

// /journey — Artist Journey: voice snapshot, milestones, before/after. A musical journey, not a report.
export default function Journey() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/journey" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Your Journey</h1>
        <div style={{ marginTop: 20, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
          <b>My Voice</b>
          <p style={{ color: "#C7CDD6", fontSize: 14 }}>Nothing here yet.</p>
        </div>
        <div style={{ marginTop: 12, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
          <b>Milestones</b>
          <p style={{ color: "#C7CDD6", fontSize: 14 }}>Nothing here yet.</p>
        </div>
        <div style={{ marginTop: 12, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
          <b>Before / After</b>
          <p style={{ color: "#C7CDD6", fontSize: 14 }}>Nothing here yet.</p>
        </div>
      </section>
    </main>
  );
}
