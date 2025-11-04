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
    <section ref={gridRef} className="py-24 lg:py-32 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-accent/10 rounded-full mb-6">
              <span className="text-accent text-2xl">★</span>
              <span className="text-sm font-bold text-accent tracking-wider">BESTSELLERS</span>
            </div>
            <h2 className="text-display font-bold leading-none">
              Nos
              <span className="block italic text-accent">essentiels</span>
            </h2>
          </div>
          <p className="text-lg lg:text-xl max-w-md text-muted-foreground">
            Des pièces pensées pour durer. Qualité premium, style intemporel.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => {
            const sizes = [
              "lg:col-span-2 lg:row-span-2", // Large
              "lg:col-span-1 lg:row-span-1", // Small
              "lg:col-span-1 lg:row-span-2", // Tall
              "lg:col-span-2 lg:row-span-1", // Wide
              "lg:col-span-1 lg:row-span-1", // Small
            ];
            
            return (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`group cursor-pointer ${sizes[index]} ${index % 2 === 0 ? 'col-span-2' : 'col-span-1'}`}
              >
                <div className="relative rounded-3xl overflow-hidden bg-background h-full min-h-[300px] lg:min-h-[400px]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-xl lg:text-2xl font-bold mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{product.year}</span>
                      <button className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center hover:scale-110 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {product.tag && (
                    <div className="absolute top-4 left-4 px-4 py-2 bg-white rounded-full shadow-lg">
                      <span className="text-xs font-bold">NEW</span>
                    </div>
                  )}
                  
                  {index === 0 && (
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shadow-xl">
                      TOP
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <button className="px-12 py-5 rounded-full bg-foreground text-background hover:bg-accent hover:scale-105 transition-all flex items-center gap-4 group shadow-xl font-bold text-lg">
            <span>Voir tout</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
