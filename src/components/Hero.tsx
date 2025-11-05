import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Twitter, ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import logo from "@/assets/logo.png";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for staggered animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      // Animate heading with split effect
      tl.from(headingRef.current?.children || [], {
        y: 120,
        opacity: 0,
        rotateX: -90,
        duration: 1.2,
        stagger: 0.2,
      }, 0);

      // Animate content paragraphs
      tl.from(contentRef.current?.children || [], {
        x: -60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
      }, 0.3);

      // Animate CTA buttons
      tl.from(ctaRef.current?.children || [], {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      }, 0.6);

      // Animate stats
      tl.from(statsRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      }, 0.8);

      // Animate image with clip-path
      gsap.from(imageRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
        duration: 1.8,
        ease: "power4.inOut",
        delay: 0.2,
      });

      // Image scale animation
      gsap.from(imageRef.current?.querySelector("img"), {
        scale: 1.3,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.2,
      });

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Image scale on scroll
      gsap.to(imageRef.current?.querySelector("img"), {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between glass-effect border-b border-border/50">
        <div className="flex items-center gap-8">
          <img src={logo} alt="INSPIRE" className="h-8 lg:h-10 w-auto" />
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <a href="#" className="relative hover:text-accent transition-colors group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="relative hover:text-accent transition-colors group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="relative hover:text-accent transition-colors group">
              Values
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden lg:block text-sm hover:text-accent transition-colors">Search</button>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent hover:shadow-accent transition-all hover:scale-110">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent hover:shadow-accent transition-all hover:scale-110">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width Split */}
      <div className="min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left Side - Content */}
        <div className="lg:w-1/2 flex items-center justify-center px-6 lg:px-16 py-12 lg:py-0 relative">
          {/* Ambient glow effect */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="max-w-2xl relative z-10">
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center gap-3 animate-float">
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shadow-glow">
                  <span className="text-white text-2xl font-bold animate-glow">★</span>
                </div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                  Est. 2025 • Premium Streetwear
                </div>
              </div>

              <h2 ref={headingRef} className="text-display font-bold leading-[0.9]">
                <span className="block">Ose être</span>
                <span className="block">exceptionnel</span>
                <span className="block italic gradient-text">chaque jour</span>
              </h2>

              <div ref={contentRef} className="space-y-4">
                <p className="text-xl lg:text-3xl font-light leading-relaxed">
                  <span className="font-bold text-accent">97% de nos clients</span> affirment que porter INSPIRE 
                  <span className="italic"> booste leur confiance</span> au quotidien.
                </p>
                <p className="text-base lg:text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Plus qu'un vêtement, c'est un <span className="font-bold">manifeste</span>. Chaque pièce est conçue pour 
                  les audacieux qui refusent la médiocrité et embrassent le <span className="italic text-accent">dépassement de soi</span>.
                </p>
                <p className="text-sm lg:text-base text-muted-foreground/80 max-w-lg">
                  🔥 Édition limitée • Livraison express 48h • Satisfait ou remboursé 30 jours
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group relative px-10 py-5 gradient-accent text-white rounded-full font-bold text-lg overflow-hidden shadow-accent hover:shadow-glow transition-all hover:scale-105">
                  <span className="relative z-10">Explorer</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>
                <button className="px-10 py-5 border-2 border-foreground rounded-full font-bold text-lg hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-3 group hover:shadow-lg hover:scale-105">
                  <span>Notre histoire</span>
                  <ArrowDown className="w-5 h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div ref={statsRef} className="flex items-center gap-12 pt-8 border-t border-border">
                <div className="group cursor-pointer">
                  <div className="text-4xl font-bold group-hover:text-accent transition-colors">50K+</div>
                  <div className="text-sm text-muted-foreground">Battants inspirés</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl font-bold group-hover:text-accent transition-colors">97%</div>
                  <div className="text-sm text-muted-foreground">Recommandent</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl font-bold text-accent">★★★★★</div>
                  <div className="text-sm text-muted-foreground">4.9/5 avis</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div ref={imageRef} className="lg:w-1/2 relative min-h-[60vh] lg:min-h-screen">
            <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="inspire. - Collection premium"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-accent/30" />
            
            {/* Floating Elements with enhanced design */}
            <div className="absolute top-12 right-12 glass-effect border border-white/20 px-6 py-4 rounded-2xl shadow-xl animate-float">
              <div className="text-xs text-white/70 mb-1 uppercase tracking-wider">🔥 Drop exclusif</div>
              <div className="text-lg font-bold text-white">Collection Elite 2025</div>
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full gradient-accent animate-glow"></div>
            </div>

            <div className="absolute bottom-12 left-12 gradient-accent text-white px-8 py-6 rounded-3xl shadow-glow hover:scale-105 transition-all cursor-pointer group">
              <div className="text-sm mb-2 opacity-90">✓ Livraison express offerte</div>
              <div className="text-2xl font-bold">Commande dès 75€</div>
              <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="absolute top-1/2 left-12 -translate-y-1/2 animate-float">
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center glass-effect cursor-pointer hover:scale-110 transition-all group shadow-lg hover:shadow-glow">
                <ArrowDown className="w-8 h-8 text-white group-hover:animate-bounce" />
              </div>
            </div>
            
            {/* Decorative rotating element */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/10 rounded-full animate-rotate-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
