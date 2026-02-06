import { memo } from "react";

const MarqueeItem = () => (
  <div className="flex items-center px-8">
    <span className="text-xl font-bold text-primary">KAYNA</span>
    <span className="text-primary/50 mx-6">•</span>
    <span className="text-sm font-medium text-primary/80 tracking-wider">CONFIANCE</span>
    <span className="text-primary/50 mx-6">•</span>
    <span className="text-sm font-medium text-primary/80 tracking-wider">DÉPASSEMENT</span>
    <span className="text-primary/50 mx-6">•</span>
    <span className="text-sm font-medium text-primary/80 tracking-wider">PERSÉVÉRANCE</span>
    <span className="text-primary/50 mx-6">★</span>
  </div>
);

const MarqueeText = memo(() => {
  return (
    <div className="py-5 bg-accent overflow-hidden" aria-hidden="true">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {Array.from({ length: 6 }).map((_, i) => (
          <MarqueeItem key={i} />
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
});

MarqueeText.displayName = "MarqueeText";

export default MarqueeText;
