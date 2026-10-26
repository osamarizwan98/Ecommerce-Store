import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  blurb: text().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});
