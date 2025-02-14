import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../.env") });

export const AUTH_SERVICE_HOST = process.env.AUTH_SERVICE_HOST || "localhost";
export const AUTH_SERVICE_PORT: number = parseInt(
  process.env.AUTH_SERVICE_PORT || "3002",
);
