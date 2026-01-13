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
  error: AlertCircle,
  favorite: Heart,
  cart: ShoppingBag,
  info: Info,
};

export function CustomToast({ type, title, description, onDismiss }: CustomToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  
  const Icon = icons[type];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle, elegant entry
      gsap.fromTo(toastRef.current,
        { 
          y: -20, 
          opacity: 0, 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          ease: "power3.out",
        }
      );

      // Icon fade in
      gsap.fromTo(iconRef.current,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.3, 
          ease: "power2.out",
          delay: 0.15,
        }
      );

      // Elegant progress line
      gsap.fromTo(lineRef.current,
        { scaleX: 1 },
        { 
          scaleX: 0, 
          duration: 4, 
          ease: "linear",
          transformOrigin: "left",
        }
      );
    });

    return () => ctx.revert();
  }, [type]);

  const isError = type === "error";

  return (
    <div
      ref={toastRef}
      className="relative flex items-center gap-4 px-5 py-4 min-w-[320px] max-w-[420px] bg-primary border border-accent/20 rounded-lg overflow-hidden"
      style={{ 
        boxShadow: "0 12px 40px -12px hsla(0, 0%, 0%, 0.5), 0 0 20px hsla(40, 45%, 60%, 0.1)",
      }}
    >
      {/* Subtle gold accent line on left */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />

      {/* Icon */}
      <div 
        ref={iconRef}
        className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isError ? "bg-destructive/10" : "bg-accent/10"
        }`}
      >
        <Icon 
          className={`w-5 h-5 ${isError ? "text-destructive" : "text-accent"}`} 
          fill={type === "favorite" ? "currentColor" : "none"} 
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-secondary tracking-wide">{title}</p>
        {description && (
          <p className="text-xs text-secondary/60 mt-0.5 truncate">{description}</p>
        )}
      </div>

      {/* Close button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-secondary/40 hover:text-secondary/70 hover:bg-secondary/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Progress bar - thin gold line at bottom */}
      <div 
        ref={lineRef}
        className={`absolute bottom-0 left-0 right-0 h-[1px] ${isError ? "bg-destructive/50" : "bg-accent/40"}`}
      />
    </div>
  );
}
