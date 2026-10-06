"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import { loadSongs, type Song } from "@/lib/songs";

// /studio/improve — compare two takes side by side (real local playback).
// AI feedback calls /api/ai when available; otherwise says so plainly — never faked.
export default function Improve({ searchParams }: { searchParams: { song?: string } }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songId, setSongId] = useState(searchParams.song ?? "");
  const [aId, setAId] = useState("");
  const [bId, setBId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const all = loadSongs();
    setSongs(all);
    if (searchParams.song && all.some((s) => s.id === searchParams.song)) setSongId(searchParams.song);
  }, [searchParams.song]);

  const song = songs.find((s) => s.id === songId) ?? null;
  const recA = song?.recordings.find((r) => r.id === aId) ?? null;
  const recB = song?.recordings.find((r) => r.id === bId) ?? null;

  async function askCoach() {
    if (!song) return;
    setAsking(true);
    setFeedback("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: song.id, messages: [{ content: `My song "${song.title}" has ${song.recordings.length} take(s). What should I work on?` }] }),
      });
      const json = await res.json();
      setFeedback(res.ok && json.reply ? json.reply : "AI feedback is unavailable right now.");
    } catch {
      setFeedback("AI feedback is unavailable right now.");
    }
    setAsking(false);
  }

  const sel: React.CSSProperties = { width: "100%", height: 48, borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", marginTop: 8 };

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <a href="/studio" style={{ color: "#C7CDD6", fontSize: 13 }}>← Studio</a>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Improve</h1>
        <label style={{ fontSize: 13, color: "#C7CDD6" }}>Song</label>
        <select value={songId} onChange={(e) => { setSongId(e.target.value); setAId(""); setBId(""); }} style={sel}>
          <option value="">Select a song…</option>
          {songs.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        {!song ? (
          <p style={{ color: "#C7CDD6", marginTop: 12 }}>Select a song above, or <a href="/songs" style={{ color: "#0AC8FF" }}>create one in My Songs</a>.</p>
        ) : song.recordings.length < 2 ? (
          <p style={{ color: "#C7CDD6", marginTop: 12 }}>Record at least two takes to compare them. <a href={`/studio/record?song=${song.id}`} style={{ color: "#0AC8FF" }}>Record →</a></p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#C7CDD6" }}>Take A</label>
                <select value={aId} onChange={(e) => setAId(e.target.value)} style={sel}>
                  <option value="">Choose…</option>
                  {song.recordings.map((r) => <option key={r.id} value={r.id}>{r.name} · {r.durationSec}s</option>)}
                </select>
                {recA && <audio src={recA.dataUrl} controls style={{ width: "100%", marginTop: 8 }} />}
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#C7CDD6" }}>Take B</label>
                <select value={bId} onChange={(e) => setBId(e.target.value)} style={sel}>
                  <option value="">Choose…</option>
                  {song.recordings.map((r) => <option key={r.id} value={r.id}>{r.name} · {r.durationSec}s</option>)}
                </select>
                {recB && <audio src={recB.dataUrl} controls style={{ width: "100%", marginTop: 8 }} />}
              </div>
            </div>
            <div style={{ marginTop: 20, background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20 }}>
              <b>✦ Ask Coach</b>
              <div style={{ marginTop: 8 }}>
                <button onClick={askCoach} disabled={asking} style={{ height: 44, padding: "0 24px", borderRadius: 8, border: "none", background: "#5B7CFF", color: "#fff", fontWeight: 800 }}>{asking ? "Asking…" : "Get feedback"}</button>
              </div>
              {feedback && <p style={{ whiteSpace: "pre-wrap", color: "#C7CDD6", marginTop: 12 }}>{feedback}</p>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
