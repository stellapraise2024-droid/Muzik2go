import { pgTable, uuid, text, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";

// Better Auth tables are created by CLI; app tables below.
export const songProjects = pgTable("song_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull(),
  title: text("title").notNull(),
  status: text("status").default("idea").notNull(),
  visibility: text("visibility").default("private").notNull(),
  lyricsText: text("lyrics_text").default("").notNull(),
  structure: jsonb("structure").default([]).notNull(),
  instrumentalUrl: text("instrumental_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recordings = pgTable("recordings", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  section: text("section").notNull(),
  type: text("type").default("lead").notNull(),
});

export const takes = pgTable("takes", {
  id: uuid("id").defaultRandom().primaryKey(),
  recordingId: uuid("recording_id").notNull(),
  projectId: uuid("project_id").notNull(),
  parentTakeId: uuid("parent_take_id"),
  audioKey: text("audio_key").notNull(),
  durationSec: integer("duration_sec").default(0),
  processing: text("processing").default("raw").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  isSelected: boolean("is_selected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const practiceSessions = pgTable("practice_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull(),
  projectId: uuid("project_id"),
  exercise: text("exercise").notNull(),
  durationSec: integer("duration_sec").default(0),
  bpm: integer("bpm"),
  notes: text("notes").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id"),
  kind: text("kind").notNull(),
  message: text("message").notNull(),
  meta: jsonb("meta").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const voiceProfiles = pgTable("voice_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull().unique(),
  rangeLow: text("range_low"),
  rangeHigh: text("range_high"),
  comfortableLow: text("comfortable_low"),
  comfortableHigh: text("comfortable_high"),
  strengths: jsonb("strengths").default([]).notNull(),
  challenges: jsonb("challenges").default([]).notNull(),
  pitchScore: integer("pitch_score"),
  timingScore: integer("timing_score"),
  consistencyScore: integer("consistency_score"),
  practiceCount: integer("practice_count").default(0).notNull(),
  totalPracticeSec: integer("total_practice_sec").default(0).notNull(),
  lastPracticeAt: timestamp("last_practice_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiAnalyses = pgTable("ai_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull(),
  projectId: uuid("project_id"),
  takeId: uuid("take_id"),
  kind: text("kind").notNull(),
  content: jsonb("content").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analysisJobs = pgTable("analysis_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull(),
  takeId: uuid("take_id").notNull(),
  status: text("status").default("queued").notNull(),
  result: jsonb("result"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull(),
  projectId: uuid("project_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
