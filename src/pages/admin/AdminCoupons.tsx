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
import { Plus, Edit, Trash2, Tag, Percent, DollarSign, Calendar, Package } from "lucide-react";
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary">Coupons de réduction</h1>
            <p className="text-secondary/60">Gérer les codes promo et réductions</p>
          </div>
          <Button onClick={() => openForm()} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau coupon
          </Button>
        </div>

        {/* Coupons List */}
        {loading ? (
          <div className="text-center py-12 text-secondary/60">Chargement...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-secondary/20 rounded-xl">
            <Tag className="w-12 h-12 mx-auto text-secondary/30 mb-4" />
            <p className="text-secondary/60">Aucun coupon créé</p>
            <Button onClick={() => openForm()} variant="outline" className="mt-4">
              Créer un coupon
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`p-4 rounded-xl border ${
                  coupon.is_active ? "border-secondary/20 bg-secondary/5" : "border-secondary/10 bg-secondary/5 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-accent text-primary font-mono font-bold rounded-lg text-sm">
                        {coupon.code}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        coupon.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {coupon.is_active ? "Actif" : "Inactif"}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-secondary/60">
                        {coupon.discount_type === "percentage" ? (
                          <>
                            <Percent className="w-3 h-3" />
                            {coupon.discount_value}%
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-3 h-3" />
                            {coupon.discount_value}€
                          </>
                        )}
                      </span>
                    </div>

                    {coupon.description && (
                      <p className="text-sm text-secondary/70 mb-2">{coupon.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary/50">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {coupon.scope === "all" ? "Tout le site" : `${coupon.product_ids?.length || 0} produits`}
                      </span>
                      {coupon.max_uses && (
                        <span>
                          Utilisations: {coupon.current_uses}/{coupon.max_uses}
                        </span>
                      )}
                      {coupon.start_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Du {format(new Date(coupon.start_date), "dd/MM/yyyy", { locale: fr })}
                        </span>
                      )}
                      {coupon.end_date && (
                        <span>
                          au {format(new Date(coupon.end_date), "dd/MM/yyyy", { locale: fr })}
                        </span>
                      )}
                      {coupon.min_order_amount > 0 && (
                        <span>Min. {coupon.min_order_amount}€</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={coupon.is_active}
                      onCheckedChange={() => toggleCouponActive(coupon)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openForm(coupon)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCoupon(coupon.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Modifier le coupon" : "Nouveau coupon"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Code du coupon *</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="PROMO20"
                  required
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <span className="text-sm text-secondary/70">
                    {isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description interne du coupon..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de réduction *</Label>
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
                <Label>Valeur *</Label>
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

            <div className="space-y-2">
              <Label>Appliquer à</Label>
              <Select value={scope} onValueChange={(v: "all" | "specific") => setScope(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout le site</SelectItem>
                  <SelectItem value="specific">Produits spécifiques</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scope === "specific" && (
              <div className="space-y-2">
                <Label>Sélectionner les produits</Label>
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
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre max d'utilisations</Label>
                <Input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Illimité"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Montant minimum de commande (€)</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : editingCoupon ? "Mettre à jour" : "Créer le coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}