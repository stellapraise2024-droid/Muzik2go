# Muzik2Go — Implementation Plan

Source: `Untitled document.md` (PRD, 43 sections)
Repo: `https://github.com/stellapraise2024-droid/Muzik2go.git`
Local: `C:\Users\NewUser123\Documents\Muzik2go`
Status: Greenfield — PRD committed (`a786a2f`), no code yet.

MVP test: **Can a singer genuinely use Muzik2Go as a personal studio to practice, record, analyze and improve?**
Core loop: **Practice → Record → Analyze → Improve → Record Again → Finish**

Assumptions: 1–3 devs + 1 designer, 1–2 weeks per slice, mobile-first (iOS TestFlight first, Web follows).

---

## PHASE 0 — Design System (gate before coding)

**Goal:** One token source for Mobile + Web, dark studio-first.

### 0.1 Brand tokens
- **Dark (default):** bg-0 `#0A0A12`, bg-1 `#12121C`, surface-1 `#1A1A26`, surface-2 `#222233`, border `#2E2E42`, text-1 `#F5F5FA`, text-2 `#B8B8CC`, text-3 `#7E7E96`, brand `#7C5CFF`, teal `#00E5CC`, record `#FF3B5C`, success `#30D158`, warning `#FFB020`, error `#FF453A`
- **Light:** bg `#F7F7FA`, surface `#FFFFFF`, text-1 `#12121A`, text-2 `#4A4A5E`, brand `#5B3DF5`, record `#D92D4A`
- **Rules:** record = circular button only; brand = 1 primary action per screen; AI surfaces always have brand 1px left border + `AI` label; Original = gray chip, Improved = brand chip + label (never color-only).
- **Type:** Sora (display) + Inter (UI), Display 28 / Title 20 / Body 16+14 / Caption 12 / Mono 12 for timecodes/cents. Lyrics Body 16+, LH 1.6.
- **Spacing:** 4pt scale 4-8-12-16-20-24-32-48-64. Mobile padding 16, Web 24 max-w 1120.
- **Radius:** xs 6 / sm 8 / md 12 / lg 16 / xl 24 / pill 999. Buttons sm 36h / md 48h / lg 56h.
- **Elevation (dark):** e1 border + shadow, e2 bottom player/nav, e3 modal + brand glow. Focus ring teal 2px.

Dev: CSS vars + Tailwind theme. Figma Variables match 1:1. No hex outside tokens.

### 0.2 Component inventory (MVP only)
- Primitives: Button (Primary/Secondary/Ghost/Destructive/Icon × sm/md/lg), Input/TextArea/Search + AI Input Bar, Chip, Segmented, Tabs, List Row, Empty/Error/Loading, Modal + Bottom Sheet
- Nav: Bottom Nav (mobile) / Side Rail (web >1024px) — HOME / STUDIO / MY SONGS / JOURNEY / COMMUNITY + Top Bar (wordmark + AI + avatar)
- Audio: Mini + Full Player, Waveform (tap-seek, text fallback `Verse Take 2, 0:42`), Record Button 72px + meter, Take List Row (wave/fav/compare), A/B Toggle + `What changed?`, Analysis Report Card (Strengths / Fix 1 thing / Turn into Exercise — never score-only), Practice Card, Project Card + Timeline (Idea > Takes > Analysis > Improved > Final), AI Bubble (`✦ [Coach]` + Keep original)

Do NOT build: collaboration, community feed, learning paths, promo kit.

### 0.3 Files + naming
- Figma `M2G-DS-MVP`: 00 Cover / 01 Tokens / 02 Primitives / 03 Navigation / 04 Audio / 05 Cards / 06 Mobile / 07 Web / 08 Prototype
- Code: `/tokens/tokens.json` (Style Dictionary), `/components/*`, `/screens` (composition only)
- Naming: `M2G/Audio/Waveform/Default/Loading`, `<TakeRow take isFavorite onCompare/>`, tokens `color.bg.0`. Lucide 24px only.

### 0.4 Accessibility (WCAG 2.2 AA)
- 4.5:1 text, 3:1 UI, 44×44 targets (Play 56px, Nav 64h), waveform 44h hit area
- Never color-only; transcripts for coach feedback; live regions for Recording/Take saved
- Web: visible focus, Space=play, R=record, modal trap + Esc; respect `prefers-reduced-motion`

### 0.5 Exit criteria
- [ ] Figma loop <6 taps: Home > Record > Compare > A/B > Save
- [ ] 0 hardcoded hex, light/dark readable, Axe 0 critical, VoiceOver/TalkBack pass on Player/Takes/A/B
- [ ] Storybook/Expo Showcase with mock audio works offline + BT + call interrupt

---

## PHASE ADR — Architectural Decisions

Record as ADRs in `docs/ADRs.md`:

1. **Mobile: Expo React Native + TS** (over Flutter) — code-share, expo-audio, EAS OTA
2. **Web: Next.js 14 App Router** on Vercel — SSR for share, Server Actions
3. **BaaS: Supabase** (Postgres + Auth + Storage + Realtime) — RLS for Private/Shared/Public, pgvector later
4. **DSP: separate FastAPI worker** on Fly.io — librosa / parselmouth / Basic-Pitch / faster-whisper
5. **Storage:** Supabase Storage buckets `raw-takes/processed/instrumentals`, capture m4a 48k mono, tus resumable
6. **Takes immutable + parent_take_id** — never UPDATE, Improved = new Take (Original vs Improved + Playground free)
7. **Analysis async job + Realtime** — p95 <60s, skeleton + polling
8. **AI managed APIs** (Whisper + gpt-4o-mini/haiku, 5 role prompts) + self-host Basic-Pitch only — cache by audio_hash, caps, cost_cents logging
9. **Visibility via RLS** + project_collaborators — can_read_project() for DB + Storage
10. **Offline-first outbox** (MMKV/SQLite, local record, background sync) — Practice offline, Analyze online

**Models:** profiles / song_projects / recordings / takes / practice_sessions / vocal_profiles / ai_analyses / analysis_jobs / chat_messages (see ADRs for fields).

**Flows:** upload-url → direct PUT → INSERT take → enqueue → worker /analyze → INSERT analysis + UPSERT profile → Realtime. Chat `POST /ai/chat {role, projectId, takeId}` injects last 3 analyses + profile + lyrics.

**Risks:** latency (instant tuner), cost (90s truncate, 10/mo free), bleed (snr<10dB → earbuds prompt), overclaim (confidence + f0 curve, no auto-tune).

---

## PHASE 1 — Foundation: Auth, Projects, Audio Engine (1–2 wks)

**Goal:** Private Song Projects + reliable capture.
- Stories: sign-in → create project (title/idea/lyrics/sections) → record 3-min acapella → Home Continue/Recent resumes in 1 tap
- Build: Auth (email/Google/Apple, delete), CRUD, Home v1 (4 quick actions), Audio v1 (permission, waveform, play/seek, local+cloud retry, `projects/{id}/takes/{id}`)
- Exit: kill app → intact; mic-denied/offline guided, no loss; Home <2s with 20 projects
- NOT: takes UI, coach, AI, sharing, beats

## PHASE 2 — Record Usable: Takes + Sections (1–2 wks)

**Goal:** Section-by-section demo recorder.
- Stories: record Verse/Chorus/Bridge multi-takes → star/compare → assemble best; import beat + sing over
- Build: Take model (songId, section, takeNo, fav, selected), section picker, A/B player, keep-all, overdub (latency cal, client mix), rename/trim non-destructive
- Exit: 5 takes/3 sections comp plays; 5-min beat drift <50ms
- NOT: analysis, coach, polish, harmonies, master

## PHASE 3 — Coach Loop: Practice + Analysis (2 wks)

**Goal:** Close Practice → Record → Analyze with explain-not-score.
- Stories: warm-up → record → “line 2 final dropped, try this” → 1-tap exercise → streak
- Build: 8–12 static exercises + metronome, Analysis v1 (pYIN pitch, onset timing, heuristic explainer), Assistant Coach-only (typed), My Voice-lite, Progress v1
- Exit: 60s vocal → Analyze <15s actionable; suggestions dismissible
- NOT: song dev, polish, A/B, other roles, sessions, Guide Me

## PHASE 4 — Finish Loop: Song Dev + Improvement (2 wks)

**Goal:** Lyrics/structure → Polish → A/B → Export.
- Stories: idea/hum → lyrics v2 → Polish → diff → Export WAV/MP3
- Build: lyrics editor + templates + Songwriter-lite, pipeline Analyze/Guide/Assist/Polish (EQ/comp/denoise, immutable + what-changed), loudness-matched A/B, Engineer-lite, Final flag + LUFS export
- Exit: end-to-end unaided, original never mutated, MVP 12-item checklist demoable
- NOT: Playground, instrumental gen, layers, sessions, collab/community/portfolio/master suite

## PHASE 5 — Hardening / Beta (1–2 wks)

**Goal:** TestFlight shippable, prove PRD §41 (1-3,5).
- Stories: airplane mode/call/low storage → no loss; private-by-default; feedback in 30s
- Build: interruption guard, resume queue, quota UI, consent + delete purges, onboarding, flags/paywall stubs, a11y pass, telemetry funnel
- Exit: crash-free >99.5%, p95 <20s, 10–20 testers complete loop unaided
- NOT: new features, billing, full Android parity if iOS+Web first

## PHASE 6+ — Post-MVP (each 1–2 wks)

6a My Voice + Journey full → 6b Playground branches → 6c Producer + instrumental-around-beat → 6d Studio Session 9-step + Guide Me → 6e harmonies/doubles/ad-libs + Master → 6f collab + feedback → 6g Community + Learning + Challenges → 6h Portfolio + Promo (not DSP distribution).
Rule: MVP loop stays green with flags off.

---

## Next actions
1. Rename `Untitled document.md` → `PRD.md`
2. Add `docs/ADRs.md`, `docs/DATA-MODEL.md`, `README.md`, `.gitignore`
3. Scaffold `mobile/ web/ backend/worker/ packages/shared-types/`
4. Push to `origin main` (needs GitHub auth)
