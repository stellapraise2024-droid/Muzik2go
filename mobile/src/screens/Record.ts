// Phase 2 Record screen — section-by-section + beat overdub.
// Flow:
// 1. Pick section [Verse|Chorus|Bridge] (emerald pill = active)
// 2. Optional: import beat (MP3/WAV/M4A ≤5min) via /api/beats → play beat + record vocal (pink ●)
// 3. Latency calibration stub: calibrateMs() → store offset, target drift <50ms
// 4. Each stop → POST /api/takes (new immutable take, never overwrite)
// 5. Take list per section → Fav (pink ★) / Select best (emerald) / Compare A/B
// 6. Comp preview: Verse2 + Chorus4 + Bridge3 stitched in order (client mix, no DAW)
export const OVERDUB = { maxBeatMin: 5, targetDriftMs: 50, monitorWithHeadphones: true };
