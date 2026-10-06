import SiteNav from "@/components/SiteNav";

// /studio — hub: each card opens its working space.
const SECTIONS = [
  { href: "/studio/practice", label: "Practice" },
  { href: "/studio/record", label: "● Record" },
  { href: "/studio/develop", label: "Develop" },
  { href: "/studio/improve", label: "✦ Improve" },
];

export default function Studio() {
  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Welcome to your studio.</h1>
        <p style={{ color: "#C7CDD6" }}><a href="/songs" style={{ color: "#0AC8FF" }}>Open My Songs →</a></p>
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, color: "#F2F5F9", textDecoration: "none" }}>
              <b>{s.label} →</b>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
