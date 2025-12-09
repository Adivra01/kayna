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
      duration: 25,
      ease: "linear",
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div className="py-5 bg-accent overflow-hidden">
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center px-8">
            <span className="text-xl font-bold text-primary">KAYNA</span>
            <span className="text-primary/50 mx-6">•</span>
            <span className="text-sm font-medium text-primary/80 tracking-wider">CONFIANCE</span>
            <span className="text-primary/50 mx-6">•</span>
            <span className="text-sm font-medium text-primary/80 tracking-wider">DÉPASSEMENT</span>
            <span className="text-primary/50 mx-6">•</span>
            <span className="text-sm font-medium text-primary/80 tracking-wider">PERSÉVÉRANCE</span>
            <span className="text-primary/50 mx-6">★</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
