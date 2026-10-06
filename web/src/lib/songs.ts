"use client";

// Local song store (device storage). Songs created here power
// Practice / Record / Develop / Improve until cloud sync is wired.
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

export function createSong(title: string): Song | null {
  const name = title.trim();
  if (!name) return null;
  const song: Song = { id: uid("song"), title: name, lyrics: "", sections: ["Verse", "Chorus"], recordings: [], createdAt: Date.now() };
  const songs = loadSongs();
  songs.unshift(song);
  return persist(songs) ? song : null;
}

export function getSong(id: string): Song | null {
  return loadSongs().find((s) => s.id === id) ?? null;
}

export function updateSong(id: string, patch: Partial<Pick<Song, "title" | "lyrics" | "sections">>): boolean {
  const songs = loadSongs();
  const i = songs.findIndex((s) => s.id === id);
  if (i < 0) return false;
  songs[i] = { ...songs[i], ...patch };
  return persist(songs);
}

export function deleteSong(id: string): boolean {
  return persist(loadSongs().filter((s) => s.id !== id));
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
