"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  colorOptions,
  departments,
  priceRanges,
  sizeOptions,
  type Department,
} from "@/lib/catalog";

type Props = {
  selected: {
    department?: Department;
    sizes: string[];
    colors: string[];
    price?: string;
  };
  /** Params that live outside the drawer and must survive an apply. */
  carry: { category?: string; sort?: string };
  activeCount: number;
  resultCount: number;
  clearHref: string;
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-6">
      <legend className="text-eyebrow mb-4 float-left w-full">{title}</legend>
      <div className="clear-both flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Option({
  type,
  name,
  value,
  label,
  checked,
  swatch,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  label: string;
  checked: boolean;
  swatch?: string;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        defaultChecked={checked}
        className="peer sr-only"
      />
      <span className="chip gap-2 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
        {swatch && (
          <span
            aria-hidden="true"
            className="size-3 border border-muted/50"
            style={{ background: swatch }}
          />
        )}
        {label}
      </span>
    </label>
  );
}

export function FilterPanel({
  selected,
  carry,
  activeCount,
  resultCount,
  clearHref,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(e.currentTarget)) {
      if (typeof value === "string" && value) params.append(key, value);
    }
    const qs = params.toString();
    setOpen(false);
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  // Remount the form when the URL-driven selection changes so defaults stay in sync.
  const formKey = JSON.stringify(selected);

  return (
    <>
      <button
        type="button"
        className="text-eyebrow inline-flex items-center gap-2"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Filter{activeCount > 0 && <span>({activeCount})</span>}
      </button>

      {open &&
        // Portal: the sticky toolbar is its own stacking context, which would
        // otherwise trap the drawer beneath the site header.
        createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 cursor-default bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <form
            key={formKey}
            onSubmit={onSubmit}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-eyebrow font-sans">Filter</h2>
              <button
                type="button"
                className="text-eyebrow"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {carry.category && <input type="hidden" name="category" value={carry.category} />}
              {carry.sort && <input type="hidden" name="sort" value={carry.sort} />}

              <Group title="Department">
                <Option type="radio" name="department" value="" label="All" checked={!selected.department} />
                {departments.map((d) => (
                  <Option
                    key={d.id}
                    type="radio"
                    name="department"
                    value={d.id}
                    label={d.label}
                    checked={selected.department === d.id}
                  />
                ))}
              </Group>

              <Group title="Size">
                {sizeOptions.map((s) => (
                  <Option key={s} type="checkbox" name="size" value={s} label={s} checked={selected.sizes.includes(s)} />
                ))}
              </Group>

              <Group title="Colour">
                {colorOptions.map((c) => (
                  <Option
                    key={c.id}
                    type="checkbox"
                    name="color"
                    value={c.id}
                    label={c.label}
                    swatch={c.hex}
                    checked={selected.colors.includes(c.id)}
                  />
                ))}
              </Group>

              <Group title="Price">
                <Option type="radio" name="price" value="" label="Any" checked={!selected.price} />
                {priceRanges.map((r) => (
                  <Option
                    key={r.id}
                    type="radio"
                    name="price"
                    value={r.id}
                    label={r.label}
                    checked={selected.price === r.id}
                  />
                ))}
              </Group>
            </div>

            <div className="flex gap-3 border-t border-line p-6">
              <Link
                href={clearHref}
                scroll={false}
                onClick={() => setOpen(false)}
                className="btn btn-secondary flex-1"
              >
                Clear all
              </Link>
              <button type="submit" className="btn btn-primary flex-1">
                Show {resultCount}
              </button>
            </div>
          </form>
        </div>,
        document.body,
      )}
    </>
  );
}
