# ARCHITECTURE (local-first)

```
Expo App  ──HTTPS──▶  Next.js :3000 (Better Auth + API + SSE)
   │                        │ presigned URL
   │                        ▼
   │                   Cloudflare R2 (raw-takes/processed/instrumentals)
   │                        │ webhook complete
   └─ direct PUT ───────────┘
Next API ──BullMQ──▶ Redis :6379 ──▶ FastAPI worker :8000 (/analyze)
   │                        └── librosa/Basic-Pitch/whisper + LLM → Postgres
   └─SSE /api/events──▶ App (analysis.complete)
Postgres :5432 (Drizzle) — profiles, projects, takes (immutable), analyses, jobs
```

Local: `docker compose up -d postgres redis`. Web/worker run via pnpm / uvicorn locally (Phase 1 wires them).
Phone testing: same Wi-Fi or Tailscale; API base URL via env.
