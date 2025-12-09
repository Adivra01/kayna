import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

const ProductGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  
  const { addItem } = useCart();

  const displayProducts = products.slice(0, 5);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        });

        // Enhanced hover animations with GSAP
        const image = card.querySelector("img");
        const overlay = card.querySelector(".card-overlay");
        const content = card.querySelector(".card-content");
        const actions = card.querySelector(".card-actions");

        card.addEventListener("mouseenter", () => {
          gsap.to(image, { scale: 1.1, duration: 0.6, ease: "power2.out" });
          gsap.to(overlay, { opacity: 0.85, duration: 0.4 });
          gsap.to(content, { y: -8, duration: 0.4, ease: "power2.out" });
          gsap.to(actions, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(image, { scale: 1, duration: 0.6, ease: "power2.out" });
          gsap.to(overlay, { opacity: 0.6, duration: 0.4 });
          gsap.to(content, { y: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(actions, { y: 20, opacity: 0, duration: 0.3 });
        });
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = (product: typeof displayProducts[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });
    toast.success(`${product.title} ajouté au panier`);
  };

  return (
    <section ref={gridRef} id="bestsellers" className="py-24 lg:py-32 bg-background relative overflow-hidden scroll-mt-20">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-[3rem] lg:text-[4rem] font-bold leading-none text-foreground">
            Best<span className="italic text-accent">sellers</span>
          </h2>
          <Link to="/shop" className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group">
            <span>Voir tout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
          {displayProducts.map((product, index) => {
            const gridClasses = [
              "col-span-2 lg:col-span-6 lg:row-span-2",
              "col-span-1 lg:col-span-3",
              "col-span-1 lg:col-span-3",
              "col-span-1 lg:col-span-4",
              "col-span-1 lg:col-span-2",
            ];
            
            return (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`group cursor-pointer ${gridClasses[index]}`}
              >
                <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-card h-full min-h-[280px] lg:min-h-[320px] shadow-elegant hover:shadow-gold transition-all duration-500">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="card-overlay absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-60" />
                  
                  {/* Floating heart button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary/10 backdrop-blur-sm border border-secondary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:border-accent hover:text-primary text-secondary"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  
                  {/* Content */}
                  <div className="card-content absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-secondary text-lg lg:text-xl font-bold mb-1">{product.title}</h3>
                        <span className="text-accent font-bold text-lg">{product.price}€</span>
                      </div>
                      <div className="card-actions flex gap-2 opacity-0 translate-y-5">
                        <button 
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-11 h-11 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-110 transition-transform shadow-gold"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {product.tag && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-primary rounded-full text-xs font-bold shadow-gold animate-pulse">
                      {product.tag}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center lg:hidden">
          <Link to="/shop" className="px-10 py-4 rounded-full bg-accent text-primary font-bold shadow-gold hover:scale-105 transition-all flex items-center gap-3">
            <span>Voir tout</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
