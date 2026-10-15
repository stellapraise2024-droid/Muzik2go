"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";

const SECTIONS = [
  { title: "Learn", desc: "Vocal lessons, exercises and guided practice programs.", bg: "#0AC8FF", fg: "#062A3A" },
  { title: "Collaborate", desc: "Invite singers, songwriters and producers to your projects.", bg: "#5B7CFF", fg: "#fff" },
  { title: "Feedback", desc: "Share takes and get specific, actionable feedback.", bg: "#222E44", fg: "#F2F5F9" },
  { title: "Challenges", desc: "Singing and songwriting challenges with the community.", bg: "#FF8A1A", fg: "#3A1E02" },
];

export default function Community() {
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d && typeof d.count === "number") setFeedbackCount(d.count); })
      .catch(() => {});
  }, []);

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/community" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>Community</h1>
        <p style={{ color: "#C7CDD6" }}>
          Optional. Your work stays private unless you share it.
          {feedbackCount !== null && feedbackCount > 0 && (
            <> <b style={{ color: "#0AC8FF" }}>{feedbackCount}</b> piece{feedbackCount === 1 ? "" : "s"} of feedback shared.</>
          )}
        </p>
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {SECTIONS.map((s) => (
            <div key={s.title} style={{ background: s.bg, color: s.fg, borderRadius: 12, padding: 20 }}>
              <b style={{ fontSize: 18 }}>{s.title}</b>
              <p style={{ fontSize: 14, marginTop: 4, opacity: 0.85 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
