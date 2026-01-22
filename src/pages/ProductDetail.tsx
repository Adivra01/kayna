import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Heart, Check, ChevronLeft, ChevronRight, ZoomIn, Ruler } from "lucide-react";
import gsap from "gsap";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useTracking } from "@/hooks/useTracking";
import { FavoriteButton } from "@/components/FavoriteButton";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { getProductBySlug, products } from "@/data/products";
import { showToast } from "@/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import videos for rotation effect
import tshirtVideo from "@/assets/videos/tshirt-rotate.mp4";
import hoodieVideo from "@/assets/videos/hoodie-rotate.mp4";
import sweaterVideo from "@/assets/videos/sweater-rotate.mp4";

const ProductDetail = () => {
  const { trackProductView, trackAddToCart } = useTracking();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const { addItem, getTotalItems, toggleCart } = useCart();
  const { isFavorite, toggleFavorite, getFavoritesCount } = useFavorites();
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get video based on category
  const getProductVideo = () => {
    if (!product) return tshirtVideo;
    if (product.category.toLowerCase().includes("hoodie")) return hoodieVideo;
    if (product.category.toLowerCase().includes("sweater")) return sweaterVideo;
    return tshirtVideo;
  };

  useEffect(() => {
    if (!product) {
      navigate("/shop");
      return;
    }

    window.scrollTo(0, 0);
    
    // Track product view
    trackProductView(product.id);

    const ctx = gsap.context(() => {
      // Cinematic entrance for gallery
      gsap.fromTo(galleryRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );

      // Images staggered entrance
      gsap.fromTo(".gallery-image",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, [product, navigate, slug, trackProductView]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast.error("Sélectionnez une taille");
      return;
    }
    
    // Track add to cart
    trackAddToCart(product.id);
    
    addItem({
      id: `${product.id}-${selectedSize}`,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
      size: selectedSize,
    });
    
    setIsAdded(true);
    showToast.cart("Ajouté au panier !", { description: `${product.title} — Taille ${selectedSize}` });
    
    // Animate button
    gsap.fromTo(".add-to-cart-btn",
      { scale: 1 },
      { scale: 1.02, duration: 0.1, yoyo: true, repeat: 1 }
    );
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Size guide data
  const sizeGuideData = [
    { size: "XS", chest: "86-91", waist: "71-76", hips: "86-91" },
    { size: "S", chest: "91-96", waist: "76-81", hips: "91-96" },
    { size: "M", chest: "96-101", waist: "81-86", hips: "96-101" },
    { size: "L", chest: "101-106", waist: "86-91", hips: "101-106" },
    { size: "XL", chest: "106-111", waist: "91-96", hips: "106-111" },
    { size: "XXL", chest: "111-116", waist: "96-101", hips: "111-116" },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <CartDrawer />
      
      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-6xl max-h-full animate-scale-in">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary/10 backdrop-blur-md flex items-center justify-center text-secondary hover:bg-accent hover:text-primary transition-all"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Size Guide Dialog */}
      <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
        <DialogContent className="bg-primary border-secondary/20 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-secondary text-xl font-bold">Guide des tailles</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-secondary/70 text-sm mb-4">Toutes les mesures sont en centimètres</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary/20">
                  <th className="py-3 text-left text-secondary font-bold">Taille</th>
                  <th className="py-3 text-center text-secondary font-bold">Poitrine</th>
                  <th className="py-3 text-center text-secondary font-bold">Taille</th>
                  <th className="py-3 text-center text-secondary font-bold">Hanches</th>
                </tr>
              </thead>
              <tbody>
                {sizeGuideData.map((row) => (
                  <tr key={row.size} className="border-b border-secondary/10">
                    <td className="py-3 text-secondary font-medium">{row.size}</td>
                    <td className="py-3 text-center text-secondary/70">{row.chest}</td>
                    <td className="py-3 text-center text-secondary/70">{row.waist}</td>
                    <td className="py-3 text-center text-secondary/70">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Header - Breadcrumb */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between backdrop-blur-md bg-primary/90 border-b border-secondary/5">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-secondary/60">
          <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
          <span>›</span>
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <span>›</span>
          <span className="capitalize hover:text-accent transition-colors">{product.category}</span>
          <span>›</span>
          <span className="text-secondary truncate max-w-[150px] sm:max-w-none">{product.title}</span>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/favorites"
            className="relative w-9 h-9 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <Heart className="w-4 h-4" />
            {getFavoritesCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                {getFavoritesCount()}
              </span>
            )}
          </Link>
          <button 
            onClick={toggleCart}
            className="relative w-9 h-9 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        {/* Gallery Section - Full Width Horizontal */}
        <div ref={galleryRef} className="relative">
          {/* Navigation Arrows */}
          <button 
            onClick={() => scrollGallery('left')}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-secondary border border-secondary/20 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollGallery('right')}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-secondary border border-secondary/20 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Horizontal Scrolling Gallery */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className="gallery-image flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[28vw] h-[60vh] sm:h-[70vh] lg:h-[75vh] snap-start relative group cursor-zoom-in"
                onClick={() => { setCurrentImageIndex(idx); setIsZoomed(true); }}
              >
                <img
                  src={img}
                  alt={`${product.title} - Vue ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Zoom indicator on hover */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-secondary/80" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div ref={contentRef} className="container mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Title & Description */}
            <div className="space-y-6">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-secondary">
                {product.title}
              </h1>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-secondary/70 leading-relaxed">
                  {product.description}
                </p>
                
                {/* Product Details */}
                <div className="pt-4 border-t border-secondary/10">
                  <h3 className="font-semibold text-secondary mb-3 text-sm uppercase tracking-wider">Détails</h3>
                  <ul className="space-y-2">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-secondary/60 text-sm">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Size, Price, Add to Cart */}
            <div className="space-y-6 lg:pl-8">
              {/* Size Selection Header */}
              <div className="flex items-center justify-between">
                <span className="text-secondary font-semibold uppercase tracking-wider text-sm">
                  Sélectionnez la taille
                </span>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-secondary/70 text-sm underline underline-offset-4 hover:text-accent transition-colors flex items-center gap-1"
                >
                  <Ruler className="w-3 h-3" />
                  Guide des tailles
                </button>
              </div>

              {/* Size Options */}
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-10 px-4 rounded-sm font-medium text-sm transition-all ${
                      selectedSize === size
                        ? "bg-secondary text-primary"
                        : "bg-transparent text-secondary border border-secondary/30 hover:border-secondary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="pt-4">
                <span className="text-2xl sm:text-3xl font-bold text-secondary">
                  {product.price.toLocaleString('fr-FR')} €
                </span>
              </div>

              {/* Add to Cart & Favorite */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`add-to-cart-btn flex-1 py-4 font-semibold uppercase tracking-wider text-sm transition-all ${
                    isAdded 
                      ? "bg-green-600 text-white" 
                      : selectedSize 
                        ? "bg-accent text-primary hover:bg-accent/90" 
                        : "bg-secondary/80 text-primary cursor-pointer"
                  }`}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Ajouté !
                    </span>
                  ) : selectedSize ? (
                    "Ajouter au panier"
                  ) : (
                    "Sélectionnez la taille"
                  )}
                </button>
                
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`w-14 h-14 flex items-center justify-center border transition-all ${
                    isFavorite(product.id)
                      ? "bg-accent border-accent text-primary"
                      : "border-secondary/30 text-secondary hover:border-secondary"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 border-t border-secondary/10">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-6 sm:mb-8 uppercase tracking-wider">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={`/product/${relProduct.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden bg-secondary/5 aspect-[3/4]">
                    <img
                      src={relProduct.images[0]}
                      alt={relProduct.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <FavoriteButton
                      isFavorite={isFavorite(relProduct.id)}
                      onToggle={() => toggleFavorite(relProduct.id)}
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <h3 className="text-secondary text-sm font-medium truncate">{relProduct.title}</h3>
                    <span className="text-secondary/70 text-sm">{relProduct.price} €</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;