import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Instagram, ShoppingBag, ArrowLeft, Heart, Check, Minus, Plus, ChevronLeft, ChevronRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import gsap from "gsap";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteButton } from "@/components/FavoriteButton";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { getProductBySlug, products } from "@/data/products";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const { addItem, getTotalItems, toggleCart } = useCart();
  const { isFavorite, toggleFavorite, getFavoritesCount } = useFavorites();
  
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) {
      navigate("/shop");
      return;
    }

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(".feature-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.4 }
      );
    });

    return () => ctx.revert();
  }, [product, navigate, slug]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Sélectionne une taille");
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${selectedSize}`,
        title: product.title,
        price: product.price,
        image: product.images[0],
        category: product.category,
        size: selectedSize,
      });
    }
    
    setIsAdded(true);
    toast.success("Ajouté au panier !");
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-primary">
      <CartDrawer />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between backdrop-blur-md bg-primary/80 border-b border-secondary/10">
        <div className="flex items-center gap-3 sm:gap-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link to="/" className="text-xl sm:text-2xl font-bold italic text-secondary">KAYNA</Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            to="/favorites"
            className="relative w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <Heart className="w-4 h-4" />
            {getFavoritesCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">
                {getFavoritesCount()}
              </span>
            )}
          </Link>
          <a href="https://www.instagram.com/kayna.xxv" target="_blank" rel="noopener noreferrer" className="hidden sm:flex w-10 h-10 rounded-full border border-secondary/20 items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all">
            <Instagram className="w-4 h-4" />
          </a>
          <button 
            onClick={toggleCart}
            className="relative w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all"
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
      <main className="pt-20 sm:pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Left - Gallery */}
            <div ref={imageRef} className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-secondary/5 group">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-accent shadow-elegant"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-accent shadow-elegant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Wishlist */}
                <FavoriteButton
                  isFavorite={isFavorite(product.id)}
                  onToggle={() => toggleFavorite(product.id)}
                  size="lg"
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 shadow-elegant"
                />

                {product.tag && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-4 py-2 bg-accent text-primary rounded-full text-xs sm:text-sm font-bold shadow-gold">
                    {product.tag}
                  </div>
                )}

                {/* Image Counter Mobile */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-primary/80 backdrop-blur-sm rounded-full text-secondary text-xs font-medium lg:hidden">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnails - Hidden on mobile, swipe works */}
              <div className="hidden sm:flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-1 aspect-square rounded-xl overflow-hidden transition-all ${
                      currentImageIndex === idx 
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-primary" 
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div ref={contentRef} className="lg:py-4">
              <div className="lg:sticky lg:top-28 space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-secondary/50">
                  <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
                  <span>/</span>
                  <span className="capitalize">{product.category}</span>
                </div>

                {/* Title & Price */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-secondary mb-4">
                    {product.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-3xl sm:text-4xl font-bold text-accent">{product.price}€</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                      <span className="text-secondary/50 text-sm ml-2">(127 avis)</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-secondary/70 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-secondary">Taille</span>
                    <button className="text-sm text-accent hover:underline">Guide des tailles</button>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold transition-all ${
                          selectedSize === size
                            ? "bg-accent text-primary shadow-gold scale-105"
                            : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-4 bg-secondary/10 rounded-xl p-2 w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary/10 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-secondary">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-secondary hover:bg-secondary/10 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all ${
                      isAdded 
                        ? "bg-green-500 text-white" 
                        : "bg-accent text-primary shadow-gold hover:shadow-gold-glow hover:scale-[1.02] active:scale-100"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Ajouté !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Ajouter — {product.price * quantity}€</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="feature-card flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/5 rounded-xl">
                    <Truck className="w-5 h-5 text-accent mb-2" />
                    <span className="text-xs sm:text-sm text-secondary font-medium">Livraison gratuite</span>
                    <span className="text-[10px] sm:text-xs text-secondary/50">dès 75€</span>
                  </div>
                  <div className="feature-card flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/5 rounded-xl">
                    <RotateCcw className="w-5 h-5 text-accent mb-2" />
                    <span className="text-xs sm:text-sm text-secondary font-medium">Retours gratuits</span>
                    <span className="text-[10px] sm:text-xs text-secondary/50">sous 30 jours</span>
                  </div>
                  <div className="feature-card flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/5 rounded-xl">
                    <Shield className="w-5 h-5 text-accent mb-2" />
                    <span className="text-xs sm:text-sm text-secondary font-medium">Paiement sécurisé</span>
                    <span className="text-[10px] sm:text-xs text-secondary/50">100% safe</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="pt-6 border-t border-secondary/10">
                  <h3 className="font-bold text-secondary mb-4">Détails produit</h3>
                  <ul className="space-y-2">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-secondary/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 sm:mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6 sm:mb-8">
                Tu pourrais aussi aimer
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.id}
                    to={`/product/${relProduct.slug}`}
                    className="group"
                  >
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-secondary/5 aspect-[3/4] shadow-elegant hover:shadow-gold transition-all duration-500">
                      <img
                        src={relProduct.images[0]}
                        alt={relProduct.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                        <h3 className="text-secondary text-sm sm:text-lg font-bold mb-1">{relProduct.title}</h3>
                        <span className="text-accent font-bold">{relProduct.price}€</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
