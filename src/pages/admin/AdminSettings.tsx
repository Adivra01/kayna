import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings, 
  Mail, 
  Lock, 
  Save,
  Eye,
  EyeOff,
  Truck,
  ShoppingCart,
  Gift
} from "lucide-react";
import { toast } from "sonner";

interface SiteSettings {
  id: string;
  free_shipping_threshold: number;
  cart_timeout_minutes: number;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100000);
  const [cartTimeout, setCartTimeout] = useState(10);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast.error("Erreur lors du chargement des paramètres");
      return;
    }

    if (data) {
      setSettings(data);
      setFreeShippingThreshold(data.free_shipping_threshold || 100000);
      setCartTimeout(data.cart_timeout_minutes || 10);
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Mot de passe mis à jour");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Un email de confirmation a été envoyé à votre nouvelle adresse");
      setNewEmail("");
    }
    setSaving(false);
  };

  const saveShopSettings = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        free_shipping_threshold: freeShippingThreshold,
        cart_timeout_minutes: cartTimeout,
      })
      .eq("id", settings.id);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
    } else {
      toast.success("Paramètres sauvegardés");
      fetchSettings();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Paramètres</h1>
          <p className="text-secondary/60">Gérez votre compte et les paramètres du site</p>
        </div>

        <div className="space-y-6">
          {/* Shop Settings */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-bold text-secondary">Paramètres boutique</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary mb-2">
                  <Truck className="w-4 h-4 text-accent" />
                  Seuil de livraison gratuite (FCFA)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-secondary/50 mt-1">
                  Les commandes supérieures à ce montant bénéficient de la livraison gratuite
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary mb-2">
                  <Gift className="w-4 h-4 text-accent" />
                  Timeout panier (minutes)
                </label>
                <input
                  type="number"
                  value={cartTimeout}
                  onChange={(e) => setCartTimeout(parseInt(e.target.value) || 10)}
                  min={1}
                  max={60}
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-secondary/50 mt-1">
                  Le panier se réinitialise automatiquement après ce délai d'inactivité
                </p>
              </div>

              <button
                onClick={saveShopSettings}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </button>
            </div>
          </div>

          {/* Change Email */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-bold text-secondary">Modifier l'email</h2>
            </div>

            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Nouvel email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nouveau@email.com"
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !newEmail}
                className="flex items-center gap-2 px-6 py-3 bg-secondary/20 text-secondary rounded-xl font-medium hover:bg-secondary/30 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Mettre à jour l'email</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-bold text-secondary">Modifier le mot de passe</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-secondary"
                  >
                    {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !newPassword || !confirmPassword}
                className="flex items-center gap-2 px-6 py-3 bg-secondary/20 text-secondary rounded-xl font-medium hover:bg-secondary/30 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Mettre à jour le mot de passe</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
