import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductMediaGallery from "@/components/ProductMediaGallery";
import BuyBox from "@/components/BuyBox";
import ArtisanalProcess from "@/components/ArtisanalProcess";
import ProductSpecs from "@/components/ProductSpecs";
import RelatedProducts from "@/components/RelatedProducts";
import { getProductBySlug, getProducts } from "@/lib/queries";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  let product: Product | null = null;
  let related: Product[] = [];
  try {
    product = await getProductBySlug(slug);
    if (product) {
      const all = await getProducts();
      related = all.filter((p) => p.id !== product!.id).slice(0, 3);
    }
  } catch {
    // DB not configured — sample data fallback handles this.
  }

  if (!product) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        {/* Gallery + buy box */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductMediaGallery images={product.images} alt={product.name} />
            <BuyBox product={product} />
          </div>
        </div>

        <ArtisanalProcess product={product} />
        <ProductSpecs product={product} />
        <RelatedProducts products={related} />
      </main>
      <SiteFooter />
    </>
  );
}
