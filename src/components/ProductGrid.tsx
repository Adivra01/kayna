import { useRef } from "react";
import { ArrowRight, Play, Lock } from "lucide-react";
import { Link } from "react-router-dom";

import tshirtVideo from "@/assets/videos/tshirt-rotate.mp4";
import hoodieVideo from "@/assets/videos/hoodie-rotate.mp4";
import sweaterVideo from "@/assets/videos/sweater-rotate.mp4";
import tshirt1 from "@/assets/tshirt-1.jpg";

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  video?: string;
  image?: string;
  isComingSoon?: boolean;
  productCount: number;
  priceRange: string;
}

const productCategories: ProductCategory[] = [
  { id: "1", name: "T-Shirts", slug: "tshirts", video: tshirtVideo, productCount: 3, priceRange: "32€ - 39€" },
  { id: "2", name: "Hoodies", slug: "hoodies", video: hoodieVideo, productCount: 3, priceRange: "75€ - 85€" },
  { id: "3", name: "Sweaters", slug: "sweaters", video: sweaterVideo, productCount: 3, priceRange: "59€ - 65€" },
  { id: "4", name: "Joggings", slug: "joggings", image: tshirt1, isComingSoon: true, productCount: 0, priceRange: "Bientôt" },
  { id: "5", name: "Casquettes", slug: "casquettes", image: tshirt1, isComingSoon: true, productCount: 0, priceRange: "Bientôt" },
  { id: "6", name: "Shorts", slug: "shorts", image: tshirt1, isComingSoon: true, productCount: 0, priceRange: "Bientôt" },
];

const ProductGrid = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleHover = (index: number, entering: boolean) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (entering) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <section id="bestsellers" className="py-28 lg:py-40 bg-background relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
          <div>
            <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium mb-6 block">
              Nos Collections
            </span>
            <h2 className="text-[3rem] lg:text-[5rem] font-bold leading-[0.9] text-foreground">
              Nos <span className="italic text-accent">Produits</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-lg">
              Des pièces conçues pour ceux qui n'ont rien à prouver, mais tout à accomplir.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden lg:flex items-center gap-3 text-foreground hover:text-accent transition-colors group px-8 py-4 rounded-full border border-border hover:border-accent/50"
          >
            <span className="font-medium">Voir la boutique</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {productCategories.map((product, index) => (
            <div key={product.id} className={`group ${product.isComingSoon ? 'opacity-70' : ''}`}>
              {product.isComingSoon ? (
                <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-card border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6 border border-accent/30">
                      <Lock className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-secondary text-2xl lg:text-3xl font-bold mb-3">{product.name}</h3>
                    <span className="text-accent font-semibold text-lg uppercase tracking-wider">Bientôt disponible</span>
                  </div>
                </div>
              ) : (
                <Link
                  to={`/shop?category=${product.slug}`}
                  className="block"
                  onMouseEnter={() => handleHover(index, true)}
                  onMouseLeave={() => handleHover(index, false)}
                >
                  <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-card border border-border/50 group-hover:border-accent/30 transition-all duration-300">
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={product.video}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      poster={product.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

                    {/* Play Indicator */}
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-secondary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-secondary/60 text-sm uppercase tracking-wider mb-2 block">
                            {product.productCount} produits
                          </span>
                          <h3 className="text-secondary text-2xl lg:text-3xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {product.name}
                          </h3>
                          <span className="text-accent font-bold text-xl">{product.priceRange}</span>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-gold">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-6 left-6 px-4 py-2 bg-accent text-primary rounded-full text-xs font-bold uppercase tracking-wider shadow-gold">
                      Disponible
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-16 flex justify-center lg:hidden">
          <Link
            to="/shop"
            className="px-12 py-5 rounded-full bg-accent text-primary font-bold shadow-gold hover:scale-105 transition-transform flex items-center gap-3 text-lg"
          >
            <span>Voir la boutique</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
