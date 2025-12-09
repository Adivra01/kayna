import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CollectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 bg-accent/15 border border-accent/30 rounded-full">
              <span className="text-accent text-2xl animate-pulse">⚔️</span>
              <span className="text-sm font-bold text-accent tracking-wider">LE CHOIX INÉBRANLABLE</span>
            </div>
            
            <h2 className="text-display font-bold leading-none mb-8 text-secondary">
              Transforme le doute
              <span className="block italic text-accent">en élan</span>
            </h2>

            <div ref={textRef} className="space-y-6">
              <p className="text-xl lg:text-2xl leading-relaxed font-light text-secondary">
                KAYNA n'est pas un vêtement. 
                C'est une <span className="italic text-accent">armure spirituelle</span>.
              </p>
              
              <p className="text-base lg:text-lg leading-relaxed text-secondary/70">
                Un <span className="font-bold text-secondary">rappel physique</span> que ton esprit a déjà fait le choix de la victoire. 
                Le doute n'est qu'un bruit de fond. L'épuisement n'est qu'une étape. 
                Ton objectif n'est <span className="text-accent font-bold">pas négociable</span>.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <button className="px-8 py-4 bg-accent text-primary rounded-full font-bold hover:bg-accent-light transition-all hover:scale-105 shadow-gold hover:shadow-gold-glow">
                  PORTER LA CONFIANCE
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-secondary/30 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-sm font-bold text-secondary">Devenir la certitude</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-secondary/5 border border-accent/20 rounded-3xl p-6 lg:p-8 hover:shadow-gold transition-all hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold mb-4 text-accent">⚡</div>
              <h3 className="font-bold text-lg mb-3 text-secondary">Confiance</h3>
              <p className="text-sm text-secondary/60">La base inébranlable de toute action décisive</p>
            </div>
            
            <div className="bg-accent/10 border border-accent/30 rounded-3xl p-6 lg:p-8 hover:shadow-gold-glow transition-all hover:scale-105 mt-8">
              <div className="text-4xl lg:text-5xl font-bold mb-4 text-accent">🔥</div>
              <h3 className="font-bold text-lg mb-3 text-secondary">Dépassement</h3>
              <p className="text-sm text-secondary/60">Transformer chaque limite en tremplin</p>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/20 rounded-3xl p-6 lg:p-8 hover:shadow-elegant transition-all hover:scale-105 -mt-8">
              <div className="text-4xl lg:text-5xl font-bold mb-4 text-accent">🛡️</div>
              <h3 className="font-bold text-lg mb-3 text-secondary">Persévérance</h3>
              <p className="text-sm text-secondary/60">L'engagement qui ne se négocie jamais</p>
            </div>
            
            <div className="bg-accent text-primary rounded-3xl p-6 lg:p-8 hover:shadow-gold-glow transition-all hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold mb-4">★</div>
              <h3 className="font-bold text-lg mb-3">Ton Héritage</h3>
              <p className="text-sm opacity-80">Rejoins ceux qui construisent leur propre légende</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-secondary/40">
            ©KAYNA - Portez la confiance. Devenez la certitude. • 2025
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
