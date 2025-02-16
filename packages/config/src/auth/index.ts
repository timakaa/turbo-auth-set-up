import * as dotenv from "dotenv";
import { join } from "path";

const envPath = join(__dirname, "../../../.env");
dotenv.config({ path: envPath });

export const AUTH_SERVICE_HOST = process.env.AUTH_SERVICE_HOST || "localhost";
export const AUTH_SERVICE_PORT: number = parseInt(
  process.env.AUTH_SERVICE_PORT || "3003",
);
export const AUTH_SERVICE_NAME = "AUTH_SERVICE";
