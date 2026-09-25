// PAGE 1/2 — Practice (emerald primary, purple Ask Coach)
// Layout: Exercise list → Player (guide + metronome) → Record attempt (pink ●) → [Ask Coach → goes to Page 2]
// 8-12 static exercises, offline-first. No score-only anywhere.
export const EXERCISES = [
  { id: "breath-01", title: "Diaphragm reset", focus: "breath", min: 3, level: "Easy" },
  { id: "warm-01", title: "Lip trill warm-up", focus: "warmup", min: 5, level: "Easy" },
  { id: "warm-02", title: "Sirens low→high", focus: "range", min: 5, level: "Easy" },
  { id: "pitch-01", title: "Pitch holds (5 notes)", focus: "pitch", min: 5, level: "Medium" },
  { id: "pitch-02", title: "Final-note hold (line 2)", focus: "pitch", min: 5, level: "Medium" },
  { id: "timing-01", title: "Clap + sing on grid", focus: "timing", min: 4, level: "Medium" },
  { id: "timing-02", title: "Chorus entry timing", focus: "timing", min: 4, level: "Medium" },
  { id: "control-01", title: "Soft→loud control", focus: "control", min: 5, level: "Medium" },
  { id: "control-02", title: "Vibrato control", focus: "control", min: 5, level: "Hard" },
  { id: "stamina-01", title: "Full verse stamina", focus: "stamina", min: 6, level: "Hard" },
];
export const PRACTICE_PAGE = { pages: "1/2 Practice → 2/2 Coach", offline: true, maxAttemptSec: 300 };
