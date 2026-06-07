-- =====================================================================
-- Assoda Furniture — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- =====================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------- Categories ----------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- ---------- Products ----------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price       numeric(10, 2),
  category_id uuid references public.categories(id) on delete set null,

  -- specs
  dimensions  text,                       -- e.g. "200 x 90 x 75 cm (W x D x H)"
  material    text,                       -- e.g. "Solid oak, linen upholstery"
  colors      text[]      not null default '{}',  -- available colors
  in_stock    boolean     not null default true,
  featured    boolean     not null default false,

  -- images: array of { public_id, url, width, height }
  images      jsonb       not null default '[]'::jsonb,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_featured_idx     on public.products (featured);

-- Rich product-page detail fields (subtitle, frame finishes, care, story, ...).
alter table public.products
  add column if not exists details jsonb not null default '{}'::jsonb;

-- ---------- Editorial site content (single-row document) ----------
create table if not exists public.site_content (
  id         text primary key default 'singleton',
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Row Level Security
-- Public site reads with the ANON key (read-only).
-- The dashboard writes with the SERVICE ROLE key, which bypasses RLS,
-- so we only need public SELECT policies here.
-- =====================================================================
alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (true);

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

-- ---------- Seed a few categories (optional) ----------
insert into public.categories (name, slug, description) values
  ('Sofas',  'sofas',  'Living room seating'),
  ('Beds',   'beds',   'Bedroom collection'),
  ('Tables', 'tables', 'Dining and coffee tables'),
  ('Storage','storage','Wardrobes, shelves and cabinets')
on conflict (slug) do nothing;
