import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles, Target, Heart, Zap, TrendingUp } from "lucide-react";
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
  const manifestoRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero split text animation
      const heroTitle = heroRef.current?.querySelector("h1");
      if (heroTitle) {
        gsap.from(heroTitle.children, {
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out"
        });
      }

      // Manifesto parallax
      gsap.to(manifestoRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      // Timeline items stagger
      const timelineItems = timelineRef.current?.querySelectorAll(".timeline-item");
      if (timelineItems) {
        gsap.from(timelineItems, {
          x: -100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        });
      }

      // Values cards with scale
      const cards = valuesRef.current?.querySelectorAll(".value-card");
      if (cards) {
        cards.forEach((card) => {
          gsap.from(card, {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: card,
              start: "top center+=150",
              toggleActions: "play none none reverse"
            }
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-x-hidden bg-background">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logo} alt="INSPIRE" className="h-7 sm:h-8 lg:h-10 w-auto" />
            </a>
            <a 
              href="/"
              className="px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-full gradient-accent text-white font-bold text-xs sm:text-sm lg:text-base hover:shadow-glow transition-all hover:scale-105"
            >
              Retour
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-rgb),0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-12 sm:py-16 lg:py-20">
          <div ref={heroRef} className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 lg:space-y-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 gradient-accent rounded-full shadow-lg animate-float">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">NOTRE HISTOIRE</span>
            </div>
            
            <h1 className="font-bold leading-[1.1] mb-0">
              <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">Plus qu'une marque,</span>
              <span className="block gradient-text italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mt-2 sm:mt-4">un mouvement</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
              Inspire. n'est pas né d'un désir de vendre des vêtements. 
              C'est né d'une conviction profonde : <span className="font-bold text-foreground">tu as le pouvoir de devenir exceptionnel</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6">
              <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>50K+ Battants</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>97% Satisfaits</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>4.9/5 Étoiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section - New */}
      <section ref={manifestoRef} className="relative py-20 sm:py-28 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-accent/10 rounded-full">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-accent" />
                <span className="text-xs sm:text-sm font-bold text-accent tracking-wider">NOTRE MANIFESTE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 lg:mb-10 leading-tight">
                Chaque jour est une <span className="gradient-text italic">opportunité</span>
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-base sm:text-lg lg:text-xl leading-relaxed">
              <p className="text-center md:text-left">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">"</span>
                <span className="font-light">Chaque matin, tu te réveilles avec un choix. Tu peux </span>
                <span className="font-bold text-foreground">rester là où tu es</span>
                <span className="font-light">, dans ta zone de confort, ou tu peux </span>
                <span className="font-bold gradient-text italic">décider d'être exceptionnel</span>
                <span className="font-light">.</span>
              </p>
              
              <p className="text-center md:text-left font-light text-muted-foreground">
                Nos vêtements ne sont pas juste du tissu cousu ensemble. Ce sont des <span className="font-bold text-foreground">armures mentales</span>, 
                des rappels constants que tu es capable de plus. Quand tu portes Inspire., tu ne portes pas qu'un vêtement — 
                tu portes une <span className="font-bold gradient-text">déclaration d'intention</span>.
              </p>

              <p className="text-center md:text-left font-light text-muted-foreground">
                La discipline n'est pas un fardeau. C'est <span className="font-bold text-foreground">ta liberté</span>. 
                La confiance n'est pas innée. C'est <span className="font-bold text-foreground">le résultat de tes actions</span>. 
                Le développement personnel n'est pas un luxe. C'est <span className="font-bold gradient-text italic">ta responsabilité</span>.
              </p>

              <div className="pt-6 sm:pt-8 lg:pt-10 text-center">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Bienvenue dans le mouvement <span className="gradient-text italic">Inspire.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - New */}
      <section ref={timelineRef} className="py-16 sm:py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-accent/10 rounded-full">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-accent" />
              <span className="text-xs sm:text-sm font-bold text-accent tracking-wider">NOTRE ÉVOLUTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
              L'histoire d'un <span className="gradient-text italic">rêve devenu réalité</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
            {[
              {
                year: "2021",
                title: "La naissance d'une vision",
                description: "Tout commence avec une idée simple : créer plus que des vêtements, créer un mouvement qui inspire les gens à devenir la meilleure version d'eux-mêmes."
              },
              {
                year: "2022",
                title: "Les premiers battants",
                description: "1000 personnes nous font confiance. Chaque témoignage renforce notre conviction : nous sommes sur la bonne voie."
              },
              {
                year: "2023",
                title: "L'expansion du mouvement",
                description: "La communauté explose. 25K membres partagent leur transformation. Nos vêtements deviennent des symboles de dépassement."
              },
              {
                year: "2024",
                title: "50K battants et au-delà",
                description: "Aujourd'hui, nous sommes plus de 50 000 à porter ces valeurs. Demain, nous serons encore plus nombreux à inspirer le monde."
              }
            ].map((item, index) => (
              <div key={index} className="timeline-item flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 group">
                <div className="flex-shrink-0">
                  <div className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 rounded-2xl sm:rounded-3xl gradient-accent flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-lg group-hover:shadow-glow transition-all group-hover:scale-110">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 glass-effect border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 group-hover:border-accent/50 transition-all">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 group-hover:gradient-text transition-all">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced */}
      <section className="py-16 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-accent/10 rounded-full">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-accent" />
              <span className="text-xs sm:text-sm font-bold text-accent tracking-wider">NOS VALEURS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              Ce qui nous <span className="gradient-text italic">définit</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
              Quatre piliers qui guident chaque création, chaque choix, chaque message.
            </p>
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card group relative rounded-2xl lg:rounded-3xl overflow-hidden glass-effect border border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20"
              >
                <div className="relative h-[350px] sm:h-[400px] lg:h-[500px]">
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
                  <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 lg:p-8">
                    <div className="mb-3 sm:mb-4 lg:mb-6 text-3xl sm:text-4xl lg:text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                      {value.icon}
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-accent transition-colors">
                        {value.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed">
                        {value.description}
                      </p>
                      
                      <div className="pt-2 sm:pt-3 lg:pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-base sm:text-lg lg:text-xl font-bold text-accent italic">
                          "{value.quote}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 lg:mt-6 w-12 sm:w-16 h-1 gradient-accent rounded-full transform origin-left group-hover:w-full transition-all duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-16 sm:py-20 lg:py-32 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
              Prêt à <span className="gradient-text italic">rejoindre le mouvement</span> ?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
              Plus de 50 000 personnes ont déjà fait le choix de l'excellence quotidienne. Et toi, qu'attends-tu ?
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a 
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 lg:px-12 py-4 sm:py-4.5 lg:py-5 rounded-full gradient-accent text-white font-bold text-sm sm:text-base lg:text-lg hover:shadow-glow transition-all duration-300 group shadow-lg hover:scale-105"
              >
                <span>DÉCOUVRE LA COLLECTION</span>
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
              </a>
              
              <a 
                href="#values"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 lg:px-12 py-4 sm:py-4.5 lg:py-5 rounded-full border-2 border-accent text-accent font-bold text-sm sm:text-base lg:text-lg hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Target className="w-5 h-5 lg:w-6 lg:h-6" />
                <span>NOS VALEURS</span>
              </a>
            </div>

            <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl glass-effect border border-border/50">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">50K+</div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">Battants inspirés</div>
              </div>
              <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl glass-effect border border-border/50">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">97%</div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">Recommandent</div>
              </div>
              <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl glass-effect border border-border/50">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">4.9/5</div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">Avis clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
