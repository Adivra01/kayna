import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";


gsap.registerPlugin(ScrollTrigger);

const ProductGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { addItem } = useCart();

  const displayProducts = products.slice(0, 5);

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x: x * 2, y: y * 2 });
    };

    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);
    return () => section?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=200",
          toggleActions: "play none none reverse",
        },
      });

      // Cards entrance with 3D rotation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(card, 
          { 
            y: 120, 
            opacity: 0, 
            rotateX: 15,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=50",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Scroll parallax for each card
        gsap.to(card, {
          yPercent: index % 2 === 0 ? -8 : 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + (index * 0.2),
          },
        });

        // Enhanced hover animations with GSAP
        const image = card.querySelector("img");
        const overlay = card.querySelector(".card-overlay");
        const content = card.querySelector(".card-content");
        const actions = card.querySelector(".card-actions");
        const shine = card.querySelector(".card-shine");

        card.addEventListener("mouseenter", () => {
          gsap.to(image, { scale: 1.15, duration: 0.8, ease: "power2.out" });
          gsap.to(overlay, { opacity: 0.9, duration: 0.4 });
          gsap.to(content, { y: -12, duration: 0.4, ease: "power2.out" });
          gsap.to(actions, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
          gsap.to(shine, { x: "100%", duration: 0.6, ease: "power2.inOut" });
          gsap.to(card, { 
            scale: 1.02, 
            boxShadow: "0 30px 60px hsla(40, 45%, 60%, 0.25)",
            duration: 0.4 
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(image, { scale: 1, duration: 0.6, ease: "power2.out" });
          gsap.to(overlay, { opacity: 0.5, duration: 0.4 });
          gsap.to(content, { y: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(actions, { y: 20, opacity: 0, duration: 0.3 });
          gsap.to(shine, { x: "-100%", duration: 0.3 });
          gsap.to(card, { 
            scale: 1, 
            boxShadow: "0 4px 20px hsla(0, 0%, 4%, 0.08)",
            duration: 0.4 
          });
        });
      });
    }, sectionRef);

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
    <section 
      ref={sectionRef} 
      id="bestsellers" 
      className="py-28 lg:py-40 bg-background relative overflow-hidden scroll-mt-20"
      style={{ perspective: "2000px" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-accent/6 rounded-full blur-[200px]"
          style={{ 
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            transition: "transform 0.5s ease-out"
          }}
        />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[150px]" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div ref={headerRef} className="flex justify-between items-end mb-16">
          <div>
            <span className="text-accent text-sm uppercase tracking-[0.25em] font-medium mb-4 block">Notre Sélection</span>
            <h2 className="text-[3rem] lg:text-[5rem] font-bold leading-[0.9] text-foreground">
              Best<span className="italic text-accent">sellers</span>
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="hidden lg:flex items-center gap-3 text-muted-foreground hover:text-accent transition-all group px-6 py-3 rounded-full border border-border hover:border-accent/50"
          >
            <span className="font-medium">Voir tout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div 
          ref={gridRef} 
          className="grid grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-8"
          style={{ transformStyle: "preserve-3d" }}
        >
          {displayProducts.map((product, index) => {
            const gridClasses = [
              "col-span-2 lg:col-span-6 lg:row-span-2",
              "col-span-1 lg:col-span-3",
              "col-span-1 lg:col-span-3",
              "col-span-1 lg:col-span-4",
              "col-span-1 lg:col-span-2",
            ];
            
            const heights = [
              "min-h-[400px] lg:min-h-[600px]",
              "min-h-[280px] lg:min-h-[280px]",
              "min-h-[280px] lg:min-h-[280px]",
              "min-h-[280px] lg:min-h-[300px]",
              "min-h-[280px] lg:min-h-[300px]",
            ];
            
            return (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`group cursor-pointer ${gridClasses[index]}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className={`relative rounded-3xl lg:rounded-[2rem] overflow-hidden bg-card h-full ${heights[index]} shadow-elegant transition-all duration-500 border border-border/50`}>
                  {/* Shine Effect */}
                  <div className="card-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full z-10 pointer-events-none" />
                  
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="card-overlay absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-50" />
                  
                  {/* Floating Favorite button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 w-11 h-11 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-primary text-primary z-20"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  
                  {/* Content */}
                  <div className="card-content absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-secondary/60 text-sm uppercase tracking-wider mb-1 block">{product.category}</span>
                        <h3 className="text-secondary text-xl lg:text-2xl font-bold mb-2">{product.title}</h3>
                        <span className="text-accent font-bold text-xl lg:text-2xl">{product.price}€</span>
                      </div>
                      <div className="card-actions flex gap-3 opacity-0 translate-y-5">
                        <button 
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-110 transition-transform shadow-gold"
                        >
                          <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {product.tag && (
                    <div className="absolute top-4 left-4 px-4 py-2 bg-accent text-primary rounded-full text-xs font-bold uppercase tracking-wider shadow-gold animate-glow-intense">
                      {product.tag}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center lg:hidden">
          <Link to="/shop" className="px-12 py-5 rounded-full bg-accent text-primary font-bold shadow-gold hover:scale-105 transition-all flex items-center gap-3 text-lg">
            <span>Voir tout</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;