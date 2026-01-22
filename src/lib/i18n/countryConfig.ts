// Country to language and currency mapping
import { Language } from './translations';
import { CurrencyCode } from './currencies';

export interface CountryConfig {
  language: Language;
  currency: CurrencyCode;
  name: string;
}

// Map country codes to their default language and currency
export const countryConfigs: Record<string, CountryConfig> = {
  // FCFA Zone (West & Central Africa)
  ML: { language: 'fr', currency: 'XOF', name: 'Mali' },
  SN: { language: 'fr', currency: 'XOF', name: 'Sénégal' },
  CI: { language: 'fr', currency: 'XOF', name: 'Côte d\'Ivoire' },
  BF: { language: 'fr', currency: 'XOF', name: 'Burkina Faso' },
  NE: { language: 'fr', currency: 'XOF', name: 'Niger' },
  TG: { language: 'fr', currency: 'XOF', name: 'Togo' },
  BJ: { language: 'fr', currency: 'XOF', name: 'Bénin' },
  GW: { language: 'pt', currency: 'XOF', name: 'Guinée-Bissau' },
  CM: { language: 'fr', currency: 'XOF', name: 'Cameroun' },
  CF: { language: 'fr', currency: 'XOF', name: 'Centrafrique' },
  TD: { language: 'fr', currency: 'XOF', name: 'Tchad' },
  CG: { language: 'fr', currency: 'XOF', name: 'Congo' },
  GA: { language: 'fr', currency: 'XOF', name: 'Gabon' },
  GQ: { language: 'es', currency: 'XOF', name: 'Guinée Équatoriale' },
  
  // French-speaking (non-FCFA)
  FR: { language: 'fr', currency: 'EUR', name: 'France' },
  BE: { language: 'fr', currency: 'EUR', name: 'Belgique' },
  CH: { language: 'fr', currency: 'EUR', name: 'Suisse' },
  LU: { language: 'fr', currency: 'EUR', name: 'Luxembourg' },
  MC: { language: 'fr', currency: 'EUR', name: 'Monaco' },
  CD: { language: 'fr', currency: 'USD', name: 'RD Congo' },
  MG: { language: 'fr', currency: 'EUR', name: 'Madagascar' },
  HT: { language: 'fr', currency: 'USD', name: 'Haïti' },
  
  // English-speaking
  US: { language: 'en', currency: 'USD', name: 'United States' },
  GB: { language: 'en', currency: 'GBP', name: 'United Kingdom' },
  CA: { language: 'en', currency: 'CAD', name: 'Canada' },
  AU: { language: 'en', currency: 'USD', name: 'Australia' },
  IE: { language: 'en', currency: 'EUR', name: 'Ireland' },
  NZ: { language: 'en', currency: 'USD', name: 'New Zealand' },
  NG: { language: 'en', currency: 'NGN', name: 'Nigeria' },
  GH: { language: 'en', currency: 'GHS', name: 'Ghana' },
  KE: { language: 'en', currency: 'KES', name: 'Kenya' },
  ZA: { language: 'en', currency: 'ZAR', name: 'South Africa' },
  
  // Spanish-speaking
  ES: { language: 'es', currency: 'EUR', name: 'España' },
  MX: { language: 'es', currency: 'USD', name: 'México' },
  AR: { language: 'es', currency: 'USD', name: 'Argentina' },
  CO: { language: 'es', currency: 'USD', name: 'Colombia' },
  CL: { language: 'es', currency: 'USD', name: 'Chile' },
  PE: { language: 'es', currency: 'USD', name: 'Perú' },
  VE: { language: 'es', currency: 'USD', name: 'Venezuela' },
  EC: { language: 'es', currency: 'USD', name: 'Ecuador' },
  
  // Portuguese-speaking
  PT: { language: 'pt', currency: 'EUR', name: 'Portugal' },
  BR: { language: 'pt', currency: 'BRL', name: 'Brasil' },
  AO: { language: 'pt', currency: 'USD', name: 'Angola' },
  MZ: { language: 'pt', currency: 'USD', name: 'Mozambique' },
  CV: { language: 'pt', currency: 'EUR', name: 'Cape Verde' },
  
  // Arabic-speaking
  MA: { language: 'ar', currency: 'MAD', name: 'Maroc' },
  DZ: { language: 'ar', currency: 'DZD', name: 'Algérie' },
  TN: { language: 'ar', currency: 'TND', name: 'Tunisie' },
  EG: { language: 'ar', currency: 'EGP', name: 'Égypte' },
  SA: { language: 'ar', currency: 'SAR', name: 'Saudi Arabia' },
  AE: { language: 'ar', currency: 'AED', name: 'UAE' },
  QA: { language: 'ar', currency: 'USD', name: 'Qatar' },
  KW: { language: 'ar', currency: 'USD', name: 'Kuwait' },
  LB: { language: 'ar', currency: 'USD', name: 'Lebanon' },
  JO: { language: 'ar', currency: 'USD', name: 'Jordan' },
  
  // Other European
  DE: { language: 'en', currency: 'EUR', name: 'Germany' },
  IT: { language: 'en', currency: 'EUR', name: 'Italy' },
  NL: { language: 'en', currency: 'EUR', name: 'Netherlands' },
  AT: { language: 'en', currency: 'EUR', name: 'Austria' },
  SE: { language: 'en', currency: 'EUR', name: 'Sweden' },
  NO: { language: 'en', currency: 'EUR', name: 'Norway' },
  DK: { language: 'en', currency: 'EUR', name: 'Denmark' },
  FI: { language: 'en', currency: 'EUR', name: 'Finland' },
  PL: { language: 'en', currency: 'EUR', name: 'Poland' },
};

// Default configuration for unknown countries
export const defaultConfig: CountryConfig = {
  language: 'fr',
  currency: 'XOF',
  name: 'International',
};

// Get config for a country code
export function getCountryConfig(countryCode: string): CountryConfig {
  return countryConfigs[countryCode.toUpperCase()] || defaultConfig;
}
