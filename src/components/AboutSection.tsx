import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import valueGrowth from "@/assets/value-growth.jpg";
import valueConfidence from "@/assets/value-confidence.jpg";
import valueDiscipline from "@/assets/value-discipline.jpg";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(heroRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      // Values cards animation
      const cards = valuesRef.current?.querySelectorAll(".value-card");
      if (cards) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: "⚡️",
      title: "Inclusion",
      description: "Grandir intérieurement, mentalement et émotionnellement",
      image: valueGrowth,
    },
    {
      icon: "💪",
      title: "Confiance en soi",
      description: "Pour ceux qui ont l'engagement et la détermination",
      image: valueConfidence,
    },
    {
      icon: "🎯",
      title: "Discipline",
      description: "Persévérer même quand personne ne regarde",
      image: valueDiscipline,
    },
    {
      icon: "✨",
      title: "Développement personnel",
      description: "Rester fidèle à soi-même, sans compromis",
      image: valueGrowth,
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 gradient-accent rounded-full shadow-accent animate-float">
            <span className="text-xl sm:text-2xl">⚡️</span>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wider">NOS VALEURS</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 sm:mb-8">
            Plus qu'une marque,
            <span className="block gradient-text">un mouvement</span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Chaque vêtement porte nos valeurs. Chaque choix est un pas vers ton excellence.
          </p>
        </div>

        {/* Values Grid */}
        <div ref={valuesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="value-card group relative rounded-2xl sm:rounded-3xl overflow-hidden glass-effect border border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow"
            >
              {/* Image Background */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <img 
                  src={value.image} 
                  alt={value.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
              
              {/* Content */}
              <div className="relative p-6 sm:p-8 h-full flex flex-col justify-end min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 sm:mb-6 text-4xl sm:text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  {value.icon}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                  {value.title}
                </h3>
                
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {value.description}
                </p>

                {/* Decorative line */}
                <div className="mt-4 sm:mt-6 w-12 h-1 gradient-accent rounded-full transform origin-left group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
            Rejoins <span className="font-bold text-accent">50 000+ battants</span> qui incarnent ces valeurs chaque jour
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 rounded-full gradient-accent text-white font-bold text-sm sm:text-base hover:shadow-glow transition-all duration-300 group shadow-accent">
            <span className="flex items-center gap-3">
              DÉCOUVRE LA COLLECTION
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
