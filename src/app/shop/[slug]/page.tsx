import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getProductBySlug, listProductSlugs, relatedProducts } from "@/db/queries/catalog";
import { colorOptions, departments, getStock, type StockStatus } from "@/lib/catalog";
import { formatPrice, services } from "@/lib/sample-data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await listProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: `${product.name} | Aurelle`,
    description: `${product.name}, ${product.category.toLowerCase()} from Aurelle.`,
  };
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

const stockStyles: Record<StockStatus, string> = {
  "in-stock": "bg-success",
  "low-stock": "bg-accent",
  "sold-out": "bg-danger",
};

async function ProductContent({ params }: { params: Params }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const stock = getStock(product);
  const department = departments.find((d) => d.id === product.department);
  const colors = colorOptions.filter((c) => product.colors.includes(c.id));
  const related = await relatedProducts(product);

  return (
    <main>
      <div className="container-page pb-16 pt-8 md:pt-14">
        <nav aria-label="Breadcrumb" className="text-micro-caps mb-6 text-muted md:mb-10">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-ink">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          {/* Imagery */}
          <div className="md:col-span-7">
            <div className="media-frame">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                preload
                sizes="(min-width: 48rem) 58vw, 100vw"
                className="object-cover"
              />
              {product.badge && (
                <span className="text-micro-caps absolute left-3 top-3 bg-paper px-2 py-1">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Information: stays in view beside the image on desktop */}
          <div className="md:col-span-5 md:self-start md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <Link
              href={`/shop?category=${product.categorySlug}`}
              className="text-eyebrow text-muted hover:text-ink"
            >
              {product.category}
            </Link>
            <h1 className="mt-3 text-title">{product.name}</h1>
            <p className="mt-4 text-lead">{formatPrice(product.priceCents)}</p>

            <p
              className="text-eyebrow mt-6 flex items-center gap-3"
              data-stock={stock.status}
            >
              <span aria-hidden="true" className={`size-2 ${stockStyles[stock.status]}`} />
              {stock.label}
            </p>

            <dl className="mt-8 divide-y divide-line border-y border-line">
              <div className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                <dt className="text-eyebrow text-muted">Category</dt>
                <dd>
                  <Link href={`/shop?category=${product.categorySlug}`} className="link">
                    {product.category}
                  </Link>
                </dd>
              </div>
              {department && (
                <div className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                  <dt className="text-eyebrow text-muted">Department</dt>
                  <dd>
                    <Link href={`/shop?department=${department.id}`} className="link">
                      {department.label}
                    </Link>
                  </dd>
                </div>
              )}
              <div className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                <dt className="text-eyebrow text-muted">Colour</dt>
                <dd className="flex flex-wrap gap-x-5 gap-y-2">
                  {colors.map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-3 border border-muted/50"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.label}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                <dt className="text-eyebrow text-muted">Sizes</dt>
                <dd className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span key={s} className="chip min-h-8 px-3">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <ul className="mt-8 space-y-3 text-muted">
              {services.slice(0, 2).map((s) => (
                <li key={s.title}>
                  <span className="text-ink">{s.title}.</span> {s.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page pb-(--section-y)" aria-label="Related products">
          <SectionHeading
            eyebrow="You may also like"
            title="Complete the look"
            href={`/shop?category=${product.categorySlug}`}
            linkLabel={`More ${product.category.toLowerCase()}`}
          />
          <div className="product-grid">
            {related.map((item, i) => (
              <ProductCard
                key={item.id}
                product={item}
                // 3-column tablet grid: stop at 3 so the row is full
                className={i >= 3 ? "md:max-xl:hidden" : ""}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function ProductSkeleton() {
  return (
    <div className="container-page pb-16 pt-8 md:pt-14">
      <div className="mb-10 h-4 w-64 bg-canvas" />
      <div className="grid gap-8 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
        <div className="media-frame animate-pulse md:col-span-7" />
        <div className="space-y-4 md:col-span-5">
          <div className="h-4 w-24 bg-canvas" />
          <div className="h-10 w-3/4 bg-canvas" />
          <div className="h-6 w-20 bg-canvas" />
        </div>
      </div>
    </div>
  );
}
