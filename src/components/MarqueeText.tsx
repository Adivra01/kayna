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
    <div className="py-4 sm:py-6 lg:py-8 border-y border-border overflow-hidden bg-secondary">
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center px-4 sm:px-6 lg:px-8">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold italic">inspire.</span>
            <span className="icon-accent text-xl sm:text-2xl lg:text-3xl mx-2 sm:mx-3 lg:mx-4">✱</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
