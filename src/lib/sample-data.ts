import type {
  Category,
  Product,
  ProductDetails,
  ProductImage,
  SiteContent,
} from "./types";

// ---------------------------------------------------------------------------
// Seed data — powers the frontend and the local JSON store before Supabase is
// connected. queries.ts / the local store use this whenever Supabase env vars
// are absent, so `npm run dev` shows a fully populated site for design work.
// ---------------------------------------------------------------------------

function img(seed: string): ProductImage {
  return {
    public_id: `sample/${seed}`,
    url: `https://picsum.photos/seed/${seed}/1000/800`,
    width: 1000,
    height: 800,
  };
}

// Editorial image helper (curated Unsplash placeholders).
function ext(id: string, w = 1000): ProductImage {
  return {
    public_id: `seed:${id}`,
    url: `https://images.unsplash.com/${id}?w=${w}&q=80`,
    width: w,
    height: Math.round((w * 3) / 4),
  };
}

const PROCESS_IMG = ext("photo-1503602642458-232111445657", 1000);

// Sensible default rich details so product pages render fully from data.
// Components still fall back to these same values if a field is missing.
function makeDetails(
  name: string,
  material: string,
  colors: string[],
): ProductDetails {
  return {
    subtitle: material,
    collectionLabel: "Heritage Collection",
    frameFinishes: [
      { name: "Walnut", hex: "#5A3A2E" },
      { name: "Natural Oak", hex: "#C9A87C" },
    ],
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
      quote:
        "We don't build furniture to fit a home; we build furniture to ground a life.",
      author: "Elias Thorne, Master Joiner",
      image: PROCESS_IMG,
    },
  };
}

export const sampleCategories: Category[] = [
  { id: "cat-sofas", name: "Sofas", slug: "sofas", description: "Living room seating", created_at: "2026-01-01T00:00:00Z" },
  { id: "cat-beds", name: "Beds", slug: "beds", description: "Bedroom collection", created_at: "2026-01-01T00:00:00Z" },
  { id: "cat-tables", name: "Tables", slug: "tables", description: "Dining and coffee tables", created_at: "2026-01-01T00:00:00Z" },
  { id: "cat-storage", name: "Storage", slug: "storage", description: "Wardrobes, shelves and cabinets", created_at: "2026-01-01T00:00:00Z" },
];

const cat = (id: string) => sampleCategories.find((c) => c.id === id) ?? null;

export const sampleProducts: Product[] = [
  {
    id: "p-haven-sofa",
    name: "Haven 3-Seater Sofa",
    slug: "haven-3-seater-sofa",
    description:
      "A generously proportioned sofa with deep seats and a low, relaxed back. Upholstered in a soft boucle that invites you to sink in.",
    price: 1899,
    category_id: "cat-sofas",
    dimensions: "220 x 95 x 78 cm (W x D x H)",
    material: "Kiln-dried hardwood frame, boucle upholstery",
    colors: ["Oatmeal", "Sage", "Charcoal"],
    in_stock: true,
    featured: true,
    images: [img("assoda-haven-1"), img("assoda-haven-2"), img("assoda-haven-3")],
    details: makeDetails("Haven 3-Seater Sofa", "Kiln-dried hardwood frame, boucle upholstery", ["Oatmeal", "Sage", "Charcoal"]),
    created_at: "2026-05-20T00:00:00Z",
    updated_at: "2026-05-20T00:00:00Z",
    category: cat("cat-sofas"),
  },
  {
    id: "p-luna-bed",
    name: "Luna Upholstered Bed",
    slug: "luna-upholstered-bed",
    description:
      "A serene platform bed with a softly curved headboard. Designed to be the calm centre of the bedroom.",
    price: 1499,
    category_id: "cat-beds",
    dimensions: "180 x 210 x 110 cm (Queen)",
    material: "Solid beech legs, linen-blend upholstery",
    colors: ["Natural", "Stone", "Midnight"],
    in_stock: true,
    featured: true,
    images: [img("assoda-luna-1"), img("assoda-luna-2")],
    details: makeDetails("Luna Upholstered Bed", "Solid beech legs, linen-blend upholstery", ["Natural", "Stone", "Midnight"]),
    created_at: "2026-05-18T00:00:00Z",
    updated_at: "2026-05-18T00:00:00Z",
    category: cat("cat-beds"),
  },
  {
    id: "p-oak-dining",
    name: "Oak Dining Table",
    slug: "oak-dining-table",
    description:
      "A timeless dining table in solid oak with a hand-finished, oil-rubbed surface that ages beautifully.",
    price: 1240,
    category_id: "cat-tables",
    dimensions: "200 x 90 x 75 cm",
    material: "Solid European oak",
    colors: ["Natural Oak", "Smoked Oak"],
    in_stock: true,
    featured: true,
    images: [img("assoda-oak-1"), img("assoda-oak-2")],
    details: makeDetails("Oak Dining Table", "Solid European oak", ["Natural Oak", "Smoked Oak"]),
    created_at: "2026-05-15T00:00:00Z",
    updated_at: "2026-05-15T00:00:00Z",
    category: cat("cat-tables"),
  },
  {
    id: "p-nest-coffee",
    name: "Nest Coffee Table",
    slug: "nest-coffee-table",
    description:
      "A pair of nesting tables with rounded edges and a warm walnut veneer. Flexible for small and large spaces alike.",
    price: 420,
    category_id: "cat-tables",
    dimensions: "90 x 50 x 40 cm",
    material: "Walnut veneer, powder-coated steel",
    colors: ["Walnut"],
    in_stock: true,
    featured: false,
    images: [img("assoda-nest-1")],
    details: makeDetails("Nest Coffee Table", "Walnut veneer, powder-coated steel", ["Walnut"]),
    created_at: "2026-05-10T00:00:00Z",
    updated_at: "2026-05-10T00:00:00Z",
    category: cat("cat-tables"),
  },
  {
    id: "p-aria-wardrobe",
    name: "Aria Sliding Wardrobe",
    slug: "aria-sliding-wardrobe",
    description:
      "A full-height wardrobe with soft-close sliding doors and a fluted front that catches the light.",
    price: 2150,
    category_id: "cat-storage",
    dimensions: "250 x 60 x 220 cm",
    material: "Engineered wood, fluted oak doors",
    colors: ["Oak", "Matte White"],
    in_stock: false,
    featured: false,
    images: [img("assoda-aria-1"), img("assoda-aria-2")],
    details: makeDetails("Aria Sliding Wardrobe", "Engineered wood, fluted oak doors", ["Oak", "Matte White"]),
    created_at: "2026-05-05T00:00:00Z",
    updated_at: "2026-05-05T00:00:00Z",
    category: cat("cat-storage"),
  },
  {
    id: "p-shelf-stack",
    name: "Stack Open Shelving",
    slug: "stack-open-shelving",
    description:
      "Modular open shelving that grows with your space. Mix and match heights to build a wall of storage.",
    price: 680,
    category_id: "cat-storage",
    dimensions: "100 x 35 x 180 cm",
    material: "Solid ash, blackened steel",
    colors: ["Ash", "Black"],
    in_stock: true,
    featured: false,
    images: [img("assoda-stack-1")],
    details: makeDetails("Stack Open Shelving", "Solid ash, blackened steel", ["Ash", "Black"]),
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    category: cat("cat-storage"),
  },
];

// Editorial content shown on the homepage + Our Story page. This is both the
// seed for the local store and the fallback for any unmanaged fields.
export const DEFAULT_SITE_CONTENT: SiteContent = {
  home: {
    hero: {
      eyebrow: "",
      title: "Objects of Permanent Beauty",
      subtitle:
        "Slow-crafted furniture designed to endure for generations. Discover the warmth of natural materials and artisanal precision.",
      cta: { label: "Shop Collection", href: "/catalog" },
      image: ext("photo-1567538096630-e0c55bd6374c", 1600),
    },
    craftBand: {
      eyebrow: "The Assoda Way",
      title: "Honoring the Material, Respecting the Maker.",
      body: "Every piece at Assoda is born from a dialogue between the artisan and the wood. We source only sustainably harvested timber, allowing its natural character to guide the final form.",
      features: [
        {
          title: "Sustainable Sourcing",
          body: "FSC-certified timber from forests managed for the next century.",
        },
        {
          title: "Handmade Precision",
          body: "Traditional joinery techniques that require time and mastery.",
        },
      ],
      quote: "Wood has a memory. We listen to it.",
      quoteAuthor: "Master Artisan",
      image: PROCESS_IMG,
    },
    featuredCollections: {
      eyebrow: "Curation",
      title: "Featured Collections",
      viewAll: { label: "View All Pieces", href: "/catalog" },
      items: [
        {
          title: "The Living Space",
          href: "/catalog",
          image: ext("photo-1555041469-a586c61ea9bc", 800),
        },
        {
          title: "Restful Sanctuary",
          href: "/catalog",
          image: ext("photo-1538688525198-9b88f6f53126", 800),
        },
      ],
    },
    newsletter: {
      title: "Assoda Notes",
      body: "Join our community for early access to new collections and stories from the workshop.",
    },
  },
  ourStory: {
    hero: {
      eyebrow: "Established 1924",
      title: "Crafted for Generations",
      image: ext("photo-1503602642458-232111445657", 1600),
    },
    philosophy: {
      eyebrow: "The Philosophy",
      title: "The Assoda Way",
      body: [
        "At the heart of Assoda lies a commitment to the 'Assoda Way'—a standard of excellence that transcends modern convenience. We believe that furniture shouldn't just inhabit a room; it should anchor a legacy.",
        "By utilizing exclusively sustainably harvested timber from managed European forests and employing joinery techniques that have remained unchanged for centuries, we ensure each piece is as enduring as the trees from which they were born.",
      ],
    },
    journey: {
      eyebrow: "Our Journey",
      title: "A Choreography of Precision",
      intro: "Three distinct stages of creation, defined by hand and heart.",
      steps: [
        {
          label: "Material Selection",
          body: "Only the finest heartwood passes our master grader's inspection, ensuring stability and figure that rivals museum artifacts.",
          image: ext("photo-1604578762246-41134e37f9cc", 700),
        },
        {
          label: "The Joiner's Bench",
          body: "We eschew modern fasteners for the timeless strength of mortise and tenon, hand-fitted with surgical precision.",
          image: ext("photo-1493663284031-b7e3aefcae8e", 700),
        },
        {
          label: "Hand-Applied Finishes",
          body: "Our signature waxes and oils are rubbed into the grain by hand, creating a breathable finish that matures beautifully over time.",
          image: ext("photo-1540574163026-643ea20ade25", 700),
        },
      ],
    },
    sustainability: {
      eyebrow: "Sustainability",
      title: "A Forest First Approach",
      body: "Our carbon-neutral workshops are powered by the very sawdust we create, heating our facility through the winter months. Every piece of FSC-certified timber is tracked from the forest floor to your living room.",
      image: ext("photo-1449247709967-d4461a6a6103", 1000),
      stats: [
        { value: "100%", label: "FSC Certified" },
        { value: "0", label: "Net Carbon" },
      ],
    },
    closingCta: {
      title: "Experience the Art of Living",
      cta: { label: "Explore the Collections", href: "/catalog" },
      secondary: { label: "Order the Print Journal", href: "#" },
    },
  },
};
