import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Instagram, ShoppingBag, ArrowLeft, Heart, Check, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import gsap from "gsap";
import { useCart } from "@/hooks/useCart";
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
  
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) {
      navigate("/shop");
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(".thumbnail-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3 }
      );
    });

    return () => ctx.revert();
  }, [product, navigate]);

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

  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-background/80 border-b border-border">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary hover:border-accent transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link to="/" className="text-2xl font-bold italic text-foreground">KAYNA</Link>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-accent transition-colors">Histoire</Link>
        </nav>
        
        <div className="flex items-center gap-3">
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
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left - Gallery */}
            <div ref={imageRef} className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-card group">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-primary shadow-elegant"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-primary shadow-elegant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Wishlist */}
                <button className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-accent hover:text-primary transition-all shadow-elegant">
                  <Heart className="w-5 h-5" />
                </button>

                {product.tag && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-accent text-primary rounded-full text-sm font-bold shadow-gold">
                    {product.tag}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div ref={thumbnailsRef} className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`thumbnail-item relative flex-1 aspect-square rounded-xl overflow-hidden transition-all ${
                      currentImageIndex === idx 
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-background" 
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div ref={contentRef} className="lg:py-8">
              <div className="sticky top-32 space-y-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
                  <span>/</span>
                  <span className="capitalize">{product.category}</span>
                </div>

                {/* Title & Price */}
                <div>
                  <h1 className="text-[2.5rem] lg:text-[3.5rem] font-bold leading-tight text-foreground mb-4">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-accent">{product.price}€</span>
                    <div className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      Livraison gratuite dès 75€
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-foreground">Taille</span>
                    <button className="text-sm text-accent hover:underline">Guide des tailles</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-xl font-bold transition-all ${
                          selectedSize === size
                            ? "bg-accent text-primary shadow-gold"
                            : "bg-muted text-foreground hover:bg-accent/20"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <span className="font-bold text-foreground block mb-4">Quantité</span>
                  <div className="inline-flex items-center gap-4 bg-muted rounded-xl p-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-background transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-foreground">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-background transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    isAdded 
                      ? "bg-green-500 text-white" 
                      : "bg-accent text-primary shadow-gold hover:shadow-gold-glow hover:scale-[1.02]"
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
                      <span>Ajouter au panier — {product.price * quantity}€</span>
                    </>
                  )}
                </button>

                {/* Product Details */}
                <div className="pt-8 border-t border-border">
                  <h3 className="font-bold text-foreground mb-4">Détails produit</h3>
                  <ul className="space-y-2">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
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
            <div className="mt-24">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
                Tu pourrais aussi aimer
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.id}
                    to={`/product/${relProduct.slug}`}
                    className="group"
                  >
                    <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-card aspect-[3/4] shadow-elegant hover:shadow-gold transition-all duration-500">
                      <img
                        src={relProduct.images[0]}
                        alt={relProduct.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-secondary text-lg font-bold mb-1">{relProduct.title}</h3>
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
