import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, ArrowDown, ShoppingBag, Menu, X, User, LogOut, Link2, Heart, Settings, Shield, Play, ChevronRight } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import heroImage from "@/assets/chapter-philosophy.jpg";
import heroGroup from "@/assets/hero-group.jpg";
import heroBattle from "@/assets/chapter-battle.jpg";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
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
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, toggleCart } = useCart();
  const { getFavoritesCount } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = [heroImage, heroGroup, heroBattle];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        setIsAdmin(roleData?.role === "admin");
        
        if (roleData?.role !== "admin") {
          const { data: affiliate } = await supabase
            .from("affiliates")
            .select("affiliate_code")
            .eq("user_id", session.user.id)
            .maybeSingle();
          
          if (affiliate?.affiliate_code) {
            setAffiliateCode(affiliate.affiliate_code);
          }
        }
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        setIsAdmin(roleData?.role === "admin");
        
        if (roleData?.role !== "admin") {
          const { data: affiliate } = await supabase
            .from("affiliates")
            .select("affiliate_code")
            .eq("user_id", session.user.id)
            .maybeSingle();
          setAffiliateCode(affiliate?.affiliate_code ?? null);
        } else {
          setAffiliateCode(null);
        }
      } else {
        setAffiliateCode(null);
        setIsAdmin(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setAffiliateCode(null);
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
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
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      gsap.set([wordRef.current, ctaRef.current, scrollIndicatorRef.current], { 
        opacity: 0, 
        y: 60 
      });

      // Dramatic image reveal
      tl.fromTo(imageContainerRef.current,
        { scale: 1.3, filter: "blur(15px) brightness(0.2)" },
        { scale: 1, filter: "blur(0px) brightness(0.8)", duration: 2.2, ease: "power3.out" }
      );

      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 1.2,
      }, "-=1.2");

      // Word reveal
      tl.to(wordRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power4.out",
      }, "-=0.6");

      // CTA reveal
      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.8");

      tl.to(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "-=0.3");

      // Parallax on scroll
      gsap.to(imageContainerRef.current, {
        yPercent: 25,
        scale: 1.1,
        filter: "brightness(0.3)",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(wordRef.current, {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "40% top",
          scrub: 1,
        },
      });

      // Breathing glow
      gsap.to(".hero-word", {
        textShadow: "0 0 100px hsl(40 45% 60% / 0.6), 0 0 150px hsl(40 45% 60% / 0.3)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    }, heroRef);

    // Image rotation
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  return (
    <section 
      ref={heroRef} 
      id="hero" 
      className="relative h-screen overflow-hidden bg-primary"
    >
      <CartDrawer />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4 lg:py-5 flex items-center justify-between">
        <div className="absolute inset-0 backdrop-blur-xl bg-primary/40" />
        
        <Link to="/" className="relative text-2xl sm:text-3xl font-bold tracking-tight text-secondary">
          KAYNA
        </Link>
        
        <nav className="relative hidden lg:flex items-center gap-8 text-sm">
          <Link to="/shop" className="text-secondary/70 hover:text-accent transition-colors duration-300">Shop</Link>
          <Link to="/about" className="text-secondary/70 hover:text-accent transition-colors duration-300">Histoire</Link>
          <Link to="/affiliate/dashboard" className="text-secondary/70 hover:text-accent transition-colors duration-300">Affiliation</Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors duration-300">
                {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>{isAdmin ? "Admin" : "Mon compte"}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-primary border-secondary/20">
                {isAdmin ? (
                  <DropdownMenuItem asChild className="text-secondary hover:bg-accent hover:text-primary cursor-pointer">
                    <Link to="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      Dashboard Admin
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="text-secondary hover:bg-accent hover:text-primary cursor-pointer">
                      <Link to="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        Mon profil
                      </Link>
                    </DropdownMenuItem>
                    {affiliateCode && (
                      <>
                        <DropdownMenuItem asChild className="text-secondary hover:bg-accent hover:text-primary cursor-pointer">
                          <Link to="/affiliate/dashboard">
                            <User className="w-4 h-4 mr-2" />
                            Mon espace affilié
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={copyAffiliateLink} className="text-secondary hover:bg-accent hover:text-primary cursor-pointer">
                          <Link2 className="w-4 h-4 mr-2" />
                          Copier mon lien ({affiliateCode})
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
                <DropdownMenuSeparator className="bg-secondary/10" />
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
          
          {user && (
            <Link 
              to="/favorites"
              className="relative w-11 h-11 rounded-full border border-secondary/10 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-110"
            >
              <Heart className="w-4 h-4" />
              {getFavoritesCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getFavoritesCount()}
                </span>
              )}
            </Link>
          )}
          
          <button 
            onClick={toggleCart}
            className="relative w-11 h-11 rounded-full border border-secondary/10 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-110"
          >
            <ShoppingBag className="w-4 h-4" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">
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
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">Shop</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">Histoire</Link>
            <Link to="/affiliate/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">Affiliation</Link>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent my-4" />
            
            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-accent hover:text-accent/80 transition-colors flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Dashboard Admin
                  </Link>
                ) : (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-secondary hover:text-accent transition-colors flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Mon profil
                    </Link>
                    <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-secondary hover:text-accent transition-colors flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Mes favoris ({getFavoritesCount()})
                    </Link>
                  </>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-2xl font-light text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">Connexion</Link>
            )}
          </nav>
        </div>
      )}

      {/* Full Screen Image with rotation */}
      <div ref={imageContainerRef} className="absolute inset-0 w-full h-full">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="KAYNA - La certitude inébranlable"
            loading={index === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Cinematic Overlays */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 opacity-0"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-transparent to-primary/70" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--primary))_100%)] opacity-50" />

      {/* THE WORD */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div ref={wordRef} className="text-center px-4">
          <h1 className="hero-word text-[4rem] sm:text-[6rem] md:text-[9rem] lg:text-[13rem] xl:text-[15rem] font-black tracking-[-0.04em] text-secondary leading-[0.85]">
            KAYNA
          </h1>
          <p className="mt-4 sm:mt-6 text-accent text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase">
            La certitude inébranlable
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-4 text-secondary/40 text-xs sm:text-sm tracking-[0.15em] uppercase">
            <span>Certitude</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Dépassement</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Persévérance</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 opacity-0">
          <Link
            to="/shop"
            className="group relative px-10 py-4 bg-accent text-primary font-bold text-sm uppercase tracking-wider rounded-full overflow-hidden transition-transform hover:scale-105 shadow-gold"
          >
            <span className="relative z-10 flex items-center gap-2">
              Découvrir
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            to="/about"
            className="group flex items-center gap-3 text-secondary/60 hover:text-secondary transition-colors text-sm uppercase tracking-wider"
          >
            <div className="w-12 h-12 rounded-full border border-secondary/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            Notre Histoire
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 opacity-0"
      >
        <span className="text-[10px] text-secondary/30 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-secondary/30 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-accent animate-[scrollDown_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentImage ? "bg-accent w-6" : "bg-secondary/20 w-1.5 hover:bg-secondary/40"
            }`}
          />
        ))}
      </div>

      {/* Side Text */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20">
        <div className="w-px h-14 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
        <span className="text-secondary/30 text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180">
          Depuis 2024
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      </div>

      <style>{`
        @keyframes scrollDown {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(200%); opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
