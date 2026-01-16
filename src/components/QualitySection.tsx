import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Leaf, Recycle, Award, ArrowRight } from "lucide-react";
import qualityDetail from "@/assets/quality-detail.jpg";
import productShowcase from "@/assets/product-showcase.jpg";

gsap.registerPlugin(ScrollTrigger);

const qualities = [
  {
    icon: Shield,
    title: "Qualité Premium",
    description: "Matériaux sélectionnés pour leur durabilité exceptionnelle",
  },
  {
    icon: Leaf,
    title: "Coton Organique",
    description: "100% coton bio, doux pour la peau et l'environnement",
  },
  {
    icon: Recycle,
    title: "Éco-responsable",
    description: "Production éthique et emballages recyclables",
  },
  {
    icon: Award,
    title: "Garantie à vie",
    description: "Confiance totale dans nos produits",
  },
];

const QualitySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const qualitiesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x: x * 2, y: y * 2 });
    };

    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);
    return () => section?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Apply mouse parallax to images
  useEffect(() => {
    if (image1Ref.current) {
      gsap.to(image1Ref.current, {
        x: mousePosition.x * 12,
        y: mousePosition.y * 8,
        rotateY: mousePosition.x * 4,
        rotateX: -mousePosition.y * 3,
        duration: 1,
        ease: "power2.out",
      });
    }
    if (image2Ref.current) {
      gsap.to(image2Ref.current, {
        x: mousePosition.x * -15,
        y: mousePosition.y * 10,
        rotateY: mousePosition.x * -3,
        rotateX: -mousePosition.y * 4,
        duration: 1.2,
        ease: "power2.out",
      });
    }
  }, [mousePosition]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from(headerRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
      });

      // Image 1 - 3D entrance from left
      gsap.fromTo(image1Ref.current,
        { 
          x: -150, 
          opacity: 0, 
          rotateY: -25,
          scale: 0.85,
        },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Image 2 - 3D entrance from right
      gsap.fromTo(image2Ref.current,
        {
          x: 150,
          opacity: 0,
          rotateY: 25,
          scale: 0.85,
        },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 1.4,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Scroll parallax for depth
      gsap.to(image1Ref.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(image2Ref.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Quality cards entrance with 3D effect
      qualitiesRef.current.forEach((quality, index) => {
        if (!quality) return;
        gsap.fromTo(quality,
          {
            y: 60,
            opacity: 0,
            rotateX: 20,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center+=50",
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
      className="py-28 lg:py-40 bg-background relative overflow-hidden scroll-mt-20"
      style={{ perspective: "2000px" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[250px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[180px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-4xl mx-auto mb-20 lg:mb-28">
          <span className="text-accent text-sm uppercase tracking-[0.25em] font-medium mb-6 block">Notre Engagement</span>
          <h2 className="text-[3rem] lg:text-[5rem] font-bold leading-[0.9] text-foreground mb-8">
            La <span className="italic text-accent">qualité</span>
            <span className="block mt-2">avant tout</span>
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Chaque détail compte. Chaque couture raconte notre engagement envers l'excellence.
          </p>
        </div>

        {/* Images + Qualities Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center" style={{ transformStyle: "preserve-3d" }}>
          {/* Left Image */}
          <div 
            ref={image1Ref} 
            className="lg:col-span-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-square shadow-dark-lg group cursor-pointer border border-border/50">
              <img
                src={qualityDetail}
                alt="Quality Detail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent group-hover:opacity-80 transition-opacity" />
              
              {/* 3D Floating Badge */}
              <div 
                className="absolute bottom-6 left-6 right-6"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="backdrop-blur-xl bg-primary/70 rounded-2xl px-6 py-4 border border-secondary/10 shadow-dark-lg group-hover:scale-105 transition-transform">
                  <div className="text-accent font-bold text-2xl">240 GSM</div>
                  <div className="text-secondary/70 text-sm">Poids premium lourd</div>
                </div>
              </div>

              {/* Hover Icon */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110 shadow-gold">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Qualities Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-5" style={{ transformStyle: "preserve-3d" }}>
            {qualities.map((quality, index) => (
              <div
                key={quality.title}
                ref={(el) => (qualitiesRef.current[index] = el)}
                className="bg-card border border-border rounded-3xl p-6 lg:p-7 hover:border-accent/40 hover:shadow-gold transition-all duration-500 group cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:scale-110 transition-all duration-500"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <quality.icon className="w-7 h-7 text-accent group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-foreground font-bold text-lg mb-2">{quality.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{quality.description}</p>
              </div>
            ))}
          </div>

          {/* Right Image */}
          <div 
            ref={image2Ref} 
            className="lg:col-span-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-dark-lg group cursor-pointer border border-border/50">
              <img
                src={productShowcase}
                alt="Product Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent group-hover:opacity-80 transition-opacity" />
              
              {/* 3D Floating Tag */}
              <div 
                className="absolute top-6 right-6"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="backdrop-blur-xl bg-accent text-primary rounded-full px-5 py-2.5 font-bold text-sm shadow-gold group-hover:scale-110 transition-transform">
                  Made in Portugal
                </div>
              </div>

              {/* Bottom Content */}
              <div 
                className="absolute bottom-6 left-6 right-6"
                style={{ transform: "translateZ(25px)" }}
              >
                <div className="backdrop-blur-xl bg-primary/60 rounded-2xl px-5 py-4 border border-secondary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-secondary/70 text-xs uppercase tracking-wider">Production éthique</span>
                  </div>
                  <p className="text-secondary font-bold text-lg">Qualité européenne</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
};

export default QualitySection;