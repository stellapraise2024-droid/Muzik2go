# Muzik2Go — Your Studio, Anywhere

AI-powered personal music studio: Practice → Record → Analyze → Improve → Record Again → Finish.

## Stack (local-first, no Supabase)
- Mobile: Expo React Native + TS (`/mobile`)
- Web: Next.js 14 + Better Auth (`/web`)
- API: Next.js routes + Hono (`/backend` — planned Phase 1)
- Worker: FastAPI DSP (`/backend/worker`: librosa / Basic-Pitch / whisper)
- DB: Postgres 16 local + Redis (via `docker-compose.yml`)
- Storage: Cloudflare R2 (S3-compatible)
- Design: Emerald `#10B981` / Purple `#8B5CF6` / Pink `#EC4899`, flat, no gradients

## Quick start (Phase 0)
1. Install Node 20 LTS + pnpm, Docker Desktop, Python 3.11+
2. Copy `.env.example` → `.env`, fill R2 + Better Auth secrets
3. `docker compose up -d postgres redis`
4. See `docs/IMPLEMENTATION_PLAN.md` for phases. Design preview: `docs/design-system-preview.html`

## Phases
- Phase 0: Foundation (this commit) — repo, tokens, docs, compose
- Phase 1: Auth + Projects + Audio engine
- Phase 2: Takes + Sections + Beat overdub
- Phase 3: Coach loop
- Phase 4: Finish loop
- Phase 5: Beta hardening

PRD: `PRD.md`
