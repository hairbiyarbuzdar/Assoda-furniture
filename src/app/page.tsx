import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import MarqueeBand from "@/components/MarqueeBand";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewArrivals from "@/components/NewArrivals";
import CraftBand from "@/components/CraftBand";
import Newsletter from "@/components/Newsletter";
import SiteFooter from "@/components/SiteFooter";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ContactSection from "@/components/ContactSection";
import { getProducts, getSiteContent } from "@/lib/queries";
import { DEFAULT_SITE_CONTENT } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let arrivals: Awaited<ReturnType<typeof getProducts>> = [];
  let home = DEFAULT_SITE_CONTENT.home;
  try {
    const [featured, content] = await Promise.all([
      getProducts({ featured: true }),
      getSiteContent(),
    ]);
    home = content.home;
    const rest = featured.length >= 4 ? [] : await getProducts();
    const seen = new Set(featured.map((p) => p.id));
    arrivals = [...featured, ...rest.filter((p) => !seen.has(p.id))].slice(0, 4);
  } catch {
    // store unavailable — render with default content.
  }

  return (
    <>
      <SiteHeader />
      <main>
        <Hero content={home.hero} />
        <MarqueeBand />
        <ScrollReveal>
          <FeaturedCollections content={home.featuredCollections} />
        </ScrollReveal>
        <ScrollReveal>
          <NewArrivals products={arrivals} />
        </ScrollReveal>
        <ScrollReveal>
          <CraftBand content={home.craftBand} />
        </ScrollReveal>
        <ScrollReveal>
          <Newsletter content={home.newsletter} />
        </ScrollReveal>
        <ScrollReveal>
          <ContactSection />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
