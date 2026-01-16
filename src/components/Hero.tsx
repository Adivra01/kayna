import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, ArrowRight, ShoppingBag, Menu, X, Play } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import heroImage from "@/assets/hero-image.jpg";
import sweater1 from "@/assets/sweater-1.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const floatingImage1Ref = useRef<HTMLDivElement>(null);
  const floatingImage2Ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animations - Cinematic reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Main image reveal with scale and blur
      tl.fromTo(mainImageRef.current, 
        { scale: 1.4, opacity: 0, filter: "blur(20px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2 }
      );

      // Floating images entrance with 3D effect
      tl.fromTo(floatingImage1Ref.current,
        { x: -100, y: 50, opacity: 0, rotateY: -25, scale: 0.8 },
        { x: 0, y: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.2 },
        "-=1.5"
      );

      tl.fromTo(floatingImage2Ref.current,
        { x: 100, y: -50, opacity: 0, rotateY: 25, scale: 0.8 },
        { x: 0, y: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.2 },
        "-=1"
      );

      // Text reveal - letter by letter effect simulation
      tl.fromTo(headingRef.current,
        { y: 120, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 },
        "-=0.8"
      );

      tl.fromTo(subTextRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

      tl.fromTo(ctaRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
        "-=0.4"
      );

      tl.fromTo(badgesRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      );

      // 3D Parallax effect on scroll - Main image goes back
      gsap.to(mainImageRef.current, {
        yPercent: 40,
        scale: 0.85,
        filter: "blur(3px)",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Floating images - different parallax speeds for depth
      gsap.to(floatingImage1Ref.current, {
        yPercent: 25,
        xPercent: -10,
        scale: 0.95,
        rotateZ: -3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(floatingImage2Ref.current, {
        yPercent: 50,
        xPercent: 8,
        scale: 0.9,
        rotateZ: 3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Continuous subtle floating animation
      gsap.to(floatingImage1Ref.current, {
        y: "+=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(floatingImage2Ref.current, {
        y: "-=12",
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Text parallax - moves slower for depth effect
      gsap.to(headingRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      // CTA glow pulse
      gsap.to(".hero-cta-btn", {
        boxShadow: "0 0 60px hsl(40 45% 60% / 0.6), 0 20px 60px hsl(40 45% 60% / 0.4)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen overflow-hidden bg-primary">
      <CartDrawer />
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/8 rounded-full blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} 
      />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4 lg:py-5 flex items-center justify-between">
        <div className="absolute inset-0 backdrop-blur-xl bg-primary/60 border-b border-secondary/5" />
        
        <Link to="/" className="relative text-2xl sm:text-3xl font-bold tracking-tight text-secondary">
          KAYNA
        </Link>
        
        <nav className="relative hidden lg:flex items-center gap-8 text-sm">
          <button onClick={() => scrollToSection("bestsellers")} className="text-secondary/70 hover:text-accent transition-colors duration-300">Bestsellers</button>
          <button onClick={() => scrollToSection("categories")} className="text-secondary/70 hover:text-accent transition-colors duration-300">Catégories</button>
          <Link to="/affiliate" className="text-secondary/70 hover:text-accent transition-colors duration-300">Affiliation</Link>
          <Link to="/shop" className="text-secondary/70 hover:text-accent transition-colors duration-300">Shop</Link>
          <Link to="/about" className="text-secondary/70 hover:text-accent transition-colors duration-300">Histoire</Link>
          <Link to="/client-auth" className="text-secondary/70 hover:text-accent transition-colors duration-300">Connexion</Link>
        </nav>
        
        <div className="relative flex gap-3">
          <a href="https://www.instagram.com/kayna.xxv" target="_blank" rel="noopener noreferrer" 
            className="hidden sm:flex w-11 h-11 rounded-full border border-secondary/10 items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-110">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://www.tiktok.com/@kayna.xxv" target="_blank" rel="noopener noreferrer" 
            className="hidden sm:flex w-11 h-11 rounded-full border border-secondary/10 items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-110">
            <SiTiktok className="w-4 h-4" />
          </a>
          <button 
            onClick={toggleCart}
            className="relative w-11 h-11 rounded-full border border-secondary/10 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-110"
          >
            <ShoppingBag className="w-4 h-4" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                {getTotalItems()}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-full border border-secondary/10 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-primary/98 backdrop-blur-2xl" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute top-24 left-0 right-0 flex flex-col items-center gap-6 py-8 animate-fade-in">
            <button onClick={() => scrollToSection("bestsellers")} className="text-2xl font-light text-secondary/70 hover:text-accent transition-colors">
              Bestsellers
            </button>
            <button onClick={() => scrollToSection("categories")} className="text-2xl font-light text-secondary/70 hover:text-accent transition-colors">
              Catégories
            </button>
            <Link to="/affiliate" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-secondary/70 hover:text-accent transition-colors">
              Affiliation
            </Link>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent my-4" />
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Shop
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Histoire
            </Link>
            <Link to="/client-auth" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Connexion
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content with 3D Perspective */}
      <div ref={parallaxContainerRef} className="min-h-screen flex items-center pt-20 lg:pt-0" style={{ perspective: "1500px" }}>
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[80vh]">
            
            {/* Left - Content */}
            <div className="relative z-20 lg:pr-12">
              <div ref={headingRef} className="mb-8">
                <div className="overflow-hidden mb-4">
                  <span className="inline-block text-accent text-sm uppercase tracking-[0.3em] font-medium">Collection 2025</span>
                </div>
                <h1 className="text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-bold leading-[0.85] text-secondary">
                  Porte ta
                  <span className="block text-accent italic mt-2">confiance</span>
                </h1>
              </div>

              <div ref={subTextRef} className="mb-10">
                <p className="text-xl lg:text-2xl text-secondary/60 max-w-lg leading-relaxed">
                  Vêtements pour ceux qui <span className="text-accent font-medium">refusent l'ordinaire</span>. L'élégance de ceux qui se battent.
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
                <Link to="/shop" className="hero-cta-btn group px-12 py-5 bg-accent text-primary rounded-full font-bold text-lg shadow-gold hover:scale-105 transition-all duration-300 flex items-center gap-3">
                  <span>Découvrir</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="px-10 py-5 border border-secondary/20 text-secondary rounded-full font-medium text-lg hover:bg-secondary/5 hover:border-secondary/40 transition-all duration-300 flex items-center gap-3">
                  <Play className="w-4 h-4" />
                  <span>Notre histoire</span>
                </Link>
              </div>

              <div ref={badgesRef} className="flex items-center gap-12 pt-8 border-t border-secondary/10">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-accent mb-1">240</div>
                  <div className="text-xs text-secondary/40 uppercase tracking-wider">GSM Premium</div>
                </div>
                <div className="w-px h-12 bg-secondary/10" />
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-secondary mb-1">75€</div>
                  <div className="text-xs text-secondary/40 uppercase tracking-wider">Livraison offerte</div>
                </div>
                <div className="w-px h-12 bg-secondary/10 hidden sm:block" />
                <div className="text-center hidden sm:block">
                  <div className="text-lg text-accent">★★★★★</div>
                  <div className="text-xs text-secondary/40 uppercase tracking-wider">Qualité</div>
                </div>
              </div>
            </div>

            {/* Right - 3D Parallax Images */}
            <div className="relative h-[60vh] lg:h-[85vh] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              
              {/* Main Hero Image - Background Layer */}
              <div 
                ref={mainImageRef} 
                className="absolute inset-0 lg:inset-[-5%] rounded-[3rem] overflow-hidden shadow-2xl"
                style={{ transform: "translateZ(-50px)" }}
              >
                <img 
                  src={heroImage} 
                  alt="KAYNA Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent lg:opacity-60" />
              </div>

              {/* Floating Image 1 - Left Front */}
              <div 
                ref={floatingImage1Ref}
                className="absolute left-[-10%] lg:left-[-15%] bottom-[15%] w-[45%] lg:w-[40%] aspect-[3/4] rounded-3xl overflow-hidden shadow-dark-lg border-2 border-secondary/10"
                style={{ transform: "translateZ(80px) rotateY(5deg)" }}
              >
                <img 
                  src={sweater1} 
                  alt="KAYNA Sweater"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="backdrop-blur-md bg-primary/50 rounded-xl px-4 py-3 border border-secondary/10">
                    <div className="text-secondary font-bold text-sm">Sweater Elite</div>
                    <div className="text-accent font-semibold">65€</div>
                  </div>
                </div>
              </div>

              {/* Floating Image 2 - Right Front */}
              <div 
                ref={floatingImage2Ref}
                className="absolute right-[-5%] lg:right-[-10%] top-[10%] w-[40%] lg:w-[35%] aspect-[3/4] rounded-3xl overflow-hidden shadow-dark-lg border-2 border-accent/20"
                style={{ transform: "translateZ(120px) rotateY(-5deg)" }}
              >
                <img 
                  src={tshirt1} 
                  alt="KAYNA T-Shirt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
                <div className="absolute top-4 right-4">
                  <div className="backdrop-blur-md bg-accent text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                    Nouveau
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 backdrop-blur-xl bg-primary/60 border border-accent/30 px-6 py-4 rounded-2xl shadow-gold z-30">
                <div className="text-xs text-accent uppercase tracking-widest mb-1">Exclusif</div>
                <div className="text-xl font-bold text-secondary">Dès 35€</div>
              </div>

              {/* Orbiting Accent */}
              <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-accent rounded-full shadow-gold-glow animate-pulse" />
              <div className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-accent/60 rounded-full animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-secondary/40 animate-bounce">
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-secondary/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;