import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, ArrowDown, ShoppingBag, Menu, X, User, LogOut, Link2, Heart, Settings, Shield } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import heroImage from "@/assets/hero-group.jpg";
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
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, toggleCart } = useCart();
  const { getFavoritesCount } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check auth state
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
      // Cinematic reveal timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Start with everything hidden
      gsap.set([wordRef.current, subtitleRef.current, scrollIndicatorRef.current], { 
        opacity: 0, 
        y: 100 
      });
      gsap.set(overlayRef.current, { opacity: 1 });

      // Phase 1: Image reveal with dramatic zoom
      tl.fromTo(imageContainerRef.current,
        { scale: 1.4, filter: "blur(20px) brightness(0.3)" },
        { scale: 1, filter: "blur(0px) brightness(1)", duration: 2.5, ease: "power3.out" }
      );

      // Phase 2: Overlay fades to reveal emotional gradient
      tl.to(overlayRef.current, {
        opacity: 0.6,
        duration: 1.5,
      }, "-=1.5");

      // Phase 3: The word emerges - raw and powerful
      tl.to(wordRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      }, "-=0.8");

      // Phase 4: Subtle subtitle
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
      }, "-=0.6");

      // Phase 5: Scroll indicator
      tl.to(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "-=0.4");

      // Continuous parallax on scroll
      gsap.to(imageContainerRef.current, {
        yPercent: 30,
        scale: 1.1,
        filter: "brightness(0.5)",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Word moves up on scroll
      gsap.to(wordRef.current, {
        yPercent: -50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "50% top",
          scrub: 1,
        },
      });

      // Breathing animation for word
      gsap.to(wordRef.current, {
        textShadow: "0 0 80px hsl(40 45% 60% / 0.5), 0 0 120px hsl(40 45% 60% / 0.3)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef} 
      id="hero" 
      className="relative h-screen overflow-hidden bg-primary"
    >
      <CartDrawer />
      
      {/* Header - Minimal */}
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
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Shop
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Histoire
            </Link>
            <Link to="/affiliate/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-semibold text-secondary hover:text-accent transition-colors">
              Affiliation
            </Link>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent my-4" />
            
            {user ? (
              <>
                {isAdmin ? (
                  <Link 
                    to="/admin" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-2xl font-semibold text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Dashboard Admin
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="text-2xl font-light text-secondary hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-5 h-5" />
                      Mon profil
                    </Link>
                    <Link 
                      to="/favorites" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="text-2xl font-light text-secondary hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Mes favoris ({getFavoritesCount()})
                    </Link>
                    {affiliateCode && (
                      <>
                        <Link 
                          to="/affiliate/dashboard" 
                          onClick={() => setMobileMenuOpen(false)} 
                          className="text-2xl font-light text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
                        >
                          <User className="w-5 h-5" />
                          Mon espace affilié
                        </Link>
                        <button 
                          onClick={() => { copyAffiliateLink(); setMobileMenuOpen(false); }} 
                          className="text-xl font-light text-secondary/70 hover:text-accent transition-colors flex items-center gap-2"
                        >
                          <Link2 className="w-5 h-5" />
                          Copier mon lien
                        </button>
                      </>
                    )}
                  </>
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

      {/* FULL SCREEN IMAGE - The Emotion */}
      <div 
        ref={imageContainerRef}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src={heroImage} 
          alt="KAYNA - Porter sa confiance"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Emotional Overlay - The Battle */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"
      />

      {/* THE WORD - Raw, Powerful, Emotional */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div 
          ref={wordRef}
          className="text-center"
        >
          {/* Main Word */}
          <h1 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[14rem] font-black tracking-tighter text-secondary leading-none">
            CONFIANCE
          </h1>
          
          {/* The meaning - subtle */}
          <div 
            ref={subtitleRef}
            className="mt-4 sm:mt-6 flex flex-col items-center gap-4"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-secondary/60 font-light tracking-wide">
              Certitude • Dépassement • Persévérance
            </p>
            
            {/* Single CTA - Minimal */}
            <Link 
              to="/shop" 
              className="mt-6 sm:mt-8 px-10 py-4 border border-accent/50 text-accent rounded-full text-sm uppercase tracking-[0.2em] hover:bg-accent hover:text-primary transition-all duration-500"
            >
              Découvrir
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Minimal */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <ArrowDown className="w-5 h-5 text-secondary/40 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
