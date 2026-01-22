import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CreditCard, Smartphone, ShieldCheck, Truck, AlertTriangle, Tag, X, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useLocalization } from "@/hooks/useLocalization";
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface Coupon {
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { t, formatPrice, isRTL } = useLocalization();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  
  // Customer info
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  
  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile_money">("card");
  
  // Calculations
  const subtotal = getTotalPrice();
  const shippingCost = 5000; // 5000 FCFA flat
  const discount = appliedCoupon 
    ? appliedCoupon.discount_type === "percentage" 
      ? subtotal * (appliedCoupon.discount_value / 100)
      : appliedCoupon.discount_value
    : 0;
  const total = subtotal + shippingCost - discount;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/shop");
    }
  }, [items, navigate]);

  useEffect(() => {
    // Animate step transitions
    gsap.fromTo(".checkout-step-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const required = ["firstName", "lastName", "email", "phone", "address1", "city", "country", "zip"];
    for (const field of required) {
      if (!customerInfo[field as keyof CustomerInfo]) {
        showToast.error("Veuillez remplir tous les champs obligatoires");
        return false;
      }
    }
    if (!customerInfo.email.includes("@")) {
      showToast.error("Email invalide");
      return false;
    }
    return true;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    setCouponError("");
    
    try {
      const { data, error } = await supabase
        .from("discount_coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();
      
      if (error || !data) {
        setCouponError("Code promo invalide");
        setCouponLoading(false);
        return;
      }
      
      // Check min order amount
      if (data.min_order_amount && subtotal < data.min_order_amount) {
        setCouponError(`Commande minimum: ${formatPrice(data.min_order_amount)}`);
        setCouponLoading(false);
        return;
      }
      
      // Check usage limit
      if (data.max_uses && data.current_uses >= data.max_uses) {
        setCouponError("Ce code a atteint sa limite d'utilisation");
        setCouponLoading(false);
        return;
      }
      
      // Check dates
      const now = new Date();
      if (data.start_date && new Date(data.start_date) > now) {
        setCouponError("Ce code n'est pas encore actif");
        setCouponLoading(false);
        return;
      }
      if (data.end_date && new Date(data.end_date) < now) {
        setCouponError("Ce code a expiré");
        setCouponLoading(false);
        return;
      }
      
      setAppliedCoupon({
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        min_order_amount: data.min_order_amount || 0,
      });
      showToast.success("Code promo appliqué !");
    } catch (err) {
      setCouponError("Erreur lors de la vérification");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    try {
      // Helper: cart item id may include variant suffix (e.g. "<uuid>-L-Noir")
      const extractUuid = (value: string) => {
        const match = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match?.[0] || value;
      };

      const extractVariantFromId = (value: string) => {
        const productId = extractUuid(value);
        const suffix = value.replace(productId, "").replace(/^-/, "");
        if (!suffix) return { size: null as string | null, color: null as string | null };
        const parts = suffix.split("-").filter(Boolean);
        const size = parts[0] || null;
        const color = parts.length > 1 ? parts.slice(1).join("-") : null;
        return { size, color };
      };

      const payload = {
        customer: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone || undefined,
        },
        shipping: {
          address1: customerInfo.address1,
          address2: customerInfo.address2 || undefined,
          city: customerInfo.city,
          state: customerInfo.state || undefined,
          country: customerInfo.country,
          zip: customerInfo.zip,
        },
        items: items.map((item) => {
          const productId = extractUuid(item.id);
          const variant = extractVariantFromId(item.id);

          return {
            product_id: productId,
            product_title: item.title,
            product_image: item.image,
            size: item.size || variant.size || "M",
            color: variant.color || "Default",
            quantity: item.quantity,
            unit_price: item.price,
          };
        }),
        discount_code: appliedCoupon?.code || undefined,
        payment_method: paymentMethod,
      };

      const { data, error } = await supabase.functions.invoke("create-printful-order", {
        body: payload,
      });

      if (error) throw error;
      if (!data?.success || !data?.order?.order_number) {
        throw new Error("Order creation failed");
      }

      showToast.success("Commande créée ! Redirection vers le paiement...");
      
      // TODO: Redirect to payment gateway based on method
      // For now, simulate success
      setTimeout(() => {
        clearCart();
        navigate(`/order-confirmation?order=${data.order.order_number}`);
      }, 2000);

    } catch (error) {
      console.error("Order error:", error);
      showToast.error("Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-12 py-4 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/shop" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t.common.back}</span>
          </Link>
          <Link to="/" className="text-2xl font-bold italic text-foreground">KAYNA</Link>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 mb-8 lg:mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? "bg-accent text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 lg:w-24 h-1 mx-2 rounded-full transition-all ${
                    step > s ? "bg-accent" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="checkout-step-content bg-card rounded-2xl lg:rounded-3xl border border-border p-6 lg:p-8">
                
                {/* Step 1: Customer Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Informations de livraison</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInputChange}
                          placeholder="Jean"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInputChange}
                          placeholder="Dupont"
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          placeholder="jean@email.com"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          placeholder="+223 XX XX XX XX"
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address1">Adresse *</Label>
                      <Input 
                        id="address1"
                        name="address1"
                        value={customerInfo.address1}
                        onChange={handleInputChange}
                        placeholder="123 Rue principale"
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">Complément d'adresse</Label>
                      <Input 
                        id="address2"
                        name="address2"
                        value={customerInfo.address2}
                        onChange={handleInputChange}
                        placeholder="Appartement, étage..."
                        className="bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="city">Ville *</Label>
                        <Input 
                          id="city"
                          name="city"
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          placeholder="Bamako"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Région</Label>
                        <Input 
                          id="state"
                          name="state"
                          value={customerInfo.state}
                          onChange={handleInputChange}
                          placeholder="District"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays *</Label>
                        <Input 
                          id="country"
                          name="country"
                          value={customerInfo.country}
                          onChange={handleInputChange}
                          placeholder="Mali"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">Code postal *</Label>
                        <Input 
                          id="zip"
                          name="zip"
                          value={customerInfo.zip}
                          onChange={handleInputChange}
                          placeholder="00000"
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Coupon */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Code promo</h2>
                    <p className="text-muted-foreground">Avez-vous un code promo ? Entrez-le ci-dessous.</p>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Tag className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-bold text-green-500">{appliedCoupon.code}</p>
                            <p className="text-sm text-green-400">
                              -{appliedCoupon.discount_type === "percentage" 
                                ? `${appliedCoupon.discount_value}%` 
                                : formatPrice(appliedCoupon.discount_value)}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={handleRemoveCoupon}
                          className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <Input 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="CODE PROMO"
                            className="bg-background flex-1"
                          />
                          <Button 
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode}
                            className="bg-accent text-primary hover:bg-accent/90"
                          >
                            {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Appliquer"}
                          </Button>
                        </div>
                        {couponError && (
                          <p className="text-red-400 text-sm">{couponError}</p>
                        )}
                      </div>
                    )}

                    <div className="pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Pas de code ? Vous pouvez passer à l'étape suivante.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Mode de paiement</h2>

                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-500">Vente finale</p>
                        <p className="text-sm text-amber-400">Aucun retour ni remboursement. Vérifiez votre commande avant de payer.</p>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="grid gap-4">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === "card" 
                            ? "border-accent bg-accent/10" 
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === "card" ? "bg-accent text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">Carte bancaire</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("mobile_money")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === "mobile_money" 
                            ? "border-accent bg-accent/10" 
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === "mobile_money" ? "bg-accent text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            <Smartphone className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">Mobile Money</p>
                            <p className="text-sm text-muted-foreground">Orange Money, Wave, etc.</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Security badges */}
                    <div className="flex items-center justify-center gap-6 pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs">Paiement sécurisé</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="w-4 h-4" />
                        <span className="text-xs">Livraison 3-15 jours</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 ? (
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                  ) : (
                    <div />
                  )}
                  
                  {step < 3 ? (
                    <Button onClick={nextStep} className="bg-accent text-primary hover:bg-accent/90">
                      Continuer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmitOrder} 
                      disabled={loading}
                      className="bg-accent text-primary hover:bg-accent/90"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Payer {formatPrice(total)}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl lg:rounded-3xl border border-border p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-4">Récapitulatif</h3>
                
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{item.title}</p>
                        {item.size && <p className="text-xs text-muted-foreground">Taille: {item.size}</p>}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                          <span className="text-sm font-medium text-accent">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-foreground">{formatPrice(shippingCost)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-500">Réduction</span>
                      <span className="text-green-500">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-xl text-accent">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
