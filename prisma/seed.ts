import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function img(seed: string) {
  return { public_id: `sample/${seed}`, url: `https://picsum.photos/seed/${seed}/1000/800`, width: 1000, height: 800 };
}

function ext(id: string, w = 1000) {
  return { public_id: `seed:${id}`, url: `https://images.unsplash.com/${id}?w=${w}&q=80`, width: w, height: Math.round((w * 3) / 4) };
}

const PROCESS_IMG = ext("photo-1503602642458-232111445657", 1000);

function makeDetails(name: string, material: string, colors: string[]) {
  return {
    subtitle: material,
    collectionLabel: "Heritage Collection",
    frameFinishes: [{ name: "Walnut", hex: "#5A3A2E" }, { name: "Natural Oak", hex: "#C9A87C" }],
    upholstery: colors,
    care: [
      "Dust woodwork weekly with a soft, lint-free cloth. Every 6 months, apply a thin coat of our proprietary Wood Nurture Oil.",
      "For upholstery, vacuum with a soft brush attachment. Professional dry cleaning recommended for spills.",
    ],
    perks: ["White Glove Delivery (4–6 weeks)", "Lifetime Frame Warranty"],
    story: {
      eyebrow: "The Artisanal Process",
      title: "Sculpted from a single vision of rest.",
      body: [
        `The ${name} is the result of months of ergonomic study and craftsmanship. Each frame is hand-shaped from sustainably harvested timber in our workshop, using traditional mortise-and-tenon joinery that requires no metal fasteners.`,
        "Every line is precisely calculated to balance comfort with a sculptural silhouette that commands presence from every angle.",
      ],
      quote: "We don't build furniture to fit a home; we build furniture to ground a life.",
      author: "Elias Thorne, Master Joiner",
      image: PROCESS_IMG,
    },
  };
}

async function main() {
  console.log("Seeding categories…");

  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .upsert([
      { name: "Sofas",   slug: "sofas",   description: "Living room seating" },
      { name: "Beds",    slug: "beds",    description: "Bedroom collection" },
      { name: "Tables",  slug: "tables",  description: "Dining and coffee tables" },
      { name: "Storage", slug: "storage", description: "Wardrobes, shelves and cabinets" },
    ], { onConflict: "slug" })
    .select();

  if (catErr) { console.error("Categories error:", catErr.message); process.exit(1); }

  const bySlug = Object.fromEntries(cats!.map((c: { slug: string; id: string }) => [c.slug, c.id]));
  console.log("  ✓ 4 categories");

  console.log("Seeding products…");

  const products = [
    {
      name: "Haven 3-Seater Sofa",
      slug: "haven-3-seater-sofa",
      description: "A generously proportioned sofa with deep seats and a low, relaxed back. Upholstered in a soft boucle that invites you to sink in.",
      price: 1899,
      category_id: bySlug["sofas"],
      dimensions: "220 x 95 x 78 cm (W x D x H)",
      material: "Kiln-dried hardwood frame, boucle upholstery",
      colors: ["Oatmeal", "Sage", "Charcoal"],
      in_stock: true,
      featured: true,
      images: [img("asooda-haven-1"), img("asooda-haven-2"), img("asooda-haven-3")],
      details: makeDetails("Haven 3-Seater Sofa", "Kiln-dried hardwood frame, boucle upholstery", ["Oatmeal", "Sage", "Charcoal"]),
    },
    {
      name: "Luna Upholstered Bed",
      slug: "luna-upholstered-bed",
      description: "A serene platform bed with a softly curved headboard. Designed to be the calm centre of the bedroom.",
      price: 1499,
      category_id: bySlug["beds"],
      dimensions: "180 x 210 x 110 cm (Queen)",
      material: "Solid beech legs, linen-blend upholstery",
      colors: ["Natural", "Stone", "Midnight"],
      in_stock: true,
      featured: true,
      images: [img("asooda-luna-1"), img("asooda-luna-2")],
      details: makeDetails("Luna Upholstered Bed", "Solid beech legs, linen-blend upholstery", ["Natural", "Stone", "Midnight"]),
    },
    {
      name: "Oak Dining Table",
      slug: "oak-dining-table",
      description: "A timeless dining table in solid oak with a hand-finished, oil-rubbed surface that ages beautifully.",
      price: 1240,
      category_id: bySlug["tables"],
      dimensions: "200 x 90 x 75 cm",
      material: "Solid European oak",
      colors: ["Natural Oak", "Smoked Oak"],
      in_stock: true,
      featured: true,
      images: [img("asooda-oak-1"), img("asooda-oak-2")],
      details: makeDetails("Oak Dining Table", "Solid European oak", ["Natural Oak", "Smoked Oak"]),
    },
    {
      name: "Nest Coffee Table",
      slug: "nest-coffee-table",
      description: "A pair of nesting tables with rounded edges and a warm walnut veneer. Flexible for small and large spaces alike.",
      price: 420,
      category_id: bySlug["tables"],
      dimensions: "90 x 50 x 40 cm",
      material: "Walnut veneer, powder-coated steel",
      colors: ["Walnut"],
      in_stock: true,
      featured: false,
      images: [img("asooda-nest-1")],
      details: makeDetails("Nest Coffee Table", "Walnut veneer, powder-coated steel", ["Walnut"]),
    },
    {
      name: "Aria Sliding Wardrobe",
      slug: "aria-sliding-wardrobe",
      description: "A full-height wardrobe with soft-close sliding doors and a fluted front that catches the light.",
      price: 2150,
      category_id: bySlug["storage"],
      dimensions: "250 x 60 x 220 cm",
      material: "Engineered wood, fluted oak doors",
      colors: ["Oak", "Matte White"],
      in_stock: false,
      featured: false,
      images: [img("asooda-aria-1"), img("asooda-aria-2")],
      details: makeDetails("Aria Sliding Wardrobe", "Engineered wood, fluted oak doors", ["Oak", "Matte White"]),
    },
    {
      name: "Stack Open Shelving",
      slug: "stack-open-shelving",
      description: "Modular open shelving that grows with your space. Mix and match heights to build a wall of storage.",
      price: 680,
      category_id: bySlug["storage"],
      dimensions: "100 x 35 x 180 cm",
      material: "Solid ash, blackened steel",
      colors: ["Ash", "Black"],
      in_stock: true,
      featured: false,
      images: [img("asooda-stack-1")],
      details: makeDetails("Stack Open Shelving", "Solid ash, blackened steel", ["Ash", "Black"]),
    },
  ];

  const { error: prodErr } = await supabase
    .from("products")
    .upsert(products, { onConflict: "slug" });

  if (prodErr) { console.error("Products error:", prodErr.message); process.exit(1); }

  console.log(`  ✓ ${products.length} products`);
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
