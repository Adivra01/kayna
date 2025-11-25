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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-primary-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 bg-accent/10 border border-accent/20 rounded-full">
              <span className="text-accent text-2xl animate-pulse">★</span>
              <span className="text-sm font-bold text-accent tracking-wider">POURQUOI KAYNA?</span>
            </div>
            
            <h2 className="text-display font-bold leading-none mb-8 text-white">
              L'excellence
              <span className="block italic text-accent">n'attend pas</span>
            </h2>

            <div ref={textRef} className="space-y-6">
              <p className="text-xl lg:text-2xl leading-relaxed font-light text-white">
                Tu n'es pas là pour <span className="font-bold">suivre</span>. 
                Tu es là pour <span className="italic text-accent">montrer la voie</span>.
              </p>
              
              <p className="text-base lg:text-lg leading-relaxed text-white/80">
                Nos collections sont créées pour les <span className="font-bold text-white">visionnaires</span>, 
                les <span className="font-bold text-white">persévérants</span>, ceux qui transforment les obstacles en tremplins. 
                Chaque pièce incarne la <span className="text-accent">détermination</span> et 
                la <span className="text-accent">confiance</span> que tu portes déjà en toi.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <button className="px-8 py-4 bg-accent text-primary rounded-full font-bold hover:bg-accent-light transition-all hover:scale-105 shadow-gold">
                  DÉCOUVRIR
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-bold text-white">Livraison gratuite</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary border border-primary-light/30 rounded-3xl p-6 lg:p-8 hover:shadow-royal-md transition-all hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold mb-4 text-accent">01</div>
              <h3 className="font-bold text-lg mb-3 text-white">Qualité Premium</h3>
              <p className="text-sm text-white/70">Tissus haut de gamme sélectionnés pour leur durabilité et confort</p>
            </div>
            
            <div className="bg-primary border border-primary-light/30 rounded-3xl p-6 lg:p-8 hover:shadow-royal-md transition-all hover:scale-105 mt-8">
              <div className="text-4xl lg:text-5xl font-bold mb-4 text-accent">02</div>
              <h3 className="font-bold text-lg mb-3 text-white">Design Unique</h3>
              <p className="text-sm text-white/70">Créations originales qui racontent ton histoire</p>
            </div>
            
            <div className="bg-primary border border-primary-light/30 rounded-3xl p-6 lg:p-8 hover:shadow-royal-md transition-all hover:scale-105 -mt-8">
              <div className="text-4xl lg:text-5xl font-bold mb-4 text-accent">03</div>
              <h3 className="font-bold text-lg mb-3 text-white">Impact Positif</h3>
              <p className="text-sm text-white/70">Production éthique et responsable</p>
            </div>
            
            <div className="bg-accent text-primary rounded-3xl p-6 lg:p-8 hover:shadow-gold-glow transition-all hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold mb-4">★</div>
              <h3 className="font-bold text-lg mb-3">Communauté</h3>
              <p className="text-sm opacity-90">Rejoins 50K+ battants qui incarnent l'excellence</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-white/50">
            ©KAYNA - Dépassement, Confiance, Persévérance • 2025
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
