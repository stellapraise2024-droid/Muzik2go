import SiteNav from "@/components/SiteNav";

// /studio — working environment: Practice / Record / Develop / Improve sections, all navigable.
const SECTIONS = ["Practice", "● Record", "Develop", "✦ Improve"];

export default function Studio() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Welcome to your studio.</h1>
        <p style={{ color: "#C7CDD6" }}><a href="/songs" style={{ color: "#0AC8FF" }}>Open My Songs →</a></p>
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {SECTIONS.map((s) => (
            <div key={s} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
              <b>{s}</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
