import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import valueInclusion from "@/assets/value-inclusion.jpg";
import valueConfidence from "@/assets/value-confidence.jpg";
import valueDiscipline from "@/assets/value-discipline.jpg";
import valueDevelopment from "@/assets/value-development.jpg";
import logo from "@/assets/logo.png";

gsap.registerPlugin(ScrollTrigger);

interface Value {
  icon: string;
  title: string;
  description: string;
  image: string;
  quote: string;
}

const values: Value[] = [
  {
    icon: "⚡️",
    title: "Inclusion",
    description: "Grandir intérieurement, mentalement et émotionnellement.",
    image: valueInclusion,
    quote: "Ensemble, on va plus loin"
  },
  {
    icon: "💪",
    title: "Confiance en soi",
    description: "Seulement pour ceux qui ont l'engagement et la détermination.",
    image: valueConfidence,
    quote: "Crois en ta force"
  },
  {
    icon: "🎯",
    title: "Discipline",
    description: "Persévérer même quand personne ne regarde.",
    image: valueDiscipline,
    quote: "L'excellence est un habit quotidien"
  },
  {
    icon: "✨",
    title: "Développement personnel",
    description: "Rester fidèle à soi-même, sans compromis.",
    image: valueDevelopment,
    quote: "Deviens la meilleure version de toi"
  }
];

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(heroRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      // Story section animation
      gsap.from(storyRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse"
        }
      });

      // Values cards animation
      const cards = valuesRef.current?.querySelectorAll(".value-card");
      if (cards) {
        gsap.from(cards, {
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-x-hidden bg-background">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src={logo} alt="INSPIRE" className="h-8 lg:h-10 w-auto" />
            </a>
            <a 
              href="/"
              className="px-4 py-2 lg:px-6 lg:py-3 rounded-full gradient-accent text-white font-bold text-sm lg:text-base hover:shadow-glow transition-all"
            >
              Retour
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 lg:gap-3 mb-6 lg:mb-8 px-4 lg:px-6 py-2 lg:py-3 gradient-accent rounded-full shadow-accent animate-float">
              <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              <span className="text-xs lg:text-sm font-bold text-white tracking-wider">NOTRE HISTOIRE</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 lg:mb-8">
              Plus qu'une marque,
              <span className="block gradient-text italic">un mouvement</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Inspire. n'est pas né d'un désir de vendre des vêtements. 
              C'est né d'une conviction profonde : <span className="font-bold text-foreground">tu as le pouvoir de devenir exceptionnel</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div ref={storyRef} className="max-w-4xl mx-auto">
            <div className="space-y-8 lg:space-y-12">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8">
                  Notre <span className="gradient-text italic">mission</span>
                </h2>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
                  Chaque matin, tu choisis : <span className="font-bold text-foreground">zone de confort ou excellence</span>.
                </p>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Nos vêtements sont des rappels quotidiens de ta capacité à surmonter l'impossible. 
                  À chaque fois que tu les portes, tu incarnes <span className="font-bold text-accent">la persévérance, la confiance, le dépassement</span>.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16">
                <div className="text-center p-6 rounded-2xl glass-effect border border-border/50">
                  <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">50K+</div>
                  <div className="text-sm lg:text-base text-muted-foreground">Battants inspirés</div>
                </div>
                <div className="text-center p-6 rounded-2xl glass-effect border border-border/50">
                  <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">97%</div>
                  <div className="text-sm lg:text-base text-muted-foreground">Recommandent</div>
                </div>
                <div className="text-center p-6 rounded-2xl glass-effect border border-border/50">
                  <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">4.9/5</div>
                  <div className="text-sm lg:text-base text-muted-foreground">Avis clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
            <div className="inline-flex items-center gap-2 lg:gap-3 mb-6 lg:mb-8 px-4 lg:px-6 py-2 lg:py-3 bg-accent/10 rounded-full">
              <span className="text-xl lg:text-2xl">⚡️</span>
              <span className="text-xs lg:text-sm font-bold text-accent tracking-wider">NOS VALEURS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6">
              Ce qui nous <span className="gradient-text italic">définit</span>
            </h2>
            <p className="text-base lg:text-xl text-muted-foreground">
              Quatre piliers qui guident chaque création, chaque choix, chaque message.
            </p>
          </div>

          <div ref={valuesRef} className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card group relative rounded-2xl lg:rounded-3xl overflow-hidden glass-effect border border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20"
              >
                <div className="relative h-[400px] lg:h-[500px]">
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={value.image} 
                      alt={value.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
                    <div className="mb-4 lg:mb-6 text-4xl lg:text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                      {value.icon}
                    </div>
                    
                    <div className="space-y-3 lg:space-y-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-accent transition-colors">
                        {value.title}
                      </h3>
                      
                      <p className="text-sm lg:text-base text-white/90 leading-relaxed">
                        {value.description}
                      </p>
                      
                      <div className="pt-2 lg:pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-lg lg:text-xl font-bold text-accent italic">
                          "{value.quote}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-6 w-16 h-1 gradient-accent rounded-full transform origin-left group-hover:w-full transition-all duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8">
              Prêt à <span className="gradient-text italic">rejoindre le mouvement</span> ?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 lg:mb-12">
              Plus de 50 000 personnes ont déjà fait le choix de l'excellence quotidienne.
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-3 px-8 lg:px-12 py-4 lg:py-5 rounded-full gradient-accent text-white font-bold text-base lg:text-lg hover:shadow-glow transition-all duration-300 group shadow-accent"
            >
              <span>DÉCOUVRE LA COLLECTION</span>
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
