import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Category images
import categoryTshirt from "@/assets/category-tshirt.jpg";
import categoryHoodie from "@/assets/category-hoodie.jpg";
import categorySweater from "@/assets/category-sweater.jpg";

gsap.registerPlugin(ScrollTrigger);

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
  description: string;
}

const categories: Category[] = [
  { 
    id: "01", 
    name: "T-Shirts", 
    slug: "tshirts",
    count: 3,
    image: categoryTshirt,
    description: "L'essentiel KAYNA"
  },
  { 
    id: "02", 
    name: "Hoodies", 
    slug: "hoodies",
    count: 3,
    image: categoryHoodie,
    description: "Le confort d'un guerrier"
  },
  { 
    id: "03", 
    name: "Sweaters", 
    slug: "sweaters",
    count: 3,
    image: categorySweater,
    description: "L'élégance discrète"
  },
];

const CategorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const categoriesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax for image
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = imageContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x: x * 20, y: y * 20 });
    };

    const container = imageContainerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image entrance animation
      gsap.from(imageContainerRef.current, {
        x: 80,
        opacity: 0,
        rotateY: -10,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      // Categories entrance with stagger
      categoriesRef.current.forEach((cat, index) => {
        if (!cat) return;
        
        gsap.from(cat, {
          x: -60,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        });

        // Hover animations
        cat.addEventListener("mouseenter", () => {
          gsap.to(cat, { x: 12, duration: 0.3, ease: "power2.out" });
        });
        
        cat.addEventListener("mouseleave", () => {
          gsap.to(cat, { x: 0, duration: 0.3, ease: "power2.out" });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (category.id === activeCategory.id || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Animate out current image
    const tl = gsap.timeline({
      onComplete: () => {
        setActiveCategory(category);
      }
    });

    tl.to(imageRef.current, {
      scale: 0.9,
      opacity: 0,
      rotateY: 10,
      duration: 0.4,
      ease: "power2.in"
    });
  };

  // Animate in new image when activeCategory changes
  useEffect(() => {
    if (!isTransitioning) return;
    
    gsap.fromTo(imageRef.current, 
      { scale: 0.9, opacity: 0, rotateY: -10 },
      { 
        scale: 1, 
        opacity: 1, 
        rotateY: 0,
        duration: 0.5, 
        ease: "power2.out",
        onComplete: () => setIsTransitioning(false)
      }
    );
  }, [activeCategory, isTransitioning]);

  return (
    <section ref={sectionRef} id="categories" className="py-28 lg:py-40 bg-primary relative overflow-hidden scroll-mt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Categories */}
          <div>
            <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium mb-6 block">
              Explorer
            </span>
            <h2 className="text-[3rem] lg:text-[5rem] font-bold leading-[0.9] mb-16 text-secondary">
              Par<span className="block italic text-accent">catégorie</span>
            </h2>

            <div className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  ref={(el) => (categoriesRef.current[index] = el)}
                  className={`group cursor-pointer relative`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className={`flex items-center justify-between py-6 lg:py-8 border-b transition-all duration-300 ${
                    activeCategory.id === category.id 
                      ? 'border-accent/50' 
                      : 'border-secondary/10 hover:border-accent/30'
                  }`}>
                    <div className="flex items-center gap-6 lg:gap-8">
                      <span className={`text-sm font-mono transition-colors duration-300 ${
                        activeCategory.id === category.id ? 'text-accent' : 'text-secondary/40'
                      }`}>
                        {category.id}
                      </span>
                      <div>
                        <h3 className={`text-2xl lg:text-4xl font-bold transition-colors duration-300 ${
                          activeCategory.id === category.id 
                            ? 'text-accent' 
                            : 'text-secondary group-hover:text-accent'
                        }`}>
                          {category.name}
                        </h3>
                        <p className={`text-sm mt-1 transition-all duration-300 ${
                          activeCategory.id === category.id 
                            ? 'opacity-100 text-secondary/70' 
                            : 'opacity-0 group-hover:opacity-100 text-secondary/50'
                        }`}>
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <span className={`text-sm transition-colors duration-300 ${
                        activeCategory.id === category.id ? 'text-accent' : 'text-secondary/50'
                      }`}>
                        {category.count} articles
                      </span>
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        activeCategory.id === category.id 
                          ? 'bg-accent border-accent' 
                          : 'border-secondary/20 group-hover:bg-accent group-hover:border-accent'
                      }`}>
                        <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${
                          activeCategory.id === category.id 
                            ? 'text-primary' 
                            : 'text-secondary/50 group-hover:text-primary'
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {activeCategory.id === category.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-accent rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link 
              to={`/shop?category=${activeCategory.slug}`}
              className="inline-flex items-center gap-3 mt-12 px-8 py-4 bg-accent text-primary rounded-full font-bold hover:scale-105 transition-all shadow-gold group"
            >
              <span>Voir les {activeCategory.name}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right - Dynamic Image */}
          <div 
            ref={imageContainerRef} 
            className="relative"
            style={{ perspective: "1500px" }}
          >
            <div 
              className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] group cursor-pointer shadow-dark-lg"
              style={{ 
                transform: `rotateY(${mousePosition.x * 0.3}deg) rotateX(${mousePosition.y * -0.3}deg)`,
                transition: "transform 0.3s ease-out",
                transformStyle: "preserve-3d"
              }}
            >
              <img 
                ref={imageRef}
                src={activeCategory.image} 
                alt={activeCategory.name}
                className="w-full h-full object-cover" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              
              {/* Ambient glow */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, hsla(40, 45%, 60%, 0.3) 0%, transparent 60%)`
                }}
              />
              
              {/* Content */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-secondary/80 text-sm">Collection Active</span>
                </div>
                <h3 className="text-secondary text-3xl lg:text-4xl font-bold mb-2">
                  {activeCategory.name}
                </h3>
                <p className="text-secondary/70 text-lg">
                  {activeCategory.description}
                </p>
              </div>

              {/* 3D shine effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(${105 + mousePosition.x * 2}deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)`,
                }}
              />
            </div>

            {/* Floating element */}
            <div 
              className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-accent flex items-center justify-center shadow-gold-glow animate-float"
              style={{
                transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)`,
                transition: "transform 0.3s ease-out"
              }}
            >
              <span className="text-primary font-bold text-center text-sm leading-tight">
                {activeCategory.count}<br/>
                articles
              </span>
            </div>

            {/* Background decorative elements */}
            <div 
              className="absolute -z-10 -bottom-6 -left-6 w-full h-full rounded-[2.5rem] border border-accent/20"
              style={{
                transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
                transition: "transform 0.4s ease-out"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
