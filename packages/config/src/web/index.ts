import * as dotenv from "dotenv";
import { join } from "path";

// Change path resolution to use the current package's context
const envPath = join(__dirname, "../../../.env");
dotenv.config({ path: envPath });

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
