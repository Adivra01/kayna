import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import hoodie1 from "@/assets/hoodie-1.jpg";
import sweater1 from "@/assets/sweater-1.jpg";
import jacket1 from "@/assets/jacket-1.jpg";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  image: string;
  title: string;
  year: string;
  tag?: string;
}

const products: Product[] = [
  { id: "1", image: jacket1, title: "©ikigai - jacket momento", year: "2024", tag: "[Other]" },
  { id: "2", image: tshirt1, title: "Essential Olive Tee", year: "2024" },
  { id: "3", image: hoodie1, title: "Graphic Hoodie", year: "2024" },
  { id: "4", image: sweater1, title: "Cream Crewneck", year: "2024" },
  { id: "5", image: tshirt2, title: "Statement Graphic Tee", year: "2024" },
];

const ProductGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          y: 100,
          opacity: 0,
          duration: 1,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        });

        // Image scale on hover
        const image = card.querySelector("img");
        if (image) {
          card.addEventListener("mouseenter", () => {
            gsap.to(image, { scale: 1.05, duration: 0.6, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(image, { scale: 1, duration: 0.6, ease: "power2.out" });
          });
        }
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={gridRef} className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-accent rounded-full mb-6 shadow-energy-glow animate-float">
              <span className="text-white text-2xl animate-glow">★</span>
              <span className="text-sm font-bold text-white tracking-wider">BESTSELLERS</span>
            </div>
            <h2 className="text-display font-bold leading-none text-primary">
              Nos
              <span className="block italic text-accent">essentiels</span>
            </h2>
          </div>
          <p className="text-lg lg:text-xl max-w-md text-muted-foreground text-balance">
            Des pièces pensées pour durer. Qualité premium, style intemporel.
          </p>
        </div>

        {/* Improved Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-[280px]">
          {products.map((product, index) => {
            // Masonry pattern: 1-large, 2-small, 3-tall, 4-wide, 5-small
            const gridClasses = [
              "sm:col-span-2 lg:col-span-6 lg:row-span-2", // Large featured
              "sm:col-span-1 lg:col-span-3 lg:row-span-1", // Small
              "sm:col-span-1 lg:col-span-3 lg:row-span-2", // Tall
              "sm:col-span-2 lg:col-span-6 lg:row-span-1", // Wide
              "sm:col-span-1 lg:col-span-3 lg:row-span-1", // Small
            ];
            
            return (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`group cursor-pointer ${gridClasses[index]}`}
              >
                <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-card h-full shadow-royal-md hover:shadow-royal-lg transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay - Fusion Bleu/Violet */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-secondary/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Content - Always visible but enhanced on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 transform translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-lg lg:text-2xl font-bold mb-2 transform group-hover:scale-105 transition-transform">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs lg:text-sm font-medium">{product.year}</span>
                      <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-accent text-white flex items-center justify-center hover:scale-110 transition-all shadow-energy-glow">
                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>

                  {product.tag && (
                    <div className="absolute top-3 left-3 lg:top-4 lg:left-4 px-3 py-1.5 lg:px-4 lg:py-2 backdrop-blur-md bg-secondary-light border border-secondary-light rounded-full shadow-transformation-glow animate-float">
                      <span className="text-xs font-bold text-white">NEW</span>
                    </div>
                  )}
                  
                  {index === 0 && (
                    <div className="absolute top-3 right-3 lg:top-4 lg:right-4 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-accent text-white flex items-center justify-center text-xs lg:text-sm font-bold shadow-energy-glow animate-pulse">
                      TOP
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <button className="group relative px-12 py-5 rounded-full bg-accent text-white hover:scale-105 transition-all flex items-center gap-4 shadow-energy-glow hover:shadow-energy-glow font-bold text-lg overflow-hidden">
            <span className="relative z-10">Voir tout</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-accent-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
