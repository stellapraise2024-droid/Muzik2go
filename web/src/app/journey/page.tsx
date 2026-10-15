"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";

interface Milestone {
  id: string;
  label: string;
  date: string;
}

interface JourneyData {
  milestones: Milestone[];
  stats: {
    totalProjects: number;
    totalTakes: number;
    totalPracticeSessions: number;
    totalAnalyses: number;
  };
}

export default function Journey() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journey")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/journey" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Your Journey</h1>
        {loading ? (
          <p style={{ color: "#C7CDD6", marginTop: 20 }}>Loading…</p>
        ) : !data ? (
          <p style={{ color: "#C7CDD6", marginTop: 20 }}>Sign in to see your journey.</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 20 }}>
              <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#0AC8FF" }}>{data.stats.totalProjects}</p>
                <p style={{ color: "#C7CDD6", fontSize: 13 }}>Songs</p>
              </div>
              <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#FF8A1A" }}>{data.stats.totalTakes}</p>
                <p style={{ color: "#C7CDD6", fontSize: 13 }}>Takes</p>
              </div>
              <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#C8F04A" }}>{data.stats.totalPracticeSessions}</p>
                <p style={{ color: "#C7CDD6", fontSize: 13 }}>Practice</p>
              </div>
              <div style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#5B7CFF" }}>{data.stats.totalAnalyses}</p>
                <p style={{ color: "#C7CDD6", fontSize: 13 }}>AI analyses</p>
              </div>
            </div>

            <h2 style={{ marginTop: 32, fontSize: 20 }}>Milestones</h2>
            {data.milestones.length === 0 ? (
              <p style={{ color: "#C7CDD6", marginTop: 12 }}>Start creating to unlock milestones.</p>
            ) : (
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {data.milestones.map((m) => (
                  <div key={m.id} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{m.label}</span>
                    <span style={{ color: "#C7CDD6", fontSize: 13 }}>{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
