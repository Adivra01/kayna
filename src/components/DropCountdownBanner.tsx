import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Flame } from "lucide-react";
import gsap from "gsap";

export default function DropCountdownBanner() {
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    fetchDropTime();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => fetchDropTime()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDropTime = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("drop_end_time, site_status")
      .limit(1)
      .maybeSingle();

    if (!error && data?.drop_end_time && data.site_status === "open") {
      const now = new Date().getTime();
      const end = new Date(data.drop_end_time).getTime();
      const diff = end - now;
      
      if (diff > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        // Auto-lock when countdown ends
        await lockSite();
      }
    } else {
      setIsVisible(false);
    }
  };

  const lockSite = async () => {
    await supabase
      .from("site_settings")
      .update({
        site_status: "locked",
        drop_end_time: null,
      })
      .neq("id", "dummy"); // Update all rows
    
    // Reload page to show locked state
    window.location.reload();
  };

  useEffect(() => {
    if (!isVisible) {
      setCountdown(null);
      return;
    }

    const updateCountdown = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("drop_end_time")
        .limit(1)
        .maybeSingle();

      if (!data?.drop_end_time) {
        setCountdown(null);
        setIsVisible(false);
        return;
      }

      const now = new Date().getTime();
      const end = new Date(data.drop_end_time).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown(null);
        setIsVisible(false);
        // Lock site when countdown ends
        await lockSite();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && bannerRef.current && !hasAnimated.current) {
      hasAnimated.current = true;
      gsap.fromTo(bannerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isVisible]);

  if (!isVisible || !countdown) return null;

  const totalMinutesLeft = countdown.hours * 60 + countdown.minutes;
  const isUrgent = totalMinutesLeft < 5;

  return (
    <div 
      ref={bannerRef}
      className={`fixed top-0 left-0 right-0 z-[90] ${
        isUrgent 
          ? "bg-gradient-to-r from-red-600 via-red-500 to-orange-500" 
          : "bg-gradient-to-r from-accent via-accent-light to-accent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            {isUrgent ? (
              <Flame className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Timer className="w-5 h-5 text-primary" />
            )}
            <span className={`font-bold text-xs sm:text-sm uppercase tracking-wider ${
              isUrgent ? "text-white" : "text-primary"
            }`}>
              🔥 DROP EN COURS
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Hours */}
            <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-mono text-sm sm:text-lg font-bold ${
              isUrgent 
                ? "bg-white/20 text-white" 
                : "bg-primary/20 text-primary"
            }`}>
              {countdown.hours.toString().padStart(2, "0")}
            </div>
            <span className={`text-lg sm:text-xl font-bold ${isUrgent ? "text-white" : "text-primary"} animate-pulse`}>
              :
            </span>
            {/* Minutes */}
            <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-mono text-sm sm:text-lg font-bold ${
              isUrgent 
                ? "bg-white/20 text-white" 
                : "bg-primary/20 text-primary"
            }`}>
              {countdown.minutes.toString().padStart(2, "0")}
            </div>
            <span className={`text-lg sm:text-xl font-bold ${isUrgent ? "text-white" : "text-primary"} animate-pulse`}>
              :
            </span>
            {/* Seconds */}
            <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-mono text-sm sm:text-lg font-bold ${
              isUrgent 
                ? "bg-white/20 text-white" 
                : "bg-primary/20 text-primary"
            }`}>
              {countdown.seconds.toString().padStart(2, "0")}
            </div>
          </div>

          <span className={`text-xs sm:text-sm font-medium hidden sm:block ${
            isUrgent ? "text-white/90" : "text-primary/80"
          }`}>
            {isUrgent ? "⚡ Dépêchez-vous !" : "avant la fermeture"}
          </span>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}