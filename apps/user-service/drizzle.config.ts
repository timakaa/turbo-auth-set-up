import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config();

export default {
  schema: resolve(__dirname, '../../packages/db/schemas/user-service/user.ts'),
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5433/user_service?schema=public',
  },
} satisfies Config;
