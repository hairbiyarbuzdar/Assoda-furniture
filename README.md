# Assoda Furniture — Catalog & Dashboard

Landing page + product catalog with a password-protected admin dashboard.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS · Supabase (Postgres) · Cloudinary (images)

## Features

- **Landing** (`/`) — hero + featured products
- **Catalog** (`/catalog`) — grid with category filter
- **Product detail** (`/catalog/[slug]`) — gallery, price, specs (dimensions / material / colors)
- **Dashboard** (`/dashboard`) — single-password login, full product CRUD, direct Cloudinary uploads
- Multiple images per product, categories, price, in-stock & featured flags

## Project structure

```
src/
  app/
    page.tsx                      Landing
    catalog/page.tsx              Catalog + category filter
    catalog/[slug]/page.tsx       Product detail
    dashboard/                    Admin (guarded by middleware)
      login/page.tsx
      page.tsx                    Product list
      products/new/page.tsx
      products/[id]/page.tsx      Edit
    api/
      auth/login | logout         Password session
      upload                      Signed Cloudinary upload
      products | products/[id]    Product CRUD
      categories | categories/[id]
  components/                     UI (header, cards, forms, uploader)
  lib/
    supabase.ts                   Public (anon) + admin (service role) clients
    cloudinary.ts                 Signing + delete
    auth.ts                       Password check + JWT session
    queries.ts                    Public read helpers
    types.ts  utils.ts  guard.ts
  middleware.ts                   Protects /dashboard
supabase/schema.sql               Tables, RLS, seed categories
```

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Environment** — copy and fill:

   ```bash
   cp .env.local.example .env.local
   ```

   - Supabase: Project Settings → API (URL, anon key, service role key)
   - Cloudinary: Dashboard → credentials (cloud name, API key, API secret)
   - `ADMIN_PASSWORD`: the dashboard password
   - `SESSION_SECRET`: a long random string (`openssl rand -base64 32`)

3. **Database** — open the Supabase SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates `categories` + `products`, enables RLS (public read-only), and seeds a few categories.

4. **Run**

   ```bash
   npm run dev
   ```

   - Site: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard (redirects to login)

## Admin panel

The admin panel lives at **`/dashboard`** (single shared password — `ADMIN_PASSWORD`). It manages:

- **Products** — full CRUD incl. rich product-page fields (subtitle, frame finishes, upholstery, care, artisanal story) and images
- **Categories** — the catalog Room Type filters
- **Site Content** — homepage + Our Story editorial copy and imagery

### Storage seam (dev vs production)

All reads/writes go through one interface, `getStore()` in [`src/lib/store/index.ts`](src/lib/store/index.ts):

- **No Supabase env → local JSON store** (`data/*.json`, seeded from `src/lib/sample-data.ts`). Lets you run and use the admin with **no external accounts**. ⚠️ This is **dev-only** — serverless filesystems are ephemeral, so it does not persist in production.
- **Supabase env present → Supabase store.** Switching backends is automatic; no code changes.

Until Cloudinary is configured, the image uploader falls back to **pasting an image URL** (use an allowed host: `picsum.photos`, `images.unsplash.com`, `res.cloudinary.com`).

To go live: fill `.env.local`, run [`supabase/schema.sql`](supabase/schema.sql), and the same admin flows persist to Postgres + Cloudinary.

## How the pieces fit

- **Public reads** use the Supabase **anon** key and are limited by RLS to `SELECT`.
- **Dashboard writes** go through `/api/*` routes that first check the admin session, then use the Supabase **service role** key (bypasses RLS). The service key is never exposed to the browser.
- **Image uploads** are signed server-side (`/api/upload`) and sent **directly browser → Cloudinary**, so the API secret stays on the server. Images are stored on each product as a JSON array of `{ public_id, url, width, height }`.

## Design

The UI is intentionally minimal and neutral so you can drop in your own design.
Brand tokens live in [`tailwind.config.ts`](tailwind.config.ts) (`brand`, `brand.accent`) and base styles in [`src/app/globals.css`](src/app/globals.css).
