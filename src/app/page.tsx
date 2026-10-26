import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { listHomeProducts } from "@/db/queries/catalog";
import { collections, img, services } from "@/lib/sample-data";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate flex min-h-[34rem] h-[calc(100svh-6.25rem)] items-end bg-canvas text-paper">
        <Image
          src={img("1483985988355-763728e1935b")}
          alt="Woman in a burgundy coat and sunglasses carrying shopping bags"
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
        <div className="container-page pb-12 md:pb-20">
          <p className="text-eyebrow mb-5">Autumn / Winter</p>
          <h1 className="max-w-2xl text-display">
            The new season <em className="font-normal italic">wardrobe</em>
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="#" className="btn btn-light">
              Shop the collection
            </Link>
            <Link
              href="#"
              className="btn btn-ghost btn-ghost-light"
            >
              View lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Featured collections: staggered columns on desktop */}
      <section className="container-page section-y">
        <SectionHeading eyebrow="Collections" title="Shop by category" />
        <div className="grid grid-cols-2 gap-x-2 gap-y-10 md:gap-x-4 lg:grid-cols-4 lg:[&>*:nth-child(even)]:mt-16">
          {collections.map((c) => (
            <Link key={c.title} href={c.href} className="group block">
              <div className="media-frame">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 64rem) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl md:text-2xl">{c.title}</h3>
                <span className="text-micro-caps text-muted transition-colors group-hover:text-ink">
                  Shop
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page pb-[var(--section-y)]">
        <SectionHeading
          eyebrow="Just in"
          title="New arrivals"
          href="/shop?sort=newest"
          linkLabel="Shop all new"
        />
        <Suspense fallback={<NewArrivalsSkeleton />}>
          <NewArrivals />
        </Suspense>
      </section>

      {/* Editorial banner: text anchored bottom-left */}
      <section className="relative isolate flex min-h-120 items-end bg-canvas py-12 text-paper md:min-h-168 md:py-20">
        <Image
          src={img("1441984904996-e0b6ba687e04")}
          alt="Boutique interior with clothing rails and pendant lamps"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/35 to-black/10" />
        <div className="container-page">
          <p className="text-eyebrow mb-4">The Edit</p>
          <h2 className="max-w-xl text-display">
            Quiet pieces, made to last
          </h2>
          <Link href="#" className="btn btn-light mt-8">
            Discover the edit
          </Link>
        </div>
      </section>

      {/* Split editorial: large image, text and a smaller offset image */}
      <section className="container-page section-y">
        <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
          <div className="media-frame md:col-span-6">
            <Image
              src={img("1490481651871-ab68de25d43d")}
              alt="Neutral clothing on a rail against a white wall"
              fill
              sizes="(min-width: 48rem) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-between gap-10 md:col-span-5 md:col-start-8">
            <div className="max-w-md border-t border-ink pt-6">
              <p className="text-eyebrow mb-4 text-muted">Essentials</p>
              <h2>Wardrobe foundations in considered colour</h2>
              <p className="mt-6 text-muted">
                Soft cottons, honest cuts and a palette that works with
                everything you already own.
              </p>
              <Link href="#" className="btn btn-secondary mt-8">
                Shop essentials
              </Link>
            </div>
            <div className="media-frame hidden w-2/3 self-end md:block">
              <Image
                src={img("1523381210434-271e8be1f52b")}
                alt="Sage green t-shirts on wooden hangers"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers rail with ranked numerals */}
      <section className="bg-canvas section-y">
        <div className="container-page">
          <SectionHeading eyebrow="Most loved" title="Best sellers" href="/shop" />
          <Suspense fallback={<div className="rail h-80" />}>
            <BestSellers />
          </Suspense>
        </div>
      </section>

      {/* Services: hairline columns, no boxes */}
      <section className="container-page section-y">
        <ul className="grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li key={s.title} className="bg-paper px-0 py-8 sm:px-6 lg:first:pl-0">
              <h3 className="text-eyebrow font-sans">{s.title}</h3>
              <p className="mt-3 text-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletter: split layout */}
      <section className="border-t border-line">
        <div className="container-page section-y grid items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-eyebrow mb-4 text-muted">Newsletter</p>
            <h2 className="max-w-md">Early access to new collections</h2>
          </div>
          <div>
            <p className="mb-6 max-w-md text-muted">
              Private sales, new arrivals and notes from the studio. No more
              than twice a month.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}

async function NewArrivals() {
  const { newArrivals } = await listHomeProducts();
  return (
    <div className="product-grid">
      {newArrivals.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          // 3-column tablet grid: stop at 6 so the last row is full
          className={i >= 6 ? "md:max-xl:hidden" : ""}
        />
      ))}
    </div>
  );
}

async function BestSellers() {
  const { bestSellers } = await listHomeProducts();
  return (
    <div className="rail -mx-(--gutter) gap-4 px-(--gutter) md:mx-0 md:px-0">
      {bestSellers.map((p, i) => (
        <div key={p.id} className="w-[62%] sm:w-[40%] lg:w-[24%]">
          <span className="mb-3 block font-display text-4xl leading-none text-muted md:text-5xl">
            {String(i + 1).padStart(2, "0")}
          </span>
          <ProductCard
            product={p}
            sizes="(min-width: 64rem) 24vw, (min-width: 40rem) 40vw, 62vw"
          />
        </div>
      ))}
    </div>
  );
}

function NewArrivalsSkeleton() {
  return (
    <div className="product-grid">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="media-frame animate-pulse" />
      ))}
    </div>
  );
}
