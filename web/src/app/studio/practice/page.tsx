"use client";
import { useEffect, useRef, useState } from "react";
import SiteNav from "@/components/SiteNav";
import { loadSongs, type Song } from "@/lib/songs";

// /studio/practice — rehearse a song: lyrics, own recordings, metronome, reference tone.
export default function Practice({ searchParams }: { searchParams: { song?: string } }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songId, setSongId] = useState(searchParams.song ?? "");
  const [bpm, setBpm] = useState(90);
  const [metroOn, setMetroOn] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const all = loadSongs();
    setSongs(all);
    if (searchParams.song && all.some((s) => s.id === searchParams.song)) setSongId(searchParams.song);
  }, [searchParams.song]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); audioCtx.current?.close(); }, []);

  const song = songs.find((s) => s.id === songId) ?? null;

  function click() {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  function toggleMetro() {
    if (metroOn) {
      if (timer.current) clearInterval(timer.current);
      setMetroOn(false);
      return;
    }
    click();
    timer.current = setInterval(click, 60000 / bpm);
    setMetroOn(true);
  }

  function tone(freq: number) {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.25);
  }

  const card: React.CSSProperties = { background: "#222E44", border: "1px solid #3A4A66", borderRadius: 12, padding: 20, marginTop: 12 };

  return (
    <main style={{ background: "#121A26", color: "#F2F5F9", minHeight: "100vh", fontFamily: "Inter,system-ui" }}>
      <SiteNav active="/studio" />
      <section style={{ padding: 32, maxWidth: 900, margin: "auto" }}>
        <a href="/studio" style={{ color: "#C7CDD6", fontSize: 13 }}>← Studio</a>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Practice</h1>
        <label style={{ fontSize: 13, color: "#C7CDD6" }}>Song</label>
        <select value={songId} onChange={(e) => setSongId(e.target.value)} style={{ width: "100%", height: 48, borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", marginTop: 8 }}>
          <option value="">Select a song…</option>
          {songs.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        {!song && <p style={{ color: "#C7CDD6", marginTop: 12 }}>Select a song above, or <a href="/songs" style={{ color: "#0AC8FF" }}>create one in My Songs</a>.</p>}
        {song && (
          <>
            <div style={card}>
              <b>Lyrics — {song.title}</b>
              <p style={{ whiteSpace: "pre-wrap", color: "#C7CDD6", marginTop: 8 }}>{song.lyrics || "No lyrics written yet — add them in Develop."}</p>
            </div>
            <div style={card}>
              <b>Your recordings</b>
              {song.recordings.length === 0 ? (
                <p style={{ color: "#C7CDD6", marginTop: 8 }}>No recordings yet. <a href={`/studio/record?song=${song.id}`} style={{ color: "#0AC8FF" }}>Record one →</a></p>
              ) : song.recordings.map((r) => (
                <div key={r.id} style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 13 }}>{r.name} · {r.durationSec}s</p>
                  <audio src={r.dataUrl} controls style={{ width: "100%", marginTop: 4 }} />
                </div>
              ))}
            </div>
            <div style={card}>
              <b>Metronome</b>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                <input type="range" min={40} max={200} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontFamily: "monospace" }}>{bpm} BPM</span>
                <button onClick={toggleMetro} style={{ height: 44, padding: "0 20px", borderRadius: 8, border: "none", background: metroOn ? "#FF8A1A" : "#0AC8FF", color: metroOn ? "#3A1E02" : "#062A3A", fontWeight: 800 }}>{metroOn ? "Stop" : "Start"}</button>
              </div>
            </div>
            <div style={card}>
              <b>Reference tones</b>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {[["C4", 261.63], ["D4", 293.66], ["E4", 329.63], ["G4", 392.0], ["A4", 440.0], ["C5", 523.25]].map(([n, f]) => (
                  <button key={n as string} onClick={() => tone(f as number)} style={{ height: 44, padding: "0 18px", borderRadius: 8, border: "1px solid #3A4A66", background: "#1A2436", color: "#F2F5F9", fontWeight: 700 }}>{n}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
