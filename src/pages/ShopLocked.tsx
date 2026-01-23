import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Lock, ShoppingBag, Bell, CheckCircle2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import gsap from "gsap";
import Footer from "@/components/Footer";

interface SiteSettings {
  lock_message: string | null;
  drop_end_time: string | null;
}

export default function ShopLocked() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  
  // Form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSettings();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel("shop_settings_changes")
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

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [loading]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("lock_message, drop_end_time")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  };

  // Countdown timer
  useEffect(() => {
    if (!settings?.drop_end_time) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(settings.drop_end_time!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown(null);
        // Reload to check if shop is open
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
  }, [settings?.drop_end_time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);

    const { error } = await supabase.from("subscribers").insert({
      email,
      phone: phone || null,
    });

    if (error) {
      if (error.code === "23505") {
        showToast.info("Vous êtes déjà inscrit !");
      } else {
        showToast.error("Erreur lors de l'inscription");
      }
    } else {
      setSubmitted(true);
      showToast.success("Inscription réussie !", { description: "Vous serez notifié de l'ouverture" });
      
      if (formRef.current) {
        gsap.to(formRef.current, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div ref={containerRef} className="max-w-lg w-full text-center">
          {/* Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-primary" />
              <Lock className="absolute -bottom-1 -right-1 w-8 h-8 text-primary bg-accent rounded-full p-1.5" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
            Boutique Fermée
          </h1>

          {/* Message */}
          <p className="text-secondary/70 text-lg mb-8 leading-relaxed">
            {settings?.lock_message || "La boutique est actuellement fermée. Inscrivez-vous pour être notifié de la prochaine ouverture."}
          </p>

          {/* Countdown */}
          {countdown && (
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-accent" />
                <span className="text-accent font-semibold uppercase text-sm tracking-wider">
                  Ouverture dans
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {countdown.days > 0 && (
                  <>
                    <div className="bg-primary border border-accent/30 px-3 sm:px-4 py-3 rounded-xl">
                      <span className="text-2xl sm:text-4xl font-bold text-accent">
                        {countdown.days.toString().padStart(2, "0")}
                      </span>
                      <p className="text-[10px] sm:text-xs text-secondary/50 mt-1">JOURS</p>
                    </div>
                    <span className="text-2xl text-accent">:</span>
                  </>
                )}
                <div className="bg-primary border border-accent/30 px-3 sm:px-4 py-3 rounded-xl">
                  <span className="text-2xl sm:text-4xl font-bold text-accent">
                    {countdown.hours.toString().padStart(2, "0")}
                  </span>
                  <p className="text-[10px] sm:text-xs text-secondary/50 mt-1">HEURES</p>
                </div>
                <span className="text-2xl text-accent">:</span>
                <div className="bg-primary border border-accent/30 px-3 sm:px-4 py-3 rounded-xl">
                  <span className="text-2xl sm:text-4xl font-bold text-accent">
                    {countdown.minutes.toString().padStart(2, "0")}
                  </span>
                  <p className="text-[10px] sm:text-xs text-secondary/50 mt-1">MIN</p>
                </div>
                <span className="text-2xl text-accent">:</span>
                <div className="bg-primary border border-accent/30 px-3 sm:px-4 py-3 rounded-xl">
                  <span className="text-2xl sm:text-4xl font-bold text-accent">
                    {countdown.seconds.toString().padStart(2, "0")}
                  </span>
                  <p className="text-[10px] sm:text-xs text-secondary/50 mt-1">SEC</p>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Form */}
          <div ref={formRef} className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-secondary font-medium">Merci pour votre inscription !</p>
                <p className="text-secondary/60 text-sm mt-1">
                  Vous serez notifié dès l'ouverture de la boutique.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-accent" />
                  <span className="text-secondary font-semibold">
                    Soyez notifié de l'ouverture
                  </span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email *"
                    required
                    className="w-full px-4 py-3 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Votre téléphone (optionnel)"
                    className="w-full px-4 py-3 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !email}
                    className="w-full px-6 py-4 bg-accent text-primary font-bold rounded-xl hover:shadow-gold transition-all disabled:opacity-50"
                  >
                    {submitting ? "Inscription..." : "M'inscrire"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
