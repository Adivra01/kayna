import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";
import gsap from "gsap";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { t, isRTL } = useLocalization();

  useEffect(() => {
    // Celebration animation
    gsap.fromTo(".success-icon",
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
    );
    gsap.fromTo(".success-content > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center max-w-lg">
        {/* Success Icon */}
        <div className="success-icon w-24 h-24 mx-auto mb-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <div className="success-content">
          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Merci pour votre commande !
          </h1>
          
          {/* Order number */}
          {orderNumber && (
            <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <span className="text-accent font-mono font-bold">{orderNumber}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-8">
            Un email de confirmation a été envoyé. Votre commande sera préparée et expédiée sous 24-48h.
          </p>

          {/* Timeline */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-xs text-muted-foreground">Confirmée</span>
              </div>
              <div className="w-8 h-0.5 bg-muted" />
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">En préparation</span>
              </div>
              <div className="w-8 h-0.5 bg-muted" />
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Expédiée</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <p className="text-sm text-muted-foreground mb-8">
            Livraison estimée : <span className="text-foreground font-medium">3 à 15 jours ouvrés</span>
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop"
              className="px-6 py-3 bg-accent text-primary rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-gold transition-all"
            >
              Continuer mes achats
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/"
              className="px-6 py-3 border border-border text-foreground rounded-full font-medium hover:bg-muted transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
