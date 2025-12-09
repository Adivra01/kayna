import { useEffect, useRef } from "react";
import gsap from "gsap";

const MarqueeText = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const animation = gsap.to(marquee.children, {
      xPercent: -100,
      repeat: -1,
      duration: 20,
      ease: "linear",
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div className="py-8 border-y border-secondary/30 overflow-hidden bg-gradient-to-r from-primary via-secondary/15 to-primary">
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center px-8">
            <span className="text-4xl font-bold italic text-white">KAYNA</span>
            <span className="text-secondary text-3xl mx-4">✱</span>
            <span className="text-2xl font-light text-accent">CONFIANCE</span>
            <span className="text-white/30 text-3xl mx-4">•</span>
            <span className="text-2xl font-light text-secondary">DÉPASSEMENT</span>
            <span className="text-white/30 text-3xl mx-4">•</span>
            <span className="text-2xl font-light text-accent">PERSÉVÉRANCE</span>
            <span className="text-accent text-3xl mx-4">✱</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
