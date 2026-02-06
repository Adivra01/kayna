import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Tag, Percent, DollarSign, Calendar, Package, Search, Copy, BarChart3, Users, Clock, CheckCircle2, XCircle } from "lucide-react";
import { showToast } from "@/lib/toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  scope: "all" | "specific";
  product_ids: string[];
  max_uses: number | null;
  current_uses: number;
  start_date: string | null;
  end_date: string | null;
  min_order_amount: number;
  is_active: boolean;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "expired">("all");
  
  // Form state
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [scope, setScope] = useState<"all" | "specific">("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [maxUses, setMaxUses] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const fetchCoupons = async () => {
    const { data, error } = await (supabase as any)
      .from("discount_coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching coupons:", error);
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("id, title")
      .eq("is_active", true)
      .order("title");

    setProducts(data || []);
  };

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("");
    setScope("all");
    setSelectedProducts([]);
    setMaxUses("");
    setStartDate("");
    setEndDate("");
    setMinOrderAmount("");
    setIsActive(true);
    setEditingCoupon(null);
  };

  const openForm = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCode(coupon.code);
      setDescription(coupon.description || "");
      setDiscountType(coupon.discount_type);
      setDiscountValue(coupon.discount_value.toString());
      setScope(coupon.scope);
      setSelectedProducts(coupon.product_ids || []);
      setMaxUses(coupon.max_uses?.toString() || "");
      setStartDate(coupon.start_date ? coupon.start_date.split("T")[0] : "");
      setEndDate(coupon.end_date ? coupon.end_date.split("T")[0] : "");
      setMinOrderAmount(coupon.min_order_amount?.toString() || "0");
      setIsActive(coupon.is_active);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const couponData = {
      code: code.toUpperCase().trim(),
      description: description || null,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      scope,
      product_ids: scope === "specific" ? selectedProducts : [],
      max_uses: maxUses ? parseInt(maxUses) : null,
      start_date: startDate || null,
      end_date: endDate || null,
      min_order_amount: parseFloat(minOrderAmount) || 0,
      is_active: isActive,
    };

    try {
      if (editingCoupon) {
        const { error } = await (supabase as any)
          .from("discount_coupons")
          .update(couponData)
          .eq("id", editingCoupon.id);

        if (error) throw error;
        showToast.success("Coupon mis à jour");
      } else {
        const { error } = await (supabase as any)
          .from("discount_coupons")
          .insert(couponData);

        if (error) throw error;
        showToast.success("Coupon créé");
      }

      setShowForm(false);
      resetForm();
      fetchCoupons();
    } catch (error: any) {
      showToast.error(error.message || "Erreur lors de la sauvegarde");
    }
    setSaving(false);
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Supprimer ce coupon ?")) return;

    const { error } = await (supabase as any)
      .from("discount_coupons")
      .delete()
      .eq("id", id);

    if (error) {
      showToast.error("Erreur lors de la suppression");
    } else {
      showToast.success("Coupon supprimé");
      fetchCoupons();
    }
  };

  const toggleCouponActive = async (coupon: Coupon) => {
    const { error } = await (supabase as any)
      .from("discount_coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);

    if (error) {
      showToast.error("Erreur");
    } else {
      fetchCoupons();
    }
  };

  const copyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    showToast.success(`Code "${couponCode}" copié !`);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "KAYNA";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  // Coupon status helpers
  const isCouponExpired = (coupon: Coupon) => {
    if (!coupon.end_date) return false;
    return new Date(coupon.end_date) < new Date();
  };

  const isCouponMaxed = (coupon: Coupon) => {
    if (!coupon.max_uses) return false;
    return coupon.current_uses >= coupon.max_uses;
  };

  const getCouponStatus = (coupon: Coupon): { label: string; color: string; icon: typeof CheckCircle2 } => {
    if (isCouponExpired(coupon)) return { label: "Expiré", color: "text-secondary/50 bg-secondary/10", icon: Clock };
    if (isCouponMaxed(coupon)) return { label: "Épuisé", color: "text-orange-400 bg-orange-500/10", icon: XCircle };
    if (!coupon.is_active) return { label: "Inactif", color: "text-red-400 bg-red-500/10", icon: XCircle };
    return { label: "Actif", color: "text-green-400 bg-green-500/10", icon: CheckCircle2 };
  };

  // Filter logic
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filterStatus) {
      case "active":
        return coupon.is_active && !isCouponExpired(coupon) && !isCouponMaxed(coupon);
      case "inactive":
        return !coupon.is_active;
      case "expired":
        return isCouponExpired(coupon) || isCouponMaxed(coupon);
      default:
        return true;
    }
  });

  // Stats
  const activeCoupons = coupons.filter(c => c.is_active && !isCouponExpired(c) && !isCouponMaxed(c));
  const totalUses = coupons.reduce((sum, c) => sum + c.current_uses, 0);
  const expiredCoupons = coupons.filter(c => isCouponExpired(c) || isCouponMaxed(c));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Coupons de réduction</h1>
            <p className="text-secondary/60">Gérer les codes promo et réductions</p>
          </div>
          <Button onClick={() => openForm()} className="gap-2 bg-accent text-primary hover:bg-accent/90">
            <Plus className="w-4 h-4" />
            Nouveau coupon
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-accent" />
              </div>
              <span className="text-2xl font-bold text-secondary">{coupons.length}</span>
            </div>
            <p className="text-secondary/50 text-sm">Total coupons</p>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-secondary">{activeCoupons.length}</span>
            </div>
            <p className="text-secondary/50 text-sm">Actifs</p>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-secondary">{totalUses}</span>
            </div>
            <p className="text-secondary/50 text-sm">Utilisations totales</p>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-secondary">{expiredCoupons.length}</span>
            </div>
            <p className="text-secondary/50 text-sm">Expirés / Épuisés</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un coupon..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive", "expired"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? "bg-accent text-primary"
                    : "bg-secondary/10 text-secondary/60 hover:bg-secondary/20"
                }`}
              >
                {status === "all" ? "Tous" : status === "active" ? "Actifs" : status === "inactive" ? "Inactifs" : "Expirés"}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons List */}
        {loading ? (
          <div className="text-center py-12 text-secondary/60">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
            Chargement...
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-secondary/20 rounded-2xl bg-secondary/5">
            <Tag className="w-16 h-16 mx-auto text-secondary/20 mb-4" />
            <p className="text-secondary/60 text-lg mb-2">
              {searchQuery || filterStatus !== "all" ? "Aucun coupon trouvé" : "Aucun coupon créé"}
            </p>
            <p className="text-secondary/40 text-sm mb-6">
              {searchQuery || filterStatus !== "all" ? "Essayez avec d'autres filtres" : "Créez votre premier code promo"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button onClick={() => openForm()} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Créer un coupon
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCoupons.map((coupon) => {
              const status = getCouponStatus(coupon);
              const StatusIcon = status.icon;
              const usagePercent = coupon.max_uses 
                ? Math.min((coupon.current_uses / coupon.max_uses) * 100, 100) 
                : null;

              return (
                <div
                  key={coupon.id}
                  className={`rounded-2xl border transition-all hover:border-accent/20 ${
                    coupon.is_active && !isCouponExpired(coupon) 
                      ? "border-secondary/15 bg-secondary/5" 
                      : "border-secondary/10 bg-secondary/[0.03] opacity-75"
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Code + Discount */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          {/* Code badge */}
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="group flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/30 hover:bg-accent/20 rounded-lg transition-all"
                          >
                            <span className="font-mono font-bold text-accent text-sm tracking-wider">{coupon.code}</span>
                            <Copy className="w-3 h-3 text-accent/60 group-hover:text-accent transition-colors" />
                          </button>

                          {/* Discount pill */}
                          <span className="flex items-center gap-1 px-3 py-1 bg-secondary/10 rounded-lg text-sm font-semibold text-secondary">
                            {coupon.discount_type === "percentage" ? (
                              <><Percent className="w-3.5 h-3.5 text-accent" />{coupon.discount_value}%</>
                            ) : (
                              <><DollarSign className="w-3.5 h-3.5 text-accent" />{coupon.discount_value}€</>
                            )}
                          </span>

                          {/* Status */}
                          <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>

                        {coupon.description && (
                          <p className="text-sm text-secondary/60 mb-3">{coupon.description}</p>
                        )}

                        {/* Info tags */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-secondary/50">
                          <span className="flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5" />
                            {coupon.scope === "all" ? "Tout le site" : `${coupon.product_ids?.length || 0} produit(s)`}
                          </span>
                          
                          {coupon.max_uses && (
                            <span className="flex items-center gap-1.5">
                              <BarChart3 className="w-3.5 h-3.5" />
                              {coupon.current_uses}/{coupon.max_uses} utilisations
                            </span>
                          )}

                          {(coupon.start_date || coupon.end_date) && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {coupon.start_date && format(new Date(coupon.start_date), "dd MMM yyyy", { locale: fr })}
                              {coupon.start_date && coupon.end_date && " → "}
                              {coupon.end_date && format(new Date(coupon.end_date), "dd MMM yyyy", { locale: fr })}
                            </span>
                          )}

                          {coupon.min_order_amount > 0 && (
                            <span>Min. {coupon.min_order_amount}€</span>
                          )}
                        </div>

                        {/* Usage progress bar */}
                        {usagePercent !== null && (
                          <div className="mt-3 max-w-xs">
                            <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  usagePercent >= 90 ? "bg-red-400" : usagePercent >= 60 ? "bg-orange-400" : "bg-accent"
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Switch
                          checked={coupon.is_active}
                          onCheckedChange={() => toggleCouponActive(coupon)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => openForm(coupon)} className="text-secondary/60 hover:text-accent">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCoupon(coupon.id)} className="text-secondary/60 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Coupon Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingCoupon ? "Modifier le coupon" : "Nouveau coupon"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Code du coupon *</Label>
                <div className="flex gap-2">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="PROMO20"
                    required
                    className="font-mono uppercase flex-1"
                  />
                  <Button type="button" variant="outline" onClick={generateCode} className="px-3 text-xs whitespace-nowrap">
                    Générer
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <span className={`text-sm font-medium ${isActive ? "text-green-400" : "text-secondary/50"}`}>
                    {isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description (interne)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Promo de lancement pour les 50 premiers clients..."
                rows={2}
              />
            </div>

            {/* Discount type + value */}
            <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-secondary flex items-center gap-2">
                <Percent className="w-4 h-4 text-accent" />
                Réduction
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-secondary/60">Type</Label>
                  <Select value={discountType} onValueChange={(v: "percentage" | "fixed") => setDiscountType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-secondary/60">Valeur</Label>
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "20" : "10"}
                    min="0"
                    max={discountType === "percentage" ? "100" : undefined}
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Scope */}
            <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-secondary flex items-center gap-2">
                <Package className="w-4 h-4 text-accent" />
                Application
              </h3>
              <Select value={scope} onValueChange={(v: "all" | "specific") => setScope(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout le site</SelectItem>
                  <SelectItem value="specific">Produits spécifiques</SelectItem>
                </SelectContent>
              </Select>

              {scope === "specific" && (
                <div className="max-h-48 overflow-y-auto border border-secondary/20 rounded-lg p-3 space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-2">
                      <Checkbox
                        id={product.id}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
                          }
                        }}
                      />
                      <label htmlFor={product.id} className="text-sm text-secondary cursor-pointer">
                        {product.title}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Limits */}
            <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-secondary flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent" />
                Limites
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-secondary/60">Nombre max d'utilisations</Label>
                  <Input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="Illimité"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-secondary/60">Commande minimum (€)</Label>
                  <Input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-secondary flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Période de validité
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-secondary/60">Date de début</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-secondary/60">Date de fin</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving} className="bg-accent text-primary hover:bg-accent/90">
                {saving ? "Enregistrement..." : editingCoupon ? "Mettre à jour" : "Créer le coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
