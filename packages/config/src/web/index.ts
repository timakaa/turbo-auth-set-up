import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../.env") });

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
