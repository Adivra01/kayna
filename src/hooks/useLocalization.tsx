import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { translations, Language, Translations } from '@/lib/i18n/translations';
import { CurrencyCode, displayPrice, convertPrice as convertPriceFn } from '@/lib/i18n/currencies';
import { getCountryConfig } from '@/lib/i18n/countryConfig';

const STORAGE_KEY_LANG = 'kayna_language';
const STORAGE_KEY_CURRENCY = 'kayna_currency';
const STORAGE_KEY_COUNTRY = 'kayna_country';
const STORAGE_KEY_GEO_DETECTED = 'kayna_geo_detected';

interface LocalizationContextType {
  language: Language;
  currency: CurrencyCode;
  country: string;
  countryName: string;
  t: Translations;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: CurrencyCode) => void;
  setCountry: (countryCode: string) => void;
  formatPrice: (priceInXOF: number) => string;
  convertPrice: (priceInXOF: number) => number;
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

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [currency, setCurrencyState] = useState<CurrencyCode>('XOF');
  const [country, setCountryState] = useState<string>('ML');
  const [countryName, setCountryName] = useState<string>('Mali');
  const [isLoading, setIsLoading] = useState(true);

  // Detect user's location via IP
  const detectLocation = useCallback(async () => {
    // Check if we've already detected location this session
    const alreadyDetected = sessionStorage.getItem(STORAGE_KEY_GEO_DETECTED);
    
    // Check for saved preferences first
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    const savedCurrency = localStorage.getItem(STORAGE_KEY_CURRENCY) as CurrencyCode;
    const savedCountry = localStorage.getItem(STORAGE_KEY_COUNTRY);

    if (savedLang && savedCurrency && savedCountry && alreadyDetected) {
      setLanguageState(savedLang);
      setCurrencyState(savedCurrency);
      setCountryState(savedCountry);
      const config = getCountryConfig(savedCountry);
      setCountryName(config.name);
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
      const config = getCountryConfig(countryCode);

      setCountryState(countryCode);
      setCountryName(config.name);
      setLanguageState(config.language);
      setCurrencyState(config.currency);

      // Save to localStorage for persistence
      localStorage.setItem(STORAGE_KEY_LANG, config.language);
      localStorage.setItem(STORAGE_KEY_CURRENCY, config.currency);
      localStorage.setItem(STORAGE_KEY_COUNTRY, countryCode);
      sessionStorage.setItem(STORAGE_KEY_GEO_DETECTED, 'true');

      console.log(`[Localization] Detected: ${countryCode} → ${config.language}/${config.currency}`);
    } catch (error) {
      console.warn('[Localization] Could not detect location, using defaults:', error);
      // Use defaults or saved values
      if (savedLang) setLanguageState(savedLang);
      if (savedCurrency) setCurrencyState(savedCurrency);
      if (savedCountry) {
        setCountryState(savedCountry);
        const config = getCountryConfig(savedCountry);
        setCountryName(config.name);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  // Update language
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    
    // Update document direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Update currency
  const setCurrency = useCallback((curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem(STORAGE_KEY_CURRENCY, curr);
  }, []);

  // Update country (also updates language and currency)
  const setCountry = useCallback((countryCode: string) => {
    setCountryState(countryCode);
    localStorage.setItem(STORAGE_KEY_COUNTRY, countryCode);
    
    const config = getCountryConfig(countryCode);
    setCountryName(config.name);
    setLanguage(config.language);
    setCurrency(config.currency);
  }, [setLanguage, setCurrency]);

  // Format price in current currency
  const formatPriceLocal = useCallback((priceInXOF: number): string => {
    return displayPrice(priceInXOF, currency);
  }, [currency]);

  // Convert price to current currency
  const convertPriceLocal = useCallback((priceInXOF: number): number => {
    return convertPriceFn(priceInXOF, currency);
  }, [currency]);

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
    currency,
    country,
    countryName,
    t,
    setLanguage,
    setCurrency,
    setCountry,
    formatPrice: formatPriceLocal,
    convertPrice: convertPriceLocal,
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
