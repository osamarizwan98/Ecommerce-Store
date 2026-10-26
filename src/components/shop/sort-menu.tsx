"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string; href: string; active: boolean };

export function SortMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = items.find((i) => i.active) ?? items[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="text-eyebrow inline-flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-muted">Sort</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span aria-hidden="true" className={open ? "rotate-180" : ""}>
          &darr;
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="surface absolute right-0 top-full z-50 mt-3 min-w-56 py-2"
        >
          {items.map((item) => (
            <li key={item.id} role="option" aria-selected={item.active}>
              <Link
                href={item.href}
                scroll={false}
                onClick={() => setOpen(false)}
                className={`text-eyebrow block px-5 py-3 hover:bg-canvas ${
                  item.active ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
