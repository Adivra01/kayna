import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Sparkles } from "lucide-react";

type BannerMode = "opening" | "closing" | null;

const BANNER_HEIGHT = 40; // px

export default function ShopCountdownBanner() {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [mode, setMode] = useState<BannerMode>(null);
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("site_status, drop_opening_time, drop_end_time")
      .limit(1)
      .maybeSingle();

    if (!data) {
      setMode(null);
      setTargetTimestamp(null);
      return;
    }

    const now = Date.now();

    if (data.site_status === "locked" && data.drop_opening_time) {
      const openTime = new Date(data.drop_opening_time).getTime();
      if (openTime > now) {
        setMode("opening");
        setTargetTimestamp(openTime);
        return;
      }
    }

    if (data.site_status === "open" && data.drop_end_time) {
      const closeTime = new Date(data.drop_end_time).getTime();
      if (closeTime > now) {
        setMode("closing");
        setTargetTimestamp(closeTime);
        return;
      }
    }

    setMode(null);
    setTargetTimestamp(null);
  }, []);

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
  }, [fetchSettings]);

  // Local countdown tick (no DB calls per second)
  useEffect(() => {
    if (!mode || !targetTimestamp) {
      setCountdown(null);
      return;
    }

    const tick = () => {
      const diff = targetTimestamp - Date.now();

      if (diff <= 0) {
        setCountdown(null);
        setMode(null);
        window.location.reload();
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [mode, targetTimestamp]);

  // Set CSS variable for header offset
  useEffect(() => {
    const isActive = mode && countdown;
    document.documentElement.style.setProperty(
      '--banner-height', 
      isActive ? `${BANNER_HEIGHT}px` : '0px'
    );
    return () => {
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, [mode, countdown]);

  if (!mode || !countdown) return null;

  const isClosing = mode === "closing";
  const isUrgent = isClosing && countdown.days === 0 && countdown.hours < 1;

  const message = isClosing
    ? isUrgent
      ? "⚡ La boutique ferme bientôt"
      : "La boutique ferme dans"
    : "La boutique ouvre dans";

  const timeStyle = (base: string) =>
    `px-1.5 sm:px-2 py-0.5 rounded font-mono text-xs sm:text-sm font-bold ${
      isUrgent
        ? "bg-white/20 text-white"
        : isClosing
          ? "bg-primary/20 text-primary"
          : "bg-accent/20 text-accent"
    } ${base}`;

  const sepColor = isUrgent
    ? "text-white/50"
    : isClosing
      ? "text-primary/50"
      : "text-accent/50";

  return (
    <>
      {/* Fixed banner */}
      <div
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 sm:gap-3 px-3 ${
          isUrgent
            ? "bg-gradient-to-r from-red-600 via-red-500 to-orange-500"
            : isClosing
              ? "bg-gradient-to-r from-accent via-accent-light to-accent"
              : "bg-gradient-to-r from-primary via-primary/95 to-primary border-b border-accent/30"
        }`}
        style={{ height: `${BANNER_HEIGHT}px` }}
      >
        {/* Icon */}
        {isClosing ? (
          <Timer className={`w-3.5 h-3.5 flex-shrink-0 ${isUrgent ? "text-white" : "text-primary"}`} />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        )}

        {/* Message */}
        <span
          className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
            isUrgent ? "text-white" : isClosing ? "text-primary" : "text-secondary"
          }`}
        >
          {message}
        </span>

        {/* Countdown digits */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {countdown.days > 0 && (
            <>
              <span className={timeStyle("")}>{countdown.days}j</span>
              <span className={`text-xs font-bold ${sepColor}`}>:</span>
            </>
          )}
          <span className={timeStyle("")}>
            {countdown.hours.toString().padStart(2, "0")}h
          </span>
          <span className={`text-xs font-bold ${sepColor}`}>:</span>
          <span className={timeStyle("")}>
            {countdown.minutes.toString().padStart(2, "0")}m
          </span>
          <span className={`text-xs font-bold ${sepColor}`}>:</span>
          <span className={timeStyle("")}>
            {countdown.seconds.toString().padStart(2, "0")}s
          </span>
        </div>
      </div>

      {/* Spacer to push non-fixed content down */}
      <div style={{ height: `${BANNER_HEIGHT}px` }} />
    </>
  );
}
