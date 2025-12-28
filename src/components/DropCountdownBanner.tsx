import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Flame } from "lucide-react";
import gsap from "gsap";

export default function DropCountdownBanner() {
  const [countdown, setCountdown] = useState<{ minutes: number; seconds: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
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
        return;
      }

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ minutes: totalMinutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      gsap.fromTo(".drop-banner",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isVisible]);

  if (!isVisible || !countdown) return null;

  const isUrgent = countdown.minutes < 5;

  return (
    <div className={`drop-banner fixed top-0 left-0 right-0 z-[90] ${
      isUrgent 
        ? "bg-gradient-to-r from-red-600 via-red-500 to-orange-500" 
        : "bg-gradient-to-r from-accent via-accent-light to-accent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            {isUrgent ? (
              <Flame className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Timer className="w-5 h-5 text-primary" />
            )}
            <span className={`font-bold text-sm uppercase tracking-wider ${
              isUrgent ? "text-white" : "text-primary"
            }`}>
              🔥 DROP EN COURS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className={`px-3 py-1.5 rounded-lg font-mono text-lg font-bold ${
              isUrgent 
                ? "bg-white/20 text-white" 
                : "bg-primary/20 text-primary"
            }`}>
              {countdown.minutes.toString().padStart(2, "0")}
            </div>
            <span className={`text-xl font-bold ${isUrgent ? "text-white" : "text-primary"} animate-pulse`}>
              :
            </span>
            <div className={`px-3 py-1.5 rounded-lg font-mono text-lg font-bold ${
              isUrgent 
                ? "bg-white/20 text-white" 
                : "bg-primary/20 text-primary"
            }`}>
              {countdown.seconds.toString().padStart(2, "0")}
            </div>
          </div>

          <span className={`text-sm font-medium hidden sm:block ${
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