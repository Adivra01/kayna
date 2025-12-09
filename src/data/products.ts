import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import hoodie1 from "@/assets/hoodie-1.jpg";
import sweater1 from "@/assets/sweater-1.jpg";
import jacket1 from "@/assets/jacket-1.jpg";

export interface Product {
  id: string;
  slug: string;
  images: string[];
  title: string;
  price: number;
  category: string;
  tag?: string;
  description: string;
  details: string[];
  sizes: string[];
}

export const products: Product[] = [
  { 
    id: "1", 
    slug: "jacket-ikigai",
    images: [jacket1, hoodie1, sweater1], 
    title: "Jacket Ikigai", 
    price: 89, 
    category: "jackets", 
    tag: "NEW",
    description: "La veste qui incarne ta détermination. Coupe moderne, matériaux premium, confort absolu.",
    details: ["100% Coton premium", "Doublure intérieure", "Poches zippées", "Coupe regular"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  { 
    id: "2", 
    slug: "tee-essential-olive",
    images: [tshirt1, tshirt2, hoodie1], 
    title: "Tee Essential Olive", 
    price: 35, 
    category: "tshirts",
    description: "L'essentiel KAYNA. Un t-shirt qui parle de toi sans un mot.",
    details: ["100% Coton bio", "240g/m²", "Coupe regular", "Col renforcé"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  { 
    id: "3", 
    slug: "hoodie-classic",
    images: [hoodie1, sweater1, jacket1], 
    title: "Hoodie Classic", 
    price: 75, 
    category: "hoodies",
    description: "Le confort d'un guerrier. Chaleur et style pour affronter chaque jour.",
    details: ["80% Coton, 20% Polyester", "400g/m²", "Capuche doublée", "Poche kangourou"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  { 
    id: "4", 
    slug: "crewneck-elite",
    images: [sweater1, tshirt1, hoodie1], 
    title: "Crewneck Elite", 
    price: 65, 
    category: "sweaters",
    description: "L'élégance discrète. Pour ceux qui n'ont rien à prouver.",
    details: ["100% Coton premium", "320g/m²", "Finitions côtelées", "Coupe regular"],
    sizes: ["S", "M", "L", "XL"]
  },
  { 
    id: "5", 
    slug: "tee-statement",
    images: [tshirt2, tshirt1, sweater1], 
    title: "Tee Statement", 
    price: 39, 
    category: "tshirts",
    description: "Fais une déclaration. Ce t-shirt dit ce que tu penses.",
    details: ["100% Coton bio", "240g/m²", "Impression HD", "Coupe oversized"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  { 
    id: "6", 
    slug: "hoodie-premium",
    images: [hoodie1, jacket1, sweater1], 
    title: "Hoodie Premium", 
    price: 85, 
    category: "hoodies", 
    tag: "BESTSELLER",
    description: "Notre best-seller. Le hoodie qui a conquis des milliers de guerriers.",
    details: ["85% Coton, 15% Polyester", "450g/m²", "Capuche premium", "Broderie exclusive"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  { 
    id: "7", 
    slug: "tee-minimal",
    images: [tshirt1, tshirt2, hoodie1], 
    title: "Tee Minimal", 
    price: 32, 
    category: "tshirts",
    description: "La puissance de la simplicité. Moins, c'est plus.",
    details: ["100% Coton bio", "200g/m²", "Coupe slim", "Logo discret"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  { 
    id: "8", 
    slug: "sweater-comfort",
    images: [sweater1, hoodie1, tshirt1], 
    title: "Sweater Comfort", 
    price: 59, 
    category: "sweaters",
    description: "Le confort ultime. Pour les moments où tu te ressources.",
    details: ["100% Coton premium", "280g/m²", "Finitions soignées", "Coupe relaxed"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
