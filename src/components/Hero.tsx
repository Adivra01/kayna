import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Twitter, Youtube, ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading
      gsap.from(headingRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Animate image
      gsap.from(imageRef.current, {
        scale: 1.2,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3,
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
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold italic">inspire.</h1>
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-accent transition-colors">Shop</a>
            <a href="#" className="hover:text-accent transition-colors">About</a>
            <a href="#" className="hover:text-accent transition-colors">Values</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden lg:block text-sm hover:text-accent transition-colors">Search</button>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width Split */}
      <div className="min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left Side - Content */}
        <div className="lg:w-1/2 flex items-center justify-center px-6 lg:px-16 py-12 lg:py-0">
          <div className="max-w-2xl">
            <div ref={headingRef} className="space-y-6 lg:space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">★</span>
                </div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground">
                  Est. 2025 • Premium Street
                </div>
              </div>

              <h2 className="text-display font-bold leading-[0.9]">
                Vis
                <span className="block">sans</span>
                <span className="block italic text-accent">limites</span>
              </h2>

              <div className="space-y-4">
                <p className="text-xl lg:text-3xl font-light leading-relaxed">
                  La <span className="font-bold">confiance</span> se porte.
                </p>
                <p className="text-base lg:text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Rejoins le mouvement des battants qui transforment chaque jour en victoire. 
                  Nos vêtements incarnent ta soif de dépassement.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-10 py-5 bg-accent text-white rounded-full font-bold text-lg hover:bg-accent/90 transition-all hover:scale-105 shadow-xl">
                  Explorer
                </button>
                <button className="px-10 py-5 border-2 border-foreground rounded-full font-bold text-lg hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-3 group">
                  <span>Notre histoire</span>
                  <ArrowDown className="w-5 h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-12 pt-8 border-t border-border">
                <div>
                  <div className="text-4xl font-bold">50K+</div>
                  <div className="text-sm text-muted-foreground">Membres</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaits</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent">★★★★★</div>
                  <div className="text-sm text-muted-foreground">Qualité</div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-accent/20" />
            
            {/* Floating Elements */}
            <div className="absolute top-12 right-12 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl">
              <div className="text-xs text-muted-foreground mb-1">Nouveau</div>
              <div className="text-lg font-bold">Collection Elite</div>
            </div>

            <div className="absolute bottom-12 left-12 bg-accent text-white px-8 py-6 rounded-3xl shadow-2xl hover:scale-105 transition-all cursor-pointer">
              <div className="text-sm mb-2">Livraison offerte</div>
              <div className="text-2xl font-bold">Dès 75€</div>
            </div>

            <div className="absolute top-1/2 left-12 -translate-y-1/2">
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-md bg-white/20 cursor-pointer hover:scale-110 transition-all">
                <ArrowDown className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
