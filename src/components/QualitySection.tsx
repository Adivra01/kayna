import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QualitySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLDivElement | null)[]>([]);

  const qualities = [
    { number: "240", unit: "GSM", label: "Poids premium" },
    { number: "100", unit: "%", label: "Coton bio" },
    { number: "∞", unit: "", label: "Garantie" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal
      gsap.fromTo(textRef.current,
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

      // Numbers counter effect
      numbersRef.current.forEach((num, index) => {
        if (!num) return;
        gsap.fromTo(num,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.5)",
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
    <section 
      ref={sectionRef} 
      id="qualite"
      className="py-24 lg:py-32 bg-background scroll-mt-20"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={textRef} className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent text-sm uppercase tracking-[0.3em] mb-6 block">Qualité</span>
          <h2 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold text-foreground leading-[0.9]">
            L'excellence.
            <span className="block text-accent italic mt-2">Sans compromis.</span>
          </h2>
        </div>

        {/* Quality Numbers */}
        <div className="grid grid-cols-3 gap-6 lg:gap-12 max-w-4xl mx-auto">
          {qualities.map((quality, index) => (
            <div
              key={quality.label}
              ref={(el) => (numbersRef.current[index] = el)}
              className="text-center p-6 lg:p-10 rounded-3xl bg-card border border-border hover:border-accent/30 transition-all group cursor-default"
            >
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-accent group-hover:scale-110 transition-transform">
                {quality.number}
                <span className="text-2xl sm:text-3xl lg:text-4xl">{quality.unit}</span>
              </div>
              <div className="text-sm sm:text-base text-muted-foreground mt-3 uppercase tracking-wider">
                {quality.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <p className="text-center text-muted-foreground text-lg mt-12 max-w-xl mx-auto">
          Chaque pièce est conçue pour durer. Production éthique, matériaux premium.
        </p>
      </div>
    </section>
  );
};

export default QualitySection;
