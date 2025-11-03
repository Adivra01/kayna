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
    <section ref={gridRef} className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group cursor-pointer"
            >
              <div className="relative rounded-[3rem] overflow-hidden bg-secondary aspect-[3/4] mb-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.tag && (
                  <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center">
                    <span className="text-2xl">+</span>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  {product.tag && (
                    <p className="text-sm text-muted-foreground mb-1">{product.tag}</p>
                  )}
                  <h3 className="text-2xl font-bold mb-1">{product.title}</h3>
                  <p className="text-muted-foreground">{product.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button className="px-8 py-4 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center gap-3 group">
            <span className="font-bold">Next</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
