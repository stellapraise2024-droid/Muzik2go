import SiteNav from "@/components/SiteNav";

// /community — Learn, Collaborate, Feedback, Challenges. Optional; private-by-default always.
export default function Community() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/community" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Community</h1>
        <p style={{ color: "#C7CDD6" }}>Optional. Your work stays private unless you share it.</p>
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {["Learn", "Collaborate", "Feedback", "Challenges"].map((t) => (
            <div key={t} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
              <b>{t}</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
