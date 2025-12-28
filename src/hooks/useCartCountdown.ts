import { useState, useEffect, useCallback } from "react";
import { useCart } from "./useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CART_TIMER_KEY = "kayna-cart-timer";

export function useCartCountdown() {
  const { items, clearCart } = useCart();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [cartTimeout, setCartTimeout] = useState(10); // Default 10 minutes

  // Fetch cart timeout from settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("cart_timeout_minutes")
        .limit(1)
        .maybeSingle();
      
      if (data?.cart_timeout_minutes) {
        setCartTimeout(data.cart_timeout_minutes);
      }
    };
    fetchSettings();
  }, []);

  // Initialize or reset timer when items change
  useEffect(() => {
    if (items.length === 0) {
      localStorage.removeItem(CART_TIMER_KEY);
      setTimeLeft(null);
      return;
    }

    const storedEndTime = localStorage.getItem(CART_TIMER_KEY);
    
    if (!storedEndTime) {
      // Start new timer
      const endTime = Date.now() + cartTimeout * 60 * 1000;
      localStorage.setItem(CART_TIMER_KEY, endTime.toString());
      setTimeLeft(cartTimeout * 60);
    } else {
      // Check existing timer
      const remaining = Math.floor((parseInt(storedEndTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        // Timer expired
        handleTimeout();
      }
    }
  }, [items.length, cartTimeout]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleTimeout();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleTimeout = useCallback(() => {
    localStorage.removeItem(CART_TIMER_KEY);
    clearCart();
    toast.error("⏰ Temps écoulé ! Votre panier a été réinitialisé.", {
      duration: 5000,
      description: "Ajoutez vos articles à nouveau pour continuer vos achats.",
    });
  }, [clearCart]);

  const resetTimer = useCallback(() => {
    const endTime = Date.now() + cartTimeout * 60 * 1000;
    localStorage.setItem(CART_TIMER_KEY, endTime.toString());
    setTimeLeft(cartTimeout * 60);
  }, [cartTimeout]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    timeLeft,
    formattedTime: timeLeft !== null ? formatTime(timeLeft) : null,
    isExpiring: timeLeft !== null && timeLeft < 120, // Less than 2 minutes
    resetTimer,
  };
}