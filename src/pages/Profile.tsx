import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, Phone, Mail, Lock, Save, Eye, EyeOff, Check, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,12}$/,
    "7-12 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial"
  ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async (userId: string, userEmail: string) => {
      if (!isMounted) return;
      setEmail(userEmail);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", userId)
        .maybeSingle();

      if (!isMounted) return;

      if (profile) {
        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
      } else {
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("full_name, phone")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (isMounted && affiliate) {
          setFullName(affiliate.full_name || "");
          setPhone(affiliate.phone || "");
        }
      }
    };

    // Listen for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        if (event === "SIGNED_OUT") {
          navigate("/auth", { replace: true });
          return;
        }
        if (session?.user) {
          loadProfile(session.user.id, session.user.email || "").catch(console.error);
        }
      }
    );

    // Then check initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (!session?.user) {
          navigate("/auth", { replace: true });
          return;
        }

        await loadProfile(session.user.id, session.user.email || "");
      } catch (error) {
        console.error("Profile init error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      // Force redirect even if signOut event doesn't fire
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
      // Force redirect anyway
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSaveProfile = async () => {
    const validation = profileSchema.safeParse({ fullName, phone });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("user_id", session.user.id);

      if (error) throw error;

      await supabase
        .from("affiliates")
        .update({ full_name: fullName, phone })
        .eq("user_id", session.user.id);

      toast.success("Profil mis à jour !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const validation = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) throw new Error("Non authentifié");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Mot de passe actuel incorrect");
        setSaving(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Mot de passe modifié !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    } finally {
      setSaving(false);
    }
  };

  const passwordChecks = {
    length: newPassword.length >= 7 && newPassword.length <= 12,
    uppercase: /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  const PasswordCheck = ({ valid, label }: { valid: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors ${valid ? 'text-green-500' : 'text-secondary/40'}`}>
      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${valid ? 'bg-green-500 border-green-500' : 'border-secondary/30'}`}>
        {valid && <Check className="w-2 h-2 text-primary" />}
      </div>
      <span>{label}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 lg:px-12 py-4 md:py-5 flex items-center justify-between backdrop-blur-md bg-primary/80 border-b border-secondary/10">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link to="/" className="text-xl md:text-2xl font-bold italic text-secondary">KAYNA</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-6 lg:px-12">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-6 h-6 md:w-7 md:h-7 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-secondary">Mon Profil</h1>
              <p className="text-secondary/60 text-xs md:text-sm truncate">{email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 p-1 bg-secondary/10 rounded-xl mb-6 md:mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2 md:py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm ${
                activeTab === "profile" ? "bg-accent text-primary" : "text-secondary/60 hover:text-secondary"
              }`}
            >
              <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Informations
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-2 md:py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm ${
                activeTab === "password" ? "bg-accent text-primary" : "text-secondary/60 hover:text-secondary"
              }`}
            >
              <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Mot de passe
            </button>
          </div>

          {activeTab === "profile" ? (
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-secondary mb-2">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-secondary mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-secondary/5 border border-secondary/10 rounded-xl text-secondary/50 cursor-not-allowed text-sm md:text-base"
                  />
                </div>
                <p className="text-[10px] md:text-xs text-secondary/40 mt-1">L'email ne peut pas être modifié</p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-secondary mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full py-3 md:py-4 bg-accent text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 text-sm md:text-base"
              >
                {saving ? (
                  <span>Enregistrement...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Enregistrer</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-secondary mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 md:pl-11 pr-10 md:pr-12 py-2.5 md:py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-secondary mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 md:pl-11 pr-10 md:pr-12 py-2.5 md:py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {newPassword.length > 0 && (
                  <div className="mt-3 p-2.5 md:p-3 bg-secondary/5 rounded-lg space-y-1.5 md:space-y-2">
                    <PasswordCheck valid={passwordChecks.length} label="7 à 12 caractères" />
                    <PasswordCheck valid={passwordChecks.uppercase} label="1 lettre majuscule" />
                    <PasswordCheck valid={passwordChecks.number} label="1 chiffre" />
                    <PasswordCheck valid={passwordChecks.special} label="1 caractère spécial (!@#$...)" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-secondary mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 md:pl-11 pr-10 md:pr-12 py-2.5 md:py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-[10px] md:text-xs mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving || !Object.values(passwordChecks).every(Boolean) || newPassword !== confirmPassword}
                className="w-full py-3 md:py-4 bg-accent text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {saving ? (
                  <span>Modification...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Changer le mot de passe</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full mt-6 py-3 md:py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all disabled:opacity-50 text-sm md:text-base"
          >
            {loggingOut ? (
              <span>Déconnexion...</span>
            ) : (
              <>
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                <span>Se déconnecter</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
