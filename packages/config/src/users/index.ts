import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../.env") });

export const USER_SERVICE_HOST = process.env.USER_SERVICE_HOST || "localhost";
export const USER_SERVICE_PORT: number = parseInt(
  process.env.USER_SERVICE_PORT || "3001",
);
