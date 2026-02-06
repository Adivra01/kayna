import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocalization } from "@/hooks/useLocalization";

import categoryTshirt from "@/assets/category-tshirt-new.jpg";
import categoryHoodie from "@/assets/category-hoodie-new.jpg";
import categorySweater from "@/assets/category-sweater-new.jpg";

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
}

const CategorySection = () => {
  const { t, home, isRTL } = useLocalization();

  const categories: Category[] = [
    { id: "01", name: t.shop.tshirts, slug: "tshirts", count: 3, image: categoryTshirt },
    { id: "02", name: t.shop.hoodies, slug: "hoodies", count: 3, image: categoryHoodie },
    { id: "03", name: t.shop.sweaters, slug: "sweaters", count: 3, image: categorySweater },
  ];

  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);

  const getCatDescription = (slug: string) => {
    return home.catDescriptions[slug] || slug;
  };

  return (
    <section id="categories" className="py-28 lg:py-40 bg-primary relative overflow-hidden scroll-mt-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium mb-6 block">{home.catLabel}</span>
            <h2 className="text-[3rem] lg:text-[5rem] font-bold leading-[0.9] mb-16 text-secondary">
              {home.catTitle1}<span className="block italic text-accent">{home.catTitle2}</span>
            </h2>

            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group cursor-pointer relative"
                  onClick={() => setActiveCategory(category)}
                >
                  <div className={`flex items-center justify-between py-6 lg:py-8 border-b transition-all duration-300 ${
                    activeCategory.id === category.id ? 'border-accent/50' : 'border-secondary/10 hover:border-accent/30'
                  }`}>
                    <div className="flex items-center gap-6 lg:gap-8">
                      <span className={`text-sm font-mono transition-colors duration-300 ${
                        activeCategory.id === category.id ? 'text-accent' : 'text-secondary/40'
                      }`}>{category.id}</span>
                      <div>
                        <h3 className={`text-2xl lg:text-4xl font-bold transition-colors duration-300 ${
                          activeCategory.id === category.id ? 'text-accent' : 'text-secondary group-hover:text-accent'
                        }`}>{category.name}</h3>
                        <p className={`text-sm mt-1 transition-all duration-300 ${
                          activeCategory.id === category.id ? 'opacity-100 text-secondary/70' : 'opacity-0 group-hover:opacity-100 text-secondary/50'
                        }`}>{getCatDescription(category.slug)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <span className={`text-sm transition-colors duration-300 ${
                        activeCategory.id === category.id ? 'text-accent' : 'text-secondary/50'
                      }`}>{category.count} {home.catArticles}</span>
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        activeCategory.id === category.id
                          ? 'bg-accent border-accent'
                          : 'border-secondary/20 group-hover:bg-accent group-hover:border-accent'
                      }`}>
                        <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${isRTL ? 'rotate-180' : ''} ${
                          activeCategory.id === category.id ? 'text-primary' : 'text-secondary/50 group-hover:text-primary'
                        }`} />
                      </div>
                    </div>
                  </div>
                  {activeCategory.id === category.id && (
                    <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-1 h-12 bg-accent rounded-full`} />
                  )}
                </div>
              ))}
            </div>

            <Link
              to={`/shop?category=${activeCategory.slug}`}
              className="inline-flex items-center gap-3 mt-12 px-8 py-4 bg-accent text-primary rounded-full font-bold hover:scale-105 transition-transform shadow-gold"
            >
              <span>{home.catSee} {activeCategory.name}</span>
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-dark-lg">
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                loading="lazy"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-secondary/80 text-sm">{home.catActiveCollection}</span>
                </div>
                <h3 className="text-secondary text-3xl lg:text-4xl font-bold mb-2">{activeCategory.name}</h3>
                <p className="text-secondary/70 text-lg">{getCatDescription(activeCategory.slug)}</p>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-accent flex items-center justify-center shadow-gold">
              <span className="text-primary font-bold text-center text-sm leading-tight">{activeCategory.count}<br/>{home.catArticles}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
