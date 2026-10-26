import Link from "next/link";

import { footerColumns, STORE_NAME } from "@/lib/sample-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-2xl uppercase tracking-[0.3em]">
            {STORE_NAME}
          </p>
          <p className="mt-4 max-w-xs text-muted">
            Considered wardrobe pieces, made to be worn for years.
          </p>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-eyebrow mb-5 font-sans">{col.title}</h3>
            <ul className="space-y-3">
              {col.links.map((label) => (
                <li key={label}>
                  <Link href="#" className="link text-muted hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page text-micro-caps flex flex-col gap-2 py-6 text-muted sm:flex-row sm:justify-between">
          <p>&copy; {STORE_NAME}. Demo storefront.</p>
          <p>Privacy &middot; Terms &middot; Cookies</p>
        </div>
      </div>
    </footer>
  );
}
