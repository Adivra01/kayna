import Hero from "@/components/Hero";
import StorySection from "@/components/StorySection";
import MarqueeText from "@/components/MarqueeText";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import AboutSection from "@/components/AboutSection";
import QualitySection from "@/components/QualitySection";
import TestimonialSection from "@/components/TestimonialSection";
import CollectionSection from "@/components/CollectionSection";
import BrandPromiseSection from "@/components/BrandPromiseSection";
import Footer from "@/components/Footer";
import { usePageTracking } from "@/hooks/useTracking";
import SEOHead, { jsonLdOrganization, jsonLdWebSite, jsonLdBrand } from "@/components/SEOHead";

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
      <StorySection />
      <AboutSection />
      <MarqueeText />
      <ProductGrid />
      <CategorySection />
      <QualitySection />
      <TestimonialSection />
      <CollectionSection />
      <BrandPromiseSection />
      <Footer />
    </div>
  );
};

export default Index;
