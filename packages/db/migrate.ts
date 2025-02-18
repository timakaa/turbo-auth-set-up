import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDbClient } from "./index";
import * as dotenv from "dotenv";
import { users } from "./schemas/user-service/user";

dotenv.config();

const schemas = {
  "user-service": users,
};

async function runMigrations(service: keyof typeof schemas) {
  const schema = schemas[service];
  if (!schema) {
    throw new Error(`Unknown service: ${service}`);
  }

  const db = createDbClient(process.env.DATABASE_URL!, schema);

  console.log(`Running migrations for ${service}...`);

  await migrate(db, { migrationsFolder: `./migrations/${service}` });

  console.log("Migrations completed");

  process.exit(0);
}

const service = process.argv[2];
if (!service) {
  console.error("Please specify service name: user-service or auth-service");
  process.exit(1);
}

runMigrations(service as keyof typeof schemas).catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
