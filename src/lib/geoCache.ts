// Shared geo cache — single source of truth for geo data across all hooks
// Prevents redundant IP detection API calls

export interface GeoData {
  country_code: string;
  country_name: string;
  city?: string;
  region?: string;
}

const CACHE_KEY = 'kayna_geo_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

let memoryCache: GeoData | null = null;
let fetchPromise: Promise<GeoData | null> | null = null;

// Read from localStorage
function readPersistedCache(): GeoData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data as GeoData;
  } catch {
    return null;
  }
}

// Write to localStorage
function persistCache(data: GeoData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Storage full or unavailable
  }
}

// IP detection APIs with fallbacks
const GEO_APIS = [
  {
    url: 'https://ipapi.co/json/',
    parse: (d: any): GeoData => ({
      country_code: d.country_code || d.country,
      country_name: d.country_name,
      city: d.city,
      region: d.region,
    }),
  },
  {
    url: 'https://ip-api.com/json/?fields=countryCode,country,city,regionName',
    parse: (d: any): GeoData => ({
      country_code: d.countryCode,
      country_name: d.country,
      city: d.city,
      region: d.regionName,
    }),
  },
  {
    url: 'https://ipwho.is/',
    parse: (d: any): GeoData => ({
      country_code: d.country_code,
      country_name: d.country,
      city: d.city,
      region: d.region,
    }),
  },
  {
    url: 'https://freeipapi.com/api/json',
    parse: (d: any): GeoData => ({
      country_code: d.countryCode,
      country_name: d.countryName,
      city: d.cityName,
      region: d.regionName,
    }),
  },
];

async function fetchGeoFromAPIs(): Promise<GeoData | null> {
  for (const api of GEO_APIS) {
    try {
      const res = await fetch(api.url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) continue;
      const data = await res.json();
      const parsed = api.parse(data);
      if (parsed.country_code) {
        console.log(`[GeoCache] Detected via ${new URL(api.url).hostname}: ${parsed.country_code}`);
        return parsed;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Get geo data — cached, deduplicated, single API call for entire session.
 * Returns immediately if cached, otherwise fetches once and shares the result.
 */
export async function getGeoData(): Promise<GeoData | null> {
  // 1. Memory cache (instant)
  if (memoryCache) return memoryCache;

  // 2. Persisted cache (fast)
  const persisted = readPersistedCache();
  if (persisted) {
    memoryCache = persisted;
    return persisted;
  }

  // 3. Deduplicate concurrent fetches
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetchGeoFromAPIs().then((result) => {
    if (result) {
      memoryCache = result;
      persistCache(result);
    }
    fetchPromise = null;
    return result;
  });

  return fetchPromise;
}

/**
 * Get cached geo data synchronously (returns null if not yet loaded).
 * Useful for non-critical reads that shouldn't block.
 */
export function getGeoDataSync(): GeoData | null {
  if (memoryCache) return memoryCache;
  const persisted = readPersistedCache();
  if (persisted) {
    memoryCache = persisted;
    return persisted;
  }
  return null;
}
