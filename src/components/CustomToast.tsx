import { useEffect, useRef } from "react";
import { Check, X, Heart, ShoppingBag, AlertCircle, Info } from "lucide-react";
import gsap from "gsap";

type ToastType = "success" | "error" | "favorite" | "cart" | "info";

interface CustomToastProps {
  type: ToastType;
  title: string;
  description?: string;
  onDismiss?: () => void;
}

const icons = {
  success: Check,
  error: X,
  favorite: Heart,
  cart: ShoppingBag,
  info: Info,
};

const styles = {
  success: {
    bg: "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600",
    iconBg: "bg-white/20",
    text: "text-white",
  },
  error: {
    bg: "bg-gradient-to-r from-red-500 via-rose-500 to-red-600",
    iconBg: "bg-white/20",
    text: "text-white",
  },
  favorite: {
    bg: "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600",
    iconBg: "bg-white/20",
    text: "text-white",
  },
  cart: {
    bg: "bg-gradient-to-r from-accent via-accent-light to-accent",
    iconBg: "bg-primary/20",
    text: "text-primary",
  },
  info: {
    bg: "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600",
    iconBg: "bg-white/20",
    text: "text-white",
  },
};

export function CustomToast({ type, title, description, onDismiss }: CustomToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const Icon = icons[type];
  const style = styles[type];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation
      gsap.fromTo(toastRef.current,
        { 
          y: -100, 
          opacity: 0, 
          scale: 0.8,
          rotateX: -15,
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotateX: 0,
          duration: 0.5, 
          ease: "back.out(1.7)",
        }
      );

      // Icon animation
      gsap.fromTo(iconRef.current,
        { scale: 0, rotate: -180 },
        { 
          scale: 1, 
          rotate: 0, 
          duration: 0.6, 
          ease: "elastic.out(1, 0.5)",
          delay: 0.2,
        }
      );

      // Progress bar animation
      gsap.fromTo(progressRef.current,
        { scaleX: 1 },
        { 
          scaleX: 0, 
          duration: 4, 
          ease: "linear",
          transformOrigin: "left",
        }
      );

      // Create sparkle effect for success/cart/favorite
      if (type === "success" || type === "cart" || type === "favorite") {
        for (let i = 0; i < 8; i++) {
          const sparkle = document.createElement("div");
          sparkle.className = "absolute w-1 h-1 rounded-full bg-white/80";
          toastRef.current?.appendChild(sparkle);
          
          const angle = (i * 45) * (Math.PI / 180);
          const distance = 40 + Math.random() * 20;
          
          gsap.fromTo(sparkle,
            { 
              x: 0, 
              y: 0, 
              scale: 1.5, 
              opacity: 1,
              left: "50%",
              top: "50%",
            },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 0,
              opacity: 0,
              duration: 0.6,
              delay: 0.1 + i * 0.03,
              ease: "power2.out",
              onComplete: () => sparkle.remove(),
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, [type]);

  return (
    <div
      ref={toastRef}
      className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl ${style.bg} overflow-hidden min-w-[320px] max-w-[420px]`}
      style={{ 
        perspective: "1000px",
        boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            animation: "shimmer 2s infinite",
            transform: "skewX(-20deg)",
          }}
        />
      </div>

      {/* Icon */}
      <div 
        ref={iconRef}
        className={`relative flex-shrink-0 w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 ${style.text}`} fill={type === "favorite" ? "currentColor" : "none"} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-base ${style.text}`}>{title}</p>
        {description && (
          <p className={`text-sm ${style.text} opacity-80 mt-0.5 truncate`}>{description}</p>
        )}
      </div>

      {/* Close button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center ${style.text} hover:bg-white/30 transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Progress bar */}
      <div 
        ref={progressRef}
        className={`absolute bottom-0 left-0 right-0 h-1 ${style.iconBg}`}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
}
