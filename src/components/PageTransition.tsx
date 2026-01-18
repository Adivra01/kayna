import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Skip animation on initial load
    if (prevPathRef.current === location.pathname) return;

    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    setIsTransitioning(true);

    // Create timeline for smooth transition
    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayChildren(children);
        prevPathRef.current = location.pathname;
        
        // Animate in new content
        gsap.fromTo(
          container,
          {
            opacity: 0,
            y: 30,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => setIsTransitioning(false),
          }
        );

        // Slide overlay out
        gsap.to(overlay, {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.5,
          ease: "power4.inOut",
          delay: 0.1,
        });
      },
    });

    // Fade out current content
    tl.to(container, {
      opacity: 0,
      y: -20,
      scale: 0.98,
      duration: 0.3,
      ease: "power2.inOut",
    });

    // Slide overlay in
    tl.fromTo(
      overlay,
      {
        scaleY: 0,
        transformOrigin: "bottom",
      },
      {
        scaleY: 1,
        duration: 0.4,
        ease: "power4.inOut",
      },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };
  }, [location.pathname, children]);

  // Update children on first render
  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children);
    }
  }, [children, isTransitioning]);

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{ transform: "scaleY(0)", transformOrigin: "bottom" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary">
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-2 border-accent/30 rounded-full animate-pulse" />
            <div className="absolute w-12 h-12 border border-accent/50 rounded-full animate-ping" />
          </div>
          
          {/* Golden lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
        </div>
      </div>

      {/* Page content */}
      <div ref={containerRef} className="will-change-transform">
        {displayChildren}
      </div>
    </>
  );
};

export default PageTransition;
