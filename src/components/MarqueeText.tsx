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
    <div className="py-8 border-y border-border overflow-hidden bg-secondary">
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center px-8">
            <span className="text-4xl font-bold italic">momento.</span>
            <span className="icon-accent text-3xl mx-4">✱</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
