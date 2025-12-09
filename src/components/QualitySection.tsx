import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Leaf, Recycle, Award } from "lucide-react";
import qualityDetail from "@/assets/quality-detail.jpg";
import productShowcase from "@/assets/product-showcase.jpg";

gsap.registerPlugin(ScrollTrigger);

const qualities = [
  {
    icon: Shield,
    title: "Qualité Premium",
    description: "Matériaux sélectionnés pour leur durabilité exceptionnelle",
  },
  {
    icon: Leaf,
    title: "Coton Organique",
    description: "100% coton bio, doux pour la peau et l'environnement",
  },
  {
    icon: Recycle,
    title: "Éco-responsable",
    description: "Production éthique et emballages recyclables",
  },
  {
    icon: Award,
    title: "Garantie à vie",
    description: "Confiance totale dans nos produits",
  },
];

const QualitySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const qualitiesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(image1Ref.current, {
        x: -80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(image2Ref.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(image1Ref.current, {
        yPercent: -10,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(image2Ref.current, {
        yPercent: 10,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      qualitiesRef.current.forEach((quality, index) => {
        if (!quality) return;
        gsap.from(quality, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="qualite" className="py-24 lg:py-32 bg-background relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] -translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-[3rem] lg:text-[4.5rem] font-bold leading-[0.95] text-foreground mb-6">
            La <span className="italic text-accent">qualité</span>
            <span className="block">avant tout</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Chaque détail compte. Chaque couture raconte notre engagement envers l'excellence.
          </p>
        </div>

        {/* Images + Qualities Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Image */}
          <div ref={image1Ref} className="lg:col-span-4">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-square shadow-elegant">
              <img
                src={qualityDetail}
                alt="Quality Detail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="backdrop-blur-md bg-primary/60 rounded-2xl px-5 py-4">
                  <div className="text-accent font-bold text-lg">240 GSM</div>
                  <div className="text-secondary/70 text-sm">Poids premium lourd</div>
                </div>
              </div>
            </div>
          </div>

          {/* Qualities */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {qualities.map((quality, index) => (
              <div
                key={quality.title}
                ref={(el) => (qualitiesRef.current[index] = el)}
                className="bg-card border border-border rounded-3xl p-6 hover:border-accent/30 hover:shadow-elegant transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-primary transition-all">
                  <quality.icon className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-foreground font-bold mb-2">{quality.title}</h3>
                <p className="text-muted-foreground text-sm">{quality.description}</p>
              </div>
            ))}
          </div>

          {/* Right Image */}
          <div ref={image2Ref} className="lg:col-span-4">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-elegant">
              <img
                src={productShowcase}
                alt="Product Showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute top-6 right-6">
                <div className="backdrop-blur-md bg-accent/90 text-primary rounded-full px-4 py-2 font-bold text-sm">
                  Made in Portugal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
