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
        
        <h1 className="text-2xl font-bold italic">momento.</h1>
        
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
      <div className="container mx-auto px-6 lg:px-12 pt-32 pb-20 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 ref={headingRef} className="text-display font-bold mb-8">
              where <span className="block">- a style</span>
              <span className="block italic">moment</span>
            </h2>
            
            <div className="flex items-center gap-8 mb-12">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-background" />
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-background" />
                <div className="w-12 h-12 rounded-full bg-accent border-2 border-background flex items-center justify-center text-white text-xl">
                  +
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">[©2015]</p>
              </div>
            </div>

            <p className="text-lg max-w-md mb-8">
              From everyday essentials to statement pieces, our curated collection is designed to celebrate your style, wherever life takes you.
            </p>

            <div className="text-6xl font-bold">
              <div className="flex items-baseline gap-4">
                <span className="icon-accent">✱</span>
                <span className="text-muted-foreground text-3xl">// FASHION</span>
              </div>
              <div className="mt-4">320K</div>
              <p className="text-sm font-normal text-muted-foreground mt-2">INFLUENCED PEOPLE</p>
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="relative rounded-[3rem] overflow-hidden aspect-[3/4]">
              <img 
                src={heroImage} 
                alt="Fashion momento collection"
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <span className="text-sm font-bold">[CHECK]</span>
                <ArrowDown className="w-6 h-6 absolute bottom-4" />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 icon-accent text-6xl">✱</div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">[SCROLL DOWN]</div>
          <div className="text-right">
            <p className="font-bold">Step into effortless</p>
            <p className="font-bold">elegance with Momento</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
