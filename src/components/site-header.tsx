"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { navLinks, STORE_NAME } from "@/lib/sample-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="bg-ink text-paper">
        <p className="text-micro-caps container-page py-2 text-center">
          Complimentary shipping &amp; returns
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div
          className="container-page grid grid-cols-[1fr_auto_1fr] items-center"
          style={{ height: "var(--header-h)" }}
        >
          <nav aria-label="Primary" className="hidden gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="text-eyebrow justify-self-start lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>

          <Link
            href="/"
            className="font-display text-2xl uppercase tracking-[0.3em] md:text-3xl"
          >
            {STORE_NAME}
          </Link>

          <div className="text-eyebrow flex items-center justify-end gap-5 md:gap-8">
            <Link href="#" className="nav-link hidden md:inline">
              Search
            </Link>
            <Link href="#" className="nav-link hidden md:inline">
              Account
            </Link>
            <Link href="#" className="nav-link">
              Bag (0)
            </Link>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-x-0 bottom-0 overflow-y-auto border-t border-line bg-paper lg:hidden"
            style={{ top: "calc(var(--header-h) + 2.25rem)" }}
          >
            <ul className="container-page py-6">
              {navLinks.map((link) => (
                <li key={link.label} className="border-b border-line">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-5 font-display text-3xl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="text-eyebrow flex gap-8 pt-6">
                <Link href="#" className="nav-link">
                  Search
                </Link>
                <Link href="#" className="nav-link">
                  Account
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
