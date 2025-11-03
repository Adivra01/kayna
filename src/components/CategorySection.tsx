import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Eye } from "lucide-react";
import { Button } from "./ui/button";
import hoodie1 from "@/assets/hoodie-1.jpg";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { id: "01", name: "Jacket", count: 361, active: false },
  { id: "02", name: "Shirt", count: 174, active: true },
  { id: "03", name: "Jeans", count: 368, active: false },
  { id: "04", name: "Outer", count: 117, active: false },
  { id: "05", name: "Shoes", count: 78, active: false },
];

const CategorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate image
      gsap.from(imageRef.current, {
        x: 100,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      // Animate categories
      categoriesRef.current.forEach((cat, index) => {
        if (!cat) return;
        gsap.from(cat, {
          x: -50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Image rotation on scroll
      gsap.to(imageRef.current, {
        rotation: 5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Categories */}
          <div>
            <div className="mb-12">
              <span className="icon-accent text-5xl">✱</span>
              <p className="text-sm text-muted-foreground mt-4 mb-2">[EBST PART]</p>
              <div className="relative">
                <p className="text-sm text-muted-foreground absolute left-0 top-0">[CATEGORIES]</p>
              </div>
            </div>

            <div className="space-y-8">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  ref={(el) => (categoriesRef.current[index] = el)}
                  className={`group cursor-pointer transition-all ${
                    category.active ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-sm text-muted-foreground">[{category.id}]</span>
                    <h3 className="text-heading font-bold group-hover:translate-x-2 transition-transform">
                      {category.name}{" "}
                      <span className="text-muted-foreground">({category.count})</span>
                    </h3>
                    {category.active && (
                      <div className="ml-auto w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {category.active && (
                    <div className="mt-6">
                      <p className="text-muted-foreground mb-6 max-w-md">
                        From everyday essentials to statement pieces, our curated collection is
                        designed to celebrate your style, wherever life takes you.
                      </p>
                      <Button variant="outline" className="rounded-full">
                        SEE PRODUCT <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-[3rem] overflow-hidden aspect-[3/4]">
              <img src={hoodie1} alt="Featured product" className="w-full h-full object-cover" />
              <div className="absolute bottom-8 right-8 icon-accent text-5xl">✱</div>
            </div>
            <div className="absolute -top-8 -right-8 icon-accent text-6xl rotate-12">✱</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
