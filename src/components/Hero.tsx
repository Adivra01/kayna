import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, ArrowRight, ShoppingBag, Menu, X, Play, Sparkles, User, LogOut, Link2 } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import heroImage from "@/assets/hero-image.jpg";
import sweater1 from "@/assets/sweater-1.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const floatingImage1Ref = useRef<HTMLDivElement>(null);
  const floatingImage2Ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState<any>(null);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get affiliate code
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("affiliate_code")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        if (affiliate?.affiliate_code) {
          setAffiliateCode(affiliate.affiliate_code);
        }
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("affiliate_code")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setAffiliateCode(affiliate?.affiliate_code ?? null);
      } else {
        setAffiliateCode(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAffiliateCode(null);
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const copyAffiliateLink = () => {
    if (affiliateCode) {
      const link = `${window.location.origin}?ref=${affiliateCode}`;
      navigator.clipboard.writeText(link);
      toast.success("Lien d'affiliation copié !");
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline for cinematic reveal
      const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Pre-set initial states
      gsap.set([headingLine1Ref.current, headingLine2Ref.current], { 
        yPercent: 100, 
        opacity: 0,
        rotateX: -45,
      });

      // === PHASE 1: Image Reveal with Mask ===
      masterTl.fromTo(mainImageRef.current, 
        { 
          scale: 1.5, 
          opacity: 0, 
          filter: "blur(30px) brightness(0.5)",
          clipPath: "inset(50% 50% 50% 50%)",
        },
        { 
          scale: 1, 
          opacity: 1, 
          filter: "blur(0px) brightness(1)",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 2.5,
          ease: "power4.out",
        }
      );

      // === PHASE 2: Text Fusion with Image ===
      // Letters appear to emerge FROM the image
      masterTl.to(headingLine1Ref.current, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: "power4.out",
      }, "-=1.8");

      masterTl.to(headingLine2Ref.current, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: "power4.out",
      }, "-=1");

      // Character-by-character shimmer effect on accent text
      masterTl.fromTo(".hero-accent-char", 
        { opacity: 0, y: 30, scale: 0.5 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(2)",
        },
        "-=0.8"
      );

      // === PHASE 3: Floating Images with 3D ===
      masterTl.fromTo(floatingImage1Ref.current,
        { x: -150, y: 100, opacity: 0, rotateY: -35, rotateZ: -10, scale: 0.7 },
        { x: 0, y: 0, opacity: 1, rotateY: 0, rotateZ: 0, scale: 1, duration: 1.4 },
        "-=1.2"
      );

      masterTl.fromTo(floatingImage2Ref.current,
        { x: 150, y: -80, opacity: 0, rotateY: 35, rotateZ: 10, scale: 0.7 },
        { x: 0, y: 0, opacity: 1, rotateY: 0, rotateZ: 0, scale: 1, duration: 1.4 },
        "-=1.2"
      );

      // === PHASE 4: Supporting Elements ===
      masterTl.fromTo(subTextRef.current,
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 },
        "-=0.8"
      );

      masterTl.fromTo(ctaRef.current,
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7 },
        "-=0.5"
      );

      masterTl.fromTo(badgesRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      );

      // === CONTINUOUS ANIMATIONS ===
      
      // Text-image fusion effect - text moves slightly with scroll
      gsap.to([headingLine1Ref.current, headingLine2Ref.current], {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      // Main image parallax - creates fusion feeling
      gsap.to(mainImageRef.current, {
        yPercent: 35,
        scale: 0.9,
        filter: "blur(5px) brightness(0.7)",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Floating images parallax
      gsap.to(floatingImage1Ref.current, {
        yPercent: 20,
        xPercent: -15,
        scale: 0.9,
        rotateZ: -5,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(floatingImage2Ref.current, {
        yPercent: 45,
        xPercent: 12,
        scale: 0.85,
        rotateZ: 5,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Floating animation for images
      gsap.to(floatingImage1Ref.current, {
        y: "+=20",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(floatingImage2Ref.current, {
        y: "-=15",
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // CTA glow pulse
      gsap.to(".hero-cta-btn", {
        boxShadow: "0 0 80px hsl(40 45% 60% / 0.7), 0 25px 70px hsl(40 45% 60% / 0.5)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Accent text glow animation
      gsap.to(".hero-accent-text", {
        textShadow: "0 0 40px hsl(40 45% 60% / 0.8)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move for interactive parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!parallaxContainerRef.current) return;
    
    const rect = parallaxContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ x, y });

    // Interactive parallax on mouse move
    gsap.to(mainImageRef.current, {
      x: x * 20,
      y: y * 20,
      rotateY: x * 5,
      rotateX: -y * 5,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(floatingImage1Ref.current, {
      x: x * -40,
      y: y * -30,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(floatingImage2Ref.current, {
      x: x * 35,
      y: y * 25,
      duration: 1,
      ease: "power2.out",
    });

    // Text subtle movement - fusion effect
    gsap.to(headingRef.current, {
      x: x * 10,
      y: y * 5,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Split text for character animation
  const accentText = "confiance";
  const accentChars = accentText.split("");

  return (
    <section 
      ref={heroRef} 
      id="hero" 
      className="relative min-h-screen overflow-hidden bg-primary"
      onMouseMove={handleMouseMove}
    >
      <CartDrawer />
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-accent/10 rounded-full blur-[250px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-accent/6 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px]" />
        {/* Dynamic glow following mouse */}
        <div 
          className="absolute w-[600px] h-[600px] bg-accent/8 rounded-full blur-[200px] transition-all duration-1000"
          style={{
            left: `calc(50% + ${mousePosition.x * 200}px)`,
            top: `calc(50% + ${mousePosition.y * 200}px)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
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
          <Link to="/shop" className="text-secondary/70 hover:text-accent transition-colors duration-300">Shop</Link>
          <Link to="/about" className="text-secondary/70 hover:text-accent transition-colors duration-300">Histoire</Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors duration-300">
                <User className="w-4 h-4" />
                <span>Mon compte</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-primary border-secondary/20">
                {affiliateCode && (
                  <>
                    <DropdownMenuItem onClick={copyAffiliateLink} className="text-secondary hover:bg-accent hover:text-primary cursor-pointer">
                      <Link2 className="w-4 h-4 mr-2" />
                      Copier mon lien ({affiliateCode})
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-secondary/10" />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="text-secondary/70 hover:text-accent transition-colors duration-300">Connexion</Link>
          )}
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
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent my-4" />
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Shop
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Histoire
            </Link>
            
            {user ? (
              <>
                {affiliateCode && (
                  <button 
                    onClick={() => { copyAffiliateLink(); setMobileMenuOpen(false); }} 
                    className="text-2xl font-light text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
                  >
                    <Link2 className="w-5 h-5" />
                    Mon lien d'affiliation
                  </button>
                )}
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                  className="text-2xl font-light text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
                Connexion
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Main Content with 3D Perspective */}
      <div ref={parallaxContainerRef} className="min-h-screen flex items-center pt-20 lg:pt-0" style={{ perspective: "2000px" }}>
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[80vh]">
            
            {/* Left - Content with Text-Image Fusion */}
            <div className="relative z-20 lg:pr-12">
              <div ref={headingRef} className="mb-8" style={{ transformStyle: "preserve-3d" }}>
                <div className="overflow-hidden mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    <span className="inline-block text-accent text-sm uppercase tracking-[0.3em] font-medium">Collection 2025</span>
                  </div>
                </div>
                <div className="overflow-hidden" style={{ perspective: "1000px" }}>
                  <span 
                    ref={headingLine1Ref}
                    className="block text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-bold leading-[0.85] text-secondary"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    Porte ta
                  </span>
                </div>
                <div className="overflow-hidden mt-2" style={{ perspective: "1000px" }}>
                  <span 
                    ref={headingLine2Ref}
                    className="hero-accent-text block text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-bold leading-[0.85] text-accent italic"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {accentChars.map((char, i) => (
                      <span key={i} className="hero-accent-char inline-block">
                        {char}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <div ref={subTextRef} className="mb-10">
                <p className="text-xl lg:text-2xl text-secondary/60 max-w-lg leading-relaxed">
                  Vêtements pour ceux qui <span className="text-accent font-medium relative">
                    refusent l'ordinaire
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </span>. L'élégance de ceux qui se battent.
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
                <Link 
                  to="/shop" 
                  className="hero-cta-btn group px-12 py-5 bg-accent text-primary rounded-full font-bold text-lg shadow-gold hover:scale-105 transition-all duration-300 flex items-center gap-3 relative overflow-hidden"
                  data-cursor="action"
                >
                  <span className="relative z-10">Découvrir</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent via-[#d4b87a] to-accent bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link 
                  to="/about" 
                  className="px-10 py-5 border border-secondary/20 text-secondary rounded-full font-medium text-lg hover:bg-secondary/5 hover:border-secondary/40 transition-all duration-300 flex items-center gap-3 group"
                  data-cursor="link"
                >
                  <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Notre histoire</span>
                </Link>
              </div>

              <div ref={badgesRef} className="flex items-center gap-12 pt-8 border-t border-secondary/10">
                <div className="text-center group cursor-default">
                  <div className="text-3xl lg:text-4xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform">240</div>
                  <div className="text-xs text-secondary/40 uppercase tracking-wider">GSM Premium</div>
                </div>
                <div className="w-px h-12 bg-secondary/10" />
                <div className="text-center group cursor-default">
                  <div className="text-3xl lg:text-4xl font-bold text-secondary mb-1 group-hover:scale-110 transition-transform">75€</div>
                  <div className="text-xs text-secondary/40 uppercase tracking-wider">Livraison offerte</div>
                </div>
                <div className="w-px h-12 bg-secondary/10 hidden sm:block" />
                <div className="text-center hidden sm:block group cursor-default">
                  <div className="text-lg text-accent group-hover:scale-110 transition-transform">★★★★★</div>
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
                style={{ transform: "translateZ(-50px)", transformStyle: "preserve-3d" }}
              >
                <img 
                  src={heroImage} 
                  alt="KAYNA Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent lg:opacity-60" />
                {/* Overlay shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-secondary/5 to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Floating Image 1 - Left Front */}
              <div 
                ref={floatingImage1Ref}
                className="absolute left-[-10%] lg:left-[-15%] bottom-[15%] w-[45%] lg:w-[40%] aspect-[3/4] rounded-3xl overflow-hidden shadow-dark-lg border-2 border-secondary/10 hover:border-accent/30 transition-all duration-500 group"
                style={{ transform: "translateZ(100px) rotateY(5deg)", transformStyle: "preserve-3d" }}
                data-cursor="product"
              >
                <img 
                  src={sweater1} 
                  alt="KAYNA Sweater"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="backdrop-blur-md bg-primary/60 rounded-xl px-4 py-3 border border-secondary/10 group-hover:bg-accent/20 group-hover:border-accent/30 transition-all">
                    <div className="text-secondary font-bold text-sm">Sweater Elite</div>
                    <div className="text-accent font-semibold">65€</div>
                  </div>
                </div>
              </div>

              {/* Floating Image 2 - Right Front */}
              <div 
                ref={floatingImage2Ref}
                className="absolute right-[-5%] lg:right-[-10%] top-[10%] w-[40%] lg:w-[35%] aspect-[3/4] rounded-3xl overflow-hidden shadow-dark-lg border-2 border-accent/20 hover:border-accent/50 transition-all duration-500 group"
                style={{ transform: "translateZ(150px) rotateY(-5deg)", transformStyle: "preserve-3d" }}
                data-cursor="product"
              >
                <img 
                  src={tshirt1} 
                  alt="KAYNA T-Shirt"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <div className="backdrop-blur-md bg-accent text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-gold">
                    Nouveau
                  </div>
                </div>
              </div>

              {/* Decorative Price Badge */}
              <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 backdrop-blur-xl bg-primary/70 border border-accent/30 px-6 py-4 rounded-2xl shadow-gold z-30 hover:scale-105 transition-transform cursor-default">
                <div className="text-xs text-accent uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Exclusif
                </div>
                <div className="text-xl font-bold text-secondary">Dès 35€</div>
              </div>

              {/* Orbiting Accents */}
              <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-accent rounded-full shadow-gold-glow animate-pulse" />
              <div className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-accent/60 rounded-full animate-ping" />
              <div className="absolute top-[40%] right-[5%] w-4 h-4 border border-accent/40 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in z-20">
        <span className="text-xs uppercase tracking-[0.3em] text-secondary/40">Scroll</span>
        <div className="w-6 h-10 border border-secondary/20 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;