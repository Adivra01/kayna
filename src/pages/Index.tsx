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

const Index = () => {
  usePageTracking();
  return (
    <div className="overflow-x-hidden">
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
