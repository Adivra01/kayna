import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, RotateCcw, Shield, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const promises = [
  {
    icon: Truck,
    title: "Livraison offerte",
    description: "Dès 75€ d'achat",
  },
  {
    icon: RotateCcw,
    title: "Retours gratuits",
    description: "Sous 30 jours",
  },
  {
    icon: Shield,
    title: "Paiement sécurisé",
    description: "100% protégé",
  },
  {
    icon: Clock,
    title: "Expédition rapide",
    description: "Sous 48h",
  },
];

const BrandPromiseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const promisesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
      });

      promisesRef.current.forEach((promise, index) => {
        if (!promise) return;
        gsap.from(promise, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-accent relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Promises Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {promises.map((promise, index) => (
            <div
              key={promise.title}
              ref={(el) => (promisesRef.current[index] = el)}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <promise.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-primary font-bold text-lg mb-1">{promise.title}</h3>
              <p className="text-primary/60 text-sm">{promise.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={contentRef} className="text-center">
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold leading-[0.95] text-primary mb-6">
            Prêt à porter ta <span className="italic">confiance</span> ?
          </h2>
          <p className="text-xl text-primary/70 max-w-2xl mx-auto mb-10">
            Rejoins ceux qui refusent l'ordinaire. Ta transformation commence ici.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-secondary rounded-full font-bold text-lg hover:scale-105 transition-all shadow-dark-lg group"
          >
            <span>Découvrir la collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandPromiseSection;
