import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Instagram, ShoppingBag, ArrowLeft, Heart, Check, Minus, Plus, ChevronLeft, ChevronRight, Star, Truck, Shield, RotateCcw, ZoomIn, Loader2 } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import gsap from "gsap";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useTracking } from "@/hooks/useTracking";
import { FavoriteButton } from "@/components/FavoriteButton";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { showToast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

// Import videos for rotation effect
import tshirtVideo from "@/assets/videos/tshirt-rotate.mp4";
import hoodieVideo from "@/assets/videos/hoodie-rotate.mp4";
import sweaterVideo from "@/assets/videos/sweater-rotate.mp4";

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
  out_of_stock: boolean;
  stock_quantity: number | null;
  video_url?: string | null;
}

const ProductDetail = () => {
  const { trackProductView, trackAddToCart } = useTracking();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { addItem, getTotalItems, toggleCart } = useCart();
  const { isFavorite, toggleFavorite, getFavoritesCount } = useFavorites();
  
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Get video based on category or custom video
  const getProductVideo = () => {
    if (product?.video_url) return product.video_url;
    if (!product) return tshirtVideo;
    if (product.category.toLowerCase().includes("hoodie")) return hoodieVideo;
    if (product.category.toLowerCase().includes("sweater")) return sweaterVideo;
    return tshirtVideo;
  };

  // Colors available
  const colors = [
    { name: "Noir", hex: "#0A0A0A" },
    { name: "Blanc", hex: "#F5F5F0" },
    { name: "Beige", hex: "#C9A86C" },
  ];

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        navigate("/shop");
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        console.error("Product not found:", error);
        navigate("/shop");
        return;
      }

      const productData: Product = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        tag: data.tag,
        sizes: data.sizes || ["S", "M", "L", "XL"],
        colors: data.colors || ["noir", "blanc", "beige"],
        details: data.details || [],
        images: data.images || [],
        is_active: data.is_active ?? true,
        out_of_stock: data.out_of_stock ?? false,
        stock_quantity: data.stock_quantity,
        video_url: (data as any).video_url || null,
      };

      setProduct(productData);
      setSelectedColor(colors[0].name);
      
      // Track product view
      trackProductView(productData.id);

      // Fetch related products
      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category", productData.category)
        .eq("is_active", true)
        .neq("id", productData.id)
        .limit(4);

      if (related) {
        setRelatedProducts(related.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          price: Number(p.price),
          category: p.category,
          tag: p.tag,
          sizes: p.sizes || ["S", "M", "L", "XL"],
          colors: p.colors || ["noir", "blanc", "beige"],
          details: p.details || [],
          images: p.images || [],
          is_active: p.is_active ?? true,
          out_of_stock: p.out_of_stock ?? false,
          stock_quantity: p.stock_quantity,
        })));
      }

      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug, navigate, trackProductView]);

  // GSAP animations after product loads
  useEffect(() => {
    if (!product || loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(galleryRef.current,
        { opacity: 0, x: -60, rotateY: -15 },
        { opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: "power3.out" }
      );
      
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(".thumbnail-item",
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.5, ease: "back.out(1.5)" }
      );

      gsap.fromTo(".feature-card",
        { opacity: 0, y: 20, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.1, delay: 0.6 }
      );
    });

    return () => ctx.revert();
  }, [product, loading]);

  // Animate image change with 3D effect
  useEffect(() => {
    if (mainImageRef.current) {
      gsap.fromTo(mainImageRef.current,
        { opacity: 0, scale: 1.1, rotateY: 10 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [currentImageIndex]);

  const animateSizeChange = (size: string) => {
    setSelectedSize(size);
    
    if (galleryRef.current) {
      gsap.to(galleryRef.current, {
        scale: 0.98,
        rotateY: 3,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(galleryRef.current, {
            scale: 1,
            rotateY: 0,
            duration: 0.3,
            ease: "elastic.out(1, 0.5)",
          });
        },
      });
    }
  };

  const animateColorChange = (color: string) => {
    setSelectedColor(color);
    
    if (galleryRef.current) {
      gsap.to(galleryRef.current, {
        rotateY: 15,
        scale: 0.95,
        opacity: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(galleryRef.current, {
            rotateY: 0,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          });
        },
      });
    }

    const flash = document.createElement("div");
    flash.className = "fixed inset-0 bg-accent/10 pointer-events-none z-50";
    document.body.appendChild(flash);
    gsap.to(flash, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => flash.remove(),
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current || isZoomed) return;
    
    const rect = galleryRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    gsap.to(galleryRef.current, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!galleryRef.current) return;
    gsap.to(galleryRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast.error("Sélectionne une taille");
      return;
    }

    if (product.out_of_stock) {
      showToast.error("Ce produit est en rupture de stock");
      return;
    }
    
    trackAddToCart(product.id);
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        title: product.title,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
        category: product.category,
        size: selectedSize,
      });
    }
    
    setIsAdded(true);
    showToast.cart("Ajouté au panier !", { description: `${product.title} — Taille ${selectedSize} — ${selectedColor}` });
    
    gsap.fromTo(".add-to-cart-btn",
      { scale: 1 },
      { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 }
    );
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  const nextImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <CartDrawer />
      
      {/* Zoom Modal */}
      {isZoomed && product.images[currentImageIndex] && (
        <div 
          className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-6xl max-h-full animate-scale-in">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            />
            <button 
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary/10 backdrop-blur-md flex items-center justify-center text-secondary hover:bg-accent hover:text-primary transition-all"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
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
            {/* Left - Interactive 3D Gallery + Description */}
            <div className="space-y-6">
              <div 
                ref={galleryRef} 
                className="space-y-3 sm:space-y-4"
                style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main Image with Video Toggle */}
                <div 
                  className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-secondary/5 group cursor-zoom-in"
                  data-cursor="product"
                  onClick={() => !showVideo && setIsZoomed(true)}
                >
                  {showVideo ? (
                    <video
                      src={getProductVideo()}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <img
                      ref={mainImageRef}
                      src={product.images[currentImageIndex] || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-auto object-contain transition-transform duration-700"
                    />
                  )}
                
                {/* 3D Shine effect */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(201, 168, 108, 0.15) 0%, transparent 50%)`,
                  }}
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-accent shadow-elegant hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-accent shadow-elegant hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Video Toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowVideo(!showVideo); }}
                  className={`absolute bottom-4 left-4 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-sm font-medium transition-all ${
                    showVideo 
                      ? "bg-accent text-primary" 
                      : "bg-primary/60 text-secondary border border-secondary/20 hover:bg-accent hover:text-primary hover:border-accent"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {showVideo ? "Image" : "360°"}
                </button>

                {/* Zoom Icon */}
                <button
                  onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
                  className="absolute bottom-4 right-16 w-10 h-10 rounded-full bg-primary/60 backdrop-blur-md flex items-center justify-center text-secondary border border-secondary/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-primary hover:border-accent"
                >
                  <ZoomIn className="w-4 h-4" />
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

                {product.out_of_stock && (
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-secondary font-bold text-xl">Rupture de stock</span>
                  </div>
                )}

                {/* Image Counter Mobile */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-primary/80 backdrop-blur-sm rounded-full text-secondary text-xs font-medium lg:hidden">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Interactive Thumbnails */}
              {product.images.length > 1 && (
                <div ref={thumbnailsRef} className="hidden sm:flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`thumbnail-item relative flex-1 aspect-square rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                        currentImageIndex === idx 
                          ? "ring-2 ring-accent ring-offset-2 ring-offset-primary shadow-gold" 
                          : "opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {currentImageIndex === idx && (
                        <div className="absolute inset-0 bg-accent/10" />
                      )}
                    </button>
                  ))}
                </div>
              )}
              </div>

              {/* Premium Description Section with Accordion */}
              {(product.description || product.details?.length > 0) && (
                <div className="mt-8 space-y-4">
                  {/* Description Accordion */}
                  {product.description && (
                    <details className="group bg-secondary/5 rounded-2xl border border-secondary/10 overflow-hidden">
                      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Star className="w-5 h-5 text-accent" />
                          </div>
                          <span className="font-bold text-secondary text-lg">Description</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-secondary/50 transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="px-5 pb-5 pt-2 border-t border-secondary/10">
                        <p className="text-secondary/70 leading-relaxed whitespace-pre-line">
                          {product.description}
                        </p>
                      </div>
                    </details>
                  )}

                  {/* Details Accordion */}
                  {product.details && product.details.length > 0 && (
                    <details className="group bg-secondary/5 rounded-2xl border border-secondary/10 overflow-hidden">
                      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-accent" />
                          </div>
                          <span className="font-bold text-secondary text-lg">Caractéristiques</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-secondary/50 transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="px-5 pb-5 pt-2 border-t border-secondary/10">
                        <ul className="space-y-3">
                          {product.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-secondary/70">
                              <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  )}

                  {/* Shipping Info Accordion */}
                  <details className="group bg-secondary/5 rounded-2xl border border-secondary/10 overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-secondary/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-accent" />
                        </div>
                        <span className="font-bold text-secondary text-lg">Livraison & Retours</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-secondary/50 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-5 pb-5 pt-2 border-t border-secondary/10 space-y-3">
                      <div className="flex items-start gap-3 text-secondary/70">
                        <Truck className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>Livraison gratuite à partir de 100 000 FCFA</span>
                      </div>
                      <div className="flex items-start gap-3 text-secondary/70">
                        <RotateCcw className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>Retours gratuits sous 30 jours</span>
                      </div>
                    </div>
                  </details>
                </div>
              )}
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
                      <span className="text-secondary/60 text-sm ml-2">(127 avis)</span>
                    </div>
                  </div>
                </div>


                {/* Colors */}
                <div className="space-y-3">
                  <h3 className="font-medium text-secondary">Couleur: <span className="text-accent">{selectedColor}</span></h3>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => animateColorChange(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                          selectedColor === color.name
                            ? "border-accent shadow-gold scale-110"
                            : "border-secondary/20 hover:border-accent/50"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className={`w-5 h-5 mx-auto ${color.name === "Blanc" ? "text-primary" : "text-secondary"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <h3 className="font-medium text-secondary">Taille: <span className="text-accent">{selectedSize || "Sélectionner"}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => animateSizeChange(size)}
                        className={`w-14 h-12 rounded-lg font-medium transition-all hover:scale-105 ${
                          selectedSize === size
                            ? "bg-accent text-primary shadow-gold"
                            : "bg-secondary/10 text-secondary hover:bg-accent/20"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-3">
                  <h3 className="font-medium text-secondary">Quantité</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary hover:bg-accent hover:text-primary transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-xl font-bold text-secondary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary hover:bg-accent hover:text-primary transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.out_of_stock}
                    className={`add-to-cart-btn flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                      product.out_of_stock
                        ? "bg-secondary/20 text-secondary/50 cursor-not-allowed"
                        : isAdded
                        ? "bg-green-500 text-white"
                        : "bg-accent text-primary hover:scale-[1.02] shadow-gold"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Ajouté !
                      </>
                    ) : product.out_of_stock ? (
                      "Rupture de stock"
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Ajouter au panier — {(product.price * quantity).toFixed(0)}€
                      </>
                    )}
                  </button>
                  
                  <FavoriteButton
                    isFavorite={isFavorite(product.id)}
                    onToggle={() => toggleFavorite(product.id)}
                    size="lg"
                    className="!w-14 !h-14 border-2 border-secondary/20"
                  />
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 pt-6">
                  <div className="feature-card text-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                    <Truck className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <span className="text-xs text-secondary/70">Livraison gratuite</span>
                  </div>
                  <div className="feature-card text-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                    <Shield className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <span className="text-xs text-secondary/70">Paiement sécurisé</span>
                  </div>
                  <div className="feature-card text-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                    <RotateCcw className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <span className="text-xs text-secondary/70">Retours 14 jours</span>
                  </div>
                </div>

                {/* Details */}
                {product.details && product.details.length > 0 && (
                  <div className="pt-6 border-t border-secondary/10">
                    <h3 className="font-bold text-secondary mb-4">Détails du produit</h3>
                    <ul className="space-y-2">
                      {product.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-secondary/70">
                          <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 sm:mt-32">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-8">Tu vas aussi aimer</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/product/${related.slug}`}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/5"
                  >
                    <img
                      src={related.images[0] || "/placeholder.svg"}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-secondary group-hover:text-accent transition-colors">{related.title}</h3>
                      <span className="text-accent font-bold">{related.price}€</span>
                    </div>
                    
                    <FavoriteButton
                      isFavorite={isFavorite(related.id)}
                      onToggle={() => toggleFavorite(related.id)}
                      size="sm"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;