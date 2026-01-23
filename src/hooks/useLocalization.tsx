import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { translations, Language, Translations } from '@/lib/i18n/translations';
import { 
  PricingRegion, 
  getRegionFromCountry, 
  getRegionPricing, 
  detectProductCategory,
  formatRegionPrice,
  getLanguageFromCountry
} from '@/lib/i18n/geoPricing';

const STORAGE_KEY_LANG = 'kayna_language';
const STORAGE_KEY_COUNTRY = 'kayna_country';
const STORAGE_KEY_REGION = 'kayna_region';
const STORAGE_KEY_GEO_DETECTED = 'kayna_geo_detected';

interface LocalizationContextType {
  language: Language;
  region: PricingRegion;
  country: string;
  countryName: string;
  t: Translations;
  setLanguage: (lang: Language) => void;
  // Price formatting based on region (fixed prices, not conversion)
  formatPrice: (product: { category?: string; title?: string }) => string;
  // Format a raw amount (for totals, cart sums, etc.)
  formatAmount: (amount: number) => string;
  getPrice: (product: { category?: string; title?: string }) => number;
  getCurrency: () => 'USD' | 'EUR';
  isRTL: boolean;
  isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

interface GeoResponse {
  country_code: string;
  country_name: string;
  city?: string;
  region?: string;
}

// Country name mapping
const countryNames: Record<string, string> = {
  ML: 'Mali', SN: 'Sénégal', CI: "Côte d'Ivoire", BF: 'Burkina Faso',
  NE: 'Niger', TG: 'Togo', BJ: 'Bénin', CM: 'Cameroun', CD: 'RD Congo',
  GA: 'Gabon', NG: 'Nigeria', GH: 'Ghana', KE: 'Kenya', ZA: 'Afrique du Sud',
  MA: 'Maroc', DZ: 'Algérie', TN: 'Tunisie', EG: 'Égypte', LY: 'Libye',
  FR: 'France', BE: 'Belgique', CH: 'Suisse', DE: 'Allemagne', IT: 'Italie',
  ES: 'Espagne', PT: 'Portugal', GB: 'United Kingdom', NL: 'Pays-Bas',
  US: 'United States', CA: 'Canada',
  SA: 'Arabie Saoudite', AE: 'Émirats Arabes Unis', QA: 'Qatar', KW: 'Koweït',
  JO: 'Jordanie', LB: 'Liban',
};

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [region, setRegion] = useState<PricingRegion>('subsaharan_africa');
  const [country, setCountryState] = useState<string>('ML');
  const [countryName, setCountryName] = useState<string>('Mali');
  const [isLoading, setIsLoading] = useState(true);

  // Detect user's location via IP
  const detectLocation = useCallback(async () => {
    // Check if we've already detected location this session
    const alreadyDetected = sessionStorage.getItem(STORAGE_KEY_GEO_DETECTED);
    
    // Check for saved preferences first
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    const savedCountry = localStorage.getItem(STORAGE_KEY_COUNTRY);
    const savedRegion = localStorage.getItem(STORAGE_KEY_REGION) as PricingRegion;

    if (savedLang && savedCountry && savedRegion && alreadyDetected) {
      setLanguageState(savedLang);
      setCountryState(savedCountry);
      setRegion(savedRegion);
      setCountryName(countryNames[savedCountry] || 'International');
      setIsLoading(false);
      return;
    }

    try {
      // Use free IP geolocation API
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(5000),
      });
      
      if (!response.ok) throw new Error('Geo API failed');
      
      const data: GeoResponse = await response.json();
      const countryCode = data.country_code || 'ML';
      
      // Get region and language based on country
      const detectedRegion = getRegionFromCountry(countryCode);
      const detectedLanguage = getLanguageFromCountry(countryCode);

      setCountryState(countryCode);
      setCountryName(countryNames[countryCode] || data.country_name || 'International');
      setLanguageState(detectedLanguage);
      setRegion(detectedRegion);

      // Save to localStorage for persistence
      localStorage.setItem(STORAGE_KEY_LANG, detectedLanguage);
      localStorage.setItem(STORAGE_KEY_COUNTRY, countryCode);
      localStorage.setItem(STORAGE_KEY_REGION, detectedRegion);
      sessionStorage.setItem(STORAGE_KEY_GEO_DETECTED, 'true');

      console.log(`[Localization] Detected: ${countryCode} → ${detectedLanguage} / ${detectedRegion}`);
    } catch (error) {
      console.warn('[Localization] Could not detect location, using defaults:', error);
      // Use defaults or saved values
      if (savedLang) setLanguageState(savedLang);
      if (savedCountry) {
        setCountryState(savedCountry);
        setCountryName(countryNames[savedCountry] || 'International');
      }
      if (savedRegion) setRegion(savedRegion);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  // Update language (user can change language, but NOT price/region)
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    
    // Update document direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Get the region-based price for a product (fixed price, NOT conversion)
  const getPrice = useCallback((product: { category?: string; title?: string }): number => {
    const productCategory = detectProductCategory(product);
    const regionInfo = getRegionPricing(region);
    return regionInfo.prices[productCategory];
  }, [region]);

  // Get the current currency for the region
  const getCurrency = useCallback((): 'USD' | 'EUR' => {
    const regionInfo = getRegionPricing(region);
    return regionInfo.currency;
  }, [region]);

  // Format price for display (using fixed regional pricing)
  const formatPriceLocal = useCallback((product: { category?: string; title?: string }): string => {
    const productCategory = detectProductCategory(product);
    const regionInfo = getRegionPricing(region);
    const price = regionInfo.prices[productCategory];
    return formatRegionPrice(price, regionInfo.currency);
  }, [region]);

  // Format a raw amount (for totals, cart sums, shipping costs, etc.)
  const formatAmountLocal = useCallback((amount: number): string => {
    const regionInfo = getRegionPricing(region);
    return formatRegionPrice(amount, regionInfo.currency);
  }, [region]);

  // Check if current language is RTL
  const isRTL = language === 'ar';

  // Get translations
  const t = translations[language];

  // Update document direction on mount
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const value: LocalizationContextType = {
    language,
    region,
    country,
    countryName,
    t,
    setLanguage,
    formatPrice: formatPriceLocal,
    formatAmount: formatAmountLocal,
    getPrice,
    getCurrency,
    isRTL,
    isLoading,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

// Export context for use in React.createElement
export { LocalizationContext };
