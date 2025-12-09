import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import hoodie1 from "@/assets/hoodie-1.jpg";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { id: "01", name: "T-Shirts", count: 24 },
  { id: "02", name: "Hoodies", count: 18 },
  { id: "03", name: "Sweaters", count: 15 },
];

const CategorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        x: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      categoriesRef.current.forEach((cat, index) => {
        if (!cat) return;
        gsap.from(cat, {
          x: -40,
          opacity: 0,
          duration: 0.7,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Categories */}
          <div>
            <h2 className="text-[3rem] lg:text-[4.5rem] font-bold leading-[0.95] mb-12 text-secondary">
              Par<span className="block italic text-accent">catégorie</span>
            </h2>

            <div className="space-y-4">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  ref={(el) => (categoriesRef.current[index] = el)}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center justify-between py-6 border-b border-secondary/10 hover:border-accent/50 transition-all">
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-secondary/40 font-mono">{category.id}</span>
                      <h3 className="text-2xl lg:text-3xl font-bold text-secondary group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-secondary/50 text-sm">{category.count}</span>
                      <div className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-primary transition-all">
                        <ArrowRight className="w-4 h-4 text-secondary/50 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Featured Image */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] group cursor-pointer shadow-dark-lg">
              <img 
                src={hoodie1} 
                alt="KAYNA Collection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-secondary/80 text-sm">Nouveau</span>
                </div>
                <h3 className="text-secondary text-2xl lg:text-3xl font-bold mb-4">Collection Élite</h3>
                <button className="px-6 py-3 bg-accent text-primary rounded-full font-bold hover:scale-105 transition-all shadow-gold flex items-center gap-2">
                  <span>Découvrir</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Floating element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-gold-glow animate-float">
              <span className="text-primary font-bold text-center text-sm leading-tight">Qualité<br/>Premium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
