import Image from "next/image";
import Link from "next/link";

import { formatPrice, productHref, type Product } from "@/lib/sample-data";

export function ProductCard({
  product,
  sizes = "(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 50vw",
  className = "",
}: {
  product: Product;
  sizes?: string;
  className?: string;
}) {
  return (
    <article className={`group ${className}`}>
      <Link href={productHref(product.slug)} className="block">
        <div className="media-frame">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {product.badge && (
            <span className="text-micro-caps absolute left-3 top-3 bg-paper px-2 py-1">
              {product.badge}
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="product-name font-sans">{product.name}</h3>
            <p className="mt-1 text-muted">{product.category}</p>
          </div>
          <p className="product-price shrink-0 text-ink">
            {formatPrice(product.priceCents)}
          </p>
        </div>
      </Link>
    </article>
  );
}
