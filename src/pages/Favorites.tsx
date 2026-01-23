import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, ShoppingBag, Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { useLocalization } from '@/hooks/useLocalization';
import { supabase } from '@/integrations/supabase/client';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import gsap from 'gsap';

interface ProductData {
  id: string;
  slug: string;
  title: string;
  price: number;
  images: string[] | null;
  category: string;
  out_of_stock?: boolean;
}

export default function Favorites() {
  const navigate = useNavigate();
  const { t, formatPrice, isRTL } = useLocalization();
  const { favorites, loading, toggleFavorite, isAuthenticated } = useFavorites();
  const { addItem, getTotalItems, toggleCart } = useCart();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoadingProducts(false);
    }
  }, [favorites]);

  const fetchProducts = async () => {
    const productIds = favorites.map(f => f.product_id);
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, title, price, images, category')
      .in('id', productIds);

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts((data || []).map(p => ({ ...p, out_of_stock: false })));
    }
    setLoadingProducts(false);
  };

  const handleRemove = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await toggleFavorite(productId);
    toast.success('Retiré des favoris');
  };

  const handleAddToCart = (product: ProductData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.out_of_stock) {
      toast.error('Ce produit est en rupture de stock');
      return;
    }
    
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '',
      category: product.category,
    });
    toast.success(`${product.title} ajouté au panier`);
  };

  if (loading || loadingProducts) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-background/80 border-b border-border">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link to="/" className="text-2xl font-bold italic text-foreground">KAYNA</Link>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href="https://www.instagram.com/kayna.xxv" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden sm:flex w-10 h-10 rounded-full border border-border items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
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
          <div className="flex items-center gap-3 mb-12">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            <div>
            <h1 className="text-[2.5rem] lg:text-[3.5rem] font-bold leading-none text-foreground">
                {t.nav.favorites}<span className="italic text-accent">.</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                {products.length} {products.length === 1 ? t.cart.item : t.cart.items}
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-2">{t.cart.empty.replace('panier', 'favoris')}</h2>
              <p className="text-muted-foreground mb-6">
                {t.hero.subtitle}
              </p>
              <Link 
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-full font-bold shadow-gold hover:shadow-gold-glow transition-all"
              >
                {t.hero.cta}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group relative"
                >
                  <div className={`relative rounded-2xl lg:rounded-3xl overflow-hidden bg-card aspect-[3/4] shadow-elegant hover:shadow-gold transition-all duration-500 ${product.out_of_stock ? 'opacity-75' : ''}`}>
                    <img
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={(e) => handleRemove(product.id, e)}
                        className="w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {!product.out_of_stock && (
                        <button 
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary hover:scale-110 transition-all shadow-gold"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Out of stock badge */}
                    {product.out_of_stock && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-bold">
                        {t.product.outOfStock}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-secondary text-lg font-bold mb-1 group-hover:translate-y-[-4px] transition-transform">
                        {product.title}
                      </h3>
                      <span className="text-accent font-bold text-lg">
                        {formatPrice(product)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
