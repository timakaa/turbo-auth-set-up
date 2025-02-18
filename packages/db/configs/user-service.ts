import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./schemas/user-service/user.ts",
  out: "./migrations/user-service",
  driver: "pg",
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5433/user_service?schema=public",
  },
} satisfies Config;
