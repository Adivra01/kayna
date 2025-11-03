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
    <section ref={sectionRef} className="py-24 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-8 mb-12">
            <span className="icon-accent text-6xl">✱</span>
            <div>
              <p className="text-sm text-muted-foreground mb-2">©Valeurs Essentielles</p>
              <p className="text-3xl lg:text-4xl font-bold">2025</p>
            </div>
            <button className="ml-auto w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors group">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div ref={textRef} className="space-y-6">
            <p className="text-base lg:text-lg leading-relaxed">
              Nos collections incarnent le dépassement de soi, la confiance et la persévérance. 
              Chaque pièce est pensée pour accompagner les battants qui refusent d'abandonner leurs rêves.
            </p>
            <p className="text-sm text-muted-foreground">
              ©Pour les battants - 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
