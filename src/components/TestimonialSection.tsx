import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Zap, Target } from "lucide-react";
import testimonialHero from "@/assets/testimonial-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Users, value: "500+", label: "Guerriers" },
  { icon: Zap, value: "100%", label: "Engagement" },
  { icon: Target, value: "1", label: "Vision" },
];

const TestimonialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image parallax
      gsap.to(imageRef.current?.querySelector("img"), {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Content reveal
      gsap.fromTo(contentRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stats counter animation
      statsRef.current.forEach((stat, index) => {
        if (!stat) return;
        gsap.fromTo(stat,
          { y: 40, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-primary overflow-hidden">
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0">
        <img
          src={testimonialHero}
          alt="KAYNA Community"
          loading="lazy"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-screen flex items-center py-20">
        <div ref={contentRef} className="max-w-2xl">
          <span className="text-accent text-sm uppercase tracking-[0.3em] mb-6 block">Le Cercle</span>
          
          <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-bold text-secondary leading-[0.9] mb-8">
            Une communauté.
            <span className="block text-accent italic mt-2">Pas seul.</span>
          </h2>

          <p className="text-xl text-secondary/60 mb-12 max-w-lg leading-relaxed">
            Rejoins ceux qui ont choisi de ne plus subir. 
            Ici, on partage des outils, on transmet une vision, on avance ensemble.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                ref={(el) => (statsRef.current[index] = el)}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-3 mx-auto">
                  <stat.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-secondary">{stat.value}</div>
                <div className="text-sm text-secondary/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
