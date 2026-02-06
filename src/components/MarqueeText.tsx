const MarqueeText = () => {
  return (
    <div className="py-5 bg-accent overflow-hidden">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
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

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
