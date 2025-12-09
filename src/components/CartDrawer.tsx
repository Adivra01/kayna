import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";
import gsap from "gsap";

const CartDrawer = () => {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(".cart-drawer", 
        { x: "100%" },
        { x: 0, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(".cart-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(".cart-drawer", {
      x: "100%",
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setCartOpen(false),
    });
    gsap.to(".cart-overlay", { opacity: 0, duration: 0.2 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="cart-overlay absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="cart-drawer absolute right-0 top-0 bottom-0 w-full max-w-md bg-primary border-l border-secondary/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-secondary">Panier</h2>
            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-bold rounded-full">
              {items.length}
            </span>
          </div>
          <button onClick={handleClose} className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-secondary/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-secondary/20 mb-4" />
              <p className="text-secondary/60 mb-2">Ton panier est vide</p>
              <button onClick={handleClose} className="text-accent font-medium hover:underline">
                Continuer le shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-secondary/5 rounded-2xl p-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-secondary">{item.title}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-secondary/40 hover:text-accent transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {item.size && <p className="text-xs text-secondary/50">Taille: {item.size}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-secondary font-medium w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-accent">{item.price * item.quantity}€</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-secondary/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary/60">Total</span>
              <span className="text-2xl font-bold text-secondary">{getTotalPrice()}€</span>
            </div>
            <button className="w-full py-4 bg-accent text-primary rounded-full font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all">
              <span>Commander</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={clearCart} className="w-full text-center text-secondary/50 text-sm hover:text-accent transition-colors">
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
