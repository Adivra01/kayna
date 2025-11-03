import Hero from "@/components/Hero";
import MarqueeText from "@/components/MarqueeText";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import AboutSection from "@/components/AboutSection";
import CollectionSection from "@/components/CollectionSection";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <MarqueeText />
      <ProductGrid />
      <CategorySection />
      <AboutSection />
      <CollectionSection />
      <MarqueeText />
    </div>
  );
};

export default Index;
