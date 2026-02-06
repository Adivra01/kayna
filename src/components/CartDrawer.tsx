import { X, Minus, Plus, ShoppingBag, ArrowRight, Timer, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useCartCountdown } from "@/hooks/useCartCountdown";
import { useLocalization } from "@/hooks/useLocalization";
import { useEffect } from "react";
import gsap from "gsap";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { formattedTime, isExpiring } = useCartCountdown();
  const { t, formatAmount, isRTL } = useLocalization();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(".cart-drawer", 
        { x: isRTL ? "-100%" : "100%" },
        { x: 0, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(".cart-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(".cart-item",
        { opacity: 0, x: isRTL ? -20 : 20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [isOpen, isRTL]);

  const handleClose = () => {
    gsap.to(".cart-drawer", {
      x: isRTL ? "-100%" : "100%",
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setCartOpen(false),
    });
    gsap.to(".cart-overlay", { opacity: 0, duration: 0.2 });
  };

  const handleRemoveItem = (id: string) => {
    gsap.to(`[data-item-id="${id}"]`, {
      x: isRTL ? -100 : 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => removeItem(id),
    });
  };

  const handleQuantityChange = (id: string, newQuantity: number, direction: "up" | "down") => {
    const element = document.querySelector(`[data-item-id="${id}"] .quantity-display`);
    if (element) {
      gsap.fromTo(element,
        { scale: 1.3, color: "#C9A86C" },
        { scale: 1, color: "inherit", duration: 0.3, ease: "back.out(1.7)" }
      );
    }
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    handleClose();
    setTimeout(() => {
      navigate("/checkout");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="cart-overlay absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className={`cart-drawer absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-full max-w-md bg-primary border-${isRTL ? 'r' : 'l'} border-secondary/10 flex flex-col`}>
        {/* Header with countdown */}
        <div className="p-6 border-b border-secondary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-secondary">{t.cart.title}</h2>
              <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-bold rounded-full">
                {items.length}
              </span>
            </div>
            <button onClick={handleClose} className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-secondary/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Countdown Timer */}
          {formattedTime && items.length > 0 && (
            <div className={`mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded-xl ${
              isExpiring 
                ? "bg-red-500/10 border border-red-500/30" 
                : "bg-accent/10 border border-accent/30"
            }`}>
              <Timer className={`w-4 h-4 ${isExpiring ? "text-red-400 animate-pulse" : "text-accent"}`} />
              <span className={`text-sm font-medium ${isExpiring ? "text-red-400" : "text-accent"}`}>
                {isExpiring ? "⚡ " : ""}{t.cart.expiresIn}:
              </span>
              <span className={`font-mono font-bold ${isExpiring ? "text-red-400" : "text-accent"}`}>
                {formattedTime}
              </span>
            </div>
          )}

          {/* Shipping included notice */}
          {items.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 py-2 px-4 bg-accent/10 border border-accent/30 rounded-xl">
                <span className="text-accent text-sm font-medium">📦 {t.cart.shippingIncluded}</span>
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-secondary/20 mb-4" />
              <p className="text-secondary/60 mb-2">{t.cart.empty}</p>
              <button onClick={handleClose} className="text-accent font-medium hover:underline">
                {t.common.continue}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                data-item-id={item.id}
                className="cart-item flex gap-4 bg-secondary/5 rounded-2xl p-4 border border-secondary/10 hover:border-accent/20 transition-all"
              >
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-secondary">{item.title}</h3>
                    <button 
                      onClick={() => handleRemoveItem(item.id)} 
                      className="text-secondary/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.size && <p className="text-xs text-secondary/50">{t.product.size}: {item.size}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, "down")}
                        className="w-8 h-8 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="quantity-display text-secondary font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, "up")}
                        className="w-8 h-8 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-accent">{formatAmount(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-secondary/10 space-y-4 bg-secondary/5">
            <div className="flex justify-between items-center">
              <span className="text-secondary/60">{t.cart.total}</span>
              <span className="text-2xl font-bold text-secondary">{formatAmount(getTotalPrice())}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-accent text-primary rounded-full font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              <span>{t.cart.checkout}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={clearCart} className="w-full text-center text-secondary/50 text-sm hover:text-red-400 transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>{t.cart.clear}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;