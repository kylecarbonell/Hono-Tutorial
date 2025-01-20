import * as t from "drizzle-orm/pg-core";

export const schema = t.pgSchema("test");

export const users = t.pgTable("users", {
  name: t.text().notNull().unique(),
  email: t.text().notNull(),
  id: t.text().notNull().unique(),
});
