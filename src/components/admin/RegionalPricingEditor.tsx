import { useState, useEffect } from "react";
import { Globe, DollarSign, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const REGIONS = [
  { key: "subsaharan_africa", label: "Afrique subsaharienne", currency: "USD", symbol: "$" },
  { key: "north_africa", label: "Afrique du Nord", currency: "USD", symbol: "$" },
  { key: "europe", label: "Europe", currency: "EUR", symbol: "€" },
  { key: "uk", label: "Royaume-Uni", currency: "GBP", symbol: "£" },
  { key: "usa_canada", label: "USA / Canada", currency: "USD", symbol: "$" },
  { key: "middle_east", label: "Moyen-Orient", currency: "USD", symbol: "$" },
];

interface RegionalPrice {
  region: string;
  price: string;
  currency: string;
}

interface RegionalPricingEditorProps {
  productId: string | null; // null = new product (save after creation)
  category: string;
}

// Default prices by category (fallback)
const defaultPrices: Record<string, Record<string, number>> = {
  tshirts: {
    subsaharan_africa: 70, north_africa: 85, europe: 95, uk: 80, usa_canada: 105, middle_east: 120,
  },
  hoodies: {
    subsaharan_africa: 85, north_africa: 100, europe: 120, uk: 105, usa_canada: 135, middle_east: 150,
  },
  sweaters: {
    subsaharan_africa: 80, north_africa: 95, europe: 115, uk: 100, usa_canada: 125, middle_east: 140,
  },
};

export default function RegionalPricingEditor({ productId, category }: RegionalPricingEditorProps) {
  const [prices, setPrices] = useState<RegionalPrice[]>(
    REGIONS.map((r) => ({
      region: r.key,
      price: (defaultPrices[category]?.[r.key] || 0).toString(),
      currency: r.currency,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing prices when productId changes
  useEffect(() => {
    if (!productId) return;

    const fetchPrices = async () => {
      const { data, error } = await supabase
        .from("product_regional_prices")
        .select("*")
        .eq("product_id", productId);

      if (error) {
        console.error("Error fetching regional prices:", error);
        return;
      }

      if (data && data.length > 0) {
        // Merge fetched prices with defaults
        const priceMap = new Map(data.map((p: any) => [p.region, p]));
        setPrices(
          REGIONS.map((r) => {
            const existing = priceMap.get(r.key);
            return {
              region: r.key,
              price: existing ? existing.price.toString() : (defaultPrices[category]?.[r.key] || 0).toString(),
              currency: r.currency,
            };
          })
        );
      } else {
        // No prices saved yet, use defaults for category
        setPrices(
          REGIONS.map((r) => ({
            region: r.key,
            price: (defaultPrices[category]?.[r.key] || 0).toString(),
            currency: r.currency,
          }))
        );
      }
    };

    fetchPrices();
  }, [productId, category]);

  // Update defaults when category changes (for new products)
  useEffect(() => {
    if (productId) return; // Only for new products
    setPrices(
      REGIONS.map((r) => ({
        region: r.key,
        price: (defaultPrices[category]?.[r.key] || 0).toString(),
        currency: r.currency,
      }))
    );
  }, [category, productId]);

  const updatePrice = (region: string, value: string) => {
    setPrices((prev) =>
      prev.map((p) => (p.region === region ? { ...p, price: value } : p))
    );
    setSaved(false);
  };

  const savePrices = async () => {
    if (!productId) {
      toast.info("Les prix seront sauvegardés après la création du produit");
      return;
    }

    setLoading(true);
    try {
      // Upsert all regional prices
      const records = prices
        .filter((p) => p.price && parseFloat(p.price) > 0)
        .map((p) => ({
          product_id: productId,
          region: p.region,
          price: parseFloat(p.price),
          currency: p.currency,
        }));

      // Delete existing then insert (upsert)
      await supabase
        .from("product_regional_prices")
        .delete()
        .eq("product_id", productId);

      if (records.length > 0) {
        const { error } = await supabase
          .from("product_regional_prices")
          .insert(records);

        if (error) throw error;
      }

      toast.success("Prix régionaux sauvegardés !");
      setSaved(true);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // Expose prices for external use (save after product creation)
  (RegionalPricingEditor as any).__lastPrices = prices;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-secondary">
          <Globe className="w-4 h-4 text-accent" />
          Prix par région (livraison incluse)
        </label>
        {productId && (
          <button
            type="button"
            onClick={savePrices}
            disabled={loading || saved}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saved
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-accent text-primary hover:scale-105"
            }`}
          >
            <Save className="w-4 h-4" />
            {loading ? "..." : saved ? "Sauvegardé ✓" : "Sauvegarder"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REGIONS.map((region) => {
          const priceData = prices.find((p) => p.region === region.key);
          return (
            <div
              key={region.key}
              className="flex items-center gap-3 p-3 bg-secondary/5 border border-secondary/10 rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs text-secondary/60 block truncate">
                  {region.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={priceData?.price || ""}
                  onChange={(e) => updatePrice(region.key, e.target.value)}
                  className="w-20 px-2 py-1.5 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary text-sm text-right focus:outline-none focus:border-accent"
                  placeholder="0"
                />
                <span className="text-accent font-bold text-sm w-6 text-center">
                  {region.symbol}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!productId && (
        <p className="text-xs text-secondary/40 italic">
          💡 Les prix régionaux seront sauvegardés automatiquement après la création du produit.
        </p>
      )}
    </div>
  );
}

// Helper to save prices externally (after product creation)
export async function saveRegionalPricesForProduct(
  productId: string,
  prices: RegionalPrice[]
) {
  const records = prices
    .filter((p) => p.price && parseFloat(p.price) > 0)
    .map((p) => ({
      product_id: productId,
      region: p.region,
      price: parseFloat(p.price),
      currency: p.currency,
    }));

  if (records.length === 0) return;

  const { error } = await supabase
    .from("product_regional_prices")
    .insert(records);

  if (error) {
    console.error("Error saving regional prices:", error);
    throw error;
  }
}
