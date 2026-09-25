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
  audioKey: text("audio_key").notNull(), // R2 key: raw-takes/{projectId}/{takeId}.m4a
  durationSec: integer("duration_sec").default(0),
  processing: text("processing").default("raw").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  isSelected: boolean("is_selected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
