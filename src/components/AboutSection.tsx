import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import sweater1 from "@/assets/sweater-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading
      gsap.from(textRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      // Animate images with parallax
      gsap.from([image1Ref.current, image2Ref.current], {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(image1Ref.current, {
        yPercent: -20,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(image2Ref.current, {
        yPercent: 20,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left - Images */}
          <div className="lg:col-span-5 relative">
            <div ref={image1Ref} className="relative rounded-[3rem] overflow-hidden aspect-[3/4] mb-8 shadow-royal-lg border border-primary/20">
              <img src={sweater1} alt="Collection KAYNA - Confiance" className="w-full h-full object-cover" />
              <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-accent text-primary flex items-center justify-center shadow-gold">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Middle - Text */}
          <div ref={textRef} className="lg:col-span-4 space-y-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
                <span className="text-accent text-2xl">★</span>
                <span className="text-sm font-bold text-accent tracking-wider">PHILOSOPHIE</span>
              </div>
              
              <h2 className="text-display font-bold leading-none mb-8 text-primary">
                Ta force
                <span className="block italic text-accent">commence ici</span>
              </h2>
              
              <p className="text-xl lg:text-2xl mb-6 leading-relaxed font-light text-primary">
                Chaque matin, tu fais un choix : <span className="font-bold">rester dans ta zone de confort</span> ou 
                <span className="italic text-accent"> oser être exceptionnel</span>.
              </p>
              
              <p className="text-base lg:text-lg mb-8 leading-relaxed text-muted-foreground">
                Nos vêtements ne sont pas juste du tissu. Ce sont des <span className="font-bold text-primary">rappels quotidiens</span> de 
                ta capacité à tout surmonter. À chaque fois que tu les portes, tu incarnes la persévérance, 
                la confiance, le dépassement.
              </p>
              
              <a href="/about" className="inline-flex px-8 py-4 rounded-full bg-accent text-primary font-bold hover:bg-accent-light transition-all duration-300 items-center gap-3 group shadow-gold hover:shadow-gold-glow hover:scale-105">
                <span className="text-sm lg:text-base">DÉCOUVRE NOTRE HISTOIRE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right - Second Image */}
          <div className="lg:col-span-3">
            <div ref={image2Ref} className="relative rounded-[3rem] overflow-hidden aspect-[3/4] group border border-accent/20 shadow-royal-md">
              <img src={tshirt2} alt="KAYNA - Collection premium" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-gold-glow" />
                  <span className="text-white/90 text-xs uppercase tracking-wider">En stock</span>
                </div>
                <p className="text-white font-bold text-lg lg:text-xl mb-2">Collection Élite</p>
                <p className="text-white/90 text-sm mb-4">Qualité premium • Design unique</p>
                <button className="text-accent font-bold text-sm flex items-center gap-2 group/btn">
                  <span>Voir plus</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-end gap-4">
              <div className="text-3xl text-accent">✱</div>
              <div className="text-right text-primary">
                <p className="font-bold text-sm lg:text-base">Fabriqué pour</p>
                <p className="font-bold text-sm lg:text-base italic">les battants</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
