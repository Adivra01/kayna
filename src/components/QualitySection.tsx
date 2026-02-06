import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocalization } from "@/hooks/useLocalization";

gsap.registerPlugin(ScrollTrigger);

const QualitySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLDivElement | null)[]>([]);
  const { home, isRTL } = useLocalization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );

      numbersRef.current.forEach((num, index) => {
        if (!num) return;
        gsap.fromTo(num,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.8, delay: index * 0.15, ease: "back.out(1.5)",
            scrollTrigger: { trigger: sectionRef.current, start: "top 60%", toggleActions: "play none none reverse" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="qualite" className="py-24 lg:py-32 bg-background scroll-mt-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 lg:px-12">
        <div ref={textRef} className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent text-sm uppercase tracking-[0.3em] mb-6 block">{home.qualLabel}</span>
          <h2 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold text-foreground leading-[0.9]">
            {home.qualTitle1}
            <span className="block text-accent italic mt-2">{home.qualTitle2}</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6 lg:gap-12 max-w-4xl mx-auto">
          {home.qualItems.map((quality, index) => (
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

        <p className="text-center text-muted-foreground text-lg mt-12 max-w-xl mx-auto">
          {home.qualMessage}
        </p>
      </div>
    </section>
  );
};

export default QualitySection;
