import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CollectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 lg:py-32 bg-primary relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[300px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div ref={contentRef} className="text-center max-w-3xl mx-auto animate-fade-in">
          {/* Main Message */}
          <h2 className="text-[2rem] sm:text-[3rem] lg:text-[4rem] font-bold text-secondary leading-[1.1] mb-8">
            Ce n'est pas un vêtement que tu portes.
            <span className="block text-accent italic mt-4">C'est une armure mentale.</span>
          </h2>

          <p className="text-xl text-secondary/60 mb-12 max-w-xl mx-auto">
            Pour ceux qui refusent la fuite. Pour ceux qui transforment le doute en discipline.
          </p>

          {/* CTA */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-4 px-12 py-6 bg-accent text-primary rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-gold"
          >
            <span>Découvrir la Collection</span>
            <ArrowRight className="w-6 h-6" />
          </Link>

          {/* Bottom Quote */}
          <p className="mt-16 text-secondary/40 text-lg italic">
            "Portez la confiance. Devenez la certitude. Ceci est KAYNA."
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
