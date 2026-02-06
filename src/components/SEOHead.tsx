import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
  lang?: string;
  alternateLanguages?: { lang: string; url: string }[];
}

const DEFAULT_TITLE = "KAYNA — Vêtements de Développement Personnel | Confiance & Dépassement de Soi";
const DEFAULT_DESCRIPTION = "KAYNA est la marque de vêtements streetwear orientée développement personnel. T-shirts, hoodies et sweaters premium qui incarnent la confiance en soi, le dépassement et la persévérance. Coton bio 240 GSM, production éthique.";
const DEFAULT_KEYWORDS = "KAYNA, vêtements développement personnel, streetwear motivation, marque confiance en soi, t-shirt inspiration, hoodie premium, mode éthique, personal development clothing, motivational streetwear, self-improvement brand, vêtements motivation, marque dépassement de soi, mode persévérance, streetwear Afrique, coton bio premium, vêtements mindset, clothing for self-growth, empowerment fashion, mental strength clothing, ropa desarrollo personal, ملابس تطوير الذات, roupa desenvolvimento pessoal";
const SITE_URL = "https://kayna.store";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  twitterCard = "summary_large_image",
  jsonLd,
  noindex = false,
  lang = "fr",
  alternateLanguages,
}: SEOHeadProps) {
  const fullCanonical = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="KAYNA" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="bingbot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="KAYNA" />
      <meta property="og:locale" content={lang === "fr" ? "fr_FR" : lang === "en" ? "en_US" : lang === "es" ? "es_ES" : lang === "ar" ? "ar_SA" : "pt_BR"} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@kayna20xxv" />
      <meta name="twitter:creator" content="@kayna20xxv" />

      {/* Alternate Languages */}
      {alternateLanguages?.map(({ lang: l, url }) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${SITE_URL}${url}`} />
      ))}
      
      {/* Additional SEO Meta */}
      <meta name="theme-color" content="#0D0D0D" />
      <meta name="apple-mobile-web-app-title" content="KAYNA" />
      <meta name="application-name" content="KAYNA" />
      <meta name="format-detection" content="telephone=no" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

// Pre-built JSON-LD generators
export const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KAYNA",
  "url": "https://kayna.store",
  "logo": "https://kayna.store/logo.png",
  "description": "Marque de vêtements streetwear orientée développement personnel. Confiance, dépassement, persévérance.",
  "foundingDate": "2024",
  "sameAs": [
    "https://www.instagram.com/kayna.xxv",
    "https://www.tiktok.com/@kayna.xxv",
    "https://x.com/kayna20xxv",
    "https://www.threads.com/@kayna.xxv"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@kayna.store",
    "contactType": "customer service"
  }
};

export const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "KAYNA",
  "url": "https://kayna.store",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://kayna.store/shop?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const jsonLdBrand = {
  "@context": "https://schema.org",
  "@type": "Brand",
  "name": "KAYNA",
  "description": "KAYNA signifie certitude en Songhaï. Marque de streetwear premium orientée développement personnel — confiance en soi, dépassement et persévérance.",
  "logo": "https://kayna.store/logo.png",
  "slogan": "La certitude inébranlable",
  "url": "https://kayna.store"
};

export function generateProductJsonLd(product: {
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  slug: string;
  category: string;
  inStock: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image,
    "brand": { "@type": "Brand", "name": "KAYNA" },
    "category": product.category,
    "url": `https://kayna.store/product/${product.slug}`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.currency,
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "KAYNA" },
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": product.currency },
        "deliveryTime": { "@type": "ShippingDeliveryTime", "businessDays": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 15 } }
      }
    },
    "material": "100% Organic Cotton",
    "weight": { "@type": "QuantitativeValue", "value": "240", "unitCode": "GRM" }
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://kayna.store${item.url}`
    }))
  };
}
