"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";

const SECTIONS = [
  { href: "/studio/practice", label: "Practice", desc: "Warm up with metronome and reference tones", bg: "#0AC8FF", fg: "#062A3A" },
  { href: "/studio/record", label: "● Record", desc: "Capture vocals over your beat or acapella", bg: "#FF8A1A", fg: "#3A1E02" },
  { href: "/studio/develop", label: "Develop", desc: "Write lyrics and structure", bg: "#222E44", fg: "#F2F5F9" },
  { href: "/studio/improve", label: "✦ Improve", desc: "Compare takes and get AI feedback", bg: "#5B7CFF", fg: "#fff" },
];

export default function Studio() {
  const [songCount, setSongCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.ok ? r.json() : { projects: [] })
      .then((d) => setSongCount((d.projects || []).length))
      .catch(() => {});
  }, []);

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Welcome to your studio.</h1>
        <p style={{ color: "#C7CDD6" }}>
          {songCount !== null && songCount > 0
            ? <>You have <b style={{ color: "#0AC8FF" }}>{songCount}</b> song{songCount === 1 ? "" : "s"}. <a href="/songs" style={{ color: "#0AC8FF" }}>Open My Songs →</a></>
            : <a href="/songs" style={{ color: "#0AC8FF" }}>Create your first song →</a>}
        </p>
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} style={{ background: s.bg, color: s.fg, borderRadius: 12, padding: 20, textDecoration: "none" }}>
              <b style={{ fontSize: 18 }}>{s.label} →</b>
              <p style={{ fontSize: 14, marginTop: 4, opacity: 0.85 }}>{s.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
