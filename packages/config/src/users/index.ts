import * as dotenv from "dotenv";
import { join } from "path";

const envPath = join(__dirname, "../../.env");
dotenv.config({ path: envPath });

export const USER_SERVICE_HOST = process.env.USER_SERVICE_HOST || "localhost";
export const USER_SERVICE_PORT: number = parseInt(
  process.env.USER_SERVICE_PORT || "3002",
);

export const USER_SERVICE_NAME = "USER_SERVICE";
