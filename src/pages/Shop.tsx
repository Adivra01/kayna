import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { Instagram, ShoppingBag, Heart, Filter, AlertCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useTracking, usePageTracking } from "@/hooks/useTracking";
import { useLocalization } from "@/hooks/useLocalization";
import { FavoriteButton } from "@/components/FavoriteButton";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "@/lib/toast";
import ShopLocked from "./ShopLocked";

// Import rotating videos
import tshirtVideo from "@/assets/videos/tshirt-rotate.mp4";
import hoodieVideo from "@/assets/videos/hoodie-rotate.mp4";
import sweaterVideo from "@/assets/videos/sweater-rotate.mp4";

gsap.registerPlugin(ScrollTrigger);

// Map category to video
const categoryVideoMap: Record<string, string> = {
  tshirts: tshirtVideo,
  hoodies: hoodieVideo,
  sweaters: sweaterVideo,
};

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  tag: string | null;
  sizes: string[];
  colors: string[];
  details: string[];
  images: string[];
  is_active: boolean;
  stock_quantity: number | null;
  out_of_stock: boolean;
}

const Shop = () => {
  usePageTracking();
  const { t, home, formatPrice, isRTL } = useLocalization();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShopLocked, setIsShopLocked] = useState<boolean | null>(null);
  const { addItem, getTotalItems, toggleCart } = useCart();
  const { isFavorite, toggleFavorite, getFavoritesCount } = useFavorites();
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Dynamic categories based on language
  const categories = [
    { id: "all", label: t.shop.all },
    { id: "tshirts", label: t.shop.tshirts },
    { id: "hoodies", label: t.shop.hoodies },
    { id: "sweaters", label: t.shop.sweaters },
  ];

  // Check if shop is locked
  useEffect(() => {
    const checkShopStatus = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("site_status")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setIsShopLocked(data.site_status === "locked");
      } else {
        setIsShopLocked(false);
      }
    };

    checkShopStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("shop_status_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => checkShopStatus()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      const mappedProducts = (data || []).map((p: any) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        tag: p.tag,
        sizes: p.sizes || [],
        colors: p.colors || [],
        details: p.details || [],
        images: p.images || [],
        is_active: p.is_active,
        stock_quantity: p.stock_quantity,
        out_of_stock: p.out_of_stock ?? false,
      }));

      setProducts(mappedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Animation effect - must be before conditional returns
  useEffect(() => {
    if (loading || isShopLocked) return;
    
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card, 
          { y: 60, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            delay: index * 0.08,
            ease: "power2.out"
          }
        );
      });
    });
    return () => ctx.revert();
  }, [activeCategory, loading, isShopLocked]);

  // Show locked page if shop is locked - AFTER all hooks
  if (isShopLocked === null) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isShopLocked) {
    return <ShopLocked />;
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if out of stock
    if (product.out_of_stock) {
      showToast.error(t.product.outOfStock);
      return;
    }
    
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });
    showToast.cart(t.product.added, { description: product.title });
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <CartDrawer />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-background/80 border-b border-border">
        <Link to="/" className="text-2xl font-bold italic text-foreground">KAYNA</Link>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/shop" className="text-accent font-medium">{t.nav.shop}</Link>
          <Link to="/about" className="hover:text-accent transition-colors">{t.nav.about}</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/favorites"
            className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <Heart className="w-4 h-4" />
            {getFavoritesCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">
                {getFavoritesCount()}
              </span>
            )}
          </Link>
          <a href="https://www.instagram.com/kayna.xxv" target="_blank" rel="noopener noreferrer" className="hidden sm:flex w-10 h-10 rounded-full border border-border items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary hover:border-accent transition-all">
            <Instagram className="w-4 h-4" />
          </a>
          <button 
            onClick={toggleCart}
            className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="container mx-auto">
          {/* Title & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-[3rem] lg:text-[4rem] font-bold leading-none text-foreground mb-2">
                {t.shop.title}<span className="italic text-accent">.</span>
              </h1>
              <p className="text-muted-foreground">{filteredProducts.length} {filteredProducts.length === 1 ? t.cart.item : t.cart.items}</p>
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-accent text-primary shadow-gold"
                      : "bg-muted text-muted-foreground hover:bg-accent/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-5 py-3 bg-muted rounded-full text-foreground"
            >
              <Filter className="w-4 h-4" />
              <span>{home.shopFilter}</span>
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden flex flex-wrap gap-2 mb-8 animate-fade-in">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-accent text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{home.shopNoProducts}</p>
            </div>
          ) : (
            /* Products Grid - Responsive for all devices */
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product, index) => {
                const productVideo = categoryVideoMap[product.category];
                const isOutOfStock = product.out_of_stock;
                
                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="group perspective-1000"
                  >
                    <div className={`relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-card aspect-[3/4] shadow-elegant hover:shadow-gold transition-all duration-500 transform-gpu group-hover:scale-[1.02] ${isOutOfStock ? 'opacity-70' : ''}`}>
                      {/* Static Image - shown by default */}
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      
                      {/* Second image - shown on hover (fallback to first if only one image) */}
                      <img
                        src={product.images[1] || product.images[0]}
                        alt={`${product.title} - vue alternative`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      
                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      {/* Out of Stock Overlay */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
                          <div className="bg-red-500/90 px-4 py-2 rounded-full flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-white" />
                            <span className="text-white font-bold text-sm">{home.shopOutOfStock}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Shine effect on hover */}
                      {!isOutOfStock && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                      )}
                      
                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <FavoriteButton
                          isFavorite={isFavorite(product.id)}
                          onToggle={() => toggleFavorite(product.id)}
                          size="md"
                        />
                        {!isOutOfStock && (
                          <button 
                            onClick={(e) => handleAddToCart(product, e)}
                            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary hover:scale-110 transition-all shadow-gold backdrop-blur-sm"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                        <h3 className="text-secondary text-sm sm:text-base lg:text-lg font-bold mb-1 drop-shadow-lg line-clamp-2">{product.title}</h3>
                        <span className="text-accent font-bold text-sm sm:text-base lg:text-lg drop-shadow-md">{formatPrice(product)}</span>
                      </div>

                      {product.tag && !isOutOfStock && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-primary rounded-full text-xs font-bold shadow-gold animate-pulse">
                          {product.tag}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
