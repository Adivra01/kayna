// Geo-Pricing System - Fixed prices per region (shipping included)
// Prices are in the region's display currency

export type PricingRegion = 
  | 'subsaharan_africa' 
  | 'north_africa' 
  | 'europe' 
  | 'uk'
  | 'usa_canada' 
  | 'middle_east';

export type ProductCategory = 'tshirt' | 'sweater' | 'hoodie';

export type Currency = 'USD' | 'EUR' | 'GBP';

// Region-specific pricing (shipping included, no conversion)
export const regionPricing: Record<PricingRegion, {
  currency: Currency;
  prices: Record<ProductCategory, number>;
}> = {
  subsaharan_africa: {
    currency: 'USD',
    prices: {
      tshirt: 70,
      sweater: 80,
      hoodie: 85,
    },
  },
  north_africa: {
    currency: 'USD',
    prices: {
      tshirt: 85,
      sweater: 95,
      hoodie: 100,
    },
  },
  europe: {
    currency: 'EUR',
    prices: {
      tshirt: 95,
      sweater: 115,
      hoodie: 120,
    },
  },
  uk: {
    currency: 'GBP',
    prices: {
      tshirt: 80,
      sweater: 100,
      hoodie: 105,
    },
  },
  usa_canada: {
    currency: 'USD',
    prices: {
      tshirt: 105,
      sweater: 125,
      hoodie: 135,
    },
  },
  middle_east: {
    currency: 'USD',
    prices: {
      tshirt: 120,
      sweater: 140,
      hoodie: 150,
    },
  },
};

// Map country codes to pricing regions
export const countryToRegion: Record<string, PricingRegion> = {
  // Sub-Saharan Africa (West, Central, East, South)
  ML: 'subsaharan_africa',
  SN: 'subsaharan_africa',
  CI: 'subsaharan_africa',
  BF: 'subsaharan_africa',
  NE: 'subsaharan_africa',
  TG: 'subsaharan_africa',
  BJ: 'subsaharan_africa',
  GW: 'subsaharan_africa',
  CM: 'subsaharan_africa',
  CF: 'subsaharan_africa',
  TD: 'subsaharan_africa',
  CG: 'subsaharan_africa',
  CD: 'subsaharan_africa',
  GA: 'subsaharan_africa',
  GQ: 'subsaharan_africa',
  NG: 'subsaharan_africa',
  GH: 'subsaharan_africa',
  KE: 'subsaharan_africa',
  ZA: 'subsaharan_africa',
  ET: 'subsaharan_africa',
  UG: 'subsaharan_africa',
  TZ: 'subsaharan_africa',
  RW: 'subsaharan_africa',
  AO: 'subsaharan_africa',
  MZ: 'subsaharan_africa',
  MG: 'subsaharan_africa',
  ZW: 'subsaharan_africa',
  ZM: 'subsaharan_africa',
  BW: 'subsaharan_africa',
  NA: 'subsaharan_africa',
  GN: 'subsaharan_africa',
  SL: 'subsaharan_africa',
  LR: 'subsaharan_africa',
  MR: 'subsaharan_africa',
  GM: 'subsaharan_africa',
  CV: 'subsaharan_africa',
  
  // North Africa
  MA: 'north_africa',
  DZ: 'north_africa',
  TN: 'north_africa',
  LY: 'north_africa',
  EG: 'north_africa',
  
  // Europe
  FR: 'europe',
  BE: 'europe',
  CH: 'europe',
  LU: 'europe',
  MC: 'europe',
  DE: 'europe',
  IT: 'europe',
  ES: 'europe',
  PT: 'europe',
  NL: 'europe',
  AT: 'europe',
  IE: 'europe',
  SE: 'europe',
  NO: 'europe',
  DK: 'europe',
  FI: 'europe',
  PL: 'europe',
  CZ: 'europe',
  HU: 'europe',
  GR: 'europe',
  RO: 'europe',
  BG: 'europe',
  HR: 'europe',
  SK: 'europe',
  SI: 'europe',
  
  // UK (separate for GBP)
  GB: 'uk',
  
  // USA & Canada
  US: 'usa_canada',
  CA: 'usa_canada',
  
  // Middle East
  SA: 'middle_east',
  AE: 'middle_east',
  QA: 'middle_east',
  KW: 'middle_east',
  BH: 'middle_east',
  OM: 'middle_east',
  JO: 'middle_east',
  LB: 'middle_east',
  SY: 'middle_east',
  IQ: 'middle_east',
  YE: 'middle_east',
  PS: 'middle_east',
  IL: 'middle_east',
  TR: 'middle_east',
};

// Default region for unknown countries
export const defaultRegion: PricingRegion = 'subsaharan_africa';

// Get region from country code
export function getRegionFromCountry(countryCode: string): PricingRegion {
  return countryToRegion[countryCode.toUpperCase()] || defaultRegion;
}

// Get pricing info for a region
export function getRegionPricing(region: PricingRegion) {
  return regionPricing[region];
}

// Detect product category from product data
export function detectProductCategory(product: { 
  category?: string; 
  title?: string;
}): ProductCategory {
  const category = product.category?.toLowerCase() || '';
  const title = product.title?.toLowerCase() || '';
  
  if (category.includes('hoodie') || title.includes('hoodie')) {
    return 'hoodie';
  }
  if (category.includes('sweater') || category.includes('pull') || 
      title.includes('sweater') || title.includes('pull')) {
    return 'sweater';
  }
  return 'tshirt';
}

// Format price with currency symbol
export function formatRegionPrice(price: number, currency: Currency): string {
  if (currency === 'EUR') {
    return `${price} €`;
  }
  if (currency === 'GBP') {
    return `£${price}`;
  }
  return `$${price}`;
}

// Get the display price for a product in a specific region
export function getProductRegionPrice(
  product: { category?: string; title?: string },
  region: PricingRegion
): { price: number; currency: Currency; formatted: string } {
  const productCategory = detectProductCategory(product);
  const regionInfo = getRegionPricing(region);
  const price = regionInfo.prices[productCategory];
  
  return {
    price,
    currency: regionInfo.currency,
    formatted: formatRegionPrice(price, regionInfo.currency),
  };
}

// Map countries to default languages
export function getLanguageFromCountry(countryCode: string): 'fr' | 'en' | 'ar' | 'es' | 'pt' {
  const code = countryCode.toUpperCase();
  
  const arabicCountries = [
    'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'SY', 'IQ', 'YE', 'PS',
    'MA', 'DZ', 'TN', 'LY', 'EG'
  ];
  
  const frenchCountries = [
    'FR', 'BE', 'CH', 'LU', 'MC', 'ML', 'SN', 'CI', 'BF', 'NE', 'TG', 'BJ',
    'CM', 'CF', 'TD', 'CG', 'CD', 'GA', 'MG', 'HT', 'GN', 'RW'
  ];
  
  const spanishCountries = [
    'ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GQ'
  ];
  
  const portugueseCountries = [
    'PT', 'BR', 'AO', 'MZ', 'CV', 'GW'
  ];
  
  if (arabicCountries.includes(code)) return 'ar';
  if (frenchCountries.includes(code)) return 'fr';
  if (spanishCountries.includes(code)) return 'es';
  if (portugueseCountries.includes(code)) return 'pt';
  
  const englishCountries = [
    'US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'NG', 'GH', 'KE', 'ZA', 'ZW', 'ZM', 'BW', 'NA'
  ];
  
  if (englishCountries.includes(code)) return 'en';
  
  return 'fr';
}
