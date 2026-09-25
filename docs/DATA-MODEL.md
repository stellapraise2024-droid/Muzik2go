# DATA-MODEL (Postgres + Drizzle, Phase 0 draft)

- profiles(id uuid PK, display_name, avatar_url, level, created_at)
- song_projects(id uuid PK, owner_id → profiles, title, status: idea|demo|finished, visibility: private|shared|public, lyrics_text, structure jsonb, instrumental_url, created_at)
- recordings(id uuid PK, project_id → song_projects, section: verse|chorus|bridge, type: lead|harmony|double|adlib)
- takes(id uuid PK, recording_id, project_id, parent_take_id → takes NULL, audio_url (R2 key), duration_sec, processing: raw|polished|mastered, is_favorite bool, is_selected bool, created_at) — IMMUTABLE
- practice_sessions(id uuid PK, user_id, project_id NULL, exercise_id, focus, duration_sec, take_id NULL, offline_queued bool)
- vocal_profiles(user_id PK, range_low/high_midi, strengths text[], challenges text[], scores jsonb, updated_at)
- ai_analyses(id uuid PK, take_id NULL, project_id, type: vocal|song, role: coach|producer|songwriter|engineer|creative, metrics jsonb, feedback_md, model_version, cost_cents)
- analysis_jobs(id uuid PK, take_id, status: queued|processing|done|failed, attempts, error)
- project_collaborators(project_id, user_id, role: viewer|editor)
- chat_messages(id uuid PK, project_id, user_id, role_preset, prompt, response)

Ownership: API checks owner_id = session.userId OR collaborator OR visibility=public (read). R2 keys: `raw-takes/{project_id}/{take_id}.m4a`.
