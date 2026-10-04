import SiteNav from "@/components/SiteNav";

// /journey — Artist Journey: voice snapshot, milestones, before/after. A musical journey, not a report.
export default function Journey() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/journey" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Your Journey</h1>
        <p style={{ color: "#C7CDD6" }}>Hear how far you’ve come.</p>
        <div style={{ marginTop: 20, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
          <b>My Voice snapshot</b>
          <p style={{ fontFamily: "monospace", fontSize: 13 }}>Range C3–C5 · strengths: chorus stability · focus: line-2 final (-40c)</p>
        </div>
        <div style={{ marginTop: 12, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
          <b>Milestones</b>
          <p style={{ color: "#C7CDD6", fontSize: 14 }}>★ First song finished · ★ 10 sessions · ○ 30-day streak</p>
        </div>
        <div style={{ marginTop: 12, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
          <b>Before / After</b>
          <p style={{ fontFamily: "monospace", fontSize: 13 }}>Chorus Take 1 → Take 4 · <u>play both</u></p>
        </div>
      </section>
    </main>
  );
}
