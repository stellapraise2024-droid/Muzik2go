"use client";

export interface Recording {
  id: string;
  name: string;
  dataUrl: string;
  mime: string;
  durationSec: number;
  createdAt: number;
}

export interface Song {
  id: string;
  title: string;
  lyrics: string;
  sections: string[];
  recordings: Recording[];
  createdAt: number;
}

const KEY = "m2g.songs.v1";

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function loadSongs(): Song[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function persist(songs: Song[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(songs));
    return true;
  } catch {
    return false;
  }
}

export async function loadSongsFromApi(): Promise<Song[]> {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) return loadSongs();
    const data = await res.json();
    const projects = data.projects || [];
    const songs: Song[] = projects.map((p: { id: string; title: string; lyricsText: string; structure: string[]; createdAt: string }) => ({
      id: p.id,
      title: p.title,
      lyrics: p.lyricsText || "",
      sections: p.structure || ["Verse", "Chorus"],
      recordings: [],
      createdAt: new Date(p.createdAt).getTime(),
    }));
    persist(songs);
    return songs;
  } catch {
    return loadSongs();
  }
}

export async function createSong(title: string): Promise<Song | null> {
  const name = title.trim();
  if (!name) return null;
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: name }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const song: Song = {
      id: data.project.id,
      title: data.project.title,
      lyrics: "",
      sections: ["Verse", "Chorus"],
      recordings: [],
      createdAt: Date.now(),
    };
    const songs = loadSongs();
    songs.unshift(song);
    persist(songs);
    return song;
  } catch {
    const song: Song = { id: uid("song"), title: name, lyrics: "", sections: ["Verse", "Chorus"], recordings: [], createdAt: Date.now() };
    const songs = loadSongs();
    songs.unshift(song);
    return persist(songs) ? song : null;
  }
}

export function getSong(id: string): Song | null {
  return loadSongs().find((s) => s.id === id) ?? null;
}

export async function updateSong(id: string, patch: Partial<Pick<Song, "title" | "lyrics" | "sections">>): Promise<boolean> {
  const songs = loadSongs();
  const i = songs.findIndex((s) => s.id === id);
  if (i < 0) return false;
  songs[i] = { ...songs[i], ...patch };
  persist(songs);
  try {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id, ...patch }),
    });
  } catch {}
  return true;
}

export async function deleteSong(id: string): Promise<boolean> {
  persist(loadSongs().filter((s) => s.id !== id));
  try {
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id }),
    });
  } catch {}
  return true;
}

export function addRecording(songId: string, rec: Omit<Recording, "id" | "createdAt">): Recording | null {
  const songs = loadSongs();
  const song = songs.find((s) => s.id === songId);
  if (!song) return null;
  const full: Recording = { ...rec, id: uid("rec"), createdAt: Date.now() };
  song.recordings.unshift(full);
  return persist(songs) ? full : null;
}

export function deleteRecording(songId: string, recId: string): boolean {
  const songs = loadSongs();
  const song = songs.find((s) => s.id === songId);
  if (!song) return false;
  song.recordings = song.recordings.filter((r) => r.id !== recId);
  return persist(songs);
}
