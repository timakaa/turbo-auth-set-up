import { join } from "path";

// Base proto directory relative to the root of the monorepo
export const PROTO_DIR = join(__dirname, "../../../proto");

// Auth service proto paths
export const AUTH_PROTO_PATH = join(PROTO_DIR, "auth/auth.proto");
