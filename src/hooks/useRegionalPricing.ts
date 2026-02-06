import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PricingRegion, Currency, formatRegionPrice, detectProductCategory, getRegionPricing } from "@/lib/i18n/geoPricing";

interface RegionalPriceEntry {
  product_id: string;
  region: string;
  price: number;
  currency: string;
}

// Cache for regional prices (loaded once)
let priceCache: Map<string, RegionalPriceEntry[]> | null = null;
let cachePromise: Promise<void> | null = null;

async function loadPriceCache() {
  if (priceCache) return;
  if (cachePromise) {
    await cachePromise;
    return;
  }

  cachePromise = (async () => {
    const { data, error } = await supabase
      .from("product_regional_prices")
      .select("product_id, region, price, currency");

    if (error) {
      console.error("[RegionalPricing] Failed to load prices:", error);
      priceCache = new Map();
      return;
    }

    const map = new Map<string, RegionalPriceEntry[]>();
    for (const row of (data || [])) {
      const existing = map.get(row.product_id) || [];
      existing.push(row as RegionalPriceEntry);
      map.set(row.product_id, existing);
    }
    priceCache = map;
  })();

  await cachePromise;
}

// Invalidate cache (call after admin saves prices)
export function invalidateRegionalPriceCache() {
  priceCache = null;
  cachePromise = null;
}

export function useRegionalPricing(region: PricingRegion) {
  const [loaded, setLoaded] = useState(!!priceCache);

  useEffect(() => {
    if (!priceCache) {
      loadPriceCache().then(() => setLoaded(true));
    }
  }, []);

  const getProductPrice = useCallback(
    (product: { id?: string; category?: string; title?: string }): { price: number; currency: Currency; formatted: string } => {
      // Try per-product regional price first
      if (product.id && priceCache) {
        const productPrices = priceCache.get(product.id);
        if (productPrices) {
          const regionPrice = productPrices.find((p) => p.region === region);
          if (regionPrice) {
            return {
              price: regionPrice.price,
              currency: regionPrice.currency as Currency,
              formatted: formatRegionPrice(regionPrice.price, regionPrice.currency as Currency),
            };
          }
        }
      }

      // Fallback to category-based pricing
      const productCategory = detectProductCategory(product);
      const regionInfo = getRegionPricing(region);
      const price = regionInfo.prices[productCategory];
      return {
        price,
        currency: regionInfo.currency,
        formatted: formatRegionPrice(price, regionInfo.currency),
      };
    },
    [region, loaded]
  );

  return { getProductPrice, loaded };
}
