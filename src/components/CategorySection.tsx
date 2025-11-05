import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Eye } from "lucide-react";
import { Button } from "./ui/button";
import hoodie1 from "@/assets/hoodie-1.jpg";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { id: "01", name: "T-Shirts", count: 24, active: true, desc: "Confort et style au quotidien" },
  { id: "02", name: "Hoodies", count: 18, active: false, desc: "Chaleur et attitude" },
  { id: "03", name: "Sweaters", count: 15, active: false, desc: "Élégance décontractée" },
];

const CategorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate image
      gsap.from(imageRef.current, {
        x: 100,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      // Animate categories
      categoriesRef.current.forEach((cat, index) => {
        if (!cat) return;
        gsap.from(cat, {
          x: -50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Image rotation on scroll
      gsap.to(imageRef.current, {
        rotation: 5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Vertical Layout */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 bg-secondary rounded-full mb-6 sm:mb-8">
            <span className="text-accent text-lg sm:text-xl">★</span>
            <span className="text-xs sm:text-sm font-bold tracking-wider">NOS CATÉGORIES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none mb-4 sm:mb-6">
            Trouve ton
            <span className="block italic text-accent">style</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Trois catégories essentielles. Une seule mission : exprimer ta détermination.
          </p>
        </div>

        {/* Horizontal Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              ref={(el) => (categoriesRef.current[index] = el)}
              className="group cursor-pointer"
            >
              <div className="relative bg-secondary rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 hover:bg-accent hover:text-white transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden">
                {/* Background Number */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-[80px] sm:text-[100px] lg:text-[120px] font-bold opacity-5 group-hover:opacity-10 transition-opacity">
                  {category.id}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <span className="text-xs sm:text-sm font-bold opacity-60">{category.id}</span>
                    {category.active && (
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent group-hover:bg-white animate-pulse" />
                    )}
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                    {category.name}
                  </h3>

                  <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-70 group-hover:opacity-100">
                    {category.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold">
                      {category.count} produits
                    </span>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Image Below */}
        <div ref={imageRef} className="mt-12 sm:mt-16 lg:mt-20 relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="relative rounded-2xl sm:rounded-[3rem] overflow-hidden aspect-[4/5] group">
              <img 
                src={hoodie1} 
                alt="Collection inspire" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-8">
                <h3 className="text-white text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Collection Élite</h3>
                <p className="text-white/90 text-base sm:text-lg">Disponible maintenant</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-4xl sm:text-5xl lg:text-6xl icon-accent">★</div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                Chaque détail compte
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Du choix des tissus à la coupe finale, nous ne faisons aucun compromis. 
                Parce que tu mérites le meilleur.
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all hover:scale-105 shadow-lg flex items-center gap-2 sm:gap-3 group">
                <span className="text-sm sm:text-base">Découvrir</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
