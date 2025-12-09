import Hero from "@/components/Hero";
import MarqueeText from "@/components/MarqueeText";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import AboutSection from "@/components/AboutSection";
import QualitySection from "@/components/QualitySection";
import TestimonialSection from "@/components/TestimonialSection";
import CollectionSection from "@/components/CollectionSection";
import BrandPromiseSection from "@/components/BrandPromiseSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <MarqueeText />
      <ProductGrid />
      <CategorySection />
      <AboutSection />
      <QualitySection />
      <TestimonialSection />
      <CollectionSection />
      <BrandPromiseSection />
      <MarqueeText />
      <Footer />
    </div>
  );
};

export default Index;
