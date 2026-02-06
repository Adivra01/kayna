import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import MarqueeText from "@/components/MarqueeText";
import Footer from "@/components/Footer";
import { usePageTracking } from "@/hooks/useTracking";
import SEOHead, { jsonLdOrganization, jsonLdWebSite, jsonLdBrand } from "@/components/SEOHead";

// Lazy load below-the-fold sections
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ProductGrid = lazy(() => import("@/components/ProductGrid"));
const QualitySection = lazy(() => import("@/components/QualitySection"));
const CategorySection = lazy(() => import("@/components/CategorySection"));
const StorySection = lazy(() => import("@/components/StorySection"));
const TestimonialSection = lazy(() => import("@/components/TestimonialSection"));
const CollectionSection = lazy(() => import("@/components/CollectionSection"));
const BrandPromiseSection = lazy(() => import("@/components/BrandPromiseSection"));

const SectionLoader = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
  </div>
);

const Index = () => {
  usePageTracking();
  return (
    <div className="overflow-x-hidden">
      <SEOHead
        title="KAYNA — Vêtements de Développement Personnel | Confiance & Dépassement de Soi"
        description="KAYNA est la marque de vêtements streetwear orientée développement personnel. T-shirts, hoodies et sweaters premium en coton bio 240 GSM. Confiance, dépassement, persévérance."
        canonicalUrl="/"
        keywords="KAYNA, vêtements développement personnel, streetwear motivation, marque confiance en soi, t-shirt inspiration, hoodie premium, mode éthique, personal development clothing, motivational streetwear, self-improvement brand, clothing for self-growth, empowerment fashion, mental strength clothing, discipline clothing, resilience streetwear, marque Afrique, KAYNA store, KAYNA brand, KAYNA clothing"
        jsonLd={[jsonLdOrganization, jsonLdWebSite, jsonLdBrand]}
      />
      <Hero />
      <MarqueeText />
      <Suspense fallback={<SectionLoader />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ProductGrid />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <QualitySection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <StorySection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TestimonialSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CollectionSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BrandPromiseSection />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;
