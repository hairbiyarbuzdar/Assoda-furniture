// Shared domain types for the Assoda Furniture catalog.

export type ProductImage = {
  public_id: string; // Cloudinary public id (used for transformations / deletion)
  url: string; // secure_url returned by Cloudinary
  width?: number;
  height?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

// ---- Rich product-page detail fields (managed in the admin "details" panel) ----
export type FrameFinish = { name: string; hex: string };

export type ProductStory = {
  eyebrow?: string;
  title?: string;
  body?: string[]; // paragraphs
  quote?: string;
  author?: string;
  image?: ProductImage | null;
};

export type ProductDetails = {
  subtitle?: string | null; // italic line under the product name
  collectionLabel?: string | null; // e.g. "Heritage Collection"
  frameFinishes?: FrameFinish[]; // swatches in the buy box
  upholstery?: string[]; // overrides colors for the upholstery options
  care?: string[]; // care-guide paragraphs
  perks?: string[]; // delivery / warranty rows
  story?: ProductStory | null; // the artisanal-process section
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  category_id: string | null;
  // specs
  dimensions: string | null;
  material: string | null;
  colors: string[]; // available colors
  in_stock: boolean;
  featured: boolean;
  images: ProductImage[];
  details?: ProductDetails | null; // rich product-page content
  created_at: string;
  updated_at: string;
  // joined (optional) when selected with category(*)
  category?: Category | null;
};

// Shape accepted by the create/update API.
export type ProductInput = {
  name: string;
  slug?: string;
  description?: string | null;
  price?: number | null;
  category_id?: string | null;
  dimensions?: string | null;
  material?: string | null;
  colors?: string[];
  in_stock?: boolean;
  featured?: boolean;
  images?: ProductImage[];
  details?: ProductDetails | null;
};

// ---- Editorial site content (managed in the admin "Site Content" editors) ----
export type CtaContent = { label: string; href: string };

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: CtaContent;
    image: ProductImage | null;
  };
  craftBand: {
    eyebrow: string;
    title: string;
    body: string;
    features: { title: string; body: string }[];
    quote: string;
    quoteAuthor: string;
    image: ProductImage | null;
  };
  featuredCollections: {
    eyebrow: string;
    title: string;
    viewAll: CtaContent;
    items: { title: string; href: string; image: ProductImage | null }[];
  };
  newsletter: { title: string; body: string };
};

export type OurStoryContent = {
  hero: { eyebrow: string; title: string; image: ProductImage | null };
  philosophy: { eyebrow: string; title: string; body: string[] };
  journey: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: { label: string; body: string; image: ProductImage | null }[];
  };
  sustainability: {
    eyebrow: string;
    title: string;
    body: string;
    image: ProductImage | null;
    stats: { value: string; label: string }[];
  };
  closingCta: { title: string; cta: CtaContent; secondary: CtaContent };
};

export type SiteContent = { home: HomeContent; ourStory: OurStoryContent };
