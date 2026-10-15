import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  songProjects,
  recordings,
  takes,
  practiceSessions,
  feedback,
  voiceProfiles,
  aiAnalyses,
  analysisJobs,
  chatMessages,
} from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, {
  schema: {
    songProjects,
    recordings,
    takes,
    practiceSessions,
    feedback,
    voiceProfiles,
    aiAnalyses,
    analysisJobs,
    chatMessages,
  },
});
