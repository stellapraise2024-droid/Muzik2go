"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import { getSong, deleteSong, type Song } from "@/lib/songs";

const ACTIONS = [
  { href: "practice", label: "Practice", bg: "#0AC8FF", fg: "#062A3A" },
  { href: "record", label: "● Record", bg: "#FF8A1A", fg: "#3A1E02" },
  { href: "develop", label: "Develop", bg: "#222E44", fg: "#F2F5F9" },
  { href: "improve", label: "✦ Improve", bg: "#5B7CFF", fg: "#fff" },
];

// /songs/[id] — one song: what to do with it.
export default function SongDetail({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null | undefined>(undefined);

  useEffect(() => setSong(getSong(params.id)), [params.id]);

  if (song === undefined) return <main style={{ background: "#121A26", minHeight: "100vh" }} />;
  if (song === null)
    return (
      <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
        <SiteNav active="/songs" />
        <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
          <h1 style={{ fontSize: 28 }}>Song not found.</h1>
          <a href="/songs" style={{ color: "#0AC8FF" }}>← My Songs</a>
        </section>
      </main>
    );

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/songs" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <a href="/songs" style={{ color: "#C7CDD6", fontSize: 13 }}>← My Songs</a>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>{song.title}</h1>
        <p style={{ color: "#C7CDD6" }}>{song.recordings.length} recording{song.recordings.length === 1 ? "" : "s"}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          {ACTIONS.map((a) => (
            <a key={a.href} href={`/studio/${a.href}?song=${song.id}`} style={{ background: a.bg, color: a.fg, padding: "14px 24px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>{a.label}</a>
          ))}
        </div>
        <button
          onClick={() => { if (window.confirm(`Delete “${song.title}”?`)) { deleteSong(song.id); window.location.href = "/songs"; } }}
          style={{ marginTop: 32, background: "transparent", border: "1px solid #3A4A66", color: "#C7CDD6", borderRadius: 8, padding: "10px 18px" }}
        >
          Delete song
        </button>
      </section>
    </main>
  );
}
