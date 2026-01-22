// Currency configuration and conversion rates
export type CurrencyCode = 'XOF' | 'USD' | 'EUR' | 'GBP' | 'MAD' | 'DZD' | 'TND' | 'BRL' | 'CAD' | 'AED' | 'SAR' | 'NGN' | 'GHS' | 'KES' | 'ZAR' | 'EGP';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  position: 'before' | 'after';
  decimals: number;
  // Conversion rate from XOF (FCFA) base
  rateFromXOF: number;
}

// Base currency is FCFA (XOF)
// Rates are approximate and should be updated regularly
export const currencies: Record<CurrencyCode, Currency> = {
  XOF: {
    code: 'XOF',
    symbol: 'FCFA',
    name: 'Franc CFA',
    position: 'after',
    decimals: 0,
    rateFromXOF: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.0016, // 1 XOF = 0.0016 USD (approximately)
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    position: 'after',
    decimals: 2,
    rateFromXOF: 0.00152, // Fixed rate: 1 EUR = 655.957 XOF
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.0013,
  },
  MAD: {
    code: 'MAD',
    symbol: 'DH',
    name: 'Moroccan Dirham',
    position: 'after',
    decimals: 2,
    rateFromXOF: 0.016,
  },
  DZD: {
    code: 'DZD',
    symbol: 'DA',
    name: 'Algerian Dinar',
    position: 'after',
    decimals: 2,
    rateFromXOF: 0.22,
  },
  TND: {
    code: 'TND',
    symbol: 'DT',
    name: 'Tunisian Dinar',
    position: 'after',
    decimals: 3,
    rateFromXOF: 0.005,
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.008,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.0022,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.006,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    name: 'Saudi Riyal',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.006,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    position: 'before',
    decimals: 0,
    rateFromXOF: 2.5,
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.02,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    position: 'before',
    decimals: 0,
    rateFromXOF: 0.25,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.03,
  },
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    position: 'before',
    decimals: 2,
    rateFromXOF: 0.08,
  },
};

// Convert price from XOF to target currency
export function convertPrice(priceInXOF: number, targetCurrency: CurrencyCode): number {
  const currency = currencies[targetCurrency];
  const converted = priceInXOF * currency.rateFromXOF;
  return Number(converted.toFixed(currency.decimals));
}

// Format price with currency symbol
export function formatPrice(price: number, currencyCode: CurrencyCode): string {
  const currency = currencies[currencyCode];
  const formattedNumber = price.toLocaleString(undefined, {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });

  if (currency.position === 'before') {
    return `${currency.symbol}${formattedNumber}`;
  }
  return `${formattedNumber} ${currency.symbol}`;
}

// Convert and format in one step
export function displayPrice(priceInXOF: number, currencyCode: CurrencyCode): string {
  const converted = convertPrice(priceInXOF, currencyCode);
  return formatPrice(converted, currencyCode);
}
