// Groq client stub — reads GROQ_API_KEY from env (never commit real key).
// Used by: /api/ai (coach), /api/song-dev, /api/playground. Model: llama-3.3-70b-versatile.
// Setup: copy .env.example → .env, set GROQ_API_KEY=<rotated-key>, `pnpm --filter web dev`.
export const GROQ = { envVar: "GROQ_API_KEY", model: "llama-3.3-70b-versatile", note: "server-only, rate-limit + cache by prompt hash" };
