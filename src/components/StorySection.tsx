import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";

// Brand chapter images
import chapterPhilosophy from "@/assets/kayna-hero.jpg";
import chapterBattle from "@/assets/kayna-battle.jpg";
import chapterChoice from "@/assets/about-confidence.jpg";
import chapterTransmission from "@/assets/value-development.jpg";
import chapterCommunity from "@/assets/hero-group.jpg";
import chapterHeritage from "@/assets/kayna-heritage.jpg";

gsap.registerPlugin(ScrollTrigger);

const chapterImages = [
  chapterPhilosophy,
  chapterBattle,
  chapterChoice,
  chapterTransmission,
  chapterCommunity,
  chapterHeritage,
];

const StorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<(HTMLDivElement | null)[]>([]);
  const { home, isRTL } = useLocalization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      chaptersRef.current.forEach((chapter) => {
        if (!chapter) return;

        const image = chapter.querySelector(".chapter-image");
        const content = chapter.querySelector(".chapter-content");
        const keywords = chapter.querySelectorAll(".chapter-keyword");

        gsap.fromTo(image,
          { scale: 1.2, filter: "brightness(0.4)" },
          {
            scale: 1,
            filter: "brightness(0.7)",
            scrollTrigger: {
              trigger: chapter,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(content,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(keywords,
          { y: 30, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: chapter,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Intro */}
      <div className="min-h-[50vh] flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl">
          <span className="text-accent text-sm uppercase tracking-[0.3em] mb-6 block">{home.storyLabel}</span>
          <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-bold text-secondary leading-[0.9] mb-6">
            {home.storyTitle1}
            <span className="block text-accent italic">{home.storyTitle2}</span>
          </h2>
        </div>
      </div>

      {/* Chapters */}
      {home.chapters.map((chapter, index) => (
        <div
          key={chapter.number}
          ref={(el) => (chaptersRef.current[index] = el)}
          className="relative min-h-screen flex items-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="chapter-image absolute inset-0">
            <img
              src={chapterImages[index]}
              alt={chapter.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-${isRTL ? 'l' : 'r'} from-primary via-primary/80 to-transparent`} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/40" />
          </div>

          {/* Content */}
          <div className="chapter-content relative z-10 container mx-auto px-6 lg:px-12 py-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-accent text-6xl sm:text-8xl font-black opacity-30">{chapter.number}</span>
                <div className={`h-px flex-1 bg-gradient-to-${isRTL ? 'l' : 'r'} from-accent/50 to-transparent max-w-[100px]`} />
              </div>

              <h3 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-secondary leading-[0.9] mb-2">
                {chapter.title}
              </h3>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-accent italic mb-8">
                {chapter.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {chapter.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="chapter-keyword px-5 py-2.5 border border-secondary/20 rounded-full text-secondary/70 text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-all cursor-default"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {home.chapters.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === index ? "w-8 bg-accent" : "w-2 bg-secondary/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* CTA Section */}
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-20 bg-gradient-to-t from-primary to-primary/95">
        <div className="text-center max-w-2xl">
          <p className="text-xl sm:text-2xl text-secondary/60 mb-8 leading-relaxed">
            {home.storyCTA1}<br />
            {home.storyCTA2}<br />
            <span className="text-secondary font-medium">{home.storyCTA3}</span>
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-primary rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-gold group"
          >
            <span>{home.collCTA}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
