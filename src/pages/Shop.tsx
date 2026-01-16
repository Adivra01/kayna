import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Instagram, ShoppingBag, Heart, Filter } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useTracking, usePageTracking } from "@/hooks/useTracking";
import { FavoriteButton } from "@/components/FavoriteButton";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { products, Product } from "@/data/products";
import { showToast } from "@/lib/toast";

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
  jackets: hoodieVideo, // fallback to hoodie for jackets
};

const categories = [
  { id: "all", label: "Tous" },
  { id: "tshirts", label: "T-Shirts" },
  { id: "hoodies", label: "Hoodies" },
  { id: "sweaters", label: "Sweaters" },
];

const Shop = () => {
  usePageTracking();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { addItem, getTotalItems, toggleCart } = useCart();
  const { isFavorite, toggleFavorite, getFavoritesCount } = useFavorites();
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  useEffect(() => {
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
  }, [activeCategory]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });
    showToast.cart("Ajouté au panier !", { description: product.title });
  };

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-background/80 border-b border-border">
        <Link to="/" className="text-2xl font-bold italic text-foreground">KAYNA</Link>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/shop" className="text-accent font-medium">Shop</Link>
          <Link to="/about" className="hover:text-accent transition-colors">Histoire</Link>
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
                Shop<span className="italic text-accent">.</span>
              </h1>
              <p className="text-muted-foreground">{filteredProducts.length} produits</p>
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
              <span>Filtrer</span>
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

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product, index) => {
              const productVideo = categoryVideoMap[product.category];
              
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="group perspective-1000"
                >
                  <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-card aspect-[3/4] shadow-elegant hover:shadow-gold transition-all duration-500 transform-gpu group-hover:scale-[1.02]">
                    {/* Static Image - shown by default */}
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    
                    {/* Rotating Video - shown on hover */}
                    {productVideo && (
                      <video
                        src={productVideo}
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                    )}
                    
                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <FavoriteButton
                        isFavorite={isFavorite(product.id)}
                        onToggle={() => toggleFavorite(product.id)}
                        size="md"
                      />
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary hover:scale-110 transition-all shadow-gold backdrop-blur-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                      <h3 className="text-secondary text-lg font-bold mb-1 drop-shadow-lg">{product.title}</h3>
                      <span className="text-accent font-bold text-lg drop-shadow-md">{product.price.toLocaleString()} FCFA</span>
                    </div>

                    {product.tag && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-primary rounded-full text-xs font-bold shadow-gold animate-pulse">
                        {product.tag}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
