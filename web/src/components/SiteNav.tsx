const TABS = [
  { href: "/home", label: "HOME" },
  { href: "/studio", label: "STUDIO" },
  { href: "/songs", label: "SONGS" },
  { href: "/journey", label: "JOURNEY" },
  { href: "/community", label: "COMMUNITY" },
];

export default function SiteNav({ active }: { active: string }) {
  return (
    <nav style={{ display: "flex", gap: 8, padding: 16, borderBottom: "1px solid #3A4A66", flexWrap: "wrap", background: "#1A2436" }}>
      <a href="/" style={{ color: "#F2F5F9", fontWeight: 800, textDecoration: "none", marginRight: 8 }}>Muzik2Go</a>
      {TABS.map((t) => (
        <a
          key={t.href}
          href={t.href}
          style={{
            padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none",
            background: t.href === active ? "#0AC8FF" : "#222E44",
            color: t.href === active ? "#062A3A" : "#C7CDD6",
          }}
        >
          {t.label}
        </a>
      ))}
    </nav>
  );
}
