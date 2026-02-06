import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Timer, 
  Lock, 
  Unlock, 
  Play, 
  Users,
  Download,
  Calendar,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { showToast } from "@/lib/toast";

interface SiteSettings {
  id: string;
  site_status: "open" | "locked" | "maintenance";
  lock_message: string | null;
  drop_opening_time: string | null;
  drop_end_time: string | null;
  drop_duration_hours: number;
  drop_closing_enabled: boolean;
  drop_closing_duration_hours: number;
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
  full_name: string | null;
  phone: string | null;
  country: string | null;
  subscribed_at: string;
}

type DurationUnit = "hours" | "days";
type DropMode = "opening" | "closing";

export default function AdminDrop() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [dropMode, setDropMode] = useState<DropMode>("opening");
  const [openingDurationValue, setOpeningDurationValue] = useState(30);
  const [openingDurationUnit, setOpeningDurationUnit] = useState<DurationUnit>("days");
  const [closingDurationValue, setClosingDurationValue] = useState(24);
  const [closingDurationUnit, setClosingDurationUnit] = useState<DurationUnit>("hours");
  const [lockPassword, setLockPassword] = useState("");
  const [lockMessage, setLockMessage] = useState("");
  
  // Countdown states
  const [openingCountdown, setOpeningCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [closingCountdown, setClosingCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchAdminSettings();
    fetchSubscribers();
  }, []);

  // Opening countdown timer
  useEffect(() => {
    if (!settings?.drop_opening_time || settings?.site_status !== "locked") {
      setOpeningCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const end = new Date(settings.drop_opening_time!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setOpeningCountdown(null);
        handleAutoOpen();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setOpeningCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings?.drop_opening_time, settings?.site_status]);

  // Closing countdown timer
  useEffect(() => {
    if (!settings?.drop_end_time || settings?.site_status !== "open") {
      setClosingCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const end = new Date(settings.drop_end_time!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setClosingCountdown(null);
        handleAutoClose();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setClosingCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings?.drop_end_time, settings?.site_status]);

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
      setLockMessage(data.lock_message || "La collection exclusive arrive bientôt. Inscrivez-vous pour être parmi les premiers à découvrir nos pièces.");
      
      // Set closing duration
      const closingHours = data.drop_closing_duration_hours || 24;
      if (closingHours >= 24 && closingHours % 24 === 0) {
        setClosingDurationValue(closingHours / 24);
        setClosingDurationUnit("days");
      } else {
        setClosingDurationValue(closingHours);
        setClosingDurationUnit("hours");
      }
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

  const getTotalHours = (value: number, unit: DurationUnit) => {
    return unit === "days" ? value * 24 : value;
  };

  // Schedule shop opening (pre-launch countdown)
  const scheduleOpening = async () => {
    if (!settings) return;
    setSaving(true);

    const totalHours = getTotalHours(openingDurationValue, openingDurationUnit);
    const openingTime = new Date();
    openingTime.setHours(openingTime.getHours() + totalHours);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "locked",
        drop_opening_time: openingTime.toISOString(),
        lock_message: lockMessage,
      })
      .eq("id", settings.id);

    if (error) {
      showToast.error("Erreur lors de la programmation");
    } else {
      const displayDuration = openingDurationUnit === "days" 
        ? `${openingDurationValue} jour${openingDurationValue > 1 ? 's' : ''}`
        : `${openingDurationValue}h`;
      showToast.success(`Ouverture programmée dans ${displayDuration}`);
      fetchSettings();
    }
    setSaving(false);
  };

  // Start closing countdown (drop is live)
  const startClosingCountdown = async () => {
    if (!settings) return;
    setSaving(true);

    const totalHours = getTotalHours(closingDurationValue, closingDurationUnit);
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + totalHours);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "open",
        drop_end_time: endTime.toISOString(),
        drop_opening_time: null,
        shop_just_opened: true,
        drop_closing_duration_hours: totalHours,
      })
      .eq("id", settings.id);

    if (error) {
      showToast.error("Erreur lors du lancement");
    } else {
      const displayDuration = closingDurationUnit === "days" 
        ? `${closingDurationValue} jour${closingDurationValue > 1 ? 's' : ''}`
        : `${closingDurationValue}h`;
      showToast.success(`Boutique ouverte ! Fermeture dans ${displayDuration}`);
      fetchSettings();
    }
    setSaving(false);
  };

  const handleAutoOpen = async () => {
    if (!settings) return;
    
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "open",
        drop_opening_time: null,
        shop_just_opened: true,
      })
      .eq("id", settings.id);

    if (!error) {
      showToast.success("La boutique est maintenant ouverte !");
      fetchSettings();
    }
  };

  const handleAutoClose = async () => {
    if (!settings) return;
    
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "locked",
        drop_end_time: null,
      })
      .eq("id", settings.id);

    if (!error) {
      showToast.info("La boutique est maintenant fermée");
      fetchSettings();
    }
  };

  const cancelSchedule = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "open",
        drop_opening_time: null,
        drop_end_time: null,
        shop_just_opened: false,
      })
      .eq("id", settings.id);

    if (error) {
      showToast.error("Erreur lors de l'annulation");
    } else {
      showToast.success("Programmation annulée — boutique ouverte");
      fetchSettings();
    }
    setSaving(false);
  };

  const manualOpen = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_status: "open",
        drop_opening_time: null,
        shop_just_opened: true,
      })
      .eq("id", settings.id);

    if (error) {
      showToast.error("Erreur lors de l'ouverture");
    } else {
      showToast.success("Boutique ouverte !");
      fetchSettings();
    }
    setSaving(false);
  };

  const manualClose = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
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

    if (error) {
      showToast.error("Erreur lors de la fermeture");
    } else {
      showToast.success("Boutique fermée");
      fetchSettings();
    }
    setSaving(false);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        lock_message: lockMessage,
        drop_closing_duration_hours: getTotalHours(closingDurationValue, closingDurationUnit),
      })
      .eq("id", settings.id);

    if (adminSettings) {
      await (supabase as any)
        .from("admin_settings")
        .update({ lock_password: lockPassword || null })
        .eq("id", adminSettings.id);
    }

    if (error) {
      showToast.error("Erreur lors de la sauvegarde");
    } else {
      showToast.success("Paramètres sauvegardés");
    }
    setSaving(false);
  };

  const exportSubscribers = () => {
    const csvContent = [
      ["Nom", "Email", "Téléphone", "Pays", "Date d'inscription"],
      ...subscribers.map(s => [
        s.full_name || "",
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

  const formatCountdown = (c: { days: number; hours: number; minutes: number; seconds: number }) => {
    if (c.days > 0) {
      return `${c.days}j ${c.hours}h ${c.minutes}m`;
    }
    return `${c.hours}h ${c.minutes}m ${c.seconds}s`;
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

  const isLocked = settings?.site_status === "locked";
  const isOpen = settings?.site_status === "open";
  const hasOpeningSchedule = !!settings?.drop_opening_time && isLocked;
  const hasClosingSchedule = !!settings?.drop_end_time && isOpen;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Gestion des Drops</h1>
          <p className="text-secondary/60">Programmez l'ouverture et la fermeture de la boutique</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current Status */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-bold text-secondary">Statut de la boutique</h2>
            </div>

            <div className={`p-4 rounded-xl mb-6 ${
              isLocked 
                ? "bg-orange-500/10 border border-orange-500/20" 
                : "bg-green-500/10 border border-green-500/20"
            }`}>
              <div className="flex items-center gap-3">
                {isLocked ? (
                  <Lock className="w-6 h-6 text-orange-400" />
                ) : (
                  <Unlock className="w-6 h-6 text-green-400" />
                )}
                <div>
                  <p className={`text-lg font-bold ${isLocked ? "text-orange-400" : "text-green-400"}`}>
                    {isLocked ? "Boutique fermée" : "Boutique ouverte"}
                  </p>
                  {hasOpeningSchedule && openingCountdown && (
                    <p className="text-secondary/70 text-sm mt-1">
                      Ouverture dans : <span className="font-mono text-accent">{formatCountdown(openingCountdown)}</span>
                    </p>
                  )}
                  {hasClosingSchedule && closingCountdown && (
                    <p className="text-secondary/70 text-sm mt-1">
                      Fermeture dans : <span className="font-mono text-accent">{formatCountdown(closingCountdown)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Opening Countdown Display */}
            {hasOpeningSchedule && openingCountdown && (
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-secondary/60 text-sm uppercase tracking-wider">La boutique ouvre dans</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {openingCountdown.days > 0 && (
                    <>
                      <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                        <span className="text-3xl font-bold text-accent">{openingCountdown.days.toString().padStart(2, "0")}</span>
                        <p className="text-xs text-secondary/50">JOURS</p>
                      </div>
                      <span className="text-2xl text-accent/50">:</span>
                    </>
                  )}
                  <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="text-3xl font-bold text-accent">{openingCountdown.hours.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">HEURES</p>
                  </div>
                  <span className="text-2xl text-accent/50">:</span>
                  <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="text-3xl font-bold text-accent">{openingCountdown.minutes.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">MIN</p>
                  </div>
                  <span className="text-2xl text-accent/50">:</span>
                  <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="text-3xl font-bold text-accent">{openingCountdown.seconds.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">SEC</p>
                  </div>
                </div>
              </div>
            )}

            {/* Closing Countdown Display */}
            {hasClosingSchedule && closingCountdown && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="w-5 h-5 text-red-400" />
                  <span className="text-secondary/60 text-sm uppercase tracking-wider">La boutique ferme dans</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {closingCountdown.days > 0 && (
                    <>
                      <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                        <span className="text-3xl font-bold text-red-400">{closingCountdown.days.toString().padStart(2, "0")}</span>
                        <p className="text-xs text-secondary/50">JOURS</p>
                      </div>
                      <span className="text-2xl text-red-400/50">:</span>
                    </>
                  )}
                  <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="text-3xl font-bold text-red-400">{closingCountdown.hours.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">HEURES</p>
                  </div>
                  <span className="text-2xl text-red-400/50">:</span>
                  <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="text-3xl font-bold text-red-400">{closingCountdown.minutes.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">MIN</p>
                  </div>
                  <span className="text-2xl text-red-400/50">:</span>
                  <div className="bg-primary px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="text-3xl font-bold text-red-400">{closingCountdown.seconds.toString().padStart(2, "0")}</span>
                    <p className="text-xs text-secondary/50">SEC</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              {isLocked && !hasOpeningSchedule && (
                <button
                  onClick={manualOpen}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  <Unlock className="w-5 h-5" />
                  <span>Ouvrir maintenant</span>
                </button>
              )}

              {(hasOpeningSchedule || hasClosingSchedule) && (
                <button
                  onClick={cancelSchedule}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Annuler la programmation</span>
                </button>
              )}

              {isOpen && !hasClosingSchedule && (
                <button
                  onClick={manualClose}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-red-500/30 text-red-400 rounded-xl font-bold hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  <span>Fermer manuellement</span>
                </button>
              )}
            </div>
          </div>

          {/* Drop Configuration */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Timer className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-bold text-secondary">Programmer un Drop</h2>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setDropMode("opening")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  dropMode === "opening"
                    ? "bg-accent text-primary"
                    : "bg-secondary/10 text-secondary/70 hover:bg-secondary/20"
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Pré-lancement
              </button>
              <button
                onClick={() => setDropMode("closing")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  dropMode === "closing"
                    ? "bg-accent text-primary"
                    : "bg-secondary/10 text-secondary/70 hover:bg-secondary/20"
                }`}
              >
                <Timer className="w-4 h-4 inline mr-2" />
                Fermeture auto
              </button>
            </div>

            {dropMode === "opening" ? (
              <div className="space-y-5">
                <p className="text-secondary/60 text-sm">
                  Programmez l'ouverture de la boutique. Pendant ce temps, les visiteurs voient un compte à rebours et peuvent s'inscrire à la liste d'attente.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    La boutique ouvre dans
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={openingDurationValue}
                      onChange={(e) => setOpeningDurationValue(parseInt(e.target.value) || 1)}
                      min={1}
                      max={openingDurationUnit === "days" ? 365 : 720}
                      className="flex-1 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    />
                    <select
                      value={openingDurationUnit}
                      onChange={(e) => setOpeningDurationUnit(e.target.value as DurationUnit)}
                      className="px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    >
                      <option value="hours">Heures</option>
                      <option value="days">Jours</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={scheduleOpening}
                  disabled={saving || isOpen}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-primary rounded-xl font-bold shadow-gold hover:shadow-gold-glow transition-all disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  <span>Programmer l'ouverture</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-secondary/60 text-sm">
                  Ouvrez la boutique avec un compte à rebours de fermeture automatique. Idéal pour les éditions limitées.
                </p>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    La boutique reste ouverte pendant
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={closingDurationValue}
                      onChange={(e) => setClosingDurationValue(parseInt(e.target.value) || 1)}
                      min={1}
                      max={closingDurationUnit === "days" ? 30 : 720}
                      className="flex-1 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    />
                    <select
                      value={closingDurationUnit}
                      onChange={(e) => setClosingDurationUnit(e.target.value as DurationUnit)}
                      className="px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    >
                      <option value="hours">Heures</option>
                      <option value="days">Jours</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={startClosingCountdown}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-primary rounded-xl font-bold shadow-gold hover:shadow-gold-glow transition-all disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  <span>Lancer le drop (ouverture + fermeture auto)</span>
                </button>
              </div>
            )}

            {/* Settings */}
            <div className="border-t border-secondary/10 mt-6 pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Message de la page fermée
                </label>
                <textarea
                  value={lockMessage}
                  onChange={(e) => setLockMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Mot de passe admin (optionnel)
                </label>
                <input
                  type="text"
                  value={lockPassword}
                  onChange={(e) => setLockPassword(e.target.value)}
                  placeholder="Pour accès anticipé"
                  className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent text-sm"
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
                <div>
                  <h2 className="text-lg font-bold text-secondary">Liste d'attente</h2>
                  <p className="text-secondary/60 text-sm">{subscribers.length} inscrit(s)</p>
                </div>
              </div>
              <button
                onClick={exportSubscribers}
                disabled={subscribers.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Exporter CSV</span>
              </button>
            </div>

            {subscribers.length === 0 ? (
              <div className="text-center py-12 text-secondary/50">
                Aucun inscrit pour le moment
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary/10">
                      <th className="text-left py-3 px-4 text-secondary/60 font-medium text-sm">Nom</th>
                      <th className="text-left py-3 px-4 text-secondary/60 font-medium text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-secondary/60 font-medium text-sm">Téléphone</th>
                      <th className="text-left py-3 px-4 text-secondary/60 font-medium text-sm">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.slice(0, 10).map((sub) => (
                      <tr key={sub.id} className="border-b border-secondary/5 hover:bg-secondary/5">
                        <td className="py-3 px-4 text-secondary">{sub.full_name || "-"}</td>
                        <td className="py-3 px-4 text-secondary">{sub.email}</td>
                        <td className="py-3 px-4 text-secondary/70">{sub.phone || "-"}</td>
                        <td className="py-3 px-4 text-secondary/50 text-sm">
                          {new Date(sub.subscribed_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {subscribers.length > 10 && (
                  <p className="text-center text-secondary/50 text-sm mt-4">
                    Et {subscribers.length - 10} autres... Exportez le CSV pour voir la liste complète.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
