import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { categories } from "./categories";

export const departmentEnum = pgEnum("department", ["women", "men"]);

export const products = pgTable(
  "products",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: text().notNull().unique(),
    name: text().notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    department: departmentEnum().notNull(),
    /** USD in minor units (cents). */
    priceCents: integer("price_cents").notNull(),
    /** Units on hand. Stock status (low / sold out) is derived in app code. */
    stockQuantity: integer("stock_quantity").notNull().default(0),
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull(),
    badge: text(),
    /** Filter attributes only; not variants (no per-size stock or price). */
    sizes: text().array().notNull().default(sql`'{}'::text[]`),
    colors: text().array().notNull().default(sql`'{}'::text[]`),
    /** Ascending = "featured" order. */
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("products_price_cents_nonnegative", sql`${t.priceCents} >= 0`),
    check("products_stock_quantity_nonnegative", sql`${t.stockQuantity} >= 0`),
  ],
);
