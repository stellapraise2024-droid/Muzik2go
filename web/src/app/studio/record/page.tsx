"use client";
import { useEffect, useRef, useState } from "react";
import SiteNav from "@/components/SiteNav";
import { loadSongs, addRecording, deleteRecording, type Song } from "@/lib/songs";

// /studio/record — real microphone recording: permission, timer, stop, playback, delete, save to song.
export default function Record({ searchParams }: { searchParams: { song?: string } }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songId, setSongId] = useState(searchParams.song ?? "");
  const [recording, setRecording] = useState(false);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(0);
  const media = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const clock = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    const all = loadSongs();
    setSongs(all);
    if (searchParams.song && all.some((s) => s.id === searchParams.song)) setSongId(searchParams.song);
  }, [searchParams.song]);

  useEffect(() => () => { if (clock.current) clearInterval(clock.current); media.current?.stream.getTracks().forEach((t) => t.stop()); }, []);

  const song = songs.find((s) => s.id === songId) ?? null;

  async function start() {
    setError("");
    if (!song) { setError("Select a song first."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const durationSec = Math.round((Date.now() - startedAt.current) / 1000);
          const rec = addRecording(song.id, { name: `Take ${song.recordings.length + 1}`, dataUrl: String(reader.result), mime: blob.type, durationSec });
          if (rec) {
            setSongs(loadSongs());
            setSavedAt(Date.now());
          } else {
            setError("Could not save. Device storage may be full — try a shorter take or delete old ones.");
          }
        };
        reader.readAsDataURL(blob);
      };
      media.current = mr;
      startedAt.current = Date.now();
      setSecs(0);
      mr.start();
      setRecording(true);
      clock.current = setInterval(() => setSecs(Math.round((Date.now() - startedAt.current) / 1000)), 500);
    } catch {
      setError("Microphone unavailable. Allow microphone permission in your browser, then try again.");
    }
  }

  function stop() {
    if (clock.current) clearInterval(clock.current);
    setRecording(false);
    media.current?.stop();
  }

  const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <a href="/studio" style={{ color: "#C7CDD6", fontSize: 13 }}>← Studio</a>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Record</h1>
        <label style={{ fontSize: 13, color: "#C7CDD6" }}>Song</label>
        <select value={songId} onChange={(e) => setSongId(e.target.value)} style={{ width: "100%", height: 48, borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", marginTop: 8 }}>
          <option value="">Select a song…</option>
          {songs.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 20 }}>
          {!recording ? (
            <button onClick={start} style={{ width: 72, height: 72, borderRadius: "50%", border: "none", background: "#FF8A1A", color: "#3A1E02", fontSize: 26, fontWeight: 800 }}>●</button>
          ) : (
            <button onClick={stop} style={{ width: 72, height: 72, borderRadius: 12, border: "none", background: "#FF8A1A", color: "#3A1E02", fontWeight: 800 }}>STOP</button>
          )}
          <span style={{ fontFamily: "monospace", fontSize: 24 }}>{recording ? mm : "0:00"}</span>
          {recording && <span style={{ color: "#FF8A1A" }}>● recording…</span>}
        </div>
        {error && <p style={{ color: "#FF8A1A", marginTop: 8 }}>{error}</p>}
        {savedAt > 0 && !error && <p style={{ color: "#C8F04A", marginTop: 8 }}>Saved to {song?.title}.</p>}
        {song && (
          <div style={{ marginTop: 20 }}>
            <b>Takes — {song.title}</b>
            {song.recordings.length === 0 ? (
              <p style={{ color: "#C7CDD6", marginTop: 8 }}>No takes yet. Press ● to record your first.</p>
            ) : song.recordings.map((r) => (
              <div key={r.id} style={{ background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 12, marginTop: 8 }}>
                <p style={{ fontSize: 13 }}>{r.name} · {r.durationSec}s</p>
                <audio src={r.dataUrl} controls style={{ width: "100%", marginTop: 4 }} />
                <button
                  onClick={() => { deleteRecording(song.id, r.id); setSongs(loadSongs()); }}
                  style={{ marginTop: 8, background: "transparent", border: "1px solid #3A4A66", color: "#C7CDD6", borderRadius: 8, padding: "8px 14px" }}
                >
                  Delete take
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
