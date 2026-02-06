import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getGeoData, getGeoDataSync } from '@/lib/geoCache';

interface TrackingData {
  event_type: string;
  page_url?: string;
  product_id?: string;
  affiliate_code?: string;
}

// Get or create a visitor ID
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('kayna_visitor_id');
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('kayna_visitor_id', visitorId);
  }
  return visitorId;
};

// Get or create session ID (resets after 30 min of inactivity)
const getSessionId = (): string => {
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const now = Date.now();
  
  const storedSession = localStorage.getItem('kayna_session');
  if (storedSession) {
    const { id, lastActive } = JSON.parse(storedSession);
    if (now - lastActive < SESSION_TIMEOUT) {
      localStorage.setItem('kayna_session', JSON.stringify({ id, lastActive: now }));
      return id;
    }
  }
  
  const newSessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  localStorage.setItem('kayna_session', JSON.stringify({ id: newSessionId, lastActive: now }));
  return newSessionId;
};

// Get affiliate code from URL or storage
export const getAffiliateCode = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    localStorage.setItem('kayna_affiliate_code', refCode);
    localStorage.setItem('kayna_affiliate_timestamp', Date.now().toString());
    return refCode;
  }
  
  const storedCode = localStorage.getItem('kayna_affiliate_code');
  const storedTimestamp = localStorage.getItem('kayna_affiliate_timestamp');
  
  if (storedCode && storedTimestamp) {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (parseInt(storedTimestamp) > thirtyDaysAgo) {
      return storedCode;
    }
    localStorage.removeItem('kayna_affiliate_code');
    localStorage.removeItem('kayna_affiliate_timestamp');
  }
  
  return null;
};

// Parse user agent for device info
const parseUserAgent = () => {
  const ua = navigator.userAgent;
  
  let deviceType = 'desktop';
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    deviceType = /iPad|Tablet/.test(ua) ? 'tablet' : 'mobile';
  }
  
  let browser = 'unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';
  
  let os = 'unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  return { deviceType, browser, os };
};

// Determine traffic source
const getTrafficSource = (): string => {
  const affiliateCode = getAffiliateCode();
  if (affiliateCode) return 'affiliate';
  
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  
  try {
    const referrerHost = new URL(referrer).hostname;
    if (referrerHost.includes('google')) return 'google';
    if (referrerHost.includes('facebook') || referrerHost.includes('fb.')) return 'facebook';
    if (referrerHost.includes('instagram')) return 'instagram';
    if (referrerHost.includes('tiktok')) return 'tiktok';
    if (referrerHost.includes('twitter') || referrerHost.includes('x.com')) return 'twitter';
    return 'referral';
  } catch {
    return 'referral';
  }
};

export const useTracking = () => {
  const trackEvent = useCallback(async (data: TrackingData) => {
    try {
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      const affiliateCode = data.affiliate_code || getAffiliateCode();
      const { deviceType, browser, os } = parseUserAgent();
      const trafficSource = getTrafficSource();
      
      // Use shared geo cache — no extra API calls!
      // Try sync first (instant if already cached), fallback to async
      let country: string | null = null;
      let city: string | null = null;
      
      const syncGeo = getGeoDataSync();
      if (syncGeo) {
        country = syncGeo.country_name || null;
        city = syncGeo.city || null;
      } else {
        // Async fetch (will also cache for next time)
        const asyncGeo = await getGeoData();
        if (asyncGeo) {
          country = asyncGeo.country_name || null;
          city = asyncGeo.city || null;
        }
      }
      
      await (supabase as any)
        .from('analytics_events')
        .insert({
          event_type: data.event_type,
          page_url: data.page_url || window.location.pathname,
          product_id: data.product_id || null,
          visitor_id: visitorId,
          session_id: sessionId,
          affiliate_code: affiliateCode,
          device_type: deviceType,
          browser,
          os,
          traffic_source: trafficSource,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          country,
          city,
        });

      // If this is an affiliate visit, also record in affiliate_visits
      if (affiliateCode && data.event_type === 'page_view') {
        const { data: affiliate } = await (supabase as any)
          .from('affiliates')
          .select('id')
          .eq('affiliate_code', affiliateCode)
          .eq('status', 'approved')
          .maybeSingle();
        
        if (affiliate) {
          await (supabase as any)
            .from('affiliate_visits')
            .insert({
              affiliate_id: affiliate.id,
              visitor_id: visitorId,
              country,
              city,
              device_type: deviceType,
              browser,
              os,
              referrer: document.referrer || null,
              page_url: window.location.pathname,
            });
        }
      }
    } catch (error) {
      console.error('Tracking error:', error);
    }
  }, []);

  const trackPageView = useCallback(() => {
    trackEvent({ event_type: 'page_view' });
  }, [trackEvent]);

  const trackProductView = useCallback(async (productId: string) => {
    trackEvent({ event_type: 'product_view', product_id: productId });
    
    const affiliateCode = getAffiliateCode();
    if (affiliateCode) {
      try {
        const { data: affiliate } = await (supabase as any)
          .from('affiliates')
          .select('id')
          .eq('affiliate_code', affiliateCode)
          .eq('status', 'approved')
          .maybeSingle();
        
        if (affiliate) {
          await (supabase as any)
            .from('affiliate_product_views')
            .insert({
              affiliate_id: affiliate.id,
              product_id: productId,
              visitor_id: getVisitorId(),
            });
        }
      } catch (error) {
        console.error('Error tracking affiliate product view:', error);
      }
    }
  }, [trackEvent]);

  const trackAddToCart = useCallback((productId: string) => {
    trackEvent({ event_type: 'add_to_cart', product_id: productId });
  }, [trackEvent]);

  const trackPurchase = useCallback((productId?: string) => {
    trackEvent({ event_type: 'purchase', product_id: productId });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackPurchase,
  };
};

// Hook to auto-track page views
export const usePageTracking = () => {
  const { trackPageView } = useTracking();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);
};
