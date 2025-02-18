import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Define roles enum
export const RoleEnum = z.enum(["ADMIN", "EDITOR", "USER"]);
export type Role = z.infer<typeof RoleEnum>;

// Define users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  password: text("password").notNull(),
  hashedRefreshToken: text("hashed_refresh_token"),
  role: varchar("role", { length: 50 }).$type<Role>().default("USER").notNull(),
});

// Create Zod schemas for type safety
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
