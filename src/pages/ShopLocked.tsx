import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Bell, CheckCircle2, ArrowLeft, User, Sparkles } from "lucide-react";
import { showToast } from "@/lib/toast";
import Footer from "@/components/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import SEOHead from "@/components/SEOHead";

interface SiteSettings {
  lock_message: string | null;
  drop_opening_time: string | null;
}

export default function ShopLocked() {
  const { home, t, isRTL } = useLocalization();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSettings();
    
    const channel = supabase
      .channel("shop_settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => fetchSettings())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);




  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("lock_message, drop_opening_time, site_status")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      if (data.site_status === "open") {
        window.location.href = "/shop";
        return;
      }
      setSettings({ lock_message: data.lock_message, drop_opening_time: data.drop_opening_time });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!settings?.drop_opening_time) { setCountdown(null); return; }

    const updateCountdown = () => {
      const diff = new Date(settings.drop_opening_time!).getTime() - Date.now();
      if (diff <= 0) { setCountdown(null); window.location.reload(); return; }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
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
      email, phone: phone || null, full_name: fullName || null,
    });

    if (error) {
      if (error.code === "23505") showToast.info("Vous êtes déjà inscrit !");
      else showToast.error("Erreur lors de l'inscription");
    } else {
      setSubmitted(true);
      showToast.success("Inscription réussie !", { description: "Vous serez notifié de l'ouverture" });
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

  const countdownLabels = { days: "JOURS", hours: "HEURES", minutes: "MIN", seconds: "SEC" };

  return (
    <div className="min-h-screen bg-primary flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title="KAYNA — Ouverture Imminente | Drop Exclusif"
        description="La boutique KAYNA ouvre bientôt. Inscrivez-vous pour être notifié de l'ouverture et accéder en premier à notre collection exclusive."
      />

      {/* Header */}
      <header className="fixed left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-secondary/10" style={{ top: 'var(--banner-height, 0px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-secondary tracking-wider">KAYNA</Link>
          <div className="flex items-center gap-4">
      <Link to="/" className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <Link to="/auth" className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors text-sm font-medium">
              <User className="w-4 h-4" />
              <span>{t.nav.login}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-24 mt-16">
        <div ref={containerRef} className="max-w-xl w-full text-center">
          
          {/* Glowing Icon */}
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 bg-accent/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -inset-4 bg-accent/10 rounded-full blur-2xl" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-accent via-accent/80 to-accent/50 rounded-full flex items-center justify-center shadow-gold">
              <ShoppingBag className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-4 leading-tight">
            Ouverture <span className="text-accent italic">Imminente</span>
          </h1>

          {/* Message */}
          <p className="text-secondary/60 text-lg sm:text-xl mb-10 leading-relaxed max-w-md mx-auto">
            {settings?.lock_message || "La boutique est actuellement fermée. Veuillez vous inscrire sur la liste d'attente, afin d'être notifié"}
          </p>

          {/* Countdown */}
          {countdown && (
            <div ref={countdownRef} className="bg-secondary/5 border border-secondary/10 rounded-3xl p-6 sm:p-10 mb-10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-accent font-bold uppercase text-sm tracking-[0.2em]">
                  LA BOUTIQUE OUVRE DANS
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {countdown.days > 0 && (
                  <>
                    <CountdownBox value={countdown.days} label={countdownLabels.days} />
                    <span className="text-3xl sm:text-4xl text-accent/30 font-light self-start mt-4">:</span>
                  </>
                )}
                <CountdownBox value={countdown.hours} label={countdownLabels.hours} />
                <span className="text-3xl sm:text-4xl text-accent/30 font-light self-start mt-4">:</span>
                <CountdownBox value={countdown.minutes} label={countdownLabels.minutes} />
                <span className="text-3xl sm:text-4xl text-accent/30 font-light self-start mt-4">:</span>
                <CountdownBox value={countdown.seconds} label={countdownLabels.seconds} pulse />
              </div>
            </div>
          )}

          {/* Subscription Form */}
          <div ref={formRef} className="bg-secondary/5 border border-secondary/10 rounded-3xl p-6 sm:p-10">
            {submitted ? (
              <div className="text-center py-6">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                <p className="text-secondary font-bold text-xl mb-2">Merci pour votre inscription !</p>
                <p className="text-secondary/50 text-sm mb-6">
                  Vous recevrez une notification dès l'ouverture de la boutique.
                </p>
                <Link 
                  to="/auth"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-full font-bold hover:shadow-gold hover:scale-105 transition-all"
                >
                  <User className="w-4 h-4" />
                  Créer un compte
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-secondary font-bold text-lg">
                    Rejoignez la liste d'attente
                  </span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-5 py-4 bg-primary border border-secondary/15 rounded-2xl text-secondary placeholder:text-secondary/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email *"
                    required
                    className="w-full px-5 py-4 bg-primary border border-secondary/15 rounded-2xl text-secondary placeholder:text-secondary/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Votre téléphone (optionnel)"
                    className="w-full px-5 py-4 bg-primary border border-secondary/15 rounded-2xl text-secondary placeholder:text-secondary/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !email}
                    className="w-full px-6 py-4 bg-accent text-primary font-bold rounded-2xl hover:shadow-gold hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-[0.98] text-lg"
                  >
                    {submitting ? "Inscription..." : "M'inscrire à la liste d'attente"}
                  </button>
                </form>
                <p className="text-secondary/30 text-xs mt-4">
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

// Countdown box component
function CountdownBox({ value, label }: { value: number; label: string; pulse?: boolean }) {
  return (
    <div className="countdown-box bg-primary rounded-2xl px-5 sm:px-8 py-5 sm:py-7 min-w-[80px] sm:min-w-[110px]">
      <span className="text-4xl sm:text-6xl lg:text-7xl font-bold text-accent block leading-none tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
      <p className="text-[10px] sm:text-xs text-secondary/40 mt-2 uppercase tracking-[0.2em] font-medium">
        {label}
      </p>
    </div>
  );
}
