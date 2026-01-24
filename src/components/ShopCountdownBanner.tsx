import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Sparkles } from "lucide-react";

type BannerMode = "opening" | "closing" | null;

export default function ShopCountdownBanner() {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [mode, setMode] = useState<BannerMode>(null);

  useEffect(() => {
    fetchSettings();
    
    const channel = supabase
      .channel("shop_countdown_banner")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => fetchSettings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("site_status, drop_opening_time, drop_end_time")
      .limit(1)
      .maybeSingle();

    if (!data) {
      setMode(null);
      return;
    }

    const now = Date.now();

    // Priority 1: Opening countdown (shop is locked, waiting to open)
    if (data.site_status === "locked" && data.drop_opening_time) {
      const openTime = new Date(data.drop_opening_time).getTime();
      if (openTime > now) {
        setMode("opening");
        return;
      }
    }

    // Priority 2: Closing countdown (shop is open, countdown to close)
    if (data.site_status === "open" && data.drop_end_time) {
      const closeTime = new Date(data.drop_end_time).getTime();
      if (closeTime > now) {
        setMode("closing");
        return;
      }
    }

    setMode(null);
  };

  // Countdown timer
  useEffect(() => {
    if (!mode) {
      setCountdown(null);
      return;
    }

    const updateCountdown = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("drop_opening_time, drop_end_time, site_status")
        .limit(1)
        .maybeSingle();

      if (!data) {
        setCountdown(null);
        setMode(null);
        return;
      }

      const targetTime = mode === "opening" 
        ? data.drop_opening_time 
        : data.drop_end_time;

      if (!targetTime) {
        setCountdown(null);
        setMode(null);
        return;
      }

      const now = Date.now();
      const end = new Date(targetTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown(null);
        // Reload page to trigger state change
        window.location.reload();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  if (!mode || !countdown) return null;

  const isClosing = mode === "closing";
  const isUrgent = isClosing && (countdown.days === 0 && countdown.hours < 1);

  const getMessage = () => {
    if (isClosing) {
      if (isUrgent) return "⚡ Édition limitée — fermeture imminente";
      return "Édition limitée — la boutique ferme dans";
    }
    return "✨ Accès exclusif — la boutique ouvre dans";
  };

  return (
    <div 
      className={`w-full py-2.5 px-4 text-center ${
        isUrgent 
          ? "bg-gradient-to-r from-red-600 via-red-500 to-orange-500" 
          : isClosing
            ? "bg-gradient-to-r from-accent via-accent-light to-accent"
            : "bg-gradient-to-r from-primary via-primary/90 to-primary border-b border-accent/30"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {isClosing ? (
            <Timer className={`w-4 h-4 ${isUrgent ? "text-white" : "text-primary"}`} />
          ) : (
            <Sparkles className="w-4 h-4 text-accent" />
          )}
          <span className={`text-xs sm:text-sm font-medium tracking-wide ${
            isUrgent ? "text-white" : isClosing ? "text-primary" : "text-secondary"
          }`}>
            {getMessage()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {countdown.days > 0 && (
            <>
              <div className={`px-2 py-1 rounded font-mono text-xs sm:text-sm font-bold ${
                isUrgent 
                  ? "bg-white/20 text-white" 
                  : isClosing 
                    ? "bg-primary/20 text-primary"
                    : "bg-accent/20 text-accent"
              }`}>
                {countdown.days}j
              </div>
              <span className={`text-sm font-bold ${isUrgent ? "text-white/60" : isClosing ? "text-primary/60" : "text-accent/60"}`}>:</span>
            </>
          )}
          <div className={`px-2 py-1 rounded font-mono text-xs sm:text-sm font-bold ${
            isUrgent 
              ? "bg-white/20 text-white" 
              : isClosing 
                ? "bg-primary/20 text-primary"
                : "bg-accent/20 text-accent"
          }`}>
            {countdown.hours.toString().padStart(2, "0")}h
          </div>
          <span className={`text-sm font-bold ${isUrgent ? "text-white/60" : isClosing ? "text-primary/60" : "text-accent/60"}`}>:</span>
          <div className={`px-2 py-1 rounded font-mono text-xs sm:text-sm font-bold ${
            isUrgent 
              ? "bg-white/20 text-white" 
              : isClosing 
                ? "bg-primary/20 text-primary"
                : "bg-accent/20 text-accent"
          }`}>
            {countdown.minutes.toString().padStart(2, "0")}m
          </div>
          <span className={`text-sm font-bold ${isUrgent ? "text-white/60" : isClosing ? "text-primary/60" : "text-accent/60"}`}>:</span>
          <div className={`px-2 py-1 rounded font-mono text-xs sm:text-sm font-bold ${
            isUrgent 
              ? "bg-white/20 text-white" 
              : isClosing 
                ? "bg-primary/20 text-primary"
                : "bg-accent/20 text-accent"
          }`}>
            {countdown.seconds.toString().padStart(2, "0")}s
          </div>
        </div>
      </div>
    </div>
  );
}
