"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";

const QUICK = [
  { href: "/studio/practice", label: "Practice", bg: "#0AC8FF", fg: "#062A3A" },
  { href: "/studio/record", label: "● Record", bg: "#FF8A1A", fg: "#3A1E02" },
  { href: "/songs", label: "My Songs", bg: "#222E44", fg: "#F2F5F9" },
  { href: "/studio/improve", label: "✦ Ask Coach", bg: "#5B7CFF", fg: "#fff" },
];

interface Project {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface PracticeData {
  totalSessions: number;
  totalPracticeSec: number;
  streakDays: number;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [practice, setPractice] = useState<PracticeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.ok ? r.json() : { projects: [] }),
      fetch("/api/practices").then((r) => r.ok ? r.json() : null),
    ]).then(([proj, prac]) => {
      setProjects(proj.projects || []);
      setPractice(prac);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const recent = projects.slice(0, 3);
  const mins = practice ? Math.round(practice.totalPracticeSec / 60) : 0;

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
        {loading ? (
          <p style={{ color: "#C7CDD6", marginTop: 12 }}>Loading…</p>
        ) : recent.length === 0 ? (
          <a href="/songs" style={{ display: "block", marginTop: 12, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, color: "#F2F5F9", textDecoration: "none" }}>
            <b>My Songs →</b>
            <p style={{ color: "#C7CDD6", fontSize: 14 }}>No songs yet — create your first one.</p>
          </a>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {recent.map((p) => (
              <a key={p.id} href={`/songs/${p.id}`} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, color: "#F2F5F9", textDecoration: "none" }}>
                <b>{p.title}</b>
                <p style={{ color: "#C7CDD6", fontSize: 14 }}>{p.status} · {new Date(p.createdAt).toLocaleDateString()} →</p>
              </a>
            ))}
          </div>
        )}

        <h2 style={{ marginTop: 32, fontSize: 20 }}>Your progress</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 12 }}>
          <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: "#0AC8FF" }}>{projects.length}</p>
            <p style={{ color: "#C7CDD6", fontSize: 13 }}>Songs</p>
          </div>
          <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: "#FF8A1A" }}>{practice?.totalSessions ?? 0}</p>
            <p style={{ color: "#C7CDD6", fontSize: 13 }}>Practice sessions</p>
          </div>
          <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: "#C8F04A" }}>{practice?.streakDays ?? 0}</p>
            <p style={{ color: "#C7CDD6", fontSize: 13 }}>Day streak</p>
          </div>
          <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: "#5B7CFF" }}>{mins}</p>
            <p style={{ color: "#C7CDD6", fontSize: 13 }}>Minutes practiced</p>
          </div>
        </div>
      </section>
    </main>
  );
}
