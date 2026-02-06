import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Timer, ShoppingBag, Bell, CheckCircle2, ArrowLeft, User } from "lucide-react";
import { showToast } from "@/lib/toast";
import gsap from "gsap";
import Footer from "@/components/Footer";

interface SiteSettings {
  lock_message: string | null;
  drop_opening_time: string | null;
}

export default function ShopLocked() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  
  // Form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSettings();
    
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
      .select("lock_message, drop_opening_time, site_status")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      // If shop is now open, redirect
      if (data.site_status === "open") {
        window.location.href = "/shop";
        return;
      }
      setSettings({
        lock_message: data.lock_message,
        drop_opening_time: data.drop_opening_time,
      });
    }
    setLoading(false);
  };

  // Countdown timer for opening
  useEffect(() => {
    if (!settings?.drop_opening_time) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(settings.drop_opening_time!).getTime();
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
  }, [settings?.drop_opening_time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);

    const { error } = await supabase.from("subscribers").insert({
      email,
      phone: phone || null,
      full_name: fullName || null,
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
          scale: 1.02,
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
      {/* Header */}
      <header className="fixed left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-secondary/10" style={{ top: 'var(--banner-height, 0px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-secondary tracking-wider">
            KAYNA
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <Link 
              to="/auth" 
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors text-sm font-medium"
            >
              <User className="w-4 h-4" />
              <span>Connexion</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-24 mt-16">
        <div ref={containerRef} className="max-w-lg w-full text-center">
          {/* Icon */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center shadow-gold">
              <ShoppingBag className="w-14 h-14 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4">
            Ouverture <span className="text-accent">Imminente</span>
          </h1>

          {/* Message */}
          <p className="text-secondary/70 text-lg mb-8 leading-relaxed max-w-md mx-auto">
            {settings?.lock_message || "La collection exclusive arrive bientôt. Inscrivez-vous pour être parmi les premiers à découvrir nos pièces."}
          </p>

          {/* Countdown */}
          {countdown && (
            <div className="bg-secondary/5 border border-secondary/10 rounded-3xl p-6 sm:p-8 mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Timer className="w-5 h-5 text-accent" />
                <span className="text-accent font-semibold uppercase text-sm tracking-wider">
                  La boutique ouvre dans
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {countdown.days > 0 && (
                  <>
                    <div className="bg-primary border border-accent/30 px-4 sm:px-6 py-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
                      <span className="text-3xl sm:text-5xl font-bold text-accent block">
                        {countdown.days.toString().padStart(2, "0")}
                      </span>
                      <p className="text-[10px] sm:text-xs text-secondary/50 mt-1 uppercase tracking-wider">Jours</p>
                    </div>
                    <span className="text-2xl sm:text-3xl text-accent/40">:</span>
                  </>
                )}
                <div className="bg-primary border border-accent/30 px-4 sm:px-6 py-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
                  <span className="text-3xl sm:text-5xl font-bold text-accent block">
                    {countdown.hours.toString().padStart(2, "0")}
                  </span>
                  <p className="text-[10px] sm:text-xs text-secondary/50 mt-1 uppercase tracking-wider">Heures</p>
                </div>
                <span className="text-2xl sm:text-3xl text-accent/40">:</span>
                <div className="bg-primary border border-accent/30 px-4 sm:px-6 py-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
                  <span className="text-3xl sm:text-5xl font-bold text-accent block">
                    {countdown.minutes.toString().padStart(2, "0")}
                  </span>
                  <p className="text-[10px] sm:text-xs text-secondary/50 mt-1 uppercase tracking-wider">Min</p>
                </div>
                <span className="text-2xl sm:text-3xl text-accent/40">:</span>
                <div className="bg-primary border border-accent/30 px-4 sm:px-6 py-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
                  <span className="text-3xl sm:text-5xl font-bold text-accent block">
                    {countdown.seconds.toString().padStart(2, "0")}
                  </span>
                  <p className="text-[10px] sm:text-xs text-secondary/50 mt-1 uppercase tracking-wider">Sec</p>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Form */}
          <div ref={formRef} className="bg-secondary/5 border border-secondary/10 rounded-3xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
                <p className="text-secondary font-semibold text-lg">Merci pour votre inscription !</p>
                <p className="text-secondary/60 text-sm mt-2">
                  Vous recevrez une notification dès l'ouverture de la boutique.
                </p>
                <Link 
                  to="/auth"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent text-primary rounded-full font-bold hover:shadow-gold transition-all"
                >
                  <User className="w-4 h-4" />
                  Créer un compte
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-accent" />
                  <span className="text-secondary font-semibold">
                    Rejoignez la liste d'attente
                  </span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-5 py-4 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email *"
                    required
                    className="w-full px-5 py-4 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Votre téléphone (optionnel)"
                    className="w-full px-5 py-4 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !email}
                    className="w-full px-6 py-4 bg-accent text-primary font-bold rounded-xl hover:shadow-gold transition-all disabled:opacity-50"
                  >
                    {submitting ? "Inscription..." : "M'inscrire à la liste d'attente"}
                  </button>
                </form>
                <p className="text-secondary/40 text-xs mt-4">
                  En vous inscrivant, vous acceptez de recevoir des communications de KAYNA.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
