import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Timer, 
  Lock, 
  Unlock, 
  Play, 
  Pause,
  Users,
  Download,
  AlertTriangle
} from "lucide-react";
import { showToast } from "@/lib/toast";

interface SiteSettings {
  id: string;
  site_status: "open" | "locked" | "maintenance";
  lock_message: string | null;
  drop_end_time: string | null;
  drop_duration_hours: number;
  free_shipping_threshold: number;
  cart_timeout_minutes: number;
}

interface AdminSettings {
  id: string;
  lock_password: string | null;
}

interface Subscriber {
  id: string;
  email: string;
  phone: string | null;
  country: string | null;
  subscribed_at: string;
}

type DurationUnit = "hours" | "days";

export default function AdminDrop() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [dropDurationValue, setDropDurationValue] = useState(24);
  const [dropDurationUnit, setDropDurationUnit] = useState<DurationUnit>("hours");
  const [lockPassword, setLockPassword] = useState("");
  const [lockMessage, setLockMessage] = useState("");
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Compute total hours from value + unit
  const getTotalHours = () => {
    return dropDurationUnit === "days" ? dropDurationValue * 24 : dropDurationValue;
  };

  useEffect(() => {
    fetchSettings();
    fetchAdminSettings();
    fetchSubscribers();
  }, []);

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
        // Auto-lock site when drop ends
        handleLockSite();
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

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      showToast.error("Erreur lors du chargement des paramètres");
      return;
    }

    if (data) {
      setSettings(data as SiteSettings);
      const hours = data.drop_duration_hours || 24;
      // Auto-detect if it's days (divisible by 24 and >= 24)
      if (hours >= 24 && hours % 24 === 0) {
        setDropDurationValue(hours / 24);
        setDropDurationUnit("days");
      } else {
        setDropDurationValue(hours);
        setDropDurationUnit("hours");
      }
      setLockMessage(data.lock_message || "La boutique est actuellement fermée. Inscrivez-vous pour être notifié de la prochaine ouverture.");
    }
    setLoading(false);
  };

  const fetchAdminSettings = async () => {
    const { data } = await (supabase as any)
      .from("admin_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (data) {
      setAdminSettings(data as AdminSettings);
      setLockPassword(data.lock_password || "");
    }
  };

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) {
      showToast.error("Erreur lors du chargement des inscrits");
      return;
    }

    setSubscribers(data || []);
  };

  const startDrop = async () => {
    if (!settings) return;
    setSaving(true);

    const totalHours = getTotalHours();
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + totalHours);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "open",
        drop_end_time: endTime.toISOString(),
        drop_duration_hours: totalHours,
      })
      .eq("id", settings.id);

    const displayDuration = dropDurationUnit === "days" 
      ? `${dropDurationValue} jour${dropDurationValue > 1 ? 's' : ''}`
      : `${dropDurationValue}h`;

    if (error) {
      showToast.error("Erreur lors du lancement du drop");
    } else {
      showToast.success(`Drop lancé !`, { description: `La boutique se verrouillera dans ${displayDuration}` });
      fetchSettings();
    }
    setSaving(false);
  };

  const stopDrop = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        drop_end_time: null,
      })
      .eq("id", settings.id);

    if (error) {
      showToast.error("Erreur lors de l'arrêt du drop");
    } else {
      showToast.success("Drop arrêté");
      fetchSettings();
    }
    setSaving(false);
  };

  const handleLockSite = async () => {
    if (!settings) return;
    setSaving(true);

    // Update site settings
    const { error: settingsError } = await supabase
      .from("site_settings")
      .update({
        site_status: "locked",
        drop_end_time: null,
        lock_message: lockMessage,
      })
      .eq("id", settings.id);

    // Update admin settings (password)
    if (adminSettings && lockPassword) {
      await (supabase as any)
        .from("admin_settings")
        .update({ lock_password: lockPassword || null })
        .eq("id", adminSettings.id);
    }

    if (settingsError) {
      showToast.error("Erreur lors du verrouillage");
    } else {
      showToast.success("Boutique verrouillée");
      fetchSettings();
    }
    setSaving(false);
  };

  const handleUnlockSite = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "open",
      })
      .eq("id", settings.id);

    if (error) {
      showToast.error("Erreur lors du déverrouillage");
    } else {
      showToast.success("Boutique déverrouillée");
      fetchSettings();
    }
    setSaving(false);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);

    // Update site settings
    const { error: settingsError } = await supabase
      .from("site_settings")
      .update({
        drop_duration_hours: getTotalHours(),
        lock_message: lockMessage,
      })
      .eq("id", settings.id);

    // Update admin settings (password)
    if (adminSettings) {
      await (supabase as any)
        .from("admin_settings")
        .update({ lock_password: lockPassword || null })
        .eq("id", adminSettings.id);
    }

    if (settingsError) {
      showToast.error("Erreur lors de la sauvegarde");
    } else {
      showToast.success("Paramètres sauvegardés");
      fetchSettings();
      fetchAdminSettings();
    }
    setSaving(false);
  };

  const exportSubscribers = () => {
    const csvContent = [
      ["Email", "Téléphone", "Pays", "Date d'inscription"],
      ...subscribers.map(s => [
        s.email,
        s.phone || "",
        s.country || "",
        new Date(s.subscribed_at).toLocaleDateString("fr-FR"),
      ]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kayna-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    showToast.success("Export téléchargé");
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
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Drop Time</h1>
          <p className="text-secondary/60">Gérez les drops et le verrouillage de la boutique</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              {settings?.site_status === "locked" ? (
                <Lock className="w-6 h-6 text-red-400" />
              ) : (
                <Unlock className="w-6 h-6 text-green-400" />
              )}
              <h2 className="text-lg font-bold text-secondary">Statut de la boutique</h2>
            </div>

            <div className={`p-4 rounded-xl mb-6 ${
              settings?.site_status === "locked" 
                ? "bg-red-500/10 border border-red-500/20" 
                : "bg-green-500/10 border border-green-500/20"
            }`}>
              <p className={`text-lg font-bold ${
                settings?.site_status === "locked" ? "text-red-400" : "text-green-400"
              }`}>
                {settings?.site_status === "locked" ? "🔒 Boutique verrouillée" : "🟢 Boutique ouverte"}
              </p>
              {countdown && (
                <p className="text-secondary/70 mt-2">
                  Temps restant : {countdown.days > 0 ? `${countdown.days}j ` : ''}{countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </p>
              )}
            </div>

            {/* Countdown Display */}
            {countdown && (
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 mb-6 text-center">
                <Timer className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-secondary/60 text-sm mb-2">BOUTIQUE OUVERTE</p>
                <div className="flex items-center justify-center gap-2">
                  {countdown.days > 0 && (
                    <>
                      <div className="bg-primary px-4 py-3 rounded-lg">
                        <span className="text-3xl font-bold text-accent">{countdown.days.toString().padStart(2, "0")}</span>
                        <p className="text-xs text-secondary/50">JOURS</p>
                      </div>
                      <span className="text-2xl text-accent">:</span>
                    </>
                  )}
                  <div className="bg-primary px-4 py-3 rounded-lg">
                    <span className="text-3xl font-bold text-accent">{countdown.hours.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">HEURES</p>
                  </div>
                  <span className="text-2xl text-accent">:</span>
                  <div className="bg-primary px-4 py-3 rounded-lg">
                    <span className="text-3xl font-bold text-accent">{countdown.minutes.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">MIN</p>
                  </div>
                  <span className="text-2xl text-accent">:</span>
                  <div className="bg-primary px-4 py-3 rounded-lg">
                    <span className="text-3xl font-bold text-accent">{countdown.seconds.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">SEC</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              {settings?.site_status === "locked" ? (
                <button
                  onClick={handleUnlockSite}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  <Unlock className="w-5 h-5" />
                  <span>Déverrouiller la boutique</span>
                </button>
              ) : countdown ? (
                <button
                  onClick={stopDrop}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  <Pause className="w-5 h-5" />
                  <span>Arrêter le drop</span>
                </button>
              ) : (
                <button
                  onClick={startDrop}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-primary rounded-xl font-bold shadow-gold hover:shadow-gold-glow transition-all disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  <span>Lancer un drop ({dropDurationValue} {dropDurationUnit === "days" ? "jour(s)" : "h"})</span>
                </button>
              )}

              {settings?.site_status === "open" && !countdown && (
                <button
                  onClick={handleLockSite}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-red-500/30 text-red-400 rounded-xl font-bold hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  <span>Verrouiller manuellement</span>
                </button>
              )}
            </div>
          </div>

          {/* Drop Settings */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Timer className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-bold text-secondary">Paramètres du drop</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Durée du drop
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={dropDurationValue}
                    onChange={(e) => setDropDurationValue(parseInt(e.target.value) || 1)}
                    min={1}
                    max={dropDurationUnit === "days" ? 365 : 720}
                    className="flex-1 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                  />
                  <select
                    value={dropDurationUnit}
                    onChange={(e) => setDropDurationUnit(e.target.value as DurationUnit)}
                    className="px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                  >
                    <option value="hours">Heures</option>
                    <option value="days">Jours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Mot de passe de verrouillage (optionnel)
                </label>
                <input
                  type="text"
                  value={lockPassword}
                  onChange={(e) => setLockPassword(e.target.value)}
                  placeholder="Laisser vide pour accès sans mot de passe"
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Message de verrouillage
                </label>
                <textarea
                  value={lockMessage}
                  onChange={(e) => setLockMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="w-full px-6 py-3 bg-secondary/20 text-secondary rounded-xl font-medium hover:bg-secondary/30 transition-all disabled:opacity-50"
              >
                Sauvegarder les paramètres
              </button>
            </div>
          </div>

          {/* Subscribers */}
          <div className="lg:col-span-2 bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-accent" />
                <h2 className="text-lg font-bold text-secondary">
                  Inscrits pendant le verrouillage ({subscribers.length})
                </h2>
              </div>
              {subscribers.length > 0 && (
                <button
                  onClick={exportSubscribers}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-xl font-medium hover:shadow-gold transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter</span>
                </button>
              )}
            </div>

            {subscribers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-secondary/20 mx-auto mb-3" />
                <p className="text-secondary/50">Aucun inscrit pour le moment</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary/10">
                      <th className="text-left py-3 px-4 text-secondary/60 text-sm font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-secondary/60 text-sm font-medium">Téléphone</th>
                      <th className="text-left py-3 px-4 text-secondary/60 text-sm font-medium">Pays</th>
                      <th className="text-left py-3 px-4 text-secondary/60 text-sm font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-secondary/5 hover:bg-secondary/5">
                        <td className="py-3 px-4 text-secondary">{subscriber.email}</td>
                        <td className="py-3 px-4 text-secondary/70">{subscriber.phone || "-"}</td>
                        <td className="py-3 px-4 text-secondary/70">{subscriber.country || "-"}</td>
                        <td className="py-3 px-4 text-secondary/50 text-sm">
                          {new Date(subscriber.subscribed_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
