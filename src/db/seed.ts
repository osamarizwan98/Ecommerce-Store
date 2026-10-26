import { config } from "dotenv";
import { sql } from "drizzle-orm";

config({ path: ".env.local" });
config();

async function main() {
  // src/db/index.ts throws at import without DATABASE_URL, so load it after dotenv.
  const { db } = await import("./index");
  const { categories, products } = await import("./schema");
  const { seedCategories, seedProducts } = await import("./seed-data");

  // neon-http has no transactions: categories first, then products that reference them.
  await db
    .insert(categories)
    .values(seedCategories)
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name: sql`excluded.name`,
        blurb: sql`excluded.blurb`,
        sortOrder: sql`excluded.sort_order`,
      },
    });

  const rows = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const categoryIds = new Map(rows.map((r) => [r.slug, r.id]));

  await db
    .insert(products)
    .values(
      seedProducts.map(({ categorySlug, ...product }) => {
        const categoryId = categoryIds.get(categorySlug);
        if (categoryId === undefined) throw new Error(`Unknown category: ${categorySlug}`);
        return { ...product, categoryId };
      }),
    )
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        name: sql`excluded.name`,
        categoryId: sql`excluded.category_id`,
        department: sql`excluded.department`,
        priceCents: sql`excluded.price_cents`,
        stockQuantity: sql`excluded.stock_quantity`,
        imageUrl: sql`excluded.image_url`,
        imageAlt: sql`excluded.image_alt`,
        badge: sql`excluded.badge`,
        sizes: sql`excluded.sizes`,
        colors: sql`excluded.colors`,
        sortOrder: sql`excluded.sort_order`,
        createdAt: sql`excluded.created_at`,
      },
    });

  console.log(`Seeded ${seedCategories.length} categories and ${seedProducts.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
