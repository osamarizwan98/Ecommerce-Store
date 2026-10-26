# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # next dev (Turbopack)
npm run build        # next build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run db:generate  # drizzle-kit generate (SQL migrations -> ./drizzle)
npm run db:migrate   # drizzle-kit migrate
npm run db:push      # drizzle-kit push (sync schema directly, no migration files)
npm run db:studio    # drizzle-kit studio
npm run db:seed      # tsx src/db/seed.ts (idempotent upsert of categories + products)
```

There is no test runner configured yet.

`tsc --noEmit` fails on `LayoutProps` in `src/app/layout.tsx` until route types exist; run `npx next typegen` (or `next dev`/`next build`) first.

## Next.js version warning

This is Next.js 16 / React 19, with breaking changes from older versions. `AGENTS.md` requires reading the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heeding deprecation notices.

## Architecture

Next.js App Router + TypeScript + Tailwind v4 (`@import "tailwindcss"` in `src/app/globals.css`, no tailwind config file) + Better Auth + Drizzle ORM + Neon Postgres. The storefront (`/`, `/shop`, `/shop/[slug]`) reads products and categories from Postgres. There is no cart, checkout or auth UI yet. Path alias `@/*` -> `src/*`.

### Database conventions

- Money is integer USD cents (`price_cents`), never floats. Format only at display time via `formatPrice`.
- Stock is a single `stock_quantity` column on `products`. No inventory tables, variants or warehouses until needed. Stock status (low / sold out) is derived in app code, not stored. When orders arrive, decrement atomically: `UPDATE ... SET stock_quantity = stock_quantity - n WHERE stock_quantity >= n`.
- `department`, `sizes` and `colors` are filter attributes, not variants.
- Change the schema with `db:generate` + `db:migrate` (committed migrations), not `db:push`.
- Catalog reads use `"use cache"` with `cacheTag("products" | "categories")`; call `revalidateTag` after any write.
- `next build` needs `DATABASE_URL` plus a migrated, seeded database (`generateStaticParams` queries it).

The server request path spans several files:

```
/api/auth/*  ->  src/app/api/auth/[...all]/route.ts   (toNextJsHandler(auth) -> GET/POST)
             ->  src/lib/auth.ts      (betterAuth + drizzleAdapter(db, {provider:"pg"}) + nextCookies())
             ->  src/db/index.ts      (drizzle over @neondatabase/serverless neon-http)
             ->  Neon Postgres via DATABASE_URL
```

- `src/db/index.ts` throws at import time if `DATABASE_URL` is unset, so anything importing `db` (including the auth route) needs it.
- `src/lib/auth-client.ts` is the browser-side Better Auth client (base URL `NEXT_PUBLIC_APP_URL`); it talks to the same `/api/auth/*` route.
- `drizzle.config.ts` is CLI-only and separate from the app's runtime DB client. It loads `.env.local` then `.env`, reads schema from `./src/db/schema` and writes migrations to `./drizzle`.
- Better Auth's Drizzle adapter requires user/session/account/verification tables, and no sign-in method is enabled yet, so the auth endpoints won't work until the schema is added and a method is configured in `src/lib/auth.ts`.

## Environment

Copy `.env.example` to `.env.local`. Variables: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`. `.gitignore` ignores `.env*` except `.env.example`.
