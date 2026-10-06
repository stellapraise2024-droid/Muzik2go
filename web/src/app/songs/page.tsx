"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import { loadSongs, createSong, type Song } from "@/lib/songs";

// /songs — real list from device storage + create. Tap a song to open it.
export default function Songs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setSongs(loadSongs()), []);

  function start() {
    setError("");
    const song = createSong(title);
    if (!song) {
      setError(title.trim() ? "Could not save. Storage may be full." : "Give your song a title first.");
      return;
    }
    window.location.href = `/songs/${song.id}`;
  }

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/songs" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <h1 style={{ fontSize: 32 }}>My Songs</h1>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song title"
            style={{ flex: 1, minWidth: 200, height: 48, borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", padding: "0 14px" }}
          />
          <button onClick={start} style={{ height: 48, padding: "0 24px", borderRadius: 12, border: "none", background: "#0AC8FF", color: "#062A3A", fontWeight: 800 }}>+ Start a song</button>
        </div>
        {error && <p style={{ color: "#FF8A1A", marginTop: 8 }}>{error}</p>}
        {songs.length === 0 ? (
          <p style={{ color: "#C7CDD6", marginTop: 20 }}>No songs yet.</p>
        ) : (
          <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
            {songs.map((s) => (
              <a key={s.id} href={`/songs/${s.id}`} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, color: "#F2F5F9", textDecoration: "none" }}>
                <b>{s.title}</b>
                <p style={{ color: "#C7CDD6", fontSize: 14 }}>{s.recordings.length} recording{s.recordings.length === 1 ? "" : "s"} →</p>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
