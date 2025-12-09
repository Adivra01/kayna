import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, ArrowRight, ShoppingBag } from "lucide-react";
import { SiTiktok, SiX } from "react-icons/si";
import heroImage from "@/assets/hero-image.jpg";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { getTotalItems, toggleCart } = useCart();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(imageRef.current, {
        scale: 1.2,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3,
      });

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
      <CartDrawer />
      
      {/* Header - Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-primary/80">
        <Link to="/" className="text-2xl font-bold italic text-secondary">KAYNA</Link>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm text-secondary/80">
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-accent transition-colors">Histoire</Link>
          <Link to="/auth" className="hover:text-accent transition-colors">Connexion</Link>
        </nav>
        
        <div className="flex gap-3">
          <a href="https://www.instagram.com/kayna.xxv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://www.tiktok.com/@kayna.xxv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all">
            <SiTiktok className="w-4 h-4" />
          </a>
          <button 
            onClick={toggleCart}
            className="relative w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left - Content */}
        <div className="lg:w-1/2 flex items-center justify-center px-6 lg:px-16 py-12 lg:py-0 relative">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[150px]"></div>
          
          <div className="max-w-xl relative z-10">
            <div ref={headingRef} className="space-y-8">
              <h2 className="text-[4rem] sm:text-[5rem] lg:text-[7rem] font-bold leading-[0.9] text-secondary">
                Porte ta
                <span className="block text-accent italic">confiance</span>
              </h2>

              <p className="text-xl lg:text-2xl text-secondary/70 max-w-md">
                Vêtements pour ceux qui <span className="text-accent font-semibold">refusent l'ordinaire</span>.
              </p>

              <div className="flex gap-4 pt-4">
                <Link to="/shop" className="group px-10 py-5 bg-accent text-primary rounded-full font-bold text-lg shadow-gold hover:shadow-gold-glow hover:scale-105 transition-all flex items-center gap-3">
                  <span>Shop</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex items-center gap-10 pt-8 border-t border-secondary/10">
                <div>
                  <div className="text-3xl font-bold text-accent">★★★★★</div>
                  <div className="text-sm text-secondary/50">Qualité Premium</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">75€</div>
                  <div className="text-sm text-secondary/50">Livraison offerte</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Image */}
        <div ref={imageRef} className="lg:w-1/2 relative min-h-[60vh] lg:min-h-screen">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="KAYNA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent lg:from-primary/80 lg:via-primary/20 lg:to-transparent" />
            
            {/* Floating Tag */}
            <div className="absolute top-12 right-8 backdrop-blur-md bg-primary/70 border border-accent/30 px-6 py-4 rounded-2xl shadow-elegant animate-float">
              <div className="text-xs text-accent uppercase tracking-wider mb-1">New</div>
              <div className="text-lg font-bold text-secondary">Collection 2025</div>
            </div>

            {/* CTA Card */}
            <Link to="/shop" className="absolute bottom-12 left-8 bg-accent text-primary px-8 py-6 rounded-3xl shadow-gold hover:scale-105 transition-all cursor-pointer block">
              <div className="text-2xl font-bold">Dès 35€</div>
              <div className="text-sm opacity-80">Voir la collection →</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
