import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "action" | "product" | "link" | "text">("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Create trail elements
    const trailCount = 5;
    const trails: HTMLDivElement[] = [];
    
    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement("div");
      trail.className = "fixed top-0 left-0 pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 rounded-full";
      trail.style.width = `${8 - i * 1.2}px`;
      trail.style.height = `${8 - i * 1.2}px`;
      trail.style.background = `linear-gradient(135deg, hsl(40, 45%, ${60 - i * 8}%), hsl(40, 45%, ${50 - i * 8}%))`;
      trail.style.opacity = `${0.6 - i * 0.1}`;
      document.body.appendChild(trail);
      trails.push(trail);
      trailsRef.current.push(trail);
    }

    // Smooth mouse move with RAF
    let rafId: number;
    const smoothMouse = { x: 0, y: 0 };
    
    const animate = () => {
      // Lerp towards mouse position
      smoothMouse.x += (mousePos.current.x - smoothMouse.x) * 0.15;
      smoothMouse.y += (mousePos.current.y - smoothMouse.y) * 0.15;
      
      // Update cursor position
      gsap.set(cursor, {
        x: mousePos.current.x,
        y: mousePos.current.y,
      });
      
      // Update follower with delay
      gsap.set(follower, {
        x: smoothMouse.x,
        y: smoothMouse.y,
      });
      
      // Update trails with staggered delay
      trails.forEach((trail, i) => {
        const delay = (i + 1) * 0.08;
        gsap.to(trail, {
          x: smoothMouse.x,
          y: smoothMouse.y,
          duration: delay,
          ease: "power2.out",
        });
      });
      
      rafId = requestAnimationFrame(animate);
    };
    
    animate();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    // Mouse leave/enter handlers
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Click handlers
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Interactive element handlers
    const handleElementEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest("[data-cursor='product']")) {
        setCursorState("product");
        setCursorText("Voir");
      } else if (target.closest("[data-cursor='action']") || target.closest("button:not([disabled])")) {
        setCursorState("action");
        setCursorText("");
      } else if (target.closest("a") || target.closest("[data-cursor='link']")) {
        setCursorState("link");
        setCursorText("");
      } else if (target.closest("input") || target.closest("textarea") || target.closest("[data-cursor='text']")) {
        setCursorState("text");
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
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add hover listeners to interactive elements
    const addListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, input, textarea, [data-cursor]");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleElementEnter as EventListener);
        el.addEventListener("mouseleave", handleElementLeave);
      });
    };
    
    addListeners();

    // MutationObserver for dynamic elements
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
      trails.forEach((trail) => trail.remove());
    };
  }, [isVisible]);

  // Animate cursor state changes
  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const states = {
      default: { 
        cursorSize: 8, 
        followerSize: 40, 
        followerBorder: 1,
        followerBg: "transparent",
      },
      hover: { 
        cursorSize: 6, 
        followerSize: 60, 
        followerBorder: 2,
        followerBg: "transparent",
      },
      action: { 
        cursorSize: 4, 
        followerSize: 50, 
        followerBorder: 2,
        followerBg: "rgba(201, 168, 108, 0.1)",
      },
      product: { 
        cursorSize: 0, 
        followerSize: 90, 
        followerBorder: 0,
        followerBg: "hsl(40, 45%, 60%)",
      },
      link: { 
        cursorSize: 4, 
        followerSize: 50, 
        followerBorder: 2,
        followerBg: "rgba(201, 168, 108, 0.15)",
      },
      text: { 
        cursorSize: 2, 
        followerSize: 4, 
        followerBorder: 0,
        followerBg: "hsl(40, 45%, 60%)",
      },
    };

    const state = states[cursorState];
    
    gsap.to(cursor, {
      width: state.cursorSize,
      height: state.cursorSize,
      duration: 0.3,
      ease: "power3.out",
    });
    
    gsap.to(follower, {
      width: state.followerSize,
      height: state.followerSize,
      borderWidth: state.followerBorder,
      backgroundColor: state.followerBg,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [cursorState]);

  // Click animation
  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    if (isClicking) {
      gsap.to(follower, {
        scale: 0.8,
        duration: 0.15,
        ease: "power2.out",
      });
    } else {
      gsap.to(follower, {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    }
  }, [isClicking]);

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot with gradient */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: 8,
          height: 8,
          background: "linear-gradient(135deg, hsl(40, 45%, 70%), hsl(40, 45%, 50%))",
          boxShadow: "0 0 15px 3px hsla(40, 45%, 60%, 0.5)",
        }}
      />

      {/* Follower ring */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: 40,
          height: 40,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "hsl(40, 45%, 60%)",
          backgroundColor: "transparent",
          backdropFilter: cursorState === "product" ? "none" : "blur(2px)",
        }}
      >
        {/* Product state text */}
        {cursorState === "product" && cursorText && (
          <span className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xs uppercase tracking-widest">
            {cursorText}
          </span>
        )}
        
        {/* Link arrow indicator */}
        {cursorState === "link" && (
          <span className="absolute inset-0 flex items-center justify-center text-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        )}
        
        {/* Action pulse */}
        {cursorState === "action" && (
          <div className="absolute inset-1 rounded-full bg-accent/20 animate-ping" />
        )}
      </div>

      {/* Magnetic effect glow for hover states */}
      {(cursorState === "hover" || cursorState === "action") && (
        <div
          className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500 ${
            isVisible ? "opacity-40" : "opacity-0"
          }`}
          style={{
            width: 80,
            height: 80,
            background: "radial-gradient(circle, hsla(40, 45%, 60%, 0.3) 0%, transparent 70%)",
            transform: `translate(${mousePos.current.x - 40}px, ${mousePos.current.y - 40}px)`,
          }}
        />
      )}

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
