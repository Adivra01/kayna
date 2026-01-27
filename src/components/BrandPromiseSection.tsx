import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Truck, RotateCcw, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const promises = [
  { icon: Truck, text: "Livraison offerte dès 75€" },
  { icon: RotateCcw, text: "Retours gratuits 30j" },
  { icon: Shield, text: "Paiement sécurisé" },
];

const BrandPromiseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const promisesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      promisesRef.current.forEach((promise, index) => {
        if (!promise) return;
        gsap.fromTo(promise,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-accent">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Promises */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16">
          {promises.map((promise, index) => (
            <div
              key={promise.text}
              ref={(el) => (promisesRef.current[index] = el)}
              className="flex items-center gap-3"
            >
              <promise.icon className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">{promise.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={contentRef} className="text-center">
          <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-bold text-primary leading-[1.1] mb-6">
            Prêt à porter ta <span className="italic">confiance</span> ?
          </h2>
          
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-secondary rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-dark-lg"
          >
            <span>Découvrir</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandPromiseSection;
