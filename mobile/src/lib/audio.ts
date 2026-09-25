// Phase 1 audio engine stub — expo-audio wiring happens after `npm install`.
// Contract:
// - requestMicPermission() → bool (show guided error if denied)
// - startRecording(section) → localUri (m4a, max 10min, meter callback)
// - stopRecording() → {localUri, durationSec}
// - queueUpload(localUri, projectId, takeId): presigned PUT to R2 via /api/upload-url, retry x3, keep local until done
// - playback(localUri|remoteUrl): play/pause/seek, waveform tap-seek 44h hit area
export const AUDIO = { maxSec: 600, format: "m4a", sampleRate: 44100 };
