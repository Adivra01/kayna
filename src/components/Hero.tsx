import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, ArrowDown } from "lucide-react";
import { SiTiktok, SiX, SiThreads } from "react-icons/si";
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
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex items-center justify-between backdrop-blur-md bg-primary/80 border-b border-primary-light/30">
        <div className="flex items-center gap-4 sm:gap-8">
          <h1 className="text-xl sm:text-2xl font-bold italic text-accent">KAYNA</h1>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-white/90">
            <a href="#" className="relative hover:text-accent transition-colors group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </a>
            <a href="/about" className="relative hover:text-accent transition-colors group">
              Notre Histoire
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="relative hover:text-accent transition-colors group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden lg:block text-sm text-white/90 hover:text-accent transition-colors">Search</button>
          <div className="flex gap-2 sm:gap-3">
            <a href="https://www.instagram.com/kayna.xxv?igsh=MWJkdXN3YzJiMzZ0dw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:text-white hover:border-accent transition-all hover:scale-110 hover:shadow-energy-glow">
              <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
            <a href="https://www.tiktok.com/@kayna.xxv?_r=1&_t=ZS-91iQ1QA3OXl" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:text-white hover:border-accent transition-all hover:scale-110 hover:shadow-energy-glow">
              <SiTiktok className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
            <a href="https://x.com/kayna20xxv?s=11" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:text-white hover:border-accent transition-all hover:scale-110 hover:shadow-energy-glow">
              <SiX className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
            <a href="https://www.threads.com/@kayna.xxv?invite=0" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-secondary-light hover:text-white hover:border-secondary-light transition-all hover:scale-110 hover:shadow-transformation-glow">
              <SiThreads className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width Split */}
      <div className="min-h-screen flex flex-col lg:flex-row pt-16 sm:pt-20">
        {/* Left Side - Content */}
        <div className="lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-16 py-8 sm:py-12 lg:py-0 relative">
          {/* Ambient glow effects - Orange + Violet fusion */}
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-secondary/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="max-w-2xl relative z-10 w-full">
            <div ref={headingRef} className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3 animate-float">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent flex items-center justify-center shadow-gold-glow">
                  <span className="text-primary text-xl sm:text-2xl font-bold animate-glow">★</span>
                </div>
                <div className="text-[10px] sm:text-xs lg:text-sm uppercase tracking-wider sm:tracking-widest text-white/70 font-medium">
                  Est. 2025 • Premium
                </div>
              </div>

              <h2 className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-[7rem] 2xl:text-[8rem] font-bold leading-[0.9] text-white">
                Plus qu'un mot
                <span className="block text-accent">Une </span>
                <span className="block italic text-accent">Philosophie</span>
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed text-white/95">
                  La convergence de la <span className="font-bold text-accent">Confiance</span>, du <span className="font-bold text-secondary-light">Dépassement</span> et de la <span className="font-bold text-accent">Persévérance</span>.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-lg leading-relaxed">
                  Une <span className="font-semibold text-accent">certitude intérieure</span> inébranlable. Toute victoire commence ici.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                <button className="group relative px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 lg:py-5 bg-accent text-primary rounded-full font-bold text-base sm:text-lg overflow-hidden shadow-gold hover:shadow-gold-glow transition-all hover:scale-105">
                  <span className="relative z-10">Explorer</span>
                  <div className="absolute inset-0 bg-accent-light translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>
                <a href="/about" className="px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 lg:py-5 border-2 border-white text-white rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2 sm:gap-3 group hover:scale-105">
                  <span>Notre histoire</span>
                  <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 pt-6 sm:pt-8 border-t border-white/20 overflow-x-auto">
                <div className="flex-shrink-0">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">50K+</div>
                  <div className="text-xs sm:text-sm text-white/60 whitespace-nowrap">Membres</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">98%</div>
                  <div className="text-xs sm:text-sm text-white/60 whitespace-nowrap">Satisfaits</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent">★★★★★</div>
                  <div className="text-xs sm:text-sm text-white/60 whitespace-nowrap">Qualité</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div ref={imageRef} className="lg:w-1/2 relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen">
            <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="KAYNA - Collection premium"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-secondary/30 to-accent/25" />
            
            {/* Floating Elements - Orange/Violet accents */}
            <div className="absolute top-6 sm:top-12 right-4 sm:right-12 backdrop-blur-md bg-primary/70 border border-secondary/40 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-transformation animate-float">
              <div className="text-[10px] sm:text-xs text-secondary-light mb-0.5 sm:mb-1 uppercase tracking-wider font-medium">Nouveau</div>
              <div className="text-sm sm:text-lg font-bold text-white">Collection Elite</div>
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent animate-glow shadow-energy-glow"></div>
            </div>

            <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-12 bg-accent text-white px-4 sm:px-8 py-3 sm:py-6 rounded-2xl sm:rounded-3xl shadow-energy-glow hover:scale-105 transition-all cursor-pointer group">
              <div className="text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Livraison offerte</div>
              <div className="text-lg sm:text-2xl font-bold">Dès 75€</div>
              <div className="absolute inset-0 bg-accent-light rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="hidden sm:block absolute top-1/2 left-6 lg:left-12 -translate-y-1/2 animate-float">
              <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full border-2 lg:border-3 border-secondary-light flex items-center justify-center backdrop-blur-md bg-primary/50 cursor-pointer hover:scale-110 transition-all group shadow-transformation hover:shadow-transformation-glow">
                <ArrowDown className="w-6 lg:w-8 h-6 lg:h-8 text-secondary-light group-hover:animate-bounce" />
              </div>
            </div>
            
            {/* Decorative rotating element - Violet accent */}
            <div className="hidden sm:block absolute top-1/4 right-1/4 w-24 sm:w-32 h-24 sm:h-32 border border-secondary/30 rounded-full animate-rotate-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
