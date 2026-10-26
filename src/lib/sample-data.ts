export const STORE_NAME = "Aurelle";

const UNSPLASH = "https://images.unsplash.com/photo-";

export function img(id: string) {
  return `${UNSPLASH}${id}?auto=format&fit=crop&q=80&w=1800`;
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Product detail URL, keyed by the stored slug. */
export function productHref(slug: string) {
  return `/shop/${slug}`;
}

export type Product = {
  id: number;
  slug: string;
  name: string;
  /** Category display name. */
  category: string;
  categorySlug: string;
  department: "women" | "men";
  /** USD in minor units (cents). */
  priceCents: number;
  stockQuantity: number;
  image: string;
  alt: string;
  badge?: string;
  sizes: string[];
  colors: string[];
};

export type Collection = {
  title: string;
  href: string;
  image: string;
  alt: string;
};

export const navLinks = [
  { label: "Women", href: "/shop?department=women" },
  { label: "Men", href: "/shop?department=men" },
  { label: "Outerwear", href: "/shop?category=outerwear" },
  { label: "Knitwear", href: "/shop?category=knitwear" },
  { label: "Sale", href: "#" },
];

export const collections: Collection[] = [
  {
    title: "Evening",
    href: "/shop?category=evening",
    image: img("1566174053879-31528523f8ae"),
    alt: "Woman in a plum off-shoulder gown against a violet backdrop",
  },
  {
    title: "Menswear",
    href: "/shop?department=men",
    image: img("1487222477894-8943e31ef7b2"),
    alt: "Man in a tan leather jacket and round sunglasses",
  },
  {
    title: "Outerwear",
    href: "/shop?category=outerwear",
    image: img("1485968579580-b6d095142e6e"),
    alt: "Woman in a dark plaid coat on a city street",
  },
  {
    title: "Knitwear",
    href: "/shop?category=knitwear",
    image: img("1558769132-cb1aea458c5e"),
    alt: "Neutral knit sweaters hanging on a rail",
  },
];

export const services = [
  { title: "Complimentary shipping", body: "On every order, worldwide." },
  { title: "Thirty-day returns", body: "Free and simple, no questions." },
  { title: "Gift packaging", body: "Wrapped by hand in every parcel." },
  { title: "Client care", body: "A stylist, by chat or phone." },
];

export const footerColumns = [
  {
    title: "Client care",
    links: ["Contact us", "Shipping", "Returns", "Size guide", "FAQ"],
  },
  {
    title: "The house",
    links: ["Our story", "Craftsmanship", "Sustainability", "Careers"],
  },
  {
    title: "Shop",
    links: ["New arrivals", "Women", "Men", "Outerwear", "Sale"],
  },
];

/** Formats USD minor units (cents), e.g. 129000 -> "$1,290". */
export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
