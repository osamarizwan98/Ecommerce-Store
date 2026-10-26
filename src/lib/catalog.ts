export type Department = "women" | "men";

export const PAGE_SIZE = 12;

export const departments: { id: Department; label: string }[] = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
];

export const colorOptions = [
  { id: "black", label: "Black", hex: "#111111" },
  { id: "white", label: "White", hex: "#ffffff" },
  { id: "cream", label: "Cream", hex: "#eadfca" },
  { id: "grey", label: "Grey", hex: "#9a9a9a" },
  { id: "brown", label: "Brown", hex: "#7a4a2b" },
  { id: "orange", label: "Orange", hex: "#d77a1f" },
  { id: "yellow", label: "Yellow", hex: "#e3b61f" },
  { id: "red", label: "Red", hex: "#b3261e" },
  { id: "pink", label: "Pink", hex: "#e5b3bd" },
  { id: "purple", label: "Purple", hex: "#5a2a5f" },
  { id: "blue", label: "Blue", hex: "#3d6fa5" },
  { id: "navy", label: "Navy", hex: "#1c2a4a" },
] as const;

export const sizeOptions = ["XS", "S", "M", "L", "XL"] as const;

/** Bounds are in cents: `minCents` inclusive, `maxCents` exclusive. */
export const priceRanges = [
  { id: "under-500", label: "Under $500", maxCents: 50_000 },
  { id: "500-1000", label: "$500 to $1,000", minCents: 50_000, maxCents: 100_001 },
  { id: "over-1000", label: "Over $1,000", minCents: 100_001 },
] as const;

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
] as const;

export type SortKey = (typeof sortOptions)[number]["id"];

/* ---- Stock ---- */

export type StockStatus = "in-stock" | "low-stock" | "sold-out";

const LOW_STOCK_THRESHOLD = 5;

export function getStock(product: { stockQuantity: number }): {
  status: StockStatus;
  label: string;
} {
  const units = product.stockQuantity;
  if (units <= 0) return { status: "sold-out", label: "Sold out" };
  if (units < LOW_STOCK_THRESHOLD) {
    return { status: "low-stock", label: `Low stock, only ${units} left` };
  }
  return { status: "in-stock", label: "In stock" };
}

/* ---- Query handling (state lives in the URL) ---- */

export type ShopQuery = {
  department?: Department;
  /** Category slug; unknown slugs are dropped by the page once categories are loaded. */
  category?: string;
  sort: SortKey;
  sizes: string[];
  colors: string[];
  price?: string;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

function many(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return (Array.isArray(v) ? v : [v]).filter(Boolean);
}

function one(v: string | string[] | undefined): string | undefined {
  return many(v)[0];
}

export function parseQuery(raw: RawParams): ShopQuery {
  const department = one(raw.department);
  const category = one(raw.category);
  const sort = one(raw.sort);
  const price = one(raw.price);
  const page = Number(one(raw.page));

  return {
    department: departments.some((d) => d.id === department)
      ? (department as Department)
      : undefined,
    category,
    sort: sortOptions.some((s) => s.id === sort) ? (sort as SortKey) : "featured",
    // Dedupe after allowlisting so repeated params can't grow past the option sets.
    sizes: [...new Set(many(raw.size).filter((s) => (sizeOptions as readonly string[]).includes(s)))],
    colors: [...new Set(many(raw.color).filter((c) => colorOptions.some((o) => o.id === c)))],
    price: priceRanges.some((r) => r.id === price) ? price : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** Build a /shop URL from a query, omitting defaults. */
export function shopHref(q: ShopQuery, overrides: Partial<ShopQuery> = {}) {
  const n = { ...q, ...overrides };
  const sp = new URLSearchParams();
  if (n.department) sp.set("department", n.department);
  if (n.category) sp.set("category", n.category);
  if (n.sort !== "featured") sp.set("sort", n.sort);
  n.sizes.forEach((s) => sp.append("size", s));
  n.colors.forEach((c) => sp.append("color", c));
  if (n.price) sp.set("price", n.price);
  if (n.page > 1) sp.set("page", String(n.page));
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

/** Number of active filters in the drawer (category and sort are not counted). */
export function activeFilterCount(q: ShopQuery) {
  return (
    (q.department ? 1 : 0) + q.sizes.length + q.colors.length + (q.price ? 1 : 0)
  );
}
