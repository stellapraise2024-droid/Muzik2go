import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Phase 1: email + Google + Apple. Postgres via DATABASE_URL.
export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
    apple: { clientId: process.env.APPLE_CLIENT_ID!, clientSecret: process.env.APPLE_CLIENT_SECRET! },
  },
  session: { expiresIn: 60 * 60 * 24 * 30 },
});
