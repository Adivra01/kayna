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
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left - Images */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div ref={image1Ref} className="relative rounded-2xl sm:rounded-[3rem] overflow-hidden aspect-[3/4] mb-6 sm:mb-8">
              <img src={sweater1} alt="Collection inspire - Confiance" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent text-white flex items-center justify-center">
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          {/* Middle - Text */}
          <div ref={textRef} className="lg:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 rounded-full">
                <span className="icon-accent text-xl sm:text-2xl">★</span>
                <span className="text-xs sm:text-sm font-bold text-accent tracking-wider">PHILOSOPHIE</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none mb-4 sm:mb-6 lg:mb-8">
                Ta force
                <span className="block italic text-accent">commence ici</span>
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 leading-relaxed font-light">
                Chaque matin, tu fais un choix : <span className="font-bold">rester dans ta zone de confort</span> ou 
                <span className="italic text-accent"> oser être exceptionnel</span>.
              </p>
              
              <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed text-muted-foreground">
                Nos vêtements ne sont pas juste du tissu. Ce sont des <span className="font-bold text-foreground">rappels quotidiens</span> de 
                ta capacité à tout surmonter. À chaque fois que tu les portes, tu incarnes la persévérance, 
                la confiance, le dépassement.
              </p>
              
              <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-accent text-white font-bold hover:bg-accent/90 transition-all duration-300 flex items-center gap-2 sm:gap-3 group shadow-lg hover:shadow-xl hover:scale-105">
                <span className="text-xs sm:text-sm lg:text-base">REJOINS LE MOUVEMENT</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right - Second Image */}
          <div className="lg:col-span-3 order-3">
            <div ref={image2Ref} className="relative rounded-2xl sm:rounded-[3rem] overflow-hidden aspect-[3/4] group">
              <img src={tshirt2} alt="inspire. - Collection premium" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-8">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-white/80 text-[10px] sm:text-xs uppercase tracking-wider">En stock</span>
                </div>
                <p className="text-white font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">Collection Élite</p>
                <p className="text-white/90 text-xs sm:text-sm mb-3 sm:mb-4">Qualité premium • Design unique</p>
                <button className="text-white font-bold text-xs sm:text-sm flex items-center gap-2 group/btn">
                  <span>Voir plus</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-end gap-3 sm:gap-4">
              <div className="text-2xl sm:text-3xl icon-accent">✱</div>
              <div className="text-right">
                <p className="font-bold text-xs sm:text-sm lg:text-base">Fabriqué pour</p>
                <p className="font-bold text-xs sm:text-sm lg:text-base italic">les battants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating brand logos */}
        <div className="mt-8 sm:mt-12 lg:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-16 opacity-30">
          <span className="text-sm sm:text-base lg:text-lg">RotaShow</span>
          <span className="text-sm sm:text-base lg:text-lg">waves</span>
          <span className="text-sm sm:text-base lg:text-lg">travelers.</span>
          <span className="text-sm sm:text-base lg:text-lg">goldlines</span>
          <span className="text-sm sm:text-base lg:text-lg">velocity</span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
