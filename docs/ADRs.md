# ADRs — Muzik2Go (local-first, no Supabase)

## ADR-001 Mobile: Expo React Native + TS
Decision: Expo RN. Consequence: shared TS types with web, EAS OTA, expo-audio for MVP.

## ADR-002 Web: Next.js 14 App Router
Decision: Next.js on local Node. Consequence: hosts Better Auth + API routes + web UI in one deploy.

## ADR-003 BaaS: none — self-host Postgres + Redis
Decision: Postgres 16 + Redis via Docker Compose on local device. No Supabase (subscription). ORM: Drizzle.
Consequence: own backups/migrations; enforce Private/Shared/Public in API middleware (no RLS).

## ADR-004 Auth: Better Auth
Decision: better-auth with Postgres adapter (email + Google + Apple + anonymous).
Consequence: own user/session tables, no per-user fees.

## ADR-005 Storage: Cloudflare R2 (S3-compatible)
Decision: R2 buckets raw-takes/processed/instrumentals, presigned PUT/GET via aws-sdk v3.
Consequence: zero egress, swap to S3 with endpoint change.

## ADR-006 Takes immutable + parent_take_id
Decision: never UPDATE takes; Improved = new row with parent_take_id. Consequence: Original vs Improved + Playground free; lifecycle rule for non-favorites.

## ADR-007 Analysis async (BullMQ + FastAPI worker)
Decision: BullMQ queue → FastAPI /analyze (librosa/Basic-Pitch/whisper) → LLM narration. Consequence: p95 <60s, SSE notify.

## ADR-008 AI managed APIs
Decision: Whisper API + gpt-4o-mini/haiku (5 role prompts), self-host Basic-Pitch only. Cache by audio_hash, caps.

## ADR-009 Realtime: SSE/WebSocket (no Supabase Realtime)
Decision: `/api/events` SSE for analysis.complete. Consequence: simple, self-hosted.

## ADR-010 Offline-first outbox
Decision: MMKV/SQLite outbox + tus-style resume. Practice offline, Analyze online.
