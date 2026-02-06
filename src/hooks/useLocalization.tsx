import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { translations, Language, Translations } from '@/lib/i18n/translations';
import { homeTranslations, HomeTranslations } from '@/lib/i18n/homeTranslations';
import { 
  PricingRegion, 
  Currency,
  getRegionFromCountry, 
  getRegionPricing, 
  detectProductCategory,
  formatRegionPrice,
  getLanguageFromCountry
} from '@/lib/i18n/geoPricing';
import { useRegionalPricing } from '@/hooks/useRegionalPricing';
import { getGeoData, type GeoData } from '@/lib/geoCache';

const STORAGE_KEY_LANG = 'kayna_language';
const STORAGE_KEY_COUNTRY = 'kayna_country';
const STORAGE_KEY_REGION = 'kayna_region';

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
  JO: 'Jordanie', LB: 'Liban', TR: 'Turquie', BR: 'Brésil', MX: 'Mexique',
  AU: 'Australie', NZ: 'Nouvelle-Zélande',
};

interface LocalizationContextType {
  language: Language;
  region: PricingRegion;
  country: string;
  countryName: string;
  t: Translations;
  home: HomeTranslations;
  setLanguage: (lang: Language) => void;
  formatPrice: (product: { id?: string; category?: string; title?: string }) => string;
  formatAmount: (amount: number) => string;
  getPrice: (product: { id?: string; category?: string; title?: string }) => number;
  getCurrency: () => Currency;
  isRTL: boolean;
  isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [region, setRegion] = useState<PricingRegion>('subsaharan_africa');
  const [country, setCountryState] = useState<string>('ML');
  const [countryName, setCountryName] = useState<string>('Mali');
  const [isLoading, setIsLoading] = useState(true);

  // Detect user's location using shared geo cache
  const detectLocation = useCallback(async () => {
    // Try saved preferences first
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    const savedCountry = localStorage.getItem(STORAGE_KEY_COUNTRY);
    const savedRegion = localStorage.getItem(STORAGE_KEY_REGION) as PricingRegion;

    if (savedLang && savedCountry && savedRegion) {
      setLanguageState(savedLang);
      setCountryState(savedCountry);
      setRegion(savedRegion);
      setCountryName(countryNames[savedCountry] || 'International');
      setIsLoading(false);
      return;
    }

    try {
      // Use shared geo cache — no redundant API calls
      const geoData = await getGeoData();
      
      if (!geoData) throw new Error('Geo detection failed');
      
      const countryCode = geoData.country_code || 'ML';
      const detectedRegion = getRegionFromCountry(countryCode);
      const detectedLanguage = getLanguageFromCountry(countryCode);

      setCountryState(countryCode);
      setCountryName(countryNames[countryCode] || geoData.country_name || 'International');
      setLanguageState(detectedLanguage);
      setRegion(detectedRegion);

      localStorage.setItem(STORAGE_KEY_LANG, detectedLanguage);
      localStorage.setItem(STORAGE_KEY_COUNTRY, countryCode);
      localStorage.setItem(STORAGE_KEY_REGION, detectedRegion);

      console.log(`[Localization] Detected: ${countryCode} → lang=${detectedLanguage}, region=${detectedRegion}`);
    } catch (error) {
      console.warn('[Localization] Could not detect location, using defaults:', error);
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

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Regional pricing hook (per-product prices from DB)
  const { getProductPrice } = useRegionalPricing(region);

  const getPrice = useCallback((product: { id?: string; category?: string; title?: string }): number => {
    return getProductPrice(product).price;
  }, [getProductPrice]);

  const getCurrency = useCallback((): Currency => {
    const regionInfo = getRegionPricing(region);
    return regionInfo.currency;
  }, [region]);

  const formatPriceLocal = useCallback((product: { id?: string; category?: string; title?: string }): string => {
    return getProductPrice(product).formatted;
  }, [getProductPrice]);

  const formatAmountLocal = useCallback((amount: number): string => {
    const regionInfo = getRegionPricing(region);
    return formatRegionPrice(amount, regionInfo.currency);
  }, [region]);

  const isRTL = language === 'ar';
  const t = translations[language];
  const home = homeTranslations[language];

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const value: LocalizationContextType = {
    language,
    region,
    country,
    countryName,
    t,
    home,
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

export { LocalizationContext };
