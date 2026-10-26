import {
  and,
  arrayOverlaps,
  asc,
  count,
  desc,
  eq,
  gte,
  lt,
  ne,
  sql,
  type SQL,
} from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { PAGE_SIZE, priceRanges, type ShopQuery } from "@/lib/catalog";
import type { Product } from "@/lib/sample-data";

export type Category = { slug: string; label: string; blurb: string };

const productColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  category: categories.name,
  categorySlug: categories.slug,
  department: products.department,
  priceCents: products.priceCents,
  stockQuantity: products.stockQuantity,
  image: products.imageUrl,
  alt: products.imageAlt,
  badge: products.badge,
  sizes: products.sizes,
  colors: products.colors,
};

type ProductRow = Omit<Product, "badge"> & { badge: string | null };

function toProduct({ badge, ...row }: ProductRow): Product {
  return { ...row, badge: badge ?? undefined };
}

export async function listCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const rows = await db
    .select({ slug: categories.slug, label: categories.name, blurb: categories.blurb })
    .from(categories)
    .orderBy(asc(categories.sortOrder));
  return rows;
}

/** Filtered, sorted products for /shop; returns the first `page * PAGE_SIZE` plus the total match count. */
export async function listProducts(q: ShopQuery): Promise<{ items: Product[]; total: number }> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const range = priceRanges.find((r) => r.id === q.price);
  const filters: (SQL | undefined)[] = [
    q.department ? eq(products.department, q.department) : undefined,
    q.category ? eq(categories.slug, q.category) : undefined,
    q.sizes.length > 0 ? arrayOverlaps(products.sizes, q.sizes) : undefined,
    q.colors.length > 0 ? arrayOverlaps(products.colors, q.colors) : undefined,
    range && "minCents" in range ? gte(products.priceCents, range.minCents) : undefined,
    range && "maxCents" in range ? lt(products.priceCents, range.maxCents) : undefined,
  ];
  const where = and(...filters);

  const order = {
    featured: [asc(products.sortOrder)],
    newest: [desc(products.createdAt), asc(products.sortOrder)],
    "price-asc": [asc(products.priceCents), asc(products.sortOrder)],
    "price-desc": [desc(products.priceCents), asc(products.sortOrder)],
  }[q.sort];

  const [rows, [totalRow]] = await Promise.all([
    db
      .select(productColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(...order)
      .limit(q.page * PAGE_SIZE),
    db
      .select({ total: count() })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where),
  ]);

  return { items: rows.map(toProduct), total: totalRow?.total ?? 0 };
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const [row] = await db
    .select(productColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return row ? toProduct(row) : undefined;
}

/** Same category and department first, then same category, then same department; newest first. */
export async function relatedProducts(product: Product, limit = 4): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  // Rank: +2 for the same category, +1 for the same department.
  const rank = sql<number>`(case when ${categories.slug} = ${product.categorySlug} then 2 else 0 end)
    + (case when ${products.department} = ${product.department} then 1 else 0 end)`;
  const rows = await db
    .select(productColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(ne(products.id, product.id))
    .orderBy(desc(rank), desc(products.createdAt))
    .limit(limit);
  return rows.map(toProduct);
}

export async function listProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.select({ slug: products.slug }).from(products).orderBy(asc(products.sortOrder));
  return rows.map((r) => r.slug);
}

/** Home-page rails. Best sellers has no sales signal yet, so it is the featured order after the new arrivals. */
export async function listHomeProducts(): Promise<{ newArrivals: Product[]; bestSellers: Product[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const [newArrivals, bestSellers] = await Promise.all([
    db
      .select(productColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt), asc(products.sortOrder))
      .limit(8),
    db
      .select(productColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(asc(products.sortOrder))
      .offset(8)
      .limit(6),
  ]);
  return { newArrivals: newArrivals.map(toProduct), bestSellers: bestSellers.map(toProduct) };
}
