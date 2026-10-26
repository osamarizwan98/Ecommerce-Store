import { img, slugify } from "../lib/sample-data";

export const seedCategories = [
  { slug: "dresses", name: "Dresses", blurb: "Day to evening silhouettes in fluid fabrics." },
  { slug: "evening", name: "Evening", blurb: "Occasion pieces with a quiet sense of drama." },
  { slug: "outerwear", name: "Outerwear", blurb: "Coats and jackets cut to layer and last." },
  { slug: "knitwear", name: "Knitwear", blurb: "Soft textures in considered shapes." },
  { slug: "tailoring", name: "Tailoring", blurb: "Sharp lines, precise fit." },
  { slug: "trousers", name: "Trousers", blurb: "Relaxed and wide, tapered and tailored." },
  { slug: "tops", name: "Tops", blurb: "Shirts and tees that do the everyday well." },
  { slug: "loungewear", name: "Loungewear", blurb: "Comfort without compromise." },
].map((c, i) => ({ ...c, sortOrder: i }));

type Department = "women" | "men";

const W: Department = "women";
const M: Department = "men";
const ALL_W = ["XS", "S", "M", "L"];
const ALL_M = ["S", "M", "L", "XL"];

/** Units on hand; products not listed here are well stocked. */
const lowStock: Record<string, number> = {
  c02: 3,
  c05: 0,
  c11: 2,
  c14: 4,
  c21: 0,
  c29: 1,
};
const DEFAULT_STOCK = 25;

/** `added` ranks recency (higher is newer); it becomes a fixed daily-spaced created_at. */
const NEWEST = Date.UTC(2026, 8, 1);
const DAY = 86_400_000;

function p(
  id: string,
  name: string,
  categorySlug: string,
  priceDollars: number,
  photo: string,
  alt: string,
  department: Department,
  colors: string[],
  sizes: string[],
  added: number,
  badge?: string,
) {
  return {
    categorySlug,
    slug: slugify(name),
    name,
    department,
    priceCents: priceDollars * 100,
    stockQuantity: lowStock[id] ?? DEFAULT_STOCK,
    imageUrl: img(photo),
    imageAlt: alt,
    badge: badge ?? null,
    colors,
    sizes,
    createdAt: new Date(NEWEST - (29 - added) * DAY),
  };
}

export const seedProducts = [
  p("c01", "Leather Biker Jacket", "outerwear", 1290, "1551028719-00167b16eac5", "Black leather biker jacket laid flat on white linen", W, ["black"], ["XS", "S", "M", "L"], 29, "New"),
  p("c02", "Fringed Crochet Poncho", "knitwear", 420, "1434389677669-e08b4cac3105", "Cream crochet poncho with fringe on a wooden hanger", W, ["cream"], ["S", "M", "L"], 28, "New"),
  p("c03", "Pleated Poppy Dress", "dresses", 780, "1572804013309-59a88b7e92f1", "Woman in a red patterned pleated dress with a woven belt", W, ["red"], ALL_W, 27),
  p("c04", "Gathered Cuff Trousers", "trousers", 350, "1594633312681-425c7b97ccd1", "Blush trousers with patch pockets and gathered ankles", W, ["pink"], ["XS", "S", "M", "L", "XL"], 26),
  p("c05", "Off-Shoulder Column Gown", "evening", 1480, "1566174053879-31528523f8ae", "Woman in a plum off-shoulder gown against a violet backdrop", W, ["purple"], ["XS", "S", "M"], 25, "New"),
  p("c06", "Tailored Wool Suit", "tailoring", 1850, "1507679799987-c73779587ccf", "Man buttoning a navy suit jacket", M, ["navy"], ALL_M, 24),
  p("c07", "Satin Wrap Maxi", "dresses", 890, "1539008835657-9e8e9680c956", "Woman in a pale blue wrap maxi dress on a beach", W, ["blue"], ALL_W, 23),
  p("c08", "Tartan Wool Coat", "outerwear", 1380, "1485968579580-b6d095142e6e", "Woman in a dark plaid coat on a city street", W, ["navy"], ["S", "M", "L"], 22),
  p("c09", "Striped Wide-Leg Trousers", "trousers", 390, "1509631179647-0177331693ae", "Woman in black and white striped wide-leg trousers against a teal wall", W, ["black", "white"], ["XS", "S", "M", "L"], 21),
  p("c10", "Merino Crew Sweater", "knitwear", 360, "1578587018452-892bacefd3f2", "Woman in an orange knit sweater and jeans", W, ["orange"], ["XS", "S", "M", "L", "XL"], 20),
  p("c11", "Check Three-Piece Suit", "tailoring", 2150, "1594938298603-c8148c4dae35", "Man in a blue check three-piece suit", M, ["blue"], ["M", "L", "XL"], 19),
  p("c12", "Floral Wrap Dress", "dresses", 640, "1496747611176-843222e1e57c", "Woman in a white floral wrap dress by the sea", W, ["white", "cream"], ALL_W, 18, "Limited"),
  p("c13", "Satin Bomber", "outerwear", 740, "1591047139829-d91aecb6caea", "Copper satin bomber jacket held up on a hanger", W, ["brown", "orange"], ["S", "M", "L"], 17),
  p("c14", "Sequin Two-Piece", "evening", 1120, "1550614000-4895a10e1bfd", "Two women in red sequin and tulle two-piece sets", W, ["red"], ["XS", "S", "M"], 16),
  p("c15", "Brushed Sweatshirt", "knitwear", 280, "1620799140408-edc6dcb6d633", "White crew-neck sweatshirt laid flat", M, ["white"], ALL_M, 15),
  p("c16", "Tan Leather Jacket", "outerwear", 1540, "1487222477894-8943e31ef7b2", "Man in a tan leather jacket and round sunglasses", M, ["brown"], ALL_M, 14),
  p("c17", "Halter Satin Jumpsuit", "evening", 830, "1495385794356-15371f348c31", "Woman in a teal halter jumpsuit", W, ["blue"], ALL_W, 13),
  p("c18", "Slim Navy Suit", "tailoring", 1790, "1617137968427-85924c800a22", "Man in a slim navy suit outside a glass building", M, ["navy"], ALL_M, 12),
  p("c19", "Puff-Sleeve Floral Dress", "dresses", 960, "1581044777550-4cfa60707c03", "Woman in a pink puff-sleeve floral dress in a wheat field", W, ["pink"], ["XS", "S", "M"], 11),
  p("c20", "Fleece Lounge Set", "loungewear", 460, "1515886657613-9f3515b0c78f", "Model in a saffron fleece hoodie and joggers", W, ["yellow"], ["XS", "S", "M", "L", "XL"], 10),
  p("c21", "Ruffle-Trim Coat", "outerwear", 1650, "1554412933-514a83d2f3c8", "Woman in a black ruffle-trim coat and wide-brim hat", W, ["black"], ["S", "M"], 9),
  p("c22", "Classic Cotton Tee", "tops", 85, "1521572163474-6864f9cf17ab", "Man in a plain white cotton t-shirt", M, ["white"], ["S", "M", "L", "XL"], 8),
  p("c23", "Chevron Knit Jumper", "knitwear", 340, "1475180098004-ca77a66827be", "Woman in a brown and cream chevron knit jumper", W, ["brown", "cream"], ["XS", "S", "M", "L"], 7),
  p("c24", "Chambray Button Shirt", "tops", 240, "1596755094514-f87e34085b2c", "Chambray three-quarter sleeve shirt on a hanger", W, ["blue"], ["XS", "S", "M", "L"], 6),
  p("c25", "Fitted Navy Blazer", "tailoring", 980, "1523359346063-d879354c0ea5", "Woman in a fitted navy blazer and jeans", W, ["navy"], ["XS", "S", "M", "L"], 5),
  p("c26", "Poplin Dress Shirt", "tops", 280, "1598033129183-c4f50c736f10", "Man in a white poplin shirt and patterned tie", M, ["white"], ALL_M, 4),
  p("c27", "Cold-Shoulder Shift", "dresses", 410, "1496217590455-aa63a8350eea", "Woman in a grey cold-shoulder shift dress by a teal door", W, ["grey"], ALL_W, 3),
  p("c28", "Utility Overshirt", "tops", 420, "1507680434567-5739c80be1ac", "Man in a dark utility overshirt", M, ["black"], ALL_M, 2),
  p("c29", "Ruffle Mini Dress", "dresses", 520, "1515372039744-b8f02a3ae446", "Woman in a white off-shoulder ruffle dress on a staircase", W, ["white"], ["XS", "S", "M"], 1),
].map((product, i) => ({ ...product, sortOrder: i }));
