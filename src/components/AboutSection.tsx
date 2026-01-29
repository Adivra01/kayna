import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutMain from "@/assets/hero-group.jpg";
import aboutLifestyle from "@/assets/kayna-confidence.jpg";
import aboutStar from "@/assets/about-star.jpg";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { word: "Confiance", meaning: "La fondation de chaque action" },
  { word: "Dépassement", meaning: "Refuser les plafonds imposés" },
  { word: "Persévérance", meaning: "La seule issue acceptable" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<HTMLDivElement>(null);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Values stagger reveal
      valuesRef.current.forEach((value, index) => {
        if (!value) return;
        gsap.fromTo(value,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Images parallax
      const images = imagesRef.current?.querySelectorAll("img");
      images?.forEach((img, i) => {
        gsap.to(img, {
          yPercent: i % 2 === 0 ? -15 : 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Auto-rotate values
      const interval = setInterval(() => {
        setActiveValue((prev) => (prev + 1) % values.length);
      }, 3000);

      return () => clearInterval(interval);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 lg:py-32 bg-primary overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[300px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            <div ref={titleRef}>
              <span className="text-accent text-sm uppercase tracking-[0.3em] mb-6 block">Philosophie</span>
              <h2 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold text-secondary leading-[0.9] mb-8">
                Trois forces.
                <span className="block text-accent italic mt-2">Une certitude.</span>
              </h2>
            </div>

            {/* Values */}
            <div className="space-y-4 mb-10">
              {values.map((value, index) => (
                <div
                  key={value.word}
                  ref={(el) => (valuesRef.current[index] = el)}
                  className={`p-5 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    activeValue === index
                      ? "border-accent bg-accent/10"
                      : "border-secondary/10 hover:border-secondary/30"
                  }`}
                  onClick={() => setActiveValue(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold transition-colors ${
                        activeValue === index ? "text-accent" : "text-secondary"
                      }`}>
                        {value.word}
                      </h3>
                      <p className={`text-sm mt-1 transition-colors ${
                        activeValue === index ? "text-secondary/80" : "text-secondary/50"
                      }`}>
                        {value.meaning}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full transition-all ${
                      activeValue === index ? "bg-accent scale-100" : "bg-secondary/20 scale-75"
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <p className="text-lg text-secondary/50 italic border-l-2 border-accent/30 pl-6">
              "Avant toute réussite visible, il y a cette victoire invisible : la certitude intérieure."
            </p>
          </div>

          {/* Right - Images */}
          <div ref={imagesRef} className="order-1 lg:order-2 relative h-[500px] lg:h-[600px]">
            {/* Main Image */}
            <div className="absolute top-0 right-0 w-[75%] h-[70%] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={aboutMain}
                alt="KAYNA Community"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>

            {/* Secondary Image */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[50%] rounded-2xl overflow-hidden shadow-xl border-4 border-primary">
              <img
                src={aboutLifestyle}
                alt="KAYNA Lifestyle"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
            </div>

            {/* Accent Image */}
            <div className="absolute top-[60%] right-[5%] w-[35%] aspect-square rounded-2xl overflow-hidden shadow-gold border-2 border-accent/30">
              <img
                src={aboutStar}
                alt="KAYNA Star"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute top-4 left-4 backdrop-blur-xl bg-primary/70 border border-accent/30 px-4 py-2 rounded-full">
              <span className="text-accent font-bold text-sm">240 GSM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
};

export default AboutSection;
