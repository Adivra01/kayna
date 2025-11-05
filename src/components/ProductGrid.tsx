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
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.from(headerRef.current?.children || [], {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
      });

      // Animate cards with 3D rotation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          y: 100,
          rotateY: -15,
          opacity: 0,
          duration: 1.2,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        });

        // Enhanced hover animations
        const image = card.querySelector("img");
        const overlay = card.querySelector(".overlay");
        const content = card.querySelector(".hover-content");
        
        if (image) {
          card.addEventListener("mouseenter", () => {
            gsap.to(image, { scale: 1.1, rotation: 2, duration: 0.8, ease: "power2.out" });
            gsap.to(overlay, { opacity: 1, duration: 0.5 });
            gsap.to(content, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(image, { scale: 1, rotation: 0, duration: 0.8, ease: "power2.out" });
            gsap.to(overlay, { opacity: 0, duration: 0.5 });
            gsap.to(content, { y: 20, opacity: 0, duration: 0.3 });
          });
        }
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={gridRef} className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-12 lg:mb-16 gap-4 sm:gap-6 lg:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 gradient-accent rounded-full mb-4 sm:mb-6 shadow-accent animate-float">
              <span className="text-white text-xl sm:text-2xl animate-glow">★</span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">TOP VENTES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none">
              Les pièces qui
              <span className="block italic gradient-text">cartonnent</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-md text-muted-foreground text-balance">
            <span className="font-bold text-accent">+10 000 clients</span> ont déjà craqué. 
            Qualité premium testée et approuvée par notre communauté.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                className={`group cursor-pointer ${sizes[index]} ${index === 0 ? 'sm:col-span-2' : 'sm:col-span-1'}`}
              >
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-background h-full min-h-[250px] sm:min-h-[300px] lg:min-h-[400px] shadow-md hover:shadow-xl transition-shadow">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-all duration-500" />
                  
                  {/* Hover Content */}
                  <div className="hover-content absolute bottom-0 left-0 right-0 p-4 sm:p-6 opacity-0 translate-y-5">
                    <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs sm:text-sm">{product.year}</span>
                      <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-accent text-white flex items-center justify-center hover:scale-110 transition-all shadow-glow">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {product.tag && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 glass-effect border border-white/20 rounded-full shadow-lg animate-float">
                      <span className="text-[10px] sm:text-xs font-bold">NEW</span>
                    </div>
                  )}
                  
                  {index === 0 && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-accent text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-glow animate-glow">
                      TOP
                    </div>
                  )}
                  
                  {/* Decorative corner accent */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/20 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center">
          <button className="group relative px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full gradient-accent text-white hover:scale-105 transition-all flex items-center gap-3 sm:gap-4 shadow-accent hover:shadow-glow font-bold text-sm sm:text-base lg:text-lg overflow-hidden">
            <span className="relative z-10">Voir tout</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
