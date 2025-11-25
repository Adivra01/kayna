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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-primary relative">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Vertical Layout */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-accent/10 border border-accent/30 rounded-full mb-8">
            <span className="text-accent text-xl">★</span>
            <span className="text-sm font-bold tracking-wider text-white">NOS CATÉGORIES</span>
          </div>
          <h2 className="text-display font-bold leading-none mb-6 text-white">
            Trouve ton
            <span className="block italic text-accent">style</span>
          </h2>
          <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto">
            Trois catégories essentielles. Une seule mission : exprimer ta détermination.
          </p>
        </div>

        {/* Horizontal Cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              ref={(el) => (categoriesRef.current[index] = el)}
              className="group cursor-pointer"
            >
              <div className="relative bg-primary-dark border border-primary-light/30 rounded-3xl p-8 lg:p-10 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-500 hover:scale-105 hover:shadow-gold-glow overflow-hidden">
                {/* Background Number */}
                <div className="absolute top-4 right-4 text-[120px] font-bold opacity-5 group-hover:opacity-10 transition-opacity">
                  {category.id}
                </div>

                <div className="relative z-10 text-white group-hover:text-primary">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-bold opacity-60">{category.id}</span>
                    {category.active && (
                      <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                    )}
                  </div>

                  <h3 className="text-4xl lg:text-5xl font-bold mb-4 group-hover:scale-105 transition-transform">
                    {category.name}
                  </h3>

                  <p className="text-base lg:text-lg mb-6 opacity-70 group-hover:opacity-100">
                    {category.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">
                      {category.count} produits
                    </span>
                    <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Image Below */}
        <div ref={imageRef} className="mt-20 relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] group border border-accent/30 shadow-royal-lg">
              <img 
                src={hoodie1} 
                alt="Collection KAYNA" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-white text-3xl font-bold mb-2">Collection Élite</h3>
                <p className="text-white/90 text-lg">Disponible maintenant</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-6xl text-accent">★</div>
              <h3 className="text-heading font-bold text-white">
                Chaque détail compte
              </h3>
              <p className="text-lg text-white/70 leading-relaxed">
                Du choix des tissus à la coupe finale, nous ne faisons aucun compromis. 
                Parce que tu mérites le meilleur.
              </p>
              <button className="px-8 py-4 bg-accent text-primary rounded-full font-bold hover:bg-accent-light transition-all hover:scale-105 shadow-gold flex items-center gap-3 group">
                <span>Découvrir</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
