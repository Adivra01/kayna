import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "action" | "text">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Smooth mouse tracking
    let rafId: number;
    const smoothMouse = { x: 0, y: 0 };
    
    const animate = () => {
      smoothMouse.x += (mousePos.current.x - smoothMouse.x) * 0.18;
      smoothMouse.y += (mousePos.current.y - smoothMouse.y) * 0.18;
      
      gsap.set(cursor, {
        x: mousePos.current.x,
        y: mousePos.current.y,
      });
      
      gsap.set(follower, {
        x: smoothMouse.x,
        y: smoothMouse.y,
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
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleElementEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest("button:not([disabled])") || target.closest("[data-cursor='action']")) {
        setCursorState("action");
      } else if (target.closest("a") || target.closest("[data-cursor='hover']") || target.closest("[data-cursor='product']") || target.closest("[data-cursor='link']")) {
        setCursorState("hover");
      } else if (target.closest("input") || target.closest("textarea") || target.closest("[data-cursor='text']")) {
        setCursorState("text");
      }
    };

    const handleElementLeave = () => {
      setCursorState("default");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    const addListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, input, textarea, [data-cursor]");
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
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, [isVisible]);

  // Animate cursor state changes
  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const states = {
      default: { cursorSize: 6, followerSize: 32, followerOpacity: 0.6 },
      hover: { cursorSize: 4, followerSize: 44, followerOpacity: 0.8 },
      action: { cursorSize: 4, followerSize: 40, followerOpacity: 1 },
      text: { cursorSize: 2, followerSize: 4, followerOpacity: 1 },
    };

    const state = states[cursorState];
    
    gsap.to(cursor, {
      width: state.cursorSize,
      height: state.cursorSize,
      duration: 0.25,
      ease: "power2.out",
    });
    
    gsap.to(follower, {
      width: state.followerSize,
      height: state.followerSize,
      opacity: state.followerOpacity,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [cursorState]);

  // Click animation
  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    if (isClicking) {
      gsap.to(follower, {
        scale: 0.85,
        duration: 0.1,
        ease: "power2.out",
      });
    } else {
      gsap.to(follower, {
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [isClicking]);

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Minimal dot cursor */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: 6,
          height: 6,
          backgroundColor: "hsl(40, 45%, 60%)",
        }}
      />

      {/* Elegant ring follower */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 ${
          isVisible ? "opacity-60" : "opacity-0"
        }`}
        style={{
          width: 32,
          height: 32,
          border: "1px solid hsl(40, 45%, 60%)",
          backgroundColor: "transparent",
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
