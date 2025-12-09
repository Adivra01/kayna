import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote } from "lucide-react";
import testimonialHero from "@/assets/testimonial-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Youssef M.",
    text: "KAYNA m'accompagne dans chaque combat. C'est plus qu'un vêtement, c'est un rappel de qui je veux devenir.",
    rating: 5,
  },
  {
    name: "Amina K.",
    text: "La qualité est exceptionnelle. Chaque fois que je porte KAYNA, je me sens invincible.",
    rating: 5,
  },
  {
    name: "Malik D.",
    text: "Enfin une marque qui comprend notre état d'esprit. Le design minimaliste mais puissant.",
    rating: 5,
  },
];

const TestimonialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        scale: 1.2,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(imageRef.current, {
        yPercent: -20,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.from(card, {
          x: 60,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.15,
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
    <section ref={sectionRef} className="relative min-h-screen bg-primary overflow-hidden">
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0">
        <img
          src={testimonialHero}
          alt="KAYNA Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-24 lg:py-32 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          {/* Left - Title */}
          <div>
            <Quote className="w-16 h-16 text-accent mb-8 opacity-50" />
            <h2 className="text-[3rem] lg:text-[4.5rem] font-bold leading-[0.95] text-secondary mb-6">
              La <span className="italic text-accent">communauté</span>
              <span className="block">parle</span>
            </h2>
            <p className="text-xl text-secondary/60 max-w-md">
              Rejoins ceux qui ont choisi de porter leur confiance.
            </p>
            
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-accent/20 border-2 border-primary flex items-center justify-center text-secondary font-bold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-secondary font-bold">+500</div>
                <div className="text-secondary/50 text-sm">clients satisfaits</div>
              </div>
            </div>
          </div>

          {/* Right - Testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                ref={(el) => (cardsRef.current[index] = el)}
                className="backdrop-blur-xl bg-secondary/5 border border-secondary/10 rounded-3xl p-6 lg:p-8 hover:bg-secondary/10 transition-all cursor-pointer group"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-secondary/80 text-lg leading-relaxed mb-4 group-hover:text-secondary transition-colors">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {testimonial.name[0]}
                  </div>
                  <span className="text-secondary font-medium">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
