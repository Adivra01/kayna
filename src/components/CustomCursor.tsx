import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "action" | "product" | "link">("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorDot) return;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
      
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power1.out",
      });
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Interactive element handlers
    const handleElementEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest("[data-cursor='product']")) {
        setCursorState("product");
        setCursorText("Voir");
      } else if (target.closest("[data-cursor='action']") || target.closest("button")) {
        setCursorState("action");
        setCursorText("");
      } else if (target.closest("a") || target.closest("[data-cursor='link']")) {
        setCursorState("link");
        setCursorText("");
      } else if (target.closest("[data-cursor='hover']")) {
        setCursorState("hover");
        setCursorText("");
      }
    };

    const handleElementLeave = () => {
      setCursorState("default");
      setCursorText("");
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll("a, button, [data-cursor]");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementEnter as EventListener);
      el.addEventListener("mouseleave", handleElementLeave);
    });

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll("a, button, [data-cursor]");
      newElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementEnter as EventListener);
        el.removeEventListener("mouseleave", handleElementLeave);
        el.addEventListener("mouseenter", handleElementEnter as EventListener);
        el.addEventListener("mouseleave", handleElementLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementEnter as EventListener);
        el.removeEventListener("mouseleave", handleElementLeave);
      });
      observer.disconnect();
    };
  }, []);

  // Animate cursor state changes
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const states = {
      default: { scale: 1, width: 40, height: 40, borderRadius: "50%", mixBlendMode: "difference" },
      hover: { scale: 1.5, width: 60, height: 60, borderRadius: "50%", mixBlendMode: "difference" },
      action: { scale: 0.8, width: 60, height: 60, borderRadius: "50%", mixBlendMode: "difference" },
      product: { scale: 1, width: 100, height: 100, borderRadius: "50%", mixBlendMode: "normal" },
      link: { scale: 1.3, width: 50, height: 50, borderRadius: "50%", mixBlendMode: "difference" },
    };

    const state = states[cursorState];
    
    gsap.to(cursor, {
      width: state.width,
      height: state.height,
      borderRadius: state.borderRadius,
      scale: state.scale,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [cursorState]);

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: 40,
          height: 40,
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-300 ${
            cursorState === "product"
              ? "bg-accent border-none"
              : cursorState === "action"
              ? "bg-accent/50 border-2 border-accent"
              : "border-2 border-secondary bg-transparent"
          }`}
        >
          {cursorState === "product" && cursorText && (
            <span
              ref={cursorTextRef}
              className="absolute inset-0 flex items-center justify-center text-primary font-bold text-sm uppercase tracking-wider"
            >
              {cursorText}
            </span>
          )}
        </div>
        
        {/* Inner glow for action state */}
        {cursorState === "action" && (
          <div className="absolute inset-2 rounded-full bg-accent/30 animate-pulse" />
        )}
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isVisible && cursorState !== "product" ? "opacity-100" : "opacity-0"
        }`}
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
