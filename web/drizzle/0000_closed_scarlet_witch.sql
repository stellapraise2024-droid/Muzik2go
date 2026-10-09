CREATE TABLE "recordings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"section" text NOT NULL,
	"type" text DEFAULT 'lead' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "song_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'idea' NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"lyrics_text" text DEFAULT '' NOT NULL,
	"structure" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"instrumental_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "takes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recording_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_take_id" uuid,
	"audio_key" text NOT NULL,
	"duration_sec" integer DEFAULT 0,
	"processing" text DEFAULT 'raw' NOT NULL,
	"is_favorite" boolean DEFAULT false,
	"is_selected" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
