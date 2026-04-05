## frontend-assessment-dammy — Content Explorer (DummyJSON Products)

A small “Content Explorer” app built with **Next.js (App Router)**, **TypeScript (strict)**, and **Tailwind CSS**. It uses the public [DummyJSON Products API](https://dummyjson.com/docs/products) (no key) to provide a browsable, searchable catalog.

### Features

- **Listing page**: `GET /products` server-rendered list with **20 items per page**, responsive grid, and pagination.
- **Cards**: title, image (with fallback), and multiple metadata fields (price, rating, stock, category, brand, discount).
- **Detail page**: `GET /products/[id]` server-fetched detail view with **breadcrumbs** and correct **Next.js metadata** (`title`, `description`, `og:image`).
- **Search + filter**: URL-driven `q` (debounced) + `category` filter so results are shareable (e.g. `/products?q=phone&category=smartphones&page=2`).
- **States**: route-level skeleton loaders (`loading.tsx`), friendly error boundaries (`error.tsx`), and a dedicated empty-state UI.
- **Streaming** (bonus): “More in category” uses **Suspense** with a server component fallback.
- **Edge caching** (bonus): `/products` is cached at the edge on Workers, with `x-cache-status: HIT|MISS`.
- **Accessibility audit** (bonus): Lighthouse accessibility score **100** (details below).

### Tech stack

- **Framework**: Next.js (App Router), React, TypeScript (strict).
- **Styling**: Tailwind CSS (no UI component library).
- **Testing**: Vitest + React Testing Library.

### Local setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` (the home route redirects to `/products`).

### Environment variables

Keys are documented in `.env.example`:

- **`NEXT_PUBLIC_SITE_URL`**: recommended for correct absolute metadata URLs in production (e.g. `https://your-deployment.example`).
- **`DUMMYJSON_BASE_URL`**: optional override (defaults to `https://dummyjson.com`).

### Scripts

- **`npm run dev`**: local dev server
- **`npm run build`** / **`npm start`**: production build + server
- **`npm run lint`**: ESLint (Next core web vitals + TS rules)
- **`npm test`** / **`npm run test:run`**: Vitest (watch / CI)
- **`npm run preview`**: build + run locally on the **Cloudflare Workers runtime** (OpenNext)
- **`npm run deploy`**: build + deploy to **Cloudflare Workers** (OpenNext)
- **`npm run upload`**: build + upload a new Workers version (OpenNext)

### Architecture notes

- **`src/app/*`**: Next.js App Router routes, layouts, loading/error boundaries
- **`src/lib/dummyjson/*`**: API layer (`dummyJsonFetch`, `getProductsPage`, `getProductById`, `getProductCategories`)
- **`src/lib/*`**: shared utilities (e.g. `buildUrl`, formatting)
- **`src/types/*`**: shared types (`Product`, `ProductListItem`, paginated response shapes)
- **`src/components/*`**: reusable UI (`SmartImage`, `Pagination`, `Breadcrumbs`, `EmptyState`)
- **`src/features/products/*`**: feature-scoped logic/UI (listing/search/detail helpers + components)
- **`worker.ts`**: custom Cloudflare Worker entrypoint that wraps the OpenNext-generated handler

**Deviation from the screenshot**: these folders live under `src/` (instead of repo root) to keep application code separate from tooling/config and to support the `@/*` import alias.

### Performance optimizations (what/where/why)

- **`next/image` everywhere**: explicit `width`/`height`, responsive `sizes`, and **`priority`** for above-the-fold images (`src/features/products/components/ProductCard.tsx`, `src/app/products/[id]/page.tsx`).
- **System font stack**: avoids external font downloads and removes a build-time network dependency (`src/app/globals.css`).
- **Fetch caching**: `revalidate` for stable endpoints (categories, default listing, product details) and `no-store` for query search (`src/lib/dummyjson/products.ts`).
- **Aggressive static asset caching (Cloudflare)**: immutable `Cache-Control` via `public/_headers` for `/_next/static/*` and `/placeholder.svg`.
- **Edge cache (bonus)**: `/products` is cached using the **Workers Cache API** (`caches.default`) and emits `x-cache-status: HIT|MISS` (`worker.ts`).
- **Streaming**: related products section streamed via Suspense (`src/app/products/[id]/page.tsx`).

### Deployment

#### Vercel (simple)

- Import the repo in Vercel.
- Set **`NEXT_PUBLIC_SITE_URL`** to your Vercel URL (recommended).

#### Cloudflare Workers (preferred) via OpenNext

OpenNext provides a CLI that converts a standard Next.js build into a Workers-compatible bundle. Official docs: [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare/howtos/dev-deploy).

- One-time setup (generates `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`, and scripts):

```bash
npx @opennextjs/cloudflare migrate
```

- Local preview in the Workers runtime:

```bash
npm run preview
```

Verify edge caching (note: `curl -I` uses `HEAD`, which is supported):

```bash
curl -I http://localhost:8787/products
curl -I http://localhost:8787/products
```

The second response should show **`x-cache-status: HIT`**.

- Deploy:

```bash
wrangler login
npm run deploy
```
If `migrate` can’t complete cache setup automatically, you can still deploy; the edge caching bonus in `worker.ts` does not require R2/D1/DO bindings.

**How caching maps on Workers (OpenNext)**:

- **`fetch(..., { next: { revalidate: N } })`**: cached in OpenNext’s data cache and revalidated after \(N\) seconds.
- **`fetch(..., { cache: "no-store" })`**: bypasses the data cache (always fetches fresh).
- **Edge cache for `/products`**: implemented separately in `worker.ts` using **`caches.default`**, which is why you see `x-cache-status: HIT|MISS` on listing responses.

### Accessibility audit (Bonus B-3)

**Tool**: Lighthouse (Chrome headless)

**How to run** (with `npm run preview` running on `http://localhost:8787`):

```bash
npx --yes lighthouse http://localhost:8787/products --only-categories=accessibility --chrome-flags="--headless --no-sandbox"
npx --yes lighthouse http://localhost:8787/products/1 --only-categories=accessibility --chrome-flags="--headless --no-sandbox"
```

**Results**

- **`/products`**: Accessibility **100**
- **`/products/1`**: Accessibility **100**

**Findings & fixes**

- **Missing main landmark (`landmark-one-main`)**: fixed by wrapping route content in a `<main id="content">` in `src/app/layout.tsx`.
- **Heading order on listing (`heading-order`)**: fixed by adding a (screen-reader-only) `h2` (“Results”) above the product grid in `src/app/products/page.tsx`.
- **Keyboard navigation**: added a “Skip to content” link in `src/app/layout.tsx`.

**Known remaining issues**

- None reported by Lighthouse for these routes; manual checks (screen reader/keyboard-only flows) are still recommended for production readiness.

### Trade-offs & known limitations

- **Combined `q` + `category`**: DummyJSON doesn’t support searching within a category via query params, so the app fetches the category list (cached) and filters server-side for shareable URLs. For a real backend, this would be handled with proper indexed server-side search.

### If I had 2 more hours

- **OpenNext persistent cache**: configure R2 + DO queue/tag cache for ISR/data-cache persistence across deploys.
- **A11y audit**: run Lighthouse/axe, fix any contrast/label issues, and document results.
- **More tests**: cover `SearchFilters` URL behavior + empty/error states.
