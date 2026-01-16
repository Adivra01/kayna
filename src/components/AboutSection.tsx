import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import sweater1 from "@/assets/sweater-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial reveal animations
      gsap.from(textRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from([image1Ref.current, image2Ref.current], {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      // Looping subtle glow animation on the accent text
      gsap.to(".about-accent-text", {
        textShadow: "0 0 30px hsl(var(--accent) / 0.6), 0 0 60px hsl(var(--accent) / 0.3)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Looping subtle pulse on the CTA button
      gsap.to(".about-cta-button", {
        boxShadow: "0 0 40px hsl(var(--accent) / 0.5), 0 10px 40px hsl(var(--accent) / 0.3)",
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Looping floating animation on images
      gsap.to(image1Ref.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      gsap.to(image2Ref.current, {
        y: 10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 0.5,
      });

      // Parallax on scroll
      gsap.to(image1Ref.current, {
        yPercent: -15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(image2Ref.current, {
        yPercent: 15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]"></div>
      
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left - Image */}
          <div className="lg:col-span-5">
            <div ref={image1Ref} className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-elegant group cursor-pointer">
              <img src={sweater1} alt="KAYNA" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center shadow-gold opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Middle - Text */}
          <div ref={textRef} className="lg:col-span-4 space-y-6">
            <h2 className="text-[3rem] lg:text-[4rem] font-bold leading-[0.95] text-foreground">
              Le combat
              <span className="about-accent-text block italic text-accent">silencieux</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              KAYNA, c'est l'armure de ceux qui se battent <span className="text-foreground font-medium">chaque jour</span> pour devenir meilleurs.
            </p>
            
            <a href="/about" className="about-cta-button inline-flex px-8 py-4 rounded-full bg-accent text-primary font-bold hover:scale-105 transition-all items-center gap-3 shadow-gold">
              <span>Notre histoire</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Right - Second Image */}
          <div className="lg:col-span-3">
            <div ref={image2Ref} className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] group cursor-pointer shadow-elegant">
              <img src={tshirt2} alt="KAYNA" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-secondary/80 text-xs uppercase tracking-wider">Disponible</span>
                </div>
                <p className="text-secondary font-bold text-xl">Collection Élite</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
