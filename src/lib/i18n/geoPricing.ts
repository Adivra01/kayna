// Geo-Pricing System - Fixed prices per region (shipping included)
// Prices are in the region's display currency

export type PricingRegion = 
  | 'subsaharan_africa' 
  | 'north_africa' 
  | 'europe' 
  | 'usa_canada' 
  | 'middle_east';

export type ProductCategory = 'tshirt' | 'sweater' | 'hoodie';

// Region-specific pricing (shipping included, no conversion)
export const regionPricing: Record<PricingRegion, {
  currency: 'USD' | 'EUR';
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
  ML: 'subsaharan_africa', // Mali
  SN: 'subsaharan_africa', // Senegal
  CI: 'subsaharan_africa', // Côte d'Ivoire
  BF: 'subsaharan_africa', // Burkina Faso
  NE: 'subsaharan_africa', // Niger
  TG: 'subsaharan_africa', // Togo
  BJ: 'subsaharan_africa', // Benin
  GW: 'subsaharan_africa', // Guinea-Bissau
  CM: 'subsaharan_africa', // Cameroon
  CF: 'subsaharan_africa', // Central African Republic
  TD: 'subsaharan_africa', // Chad
  CG: 'subsaharan_africa', // Congo
  CD: 'subsaharan_africa', // DR Congo
  GA: 'subsaharan_africa', // Gabon
  GQ: 'subsaharan_africa', // Equatorial Guinea
  NG: 'subsaharan_africa', // Nigeria
  GH: 'subsaharan_africa', // Ghana
  KE: 'subsaharan_africa', // Kenya
  ZA: 'subsaharan_africa', // South Africa
  ET: 'subsaharan_africa', // Ethiopia
  UG: 'subsaharan_africa', // Uganda
  TZ: 'subsaharan_africa', // Tanzania
  RW: 'subsaharan_africa', // Rwanda
  AO: 'subsaharan_africa', // Angola
  MZ: 'subsaharan_africa', // Mozambique
  MG: 'subsaharan_africa', // Madagascar
  ZW: 'subsaharan_africa', // Zimbabwe
  ZM: 'subsaharan_africa', // Zambia
  BW: 'subsaharan_africa', // Botswana
  NA: 'subsaharan_africa', // Namibia
  GN: 'subsaharan_africa', // Guinea
  SL: 'subsaharan_africa', // Sierra Leone
  LR: 'subsaharan_africa', // Liberia
  MR: 'subsaharan_africa', // Mauritania
  GM: 'subsaharan_africa', // Gambia
  CV: 'subsaharan_africa', // Cape Verde
  
  // North Africa
  MA: 'north_africa', // Morocco
  DZ: 'north_africa', // Algeria
  TN: 'north_africa', // Tunisia
  LY: 'north_africa', // Libya
  EG: 'north_africa', // Egypt
  
  // Europe
  FR: 'europe', // France
  BE: 'europe', // Belgium
  CH: 'europe', // Switzerland
  LU: 'europe', // Luxembourg
  MC: 'europe', // Monaco
  DE: 'europe', // Germany
  IT: 'europe', // Italy
  ES: 'europe', // Spain
  PT: 'europe', // Portugal
  NL: 'europe', // Netherlands
  AT: 'europe', // Austria
  GB: 'europe', // United Kingdom
  IE: 'europe', // Ireland
  SE: 'europe', // Sweden
  NO: 'europe', // Norway
  DK: 'europe', // Denmark
  FI: 'europe', // Finland
  PL: 'europe', // Poland
  CZ: 'europe', // Czech Republic
  HU: 'europe', // Hungary
  GR: 'europe', // Greece
  RO: 'europe', // Romania
  BG: 'europe', // Bulgaria
  HR: 'europe', // Croatia
  SK: 'europe', // Slovakia
  SI: 'europe', // Slovenia
  
  // USA & Canada
  US: 'usa_canada', // United States
  CA: 'usa_canada', // Canada
  
  // Middle East
  SA: 'middle_east', // Saudi Arabia
  AE: 'middle_east', // UAE
  QA: 'middle_east', // Qatar
  KW: 'middle_east', // Kuwait
  BH: 'middle_east', // Bahrain
  OM: 'middle_east', // Oman
  JO: 'middle_east', // Jordan
  LB: 'middle_east', // Lebanon
  SY: 'middle_east', // Syria
  IQ: 'middle_east', // Iraq
  YE: 'middle_east', // Yemen
  PS: 'middle_east', // Palestine
  IL: 'middle_east', // Israel
  TR: 'middle_east', // Turkey
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
  // Default to tshirt for t-shirts or unknown categories
  return 'tshirt';
}

// Format price with currency symbol
export function formatRegionPrice(price: number, currency: 'USD' | 'EUR'): string {
  if (currency === 'EUR') {
    return `${price} €`;
  }
  return `$${price}`;
}

// Get the display price for a product in a specific region
export function getProductRegionPrice(
  product: { category?: string; title?: string },
  region: PricingRegion
): { price: number; currency: 'USD' | 'EUR'; formatted: string } {
  const productCategory = detectProductCategory(product);
  const regionInfo = getRegionPricing(region);
  const price = regionInfo.prices[productCategory];
  
  return {
    price,
    currency: regionInfo.currency,
    formatted: formatRegionPrice(price, regionInfo.currency),
  };
}

// Map countries to default languages (updated with Arabic priority)
export function getLanguageFromCountry(countryCode: string): 'fr' | 'en' | 'ar' | 'es' | 'pt' {
  const code = countryCode.toUpperCase();
  
  // Arabic-speaking countries
  const arabicCountries = [
    'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'SY', 'IQ', 'YE', 'PS',
    'MA', 'DZ', 'TN', 'LY', 'EG' // North Africa can use Arabic or French
  ];
  
  // French-speaking countries
  const frenchCountries = [
    'FR', 'BE', 'CH', 'LU', 'MC', 'ML', 'SN', 'CI', 'BF', 'NE', 'TG', 'BJ',
    'CM', 'CF', 'TD', 'CG', 'CD', 'GA', 'MG', 'HT', 'GN', 'RW'
  ];
  
  // Spanish-speaking countries
  const spanishCountries = [
    'ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GQ'
  ];
  
  // Portuguese-speaking countries
  const portugueseCountries = [
    'PT', 'BR', 'AO', 'MZ', 'CV', 'GW'
  ];
  
  // Middle East priority: Arabic
  if (arabicCountries.includes(code)) {
    return 'ar';
  }
  
  // French-speaking Africa and Europe
  if (frenchCountries.includes(code)) {
    return 'fr';
  }
  
  // Spanish-speaking countries
  if (spanishCountries.includes(code)) {
    return 'es';
  }
  
  // Portuguese-speaking countries
  if (portugueseCountries.includes(code)) {
    return 'pt';
  }
  
  // Default: English for USA, Canada, UK, and others
  const englishCountries = [
    'US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'NG', 'GH', 'KE', 'ZA', 'ZW', 'ZM', 'BW', 'NA'
  ];
  
  if (englishCountries.includes(code)) {
    return 'en';
  }
  
  // Default fallback: French (for KAYNA's primary market)
  return 'fr';
}
