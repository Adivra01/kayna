import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Bell, Mail, Phone, MapPin, User, Sparkles } from "lucide-react";
import { showToast } from "@/lib/toast";
import gsap from "gsap";

interface SiteSettings {
  lock_message: string | null;
}

interface AdminSettings {
  lock_password: string | null;
}

export default function LockedSite() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    fetchSettings();
    
    // Animate on mount
    gsap.fromTo(".lock-container", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
    gsap.fromTo(".lock-icon", 
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.5 }
    );
    gsap.fromTo(".form-field",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.7 }
    );
  }, []);

  const fetchSettings = async () => {
    // Fetch site settings (public)
    const { data: siteData } = await supabase
      .from("site_settings")
      .select("lock_message")
      .limit(1)
      .maybeSingle();

    if (siteData) {
      setSettings(siteData);
    }
    
    // Fetch admin settings (check if password exists - admins only can see actual value)
    const { data: adminData } = await (supabase as any)
      .from("admin_settings")
      .select("lock_password")
      .limit(1)
      .maybeSingle();

    if (adminData) {
      setAdminSettings(adminData);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast.error("L'email est requis");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("subscribers").insert({
      full_name: fullName.trim() || null,
      email: email.trim(),
      phone: phone.trim() || null,
      country: country.trim() || null,
    });

    if (error) {
      if (error.code === "23505") {
        showToast.error("Cet email est déjà inscrit");
      } else {
        showToast.error("Une erreur est survenue");
      }
    } else {
      setSubmitted(true);
      // Success animation
      gsap.to(".form-container", {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.fromTo(".success-container",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
          );
        }
      });
      showToast.success("Inscription réussie !", { description: "Vous serez notifié dès la prochaine ouverture" });
    }
    setSubmitting(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === adminSettings?.lock_password) {
      // Unlock animation
      gsap.to(".lock-container", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => {
          window.location.reload();
        }
      });
    } else {
      showToast.error("Mot de passe incorrect");
      // Shake animation for wrong password
      gsap.fromTo(".password-input", 
        { x: 0 },
        { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(40,45%,60%,0.08)_0%,_transparent_70%)]" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="lock-container max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary tracking-tight">KAYNA</h1>
        </div>

        {/* Lock Icon */}
        <div className="lock-icon flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Lock className="w-10 h-10 text-accent" />
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-secondary/70 mb-8 text-lg">
          {settings?.lock_message || "Le site est actuellement fermé. Inscrivez-vous pour être notifié de la prochaine ouverture."}
        </p>

        {!submitted ? (
          <div className="form-container bg-secondary/5 border border-secondary/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-secondary">Soyez notifié</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-field">
                <label className="block text-sm text-secondary/60 mb-2">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full pl-12 pr-4 py-4 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="block text-sm text-secondary/60 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="block text-sm text-secondary/60 mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 00 00 00 00"
                    className="w-full pl-12 pr-4 py-4 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="block text-sm text-secondary/60 mb-2">Pays</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Côte d'Ivoire"
                    className="w-full pl-12 pr-4 py-4 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="form-field w-full py-4 bg-accent text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    <span>M'inscrire</span>
                  </>
                )}
              </button>
            </form>

            {adminSettings?.lock_password && (
              <div className="mt-6 pt-6 border-t border-secondary/10">
                {!showPasswordInput ? (
                  <button
                    onClick={() => setShowPasswordInput(true)}
                    className="w-full text-center text-secondary/50 text-sm hover:text-accent transition-colors"
                  >
                    J'ai un code d'accès
                  </button>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez le code d'accès"
                      className="password-input w-full px-4 py-3 bg-primary border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-all text-center"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 border border-accent text-accent rounded-xl font-medium hover:bg-accent hover:text-primary transition-all"
                    >
                      Déverrouiller
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="success-container bg-accent/10 border border-accent/30 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">Merci !</h3>
            <p className="text-secondary/70">
              Vous serez notifié dès que le site sera de nouveau accessible.
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-secondary/30 text-sm mt-8">
          © {new Date().getFullYear()} KAYNA. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}