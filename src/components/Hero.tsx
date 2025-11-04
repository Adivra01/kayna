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
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>info@momento.com</p>
          <p>(+12) 808 130 1190</p>
        </div>
        
        <h1 className="text-2xl font-bold italic">inspire.</h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm">Follow us</span>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-12 pt-24 lg:pt-32 pb-12 lg:pb-20 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 border border-accent/30 rounded-full mb-6 lg:mb-8">
              <span className="text-xs lg:text-sm text-accent font-bold tracking-wider">COLLECTION 2025</span>
            </div>
            
            <h2 ref={headingRef} className="text-display font-bold mb-6 lg:mb-8">
              Transcende
              <span className="block italic text-accent">tes limites</span>
            </h2>

            <p className="text-lg lg:text-2xl max-w-xl mb-8 lg:mb-12 leading-relaxed font-light">
              Porte ta <span className="font-bold text-accent">détermination</span>. Chaque pièce raconte l'histoire de ceux qui 
              <span className="italic"> refusent l'ordinaire</span> et embrassent le dépassement.
            </p>

            <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-8 lg:mb-12">
              <button className="px-8 py-4 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all hover:scale-105 shadow-lg">
                SHOP NOW
              </button>
              <button className="px-8 py-4 border-2 border-foreground rounded-full font-bold hover:bg-foreground hover:text-background transition-all">
                NOTRE VISION
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 lg:gap-8 max-w-2xl">
              <div>
                <div className="text-3xl lg:text-5xl font-bold mb-2">50K+</div>
                <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wide">Battants inspirés</p>
              </div>
              <div>
                <div className="text-3xl lg:text-5xl font-bold mb-2">98%</div>
                <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wide">Satisfaction</p>
              </div>
              <div>
                <div className="text-3xl lg:text-5xl font-bold mb-2 icon-accent">★</div>
                <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wide">Qualité premium</p>
              </div>
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="relative rounded-[3rem] overflow-hidden aspect-[3/4]">
              <img 
                src={heroImage} 
                alt="inspire. - Vêtements pour dépassement de soi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <span className="text-white font-bold text-sm">NOUVEAU ★</span>
              </div>
              <button className="absolute bottom-8 right-8 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-accent text-white flex flex-col items-center justify-center shadow-2xl hover:scale-110 transition-all hover:rotate-12">
                <ArrowDown className="w-6 h-6 animate-bounce" />
                <span className="text-xs font-bold mt-1">SHOP</span>
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 icon-accent text-6xl">✱</div>
          </div>
        </div>

        <div className="mt-8 lg:mt-16 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-xs lg:text-sm text-muted-foreground tracking-widest">DÉCOUVRIR LA COLLECTION</div>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div className="text-4xl lg:text-6xl icon-accent">✱</div>
            <div>
              <p className="font-bold text-sm lg:text-base">Plus qu'un vêtement,</p>
              <p className="font-bold text-sm lg:text-base italic">un état d'esprit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
