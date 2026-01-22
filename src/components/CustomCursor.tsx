import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Smooth mouse tracking
    let rafId: number;
    
    const animate = () => {
      gsap.set(cursor, {
        x: mousePos.current.x,
        y: mousePos.current.y,
      });
      rafId = requestAnimationFrame(animate);
    };
    
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") || 
        target.closest("button:not([disabled])") || 
        target.closest("[data-cursor]")
      ) {
        setIsHovering(true);
      }
    };

    const handleElementLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const addListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, [data-cursor]");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleElementEnter as EventListener);
        el.addEventListener("mouseleave", handleElementLeave);
      });
    };
    
    addListeners();

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible]);

  // Animate cursor state changes
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.to(cursor, {
      scale: isHovering ? 1.5 : 1,
      opacity: isHovering ? 0.8 : 0.6,
      duration: 0.2,
      ease: "power2.out",
    });
  }, [isHovering]);

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Simple elegant dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference transition-opacity duration-200 ${
          isVisible ? "opacity-60" : "opacity-0"
        }`}
        style={{
          width: 8,
          height: 8,
          backgroundColor: "hsl(40, 45%, 65%)",
        }}
      />

      {/* Hide default cursor */}
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
