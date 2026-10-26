import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProductCard } from "@/components/product-card";
import { FilterPanel } from "@/components/shop/filter-panel";
import { SortMenu } from "@/components/shop/sort-menu";
import { listCategories, listProducts, type Category } from "@/db/queries/catalog";
import {
  activeFilterCount,
  colorOptions,
  departments,
  parseQuery,
  priceRanges,
  shopHref,
  sortOptions,
  type ShopQuery,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop | Aurelle",
  description: "Browse dresses, outerwear, knitwear and tailoring.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ShopContent({ searchParams }: { searchParams: SearchParams }) {
  const parsed = parseQuery(await searchParams);
  const categories = await listCategories();
  const category = categories.find((c) => c.slug === parsed.category);
  // Drop unknown category slugs so they behave like "All".
  const q: ShopQuery = { ...parsed, category: category?.slug };
  const { items: visible, total } = await listProducts(q);
  const department = departments.find((d) => d.id === q.department);
  const activeCount = activeFilterCount(q);

  const heading = category
    ? department
      ? `${department.label}'s ${category.label.toLowerCase()}`
      : category.label
    : (department?.label ?? "The collection");
  return (
    <>
      {/* Page header */}
      <header className="container-page pb-8 pt-8 md:pb-12 md:pt-14">
        <nav aria-label="Breadcrumb" className="text-micro-caps mb-6 text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          {category ? (
            <>
              <Link href="/shop" className="hover:text-ink">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-ink">{category.label}</span>
            </>
          ) : (
            <span className="text-ink">Shop</span>
          )}
        </nav>
        <h1 className="text-display">{heading}</h1>
        <p className="mt-4 max-w-md text-muted">
          {category?.blurb ?? "Considered wardrobe pieces for every season."}
        </p>

        <CategoryNav q={q} categories={categories} />
      </header>

      {/* Toolbar */}
      <div className="sticky top-(--header-h) z-30 border-y border-line bg-paper">
        <div className="container-page flex h-12 items-center justify-between gap-4">
          <FilterPanel
            selected={{
              department: q.department,
              sizes: q.sizes,
              colors: q.colors,
              price: q.price,
            }}
            carry={{ category: q.category, sort: q.sort !== "featured" ? q.sort : undefined }}
            activeCount={activeCount}
            resultCount={total}
            clearHref={shopHref(q, { department: undefined, sizes: [], colors: [], price: undefined, page: 1 })}
          />
          <p className="text-micro-caps text-muted" aria-live="polite">
            {total} {total === 1 ? "piece" : "pieces"}
          </p>
          <SortMenu
            items={sortOptions.map((s) => ({
              id: s.id,
              label: s.label,
              href: shopHref(q, { sort: s.id, page: 1 }),
              active: q.sort === s.id,
            }))}
          />
        </div>
      </div>

      <ActiveFilters q={q} />

      {/* Results */}
      <section className="container-page pb-[var(--section-y)] pt-8 md:pt-12" aria-label="Products">
        {total === 0 ? (
          <div className="mx-auto max-w-sm py-24 text-center">
            <h2>No pieces found</h2>
            <p className="mb-8 mt-4 text-muted">
              Nothing matches those filters. Try removing one or start again.
            </p>
            <Link href="/shop" className="btn btn-secondary">
              Clear all filters
            </Link>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-16 flex flex-col items-center gap-5 text-center">
              <p className="text-micro-caps text-muted">
                Showing {visible.length} of {total}
              </p>
              <div className="h-px w-40 bg-line">
                <div
                  className="h-px bg-ink"
                  style={{ width: `${(visible.length / total) * 100}%` }}
                />
              </div>
              {visible.length < total && (
                <Link
                  href={shopHref(q, { page: q.page + 1 })}
                  scroll={false}
                  className="btn btn-secondary"
                >
                  Show more
                </Link>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}

function CategoryNav({ q, categories }: { q: ShopQuery; categories: Category[] }) {
  return (
    <nav aria-label="Categories" className="mt-8 md:mt-10">
      <ul className="rail -mx-(--gutter) px-(--gutter) md:mx-0 md:flex-wrap md:px-0">
        <li>
          <Link
            href={shopHref(q, { category: undefined, page: 1 })}
            aria-current={!q.category ? "true" : undefined}
            className="chip"
          >
            All
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={shopHref(q, { category: c.slug, page: 1 })}
              aria-current={q.category === c.slug ? "true" : undefined}
              className="chip"
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ActiveFilters({ q }: { q: ShopQuery }) {
  const chips: { label: string; href: string }[] = [];
  const dept = departments.find((d) => d.id === q.department);
  if (dept) chips.push({ label: dept.label, href: shopHref(q, { department: undefined, page: 1 }) });
  q.sizes.forEach((s) =>
    chips.push({ label: `Size ${s}`, href: shopHref(q, { sizes: q.sizes.filter((x) => x !== s), page: 1 }) }),
  );
  q.colors.forEach((c) =>
    chips.push({
      label: colorOptions.find((o) => o.id === c)?.label ?? c,
      href: shopHref(q, { colors: q.colors.filter((x) => x !== c), page: 1 }),
    }),
  );
  const range = priceRanges.find((r) => r.id === q.price);
  if (range) chips.push({ label: range.label, href: shopHref(q, { price: undefined, page: 1 }) });

  if (chips.length === 0) return null;

  return (
    <div className="container-page flex flex-wrap items-center gap-2 pt-6">
      {chips.map((chip) => (
        <Link key={chip.label} href={chip.href} scroll={false} className="chip gap-2" aria-label={`Remove ${chip.label}`}>
          {chip.label}
          <span aria-hidden="true">&times;</span>
        </Link>
      ))}
      <Link
        href={shopHref(q, { department: undefined, sizes: [], colors: [], price: undefined, page: 1 })}
        scroll={false}
        className="btn btn-ghost ml-2"
      >
        Clear all
      </Link>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <>
      <div className="container-page pb-8 pt-8 md:pb-12 md:pt-14">
        <div className="h-12 w-64 bg-canvas" />
        <div className="mt-4 h-5 w-72 bg-canvas" />
      </div>
      <div className="h-12 border-y border-line" />
      <div className="container-page pt-8 md:pt-12">
        <div className="product-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="media-frame animate-pulse" />
          ))}
        </div>
      </div>
    </>
  );
}
