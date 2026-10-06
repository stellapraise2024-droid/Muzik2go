"use client";
import { useEffect, useState } from "react";
import SiteNav from "@/components/SiteNav";
import { loadSongs, updateSong, type Song } from "@/lib/songs";

// /studio/develop — edit a song's lyrics + structure, saved on device.
export default function Develop({ searchParams }: { searchParams: { song?: string } }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songId, setSongId] = useState(searchParams.song ?? "");
  const [lyrics, setLyrics] = useState("");
  const [sections, setSections] = useState("");
  const [savedAt, setSavedAt] = useState(0);

  useEffect(() => {
    const all = loadSongs();
    setSongs(all);
    const id = searchParams.song && all.some((s) => s.id === searchParams.song) ? searchParams.song : "";
    setSongId(id);
    if (id) {
      const s = all.find((x) => x.id === id);
      setLyrics(s?.lyrics ?? "");
      setSections((s?.sections ?? []).join("\n"));
    }
  }, [searchParams.song]);

  function pick(id: string) {
    setSongId(id);
    setSavedAt(0);
    const s = songs.find((x) => x.id === id);
    setLyrics(s?.lyrics ?? "");
    setSections((s?.sections ?? []).join("\n"));
  }

  function save() {
    if (!songId) return;
    const ok = updateSong(songId, { lyrics, sections: sections.split("\n").map((x) => x.trim()).filter(Boolean) });
    if (ok) {
      setSongs(loadSongs());
      setSavedAt(Date.now());
    }
  }

  const input: React.CSSProperties = { width: "100%", borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", padding: 12, marginTop: 8, fontFamily: "Inter,system-ui" };

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <a href="/studio" style={{ color: "#C7CDD6", fontSize: 13 }}>← Studio</a>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Develop</h1>
        <label style={{ fontSize: 13, color: "#C7CDD6" }}>Song</label>
        <select value={songId} onChange={(e) => pick(e.target.value)} style={{ width: "100%", height: 48, borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", marginTop: 8 }}>
          <option value="">Select a song…</option>
          {songs.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        {!songId ? (
          <p style={{ color: "#C7CDD6", marginTop: 12 }}>Select a song above, or <a href="/songs" style={{ color: "#0AC8FF" }}>create one in My Songs</a>.</p>
        ) : (
          <>
            <label style={{ fontSize: 13, color: "#C7CDD6", display: "block", marginTop: 16 }}>Lyrics</label>
            <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} rows={10} placeholder="Write your lyrics here…" style={input} />
            <label style={{ fontSize: 13, color: "#C7CDD6", display: "block", marginTop: 16 }}>Structure (one section per line)</label>
            <textarea value={sections} onChange={(e) => setSections(e.target.value)} rows={4} style={{ ...input, fontFamily: "monospace" }} />
            <button onClick={save} style={{ marginTop: 16, height: 52, padding: "0 32px", borderRadius: 12, border: "none", background: "#0AC8FF", color: "#062A3A", fontWeight: 800, fontSize: 16 }}>Save changes</button>
            {savedAt > 0 && <p style={{ color: "#C8F04A", marginTop: 8 }}>Saved.</p>}
          </>
        )}
      </section>
    </main>
  );
}
