import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";

const CollectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { home, isRTL } = useLocalization();

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-primary relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[300px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div ref={contentRef} className="text-center max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-[2rem] sm:text-[3rem] lg:text-[4rem] font-bold text-secondary leading-[1.1] mb-8">
            {home.collTitle1}
            <span className="block text-accent italic mt-4">{home.collTitle2}</span>
          </h2>

          <p className="text-xl text-secondary/60 mb-12 max-w-xl mx-auto">
            {home.collSubtitle}
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-4 px-12 py-6 bg-accent text-primary rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-gold"
          >
            <span>{home.collCTA}</span>
            <ArrowRight className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>

          <p className="mt-16 text-secondary/40 text-lg italic">
            "{home.collQuote}"
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
