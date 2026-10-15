CREATE TABLE IF NOT EXISTS "practice_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_id" text NOT NULL,
  "project_id" uuid,
  "exercise" text NOT NULL,
  "duration_sec" integer DEFAULT 0,
  "bpm" integer,
  "notes" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "feedback" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_id" text,
  "kind" text NOT NULL,
  "message" text NOT NULL,
  "meta" jsonb DEFAULT '{}' NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "voice_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_id" text NOT NULL,
  "range_low" text,
  "range_high" text,
  "comfortable_low" text,
  "comfortable_high" text,
  "strengths" jsonb DEFAULT '[]' NOT NULL,
  "challenges" jsonb DEFAULT '[]' NOT NULL,
  "pitch_score" integer,
  "timing_score" integer,
  "consistency_score" integer,
  "practice_count" integer DEFAULT 0 NOT NULL,
  "total_practice_sec" integer DEFAULT 0 NOT NULL,
  "last_practice_at" timestamp,
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "voice_profiles_owner_id_unique" UNIQUE ("owner_id")
);

CREATE TABLE IF NOT EXISTS "ai_analyses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_id" text NOT NULL,
  "project_id" uuid,
  "take_id" uuid,
  "kind" text NOT NULL,
  "content" jsonb DEFAULT '{}' NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "analysis_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_id" text NOT NULL,
  "take_id" uuid NOT NULL,
  "status" text DEFAULT 'queued' NOT NULL,
  "result" jsonb,
  "error" text,
  "created_at" timestamp DEFAULT now(),
  "completed_at" timestamp
);

CREATE TABLE IF NOT EXISTS "chat_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_id" text NOT NULL,
  "project_id" uuid,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
