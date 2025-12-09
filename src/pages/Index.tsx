import Hero from "@/components/Hero";
import MarqueeText from "@/components/MarqueeText";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import AboutSection from "@/components/AboutSection";
import CollectionSection from "@/components/CollectionSection";
import Footer from "@/components/Footer";

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
      <Footer />
    </div>
  );
};

export default Index;
