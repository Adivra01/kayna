import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Shield, Flame, Zap } from "lucide-react";
import kaynaHero from "@/assets/kayna-hero.jpg";
import aboutHeritage from "@/assets/about-heritage.jpg";
import aboutConfidence from "@/assets/about-confidence.jpg";
import aboutBattle from "@/assets/about-battle.jpg";
import logo from "@/assets/logo.png";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in animations for all sections
      const sections = document.querySelectorAll(".fade-section");
      sections.forEach((section, index) => {
        gsap.from(section, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-x-hidden bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logo} alt="KAYNA" className="h-8 sm:h-10 lg:h-12 w-auto object-contain" />
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={kaynaHero} alt="KAYNA - La Certitude" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center text-white py-20">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              KAYNA
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl gradient-text italic font-light">
              L'Histoire de notre Certitude
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Plus qu'un mot */}
      <section className="py-16 sm:py-20 lg:py-32 bg-secondary/30 fade-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-accent" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
              KAYNA : Plus qu'un mot, <span className="gradient-text italic">une Philosophie</span>
            </h2>
            <div className="space-y-6 text-lg sm:text-xl lg:text-2xl leading-relaxed">
              <p>
                En Songhaï, KAYNA est un mot qui résonne au-delà de la simple traduction. 
                Ce n'est pas seulement la <span className="font-bold">Certitude</span> ; 
                c'est la convergence de la <span className="gradient-text font-bold">Confiance</span>, 
                du <span className="gradient-text font-bold">Dépassement</span> et 
                de la <span className="gradient-text font-bold">Persévérance</span>.
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                C'est l'état d'esprit inébranlable qui résulte d'un engagement total envers votre propre potentiel.
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Nous croyons que la plus grande victoire commence par cette certitude intérieure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Battle Section */}
      <section className="py-16 sm:py-20 lg:py-32 fade-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                La Bataille <span className="gradient-text italic">Silencieuse</span>
              </h2>
              <p className="text-xl sm:text-2xl font-light leading-relaxed">
                Nous avons tous été là.
              </p>
              <div className="space-y-4 text-base sm:text-lg lg:text-xl leading-relaxed">
                <p>
                  Vous vous rappelez de la bataille silencieuse ? Ce n'est pas la difficulté de la tâche qui vous écrase, 
                  mais la petite voix sournoise qui frappe dans le silence de l'aube. Elle vous parle de l'épuisement, 
                  du cynisme des autres, ou de la tentation de tout laisser tomber après un échec.
                </p>
                <p className="text-muted-foreground">
                  Le véritable ennemi n'est pas le manque de talent, mais la faiblesse de l'esprit qui cherche 
                  une porte de sortie facile.
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  C'est là, dans cette solitude du combat, que le commun des mortels recule. 
                  Mais vous, vous avez choisi <span className="gradient-text italic">une autre voie</span>.
                </p>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <img 
                src={aboutBattle} 
                alt="La Bataille Silencieuse" 
                className="rounded-2xl lg:rounded-3xl w-full h-auto shadow-2xl hover:shadow-accent/20 transition-shadow duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Choice Section */}
      <section className="py-16 sm:py-20 lg:py-32 bg-secondary/30 fade-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <img 
                src={aboutConfidence} 
                alt="Le Choix Inébranlable" 
                className="rounded-2xl lg:rounded-3xl w-full h-auto shadow-2xl hover:shadow-accent/20 transition-shadow duration-500"
              />
            </div>
            <div className="space-y-6">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Le Choix <span className="gradient-text italic">Inébranlable</span>
              </h2>
              <p className="text-xl sm:text-2xl font-light leading-relaxed">
                C'est pour ce moment précis que KAYNA existe.
              </p>
              <div className="space-y-4 text-base sm:text-lg lg:text-xl leading-relaxed">
                <p>
                  Nous sommes là pour transformer le doute en élan. Le vêtement que vous enfilez est 
                  le rappel physique que votre esprit a déjà fait le choix de la victoire.
                </p>
                <p className="font-bold">
                  KAYNA est l'ancrage qui vous donne la certitude que :
                </p>
                <div className="space-y-3 pl-4 border-l-4 border-accent">
                  <p>
                    <span className="font-bold gradient-text">Le doute n'est qu'un bruit de fond</span> – 
                    Car votre Confiance est la fondation de votre action.
                  </p>
                  <p>
                    <span className="font-bold gradient-text">L'épuisement n'est qu'une étape</span> – 
                    Car votre Dépassement est votre mode de vie.
                  </p>
                  <p>
                    <span className="font-bold gradient-text">Votre objectif n'est pas négociable</span> – 
                    Car votre Persévérance est la seule issue.
                  </p>
                </div>
                <p className="text-xl sm:text-2xl font-bold pt-4">
                  Ce n'est pas un vêtement que vous mettez, c'est une <span className="gradient-text italic">armure spirituelle</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-16 sm:py-20 lg:py-32 fade-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Votre Uniforme. <span className="gradient-text italic">Votre Héritage.</span>
              </h2>
              <div className="space-y-4 text-base sm:text-lg lg:text-xl leading-relaxed">
                <p className="text-xl sm:text-2xl font-light">
                  KAYNA n'est pas juste un vêtement. C'est <span className="font-bold">l'uniforme de votre assurance inébranlable</span>.
                </p>
                <p>
                  Chaque pièce est conçue avec la rigueur et la résilience nécessaires pour supporter votre propre ascension. 
                  Inspiré par ceux qui, de l'Afrique de l'Ouest aux capitales du monde, ont forgé leur propre succès par la volonté.
                </p>
                <p className="text-muted-foreground">
                  Nous nous adressons à ceux qui savent que le plus grand héritage n'est pas ce que l'on reçoit, 
                  mais ce que l'on construit et transmet par la force de sa détermination.
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  En portant KAYNA, vous rejoignez ceux qui se battent pour <span className="gradient-text italic">chaque victoire</span>.
                </p>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <img 
                src={aboutHeritage} 
                alt="Votre Héritage" 
                className="rounded-2xl lg:rounded-3xl w-full h-auto shadow-2xl hover:shadow-accent/20 transition-shadow duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 lg:py-40 bg-primary text-primary-foreground relative overflow-hidden fade-section">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Portez l'assurance. <br/>
              <span className="gradient-text italic">Devenez la Certitude.</span>
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl opacity-90 font-light">
              Ceci est KAYNA. Votre engagement. Votre héritage. Votre victoire.
            </p>
            <div className="pt-6">
              <a 
                href="/"
                className="inline-flex items-center gap-3 px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-full gradient-accent text-white font-bold text-base sm:text-lg lg:text-xl hover:shadow-glow transition-all duration-300 group shadow-2xl hover:scale-105"
              >
                <span>DÉCOUVRIR LA COLLECTION</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;