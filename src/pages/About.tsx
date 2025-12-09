import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowLeft, Shield, Flame, Zap, Crown } from "lucide-react";
import storyBattle from "@/assets/story-battle.jpg";
import storyChoice from "@/assets/story-choice.jpg";
import storyHeritage from "@/assets/story-heritage.jpg";
import storyPhilosophy from "@/assets/story-philosophy.jpg";
import logo from "@/assets/logo.png";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on images
      gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
        gsap.to(img, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Fade in sections
      gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Text reveal animations
      gsap.utils.toArray<HTMLElement>(".text-reveal").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=50",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="overflow-x-hidden bg-primary">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-primary/80 border-b border-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logo} alt="KAYNA" className="h-8 sm:h-10 lg:h-12 w-auto object-contain" />
            </Link>
            <Link 
              to="/"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-secondary/20 text-secondary hover:bg-accent hover:text-primary hover:border-accent transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - L'Introduction */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={storyPhilosophy} 
            alt="KAYNA - La Certitude" 
            className="w-full h-full object-cover parallax-img scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center py-32">
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-accent uppercase tracking-[0.3em] text-sm font-medium fade-up">Notre Histoire</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-secondary leading-none fade-up">
              KAYNA
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl text-secondary/80 italic font-light fade-up">
              La Certitude Inébranlable
            </p>
            <div className="w-24 h-1 bg-accent mx-auto fade-up" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-secondary/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-accent rounded-full" />
          </div>
        </div>
      </section>

      {/* Section 1 - La Philosophie */}
      <section className="py-24 lg:py-40 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8 fade-up">
              <Shield className="w-8 h-8 text-accent" />
              <span className="text-accent uppercase tracking-widest text-sm">Chapitre 1</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-12 fade-up">
              Plus qu'un mot,<br/>
              <span className="text-accent italic">une Philosophie</span>
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 text-reveal">
                <p className="text-xl lg:text-2xl text-secondary/90 leading-relaxed">
                  En <span className="text-accent font-semibold">Songhaï</span>, KAYNA est un mot qui résonne 
                  au-delà de la simple traduction.
                </p>
                <p className="text-lg text-secondary/70 leading-relaxed">
                  Ce n'est pas seulement la <span className="font-bold text-secondary">Certitude</span> ; 
                  c'est la convergence de trois forces inébranlables :
                </p>
                
                <div className="space-y-6 pl-6 border-l-2 border-accent/50">
                  <div>
                    <h4 className="text-xl font-bold text-accent">La Confiance</h4>
                    <p className="text-secondary/60">La fondation de chaque action que tu entreprends.</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-accent">Le Dépassement</h4>
                    <p className="text-secondary/60">L'état d'esprit qui refuse les limites imposées.</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-accent">La Persévérance</h4>
                    <p className="text-secondary/60">La seule issue acceptable face à tes objectifs.</p>
                  </div>
                </div>
                
                <p className="text-2xl font-bold text-secondary pt-4">
                  La plus grande victoire commence par cette <span className="text-accent italic">certitude intérieure</span>.
                </p>
              </div>
              
              <div className="relative fade-up order-first lg:order-last">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={storyPhilosophy} 
                    alt="La Philosophie KAYNA"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-accent text-primary px-6 py-4 rounded-2xl shadow-gold">
                  <p className="text-sm uppercase tracking-wider opacity-80">Depuis</p>
                  <p className="text-2xl font-bold">2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - La Bataille Silencieuse */}
      <section className="relative py-24 lg:py-40">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={storyBattle} 
            alt="La Bataille Silencieuse"
            className="w-full h-full object-cover parallax-img scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8 fade-up">
              <Flame className="w-8 h-8 text-accent" />
              <span className="text-accent uppercase tracking-widest text-sm">Chapitre 2</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-12 fade-up">
              La Bataille<br/>
              <span className="text-accent italic">Silencieuse</span>
            </h2>
            
            <div className="space-y-8 text-reveal">
              <p className="text-2xl lg:text-3xl text-secondary font-light leading-relaxed">
                Tu connais cette bataille. Nous l'avons tous vécue.
              </p>
              
              <p className="text-lg lg:text-xl text-secondary/80 leading-relaxed">
                Ce n'est pas la difficulté de la tâche qui t'écrase. C'est cette <span className="font-bold text-secondary">petite voix sournoise</span> qui 
                frappe dans le silence de l'aube.
              </p>
              
              <div className="bg-secondary/5 backdrop-blur-sm border border-secondary/10 rounded-2xl p-8 my-12">
                <p className="text-xl text-secondary/90 italic leading-relaxed">
                  "Elle te parle de l'épuisement. Du cynisme des autres. De la tentation de tout 
                  laisser tomber après un échec."
                </p>
              </div>
              
              <p className="text-lg lg:text-xl text-secondary/80 leading-relaxed">
                Le véritable ennemi n'est pas le manque de talent. C'est la <span className="text-accent font-semibold">faiblesse de l'esprit</span> qui 
                cherche une porte de sortie facile.
              </p>
              
              <p className="text-2xl lg:text-3xl font-bold text-secondary pt-6">
                C'est là, dans cette solitude du combat, que le commun des mortels recule.<br/>
                <span className="text-accent italic">Mais toi, tu as choisi une autre voie.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Le Choix Inébranlable */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative fade-up">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={storyChoice} 
                    alt="Le Choix Inébranlable"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-gold">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-8 fade-up">
                  <Zap className="w-8 h-8 text-accent" />
                  <span className="text-accent uppercase tracking-widest text-sm">Chapitre 3</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-12 fade-up">
                  Le Choix<br/>
                  <span className="text-accent italic">Inébranlable</span>
                </h2>
                
                <div className="space-y-8 text-reveal">
                  <p className="text-2xl text-secondary font-light leading-relaxed">
                    C'est pour ce moment précis que <span className="text-accent font-bold">KAYNA</span> existe.
                  </p>
                  
                  <p className="text-lg text-secondary/80 leading-relaxed">
                    Nous sommes là pour <span className="font-bold text-secondary">transformer le doute en élan</span>. 
                    Le vêtement que tu enfiles est le rappel physique que ton esprit a déjà fait le choix de la victoire.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                      <div>
                        <p className="font-bold text-secondary">Le doute n'est qu'un bruit de fond</p>
                        <p className="text-secondary/60">Car ta Confiance est la fondation de ton action.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                      <div>
                        <p className="font-bold text-secondary">L'épuisement n'est qu'une étape</p>
                        <p className="text-secondary/60">Car ton Dépassement est ton mode de vie.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                      <div>
                        <p className="font-bold text-secondary">Ton objectif n'est pas négociable</p>
                        <p className="text-secondary/60">Car ta Persévérance est la seule issue.</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xl font-bold text-secondary pt-4">
                    Ce n'est pas un vêtement que tu mets.<br/>
                    C'est une <span className="text-accent italic">armure spirituelle</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Ton Héritage */}
      <section className="relative py-24 lg:py-40">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={storyHeritage} 
            alt="Ton Héritage"
            className="w-full h-full object-cover parallax-img scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/95 to-primary/80" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl ml-auto text-right">
            <div className="flex items-center gap-4 mb-8 justify-end fade-up">
              <span className="text-accent uppercase tracking-widest text-sm">Chapitre 4</span>
              <Crown className="w-8 h-8 text-accent" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-12 fade-up">
              Ton Uniforme.<br/>
              <span className="text-accent italic">Ton Héritage.</span>
            </h2>
            
            <div className="space-y-8 text-reveal">
              <p className="text-2xl lg:text-3xl text-secondary font-light leading-relaxed">
                KAYNA n'est pas juste un vêtement.<br/>
                C'est <span className="font-bold">l'uniforme de ton assurance inébranlable</span>.
              </p>
              
              <p className="text-lg lg:text-xl text-secondary/80 leading-relaxed">
                Chaque pièce est conçue avec la rigueur et la résilience nécessaires pour supporter 
                ta propre ascension. Inspiré par ceux qui, de <span className="text-accent font-semibold">l'Afrique de l'Ouest</span> aux capitales du monde, 
                ont forgé leur propre succès par la volonté.
              </p>
              
              <p className="text-lg text-secondary/70 leading-relaxed">
                Nous nous adressons à ceux qui savent que le plus grand héritage n'est pas ce que l'on reçoit, 
                mais <span className="font-bold text-secondary">ce que l'on construit et transmet</span> par la force de sa détermination.
              </p>
              
              <p className="text-2xl lg:text-3xl font-bold text-secondary pt-6">
                En portant KAYNA, tu rejoins ceux qui se battent pour<br/>
                <span className="text-accent italic">chaque victoire</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 lg:py-48 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10 fade-up">
            <div className="w-20 h-1 bg-accent mx-auto" />
            
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-secondary leading-tight">
              Porte l'assurance.<br/>
              <span className="text-accent italic">Deviens la Certitude.</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-secondary/70 max-w-2xl mx-auto">
              Ceci est KAYNA. Ton engagement. Ton héritage. Ta victoire.
            </p>
            
            <div className="pt-8">
              <Link 
                to="/shop"
                className="inline-flex items-center gap-3 px-10 py-5 lg:px-12 lg:py-6 rounded-full bg-accent text-primary font-bold text-lg lg:text-xl shadow-gold hover:shadow-gold-glow hover:scale-105 transition-all group"
              >
                <span>DÉCOUVRIR LA COLLECTION</span>
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;