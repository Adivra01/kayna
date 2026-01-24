import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import gsap from "gsap";

export default function ShopOpenCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkCelebration();
  }, []);

  const checkCelebration = async () => {
    // Check if shop just opened
    const { data } = await supabase
      .from("site_settings")
      .select("shop_just_opened, site_status")
      .limit(1)
      .maybeSingle();

    if (data?.shop_just_opened && data?.site_status === "open") {
      // Check if user has already seen this celebration
      const celebrationSeen = sessionStorage.getItem("kayna_celebration_seen");
      if (!celebrationSeen) {
        setShowCelebration(true);
        sessionStorage.setItem("kayna_celebration_seen", "true");
        
        // Reset the flag after showing
        setTimeout(async () => {
          await supabase
            .from("site_settings")
            .update({ shop_just_opened: false })
            .neq("id", "dummy");
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (!showCelebration || !overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => setShowCelebration(false),
          });
        }, 2500);
      },
    });

    // Initial state
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(contentRef.current.children, { opacity: 0, y: 30 });

    // Animation sequence
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    })
    .to(contentRef.current.children, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.2");

    // Animate glow pulses
    const glowElements = document.querySelectorAll(".celebration-glow");
    glowElements.forEach((el, i) => {
      gsap.to(el, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        delay: i * 0.3,
        repeat: 2,
        ease: "power2.out",
      });
    });

  }, [showCelebration]);

  if (!showCelebration) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-primary/95 backdrop-blur-xl"
    >
      {/* Animated glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="celebration-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="celebration-glow absolute top-1/3 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-2xl" style={{ animationDelay: '0.5s' }} />
        <div className="celebration-glow absolute bottom-1/3 right-1/3 w-72 h-72 bg-accent/25 rounded-full blur-2xl" style={{ animationDelay: '1s' }} />
      </div>

      {/* Light rays */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-[200%] bg-gradient-to-t from-transparent via-accent to-transparent origin-bottom"
            style={{
              transform: `rotate(${i * 45}deg) translateY(-50%)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative text-center px-6 max-w-lg">
        {/* Animated icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative w-32 h-32 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center shadow-gold">
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
          La Boutique est <span className="text-accent">Ouverte</span>
        </h1>
        
        <p className="text-xl text-secondary/70 mb-6">
          Bienvenue dans l'univers KAYNA
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/30 rounded-full">
          <span className="text-accent font-semibold">Édition Exclusive</span>
          <span className="text-secondary/50">•</span>
          <span className="text-secondary/70">Accès limité</span>
        </div>
      </div>
    </div>
  );
}
