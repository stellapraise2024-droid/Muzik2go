// Phase 5 reliability — offline-first outbox + interruption guards.
// - Outbox (MMKV/SQLite): {op: record|upload|practice-log, payload, retries:3 backoff} → sync on reconnect, "Pending upload" badge
// - Guards: incoming call → auto-stop + keep take; background → guard toast; low storage → quota UI + block with guided error
// - Upload resume: keep local m4a until /api/takes complete + analysis done. Record loss target: 0.
export const RELIABILITY = { retries: 3, keepLocalUntilDone: true, quotaWarnMB: 200 };
