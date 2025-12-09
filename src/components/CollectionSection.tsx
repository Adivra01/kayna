import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Flame, Shield, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { 
    Icon: Zap, 
    title: "Confiance", 
    description: "Crois en toi, avance sans douter",
    gradient: "from-accent/20 to-accent/5" 
  },
  { 
    Icon: Flame, 
    title: "Dépassement", 
    description: "Repousse tes limites chaque jour",
    gradient: "from-accent/30 to-accent/10" 
  },
  { 
    Icon: Shield, 
    title: "Persévérance", 
    description: "Ne lâche jamais, quoi qu'il arrive",
    gradient: "from-accent/20 to-accent/5" 
  },
];

const CollectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.from(card, {
          y: 80,
          opacity: 0,
          rotation: index === 1 ? 0 : (index === 0 ? -5 : 5),
          duration: 0.8,
          delay: index * 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center+=50",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-[3rem] lg:text-[4.5rem] font-bold leading-[0.95] mb-6 text-secondary">
            Plus qu'un <span className="italic text-accent">vêtement</span>
          </h2>
          <p className="text-xl text-secondary/60">
            Une philosophie. Un engagement envers toi-même. Trois forces qui te définissent.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {values.map((value, index) => (
            <div
              key={value.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`relative bg-gradient-to-br ${value.gradient} border border-secondary/10 rounded-[2rem] p-8 lg:p-10 hover:border-accent/40 transition-all duration-500 cursor-pointer group overflow-hidden`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all duration-500 rounded-[2rem]" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <value.Icon className="w-8 h-8 text-accent group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-secondary mb-3 group-hover:text-accent transition-colors">
                  {value.title}
                </h3>
                <p className="text-secondary/60 text-lg group-hover:text-secondary/80 transition-colors">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center text-center">
          <Link 
            to="/about"
            className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-primary rounded-full font-bold text-lg shadow-gold hover:shadow-gold-glow hover:scale-105 transition-all group"
          >
            <span>Découvrir notre histoire</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-secondary/40 text-sm mt-6">En savoir plus sur KAYNA</p>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
