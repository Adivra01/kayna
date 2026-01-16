import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Play, Lock } from "lucide-react";
import { Link } from "react-router-dom";

// Videos for current products
import tshirtVideo from "@/assets/videos/tshirt-rotate.mp4";
import hoodieVideo from "@/assets/videos/hoodie-rotate.mp4";
import sweaterVideo from "@/assets/videos/sweater-rotate.mp4";

// Images for coming soon
import tshirt1 from "@/assets/tshirt-1.jpg";

gsap.registerPlugin(ScrollTrigger);

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  video?: string;
  image?: string;
  isComingSoon?: boolean;
  productCount: number;
  priceRange: string;
}

const productCategories: ProductCategory[] = [
  { 
    id: "1", 
    name: "T-Shirts", 
    slug: "tshirts",
    video: tshirtVideo,
    productCount: 3,
    priceRange: "32€ - 39€"
  },
  { 
    id: "2", 
    name: "Hoodies", 
    slug: "hoodies",
    video: hoodieVideo,
    productCount: 3,
    priceRange: "75€ - 85€"
  },
  { 
    id: "3", 
    name: "Sweaters", 
    slug: "sweaters",
    video: sweaterVideo,
    productCount: 3,
    priceRange: "59€ - 65€"
  },
  { 
    id: "4", 
    name: "Joggings", 
    slug: "joggings",
    image: tshirt1,
    isComingSoon: true,
    productCount: 0,
    priceRange: "Bientôt"
  },
  { 
    id: "5", 
    name: "Casquettes", 
    slug: "casquettes",
    image: tshirt1,
    isComingSoon: true,
    productCount: 0,
    priceRange: "Bientôt"
  },
  { 
    id: "6", 
    name: "Shorts", 
    slug: "shorts",
    image: tshirt1,
    isComingSoon: true,
    productCount: 0,
    priceRange: "Bientôt"
  },
];

const ProductGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=200",
          toggleActions: "play none none reverse",
        },
      });

      // Cards entrance with staggered 3D effect
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const isComingSoon = productCategories[index]?.isComingSoon;
        
        gsap.fromTo(card, 
          { 
            y: 150, 
            opacity: 0, 
            rotateY: index % 2 === 0 ? -15 : 15,
            rotateX: 10,
            scale: 0.85,
          },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.2,
            delay: index * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=80",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Continuous floating animation for coming soon cards
        if (isComingSoon) {
          gsap.to(card, {
            y: -8,
            duration: 2.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.3,
          });
        }

        // Scroll parallax
        gsap.to(card, {
          yPercent: index % 2 === 0 ? -6 : 6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (id: string, isEntering: boolean) => {
    setHoveredCard(isEntering ? id : null);
    
    const index = productCategories.findIndex(p => p.id === id);
    const card = cardsRef.current[index];
    const video = videoRefs.current[index];
    
    if (!card) return;

    if (isEntering) {
      gsap.to(card, { 
        scale: 1.03, 
        rotateY: 3,
        boxShadow: "0 40px 80px hsla(40, 45%, 60%, 0.3)",
        duration: 0.5,
        ease: "power2.out"
      });
      
      if (video) {
        video.play();
      }
    } else {
      gsap.to(card, { 
        scale: 1, 
        rotateY: 0,
        boxShadow: "0 20px 40px hsla(0, 0%, 4%, 0.15)",
        duration: 0.4,
        ease: "power2.out"
      });
      
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="bestsellers" 
      className="py-28 lg:py-44 bg-background relative overflow-hidden scroll-mt-20"
      style={{ perspective: "2000px" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-accent/8 rounded-full blur-[250px]"
          style={{ 
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            transition: "transform 0.8s ease-out"
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px]"
          style={{ 
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
            transition: "transform 0.8s ease-out"
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
          <div>
            <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium mb-6 block">
              Nos Collections
            </span>
            <h2 className="text-[3rem] lg:text-[5.5rem] font-bold leading-[0.9] text-foreground">
              Nos <span className="italic text-accent">Produits</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-lg">
              Des pièces conçues pour ceux qui n'ont rien à prouver, 
              mais tout à accomplir.
            </p>
          </div>
          <Link 
            to="/shop" 
            className="hidden lg:flex items-center gap-3 text-foreground hover:text-accent transition-all group px-8 py-4 rounded-full border border-border hover:border-accent/50 bg-card/50 backdrop-blur-sm"
          >
            <span className="font-medium">Voir la boutique</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {productCategories.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`group relative cursor-pointer ${product.isComingSoon ? 'opacity-80' : ''}`}
              style={{ transformStyle: "preserve-3d" }}
              onMouseEnter={() => !product.isComingSoon && handleCardHover(product.id, true)}
              onMouseLeave={() => !product.isComingSoon && handleCardHover(product.id, false)}
            >
              {product.isComingSoon ? (
                // Coming Soon Card
                <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] bg-card border border-border/50 shadow-elegant">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
                  
                  {/* Lock Icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6 border border-accent/30">
                      <Lock className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-secondary text-2xl lg:text-3xl font-bold mb-3">
                      {product.name}
                    </h3>
                    <span className="text-accent font-semibold text-lg uppercase tracking-wider">
                      Bientôt disponible
                    </span>
                    <div className="mt-6 w-16 h-1 bg-accent/30 rounded-full" />
                  </div>

                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-[2rem] border-2 border-accent/20 animate-pulse" />
                </div>
              ) : (
                // Active Product Card with Video
                <Link to={`/shop?category=${product.slug}`} className="block">
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] bg-card border border-border/50 shadow-elegant group-hover:border-accent/30 transition-all duration-500">
                    {/* Video Background */}
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={product.video}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      poster={product.image}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-500" />
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    
                    {/* Play Indicator */}
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                      <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-secondary/60 text-sm uppercase tracking-wider mb-2 block">
                            {product.productCount} produits
                          </span>
                          <h3 className="text-secondary text-2xl lg:text-3xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {product.name}
                          </h3>
                          <span className="text-accent font-bold text-xl">
                            {product.priceRange}
                          </span>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-gold">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Product Badge */}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-accent text-primary rounded-full text-xs font-bold uppercase tracking-wider shadow-gold">
                      Disponible
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-16 flex justify-center lg:hidden">
          <Link 
            to="/shop" 
            className="px-12 py-5 rounded-full bg-accent text-primary font-bold shadow-gold hover:scale-105 transition-all flex items-center gap-3 text-lg"
          >
            <span>Voir la boutique</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
