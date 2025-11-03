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
            <div ref={image1Ref} className="relative rounded-[3rem] overflow-hidden aspect-[3/4] mb-8">
              <img src={sweater1} alt="About momento" className="w-full h-full object-cover" />
              <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Middle - Text */}
          <div ref={textRef} className="lg:col-span-4 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-muted" />
              </div>
              <h2 className="text-display font-bold leading-none mb-8">
                It's -about
                <span className="block italic">moments</span>
                <span className="block">©24</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-8">(45%)</p>
              <button className="px-8 py-4 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center gap-3 group">
                <span className="font-bold">LEARN MORE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right - Second Image */}
          <div className="lg:col-span-3">
            <div ref={image2Ref} className="relative rounded-[3rem] overflow-hidden aspect-[3/4]">
              <img src={tshirt2} alt="Momento style" className="w-full h-full object-cover" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white font-bold text-lg mb-1">©international - just do it</p>
                <p className="text-white/80 text-sm">2024</p>
              </div>
            </div>
            <div className="mt-8 text-right">
              <p className="font-bold">To Celebrate</p>
              <p className="font-bold">Your Moments</p>
            </div>
          </div>
        </div>

        {/* Floating brand logos */}
        <div className="mt-16 flex items-center justify-center gap-16 opacity-30">
          <span className="text-lg">RotaShow</span>
          <span className="text-lg">waves</span>
          <span className="text-lg">travelers.</span>
          <span className="text-lg">goldlines</span>
          <span className="text-lg">velocity</span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
