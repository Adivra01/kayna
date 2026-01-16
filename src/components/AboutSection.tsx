import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import sweater1 from "@/assets/sweater-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import hoodie1 from "@/assets/hoodie-1.jpg";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3Ref = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Apply mouse parallax to images
  useEffect(() => {
    if (image1Ref.current) {
      gsap.to(image1Ref.current, {
        x: mousePosition.x * 15,
        y: mousePosition.y * 10,
        rotateY: mousePosition.x * 5,
        rotateX: -mousePosition.y * 3,
        duration: 1,
        ease: "power2.out",
      });
    }
    if (image2Ref.current) {
      gsap.to(image2Ref.current, {
        x: mousePosition.x * -20,
        y: mousePosition.y * 15,
        rotateY: mousePosition.x * -3,
        rotateX: -mousePosition.y * 5,
        duration: 1.2,
        ease: "power2.out",
      });
    }
    if (image3Ref.current) {
      gsap.to(image3Ref.current, {
        x: mousePosition.x * 10,
        y: mousePosition.y * -12,
        rotateY: mousePosition.x * 4,
        rotateX: -mousePosition.y * 4,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [mousePosition]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      gsap.to(parallaxBgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text reveal with split effect
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
      });

      textTl.from(textRef.current?.querySelectorAll(".reveal-text"), {
        y: 100,
        opacity: 0,
        rotateX: -45,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      });

      // Image 1 - Large left with 3D entrance
      gsap.fromTo(image1Ref.current, 
        { 
          x: -150, 
          opacity: 0, 
          rotateY: -30,
          scale: 0.8,
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

      // Image 2 - Right with delayed 3D entrance
      gsap.fromTo(image2Ref.current,
        {
          x: 150,
          y: -50,
          opacity: 0,
          rotateY: 30,
          scale: 0.8,
        },
        {
          x: 0,
          y: 0,
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

      // Image 3 - Bottom right with 3D entrance
      gsap.fromTo(image3Ref.current,
        {
          y: 100,
          opacity: 0,
          rotateX: 30,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Scroll-based parallax for depth
      gsap.to(image1Ref.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(image2Ref.current, {
        yPercent: 15,
        xPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(image3Ref.current, {
        yPercent: -10,
        xPercent: 8,
        rotateZ: 3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Looping animations
      gsap.to(".about-accent-text", {
        textShadow: "0 0 40px hsl(40 45% 60% / 0.7), 0 0 80px hsl(40 45% 60% / 0.4)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".about-cta-button", {
        boxShadow: "0 0 50px hsl(40 45% 60% / 0.6), 0 15px 50px hsl(40 45% 60% / 0.4)",
        scale: 1.03,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Floating decorative elements
      gsap.to(".floating-orb", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 bg-primary overflow-hidden" style={{ perspective: "2000px" }}>
      {/* Parallax Background */}
      <div ref={parallaxBgRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-accent/5 rounded-full blur-[250px]" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-accent/8 rounded-full blur-[200px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/3 rounded-full blur-[150px]" />
      </div>

      {/* Floating Orbs */}
      <div className="floating-orb absolute top-[20%] right-[15%] w-4 h-4 bg-accent rounded-full shadow-gold-glow opacity-60" />
      <div className="floating-orb absolute top-[60%] left-[10%] w-3 h-3 bg-accent/80 rounded-full shadow-gold opacity-50" />
      <div className="floating-orb absolute bottom-[25%] right-[25%] w-2 h-2 bg-accent rounded-full opacity-70" />
      
      <div ref={containerRef} className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[80vh]" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Left - Main Image with 3D effect */}
          <div className="lg:col-span-5 relative" style={{ transformStyle: "preserve-3d" }}>
            <div 
              ref={image1Ref} 
              className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl group cursor-pointer border border-secondary/10"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img 
                src={sweater1} 
                alt="KAYNA Sweater" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              
              {/* 3D Floating Badge */}
              <div 
                className="absolute bottom-8 right-8 backdrop-blur-xl bg-primary/70 border border-accent/30 px-5 py-3 rounded-2xl shadow-gold group-hover:scale-110 transition-transform duration-500"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-secondary font-bold">240 GSM</span>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-8 left-8 w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center shadow-gold opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Middle - Text Content */}
          <div ref={textRef} className="lg:col-span-4 space-y-8 py-8" style={{ transformStyle: "preserve-3d" }}>
            <div className="overflow-hidden">
              <span className="reveal-text inline-block text-accent text-sm uppercase tracking-[0.25em] font-medium mb-4">Notre Philosophie</span>
            </div>
            
            <div className="overflow-hidden">
              <h2 className="reveal-text text-[3rem] lg:text-[4.5rem] font-bold leading-[0.9] text-secondary">
                Le combat
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="reveal-text about-accent-text text-[3rem] lg:text-[4.5rem] font-bold leading-[0.9] italic text-accent">
                silencieux
              </h2>
            </div>
            
            <div className="overflow-hidden">
              <p className="reveal-text text-lg lg:text-xl text-secondary/60 leading-relaxed max-w-md">
                KAYNA, c'est l'armure de ceux qui se battent <span className="text-secondary font-medium">chaque jour</span> pour devenir meilleurs. Chaque pièce incarne la certitude.
              </p>
            </div>
            
            <div className="overflow-hidden pt-4">
              <a 
                href="/about" 
                className="reveal-text about-cta-button inline-flex px-10 py-5 rounded-full bg-accent text-primary font-bold hover:scale-105 transition-all items-center gap-4 shadow-gold text-lg"
              >
                <span>Notre histoire</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right - Stacked Images with 3D depth */}
          <div className="lg:col-span-3 relative h-[500px] lg:h-[600px]" style={{ transformStyle: "preserve-3d" }}>
            {/* Top Image */}
            <div 
              ref={image2Ref} 
              className="absolute top-0 right-0 w-[90%] rounded-[2rem] overflow-hidden aspect-[4/5] group cursor-pointer shadow-dark-lg border border-secondary/10"
              style={{ transform: "translateZ(60px)" }}
            >
              <img 
                src={tshirt2} 
                alt="KAYNA T-Shirt" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-secondary/70 text-xs uppercase tracking-wider">Disponible</span>
                </div>
                <p className="text-secondary font-bold text-lg">Collection Élite</p>
              </div>
            </div>

            {/* Bottom Overlapping Image */}
            <div 
              ref={image3Ref} 
              className="absolute bottom-0 left-0 w-[70%] rounded-[1.5rem] overflow-hidden aspect-square group cursor-pointer shadow-gold border-2 border-accent/20"
              style={{ transform: "translateZ(100px)" }}
            >
              <img 
                src={hoodie1} 
                alt="KAYNA Hoodie" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
              <div className="absolute top-3 left-3">
                <div className="backdrop-blur-md bg-accent text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Best-seller
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
};

export default AboutSection;