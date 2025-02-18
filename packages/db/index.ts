import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Экспорт схем для разных сервисов
export * as userServiceSchema from "./schemas/user-service/user";

// Функция создания клиента с указанием конкретной схемы
export function createDbClient(connectionString: string, schema: any) {
  const pool = new Pool({
    connectionString,
  });

  return drizzle(pool, { schema });
}
