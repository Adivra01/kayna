import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { icon: "⚡", title: "Confiance", color: "bg-secondary/5 border-accent/20" },
  { icon: "🔥", title: "Dépassement", color: "bg-accent/10 border-accent/30" },
  { icon: "🛡️", title: "Persévérance", color: "bg-secondary/5 border-secondary/20" },
];

const CollectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[150px]"></div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-[3rem] lg:text-[4.5rem] font-bold leading-[0.95] mb-6 text-secondary">
            Plus qu'un<span className="block italic text-accent">vêtement</span>
          </h2>
          <p className="text-xl text-secondary/60">
            Une philosophie. Un engagement envers toi-même.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {values.map((value, index) => (
            <div
              key={value.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`${value.color} border rounded-3xl p-8 lg:p-10 hover:scale-105 transition-all cursor-pointer group`}
            >
              <div className="text-4xl mb-6">{value.icon}</div>
              <h3 className="text-2xl font-bold text-secondary group-hover:text-accent transition-colors">{value.title}</h3>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="px-10 py-5 bg-accent text-primary rounded-full font-bold text-lg shadow-gold hover:shadow-gold-glow hover:scale-105 transition-all flex items-center gap-3">
            <span>Rejoindre KAYNA</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="text-secondary/40 text-sm">Livraison offerte dès 75€</span>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
