import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ImagePlus, 
  X, 
  Eye, 
  EyeOff,
  Archive,
  Search
} from "lucide-react";
import { toast } from "sonner";

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
  stock_quantity: number;
  out_of_stock: boolean;
  created_at: string;
}

const FIXED_SIZES = ["S", "M", "L", "XL", "XXL"];
const FIXED_COLORS = [
  { name: "noir", hex: "#0A0A0A" },
  { name: "blanc", hex: "#F5F5F0" },
  { name: "beige", hex: "#D4C4A8" },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "archived">("all");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    category: "tshirts",
    tag: "",
    sizes: ["S", "M", "L", "XL"],
    colors: ["noir", "blanc", "beige"],
    details: [""],
    is_active: true,
    stock_quantity: 100,
    out_of_stock: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Erreur lors du chargement des produits");
      return;
    }
    
    // Map data to include default values for new fields (cast to any for new columns)
    const mappedProducts = (data || []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      tag: p.tag,
      sizes: p.sizes || [],
      colors: p.colors || [],
      details: p.details || [],
      images: p.images || [],
      is_active: p.is_active ?? true,
      stock_quantity: p.stock_quantity ?? 0,
      out_of_stock: p.out_of_stock ?? false,
      created_at: p.created_at,
    })) as Product[];
    
    setProducts(mappedProducts);
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const openForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        slug: product.slug,
        description: product.description || "",
        price: product.price.toString(),
        category: product.category,
        tag: product.tag || "",
        sizes: product.sizes || FIXED_SIZES,
        colors: product.colors || ["noir", "blanc", "beige"],
        details: product.details?.length ? product.details : [""],
        is_active: product.is_active,
        stock_quantity: product.stock_quantity || 0,
        out_of_stock: product.out_of_stock || false,
      });
      setExistingImages(product.images || []);
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        slug: "",
        description: "",
        price: "",
        category: "tshirts",
        tag: "",
        sizes: FIXED_SIZES,
        colors: ["noir", "blanc", "beige"],
        details: [""],
        is_active: true,
        stock_quantity: 100,
        out_of_stock: false,
      });
      setExistingImages([]);
    }
    setImageFiles([]);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setImageFiles([]);
    setExistingImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addDetail = () => {
    setFormData(prev => ({ ...prev, details: [...prev.details, ""] }));
  };

  const updateDetail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((d, i) => i === index ? value : d),
    }));
  };

  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload new images
      const uploadedUrls: string[] = [...existingImages];
      
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        
        uploadedUrls.push(publicUrl);
      }

      const productData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description || null,
        price: parseFloat(formData.price),
        category: formData.category,
        tag: formData.tag || null,
        sizes: formData.sizes,
        colors: formData.colors,
        details: formData.details.filter(d => d.trim()),
        images: uploadedUrls,
        is_active: formData.is_active,
        stock_quantity: formData.stock_quantity,
        out_of_stock: formData.out_of_stock,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        
        if (error) throw error;
        toast.success("Produit mis à jour !");
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);
        
        if (error) throw error;
        toast.success("Produit créé !");
      }

      closeForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    toast.success("Produit supprimé");
    fetchProducts();
  };

  const toggleProductActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    
    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }

    toast.success(currentStatus ? "Produit archivé" : "Produit activé");
    fetchProducts();
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterActive === "all" ? true :
      filterActive === "active" ? product.is_active :
      !product.is_active;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Produits</h1>
            <p className="text-secondary/60">{products.length} produit{products.length > 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => openForm()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-bold shadow-gold hover:shadow-gold-glow hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau produit</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-12 pr-4 py-3 bg-secondary/5 border border-secondary/10 rounded-xl text-secondary focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "archived"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterActive(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterActive === filter
                    ? "bg-accent text-primary"
                    : "bg-secondary/5 text-secondary/70 hover:bg-secondary/10"
                }`}
              >
                {filter === "all" ? "Tous" : filter === "active" ? "Actifs" : "Archivés"}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
            <p className="text-secondary/60 mb-4">
              {searchQuery ? "Aucun produit trouvé" : "Aucun produit pour le moment"}
            </p>
            {!searchQuery && (
              <button onClick={() => openForm()} className="text-accent hover:underline">
                Créer votre premier produit
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-secondary/5 border border-secondary/10 rounded-2xl overflow-hidden group ${
                  !product.is_active ? "opacity-60" : ""
                }`}
              >
                <div className="aspect-square relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                      <ImagePlus className="w-12 h-12 text-secondary/20" />
                    </div>
                  )}
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => openForm(product)}
                      className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleProductActive(product.id, product.is_active)}
                      className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      {product.is_active ? <Archive className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {!product.is_active && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-secondary/80 text-primary text-xs font-bold rounded-full">
                      Archivé
                    </div>
                  )}
                  {product.tag && product.is_active && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-primary text-xs font-bold rounded-full">
                      {product.tag}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-secondary mb-1 truncate">{product.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent font-bold">{product.price.toLocaleString()} FCFA</span>
                    <span className="text-secondary/40 text-sm capitalize">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${product.out_of_stock ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {product.out_of_stock ? 'Rupture' : `Stock: ${product.stock_quantity}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto bg-secondary/5 border border-secondary/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary">
                  {editingProduct ? "Modifier le produit" : "Nouveau produit"}
                </h2>
                <button
                  onClick={closeForm}
                  className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-secondary/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      }));
                    }}
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Prix (FCFA) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Catégorie *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    >
                      <option value="tshirts">T-Shirts</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="sweaters">Pulls</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Tailles disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {FIXED_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.sizes.includes(size)
                            ? "bg-accent text-primary border-accent"
                            : "bg-transparent text-secondary/60 border-secondary/20 hover:border-secondary/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Couleurs disponibles</label>
                  <div className="flex flex-wrap gap-3">
                    {FIXED_COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => toggleColor(color.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          formData.colors.includes(color.name)
                            ? "bg-accent/20 border-accent"
                            : "bg-transparent border-secondary/20 hover:border-secondary/40"
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full border border-secondary/20" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-secondary capitalize">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Management */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Quantité en stock</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 0;
                        setFormData(prev => ({ 
                          ...prev, 
                          stock_quantity: qty,
                          out_of_stock: qty === 0 ? true : prev.out_of_stock
                        }));
                      }}
                      className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center justify-between py-3 px-4 bg-secondary/5 rounded-xl h-[50px]">
                      <span className="text-secondary text-sm">Rupture de stock</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, out_of_stock: !prev.out_of_stock }))}
                        className={`w-12 h-7 rounded-full transition-all ${
                          formData.out_of_stock ? "bg-red-500" : "bg-secondary/20"
                        }`}
                      >
                        <span 
                          className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                            formData.out_of_stock ? "translate-x-6" : "translate-x-1"
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Tag (optionnel)</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                    placeholder="Ex: Nouveau, Bestseller, -20%"
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Détails produit</label>
                  <div className="space-y-2">
                    {formData.details.map((detail, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => updateDetail(index, e.target.value)}
                          placeholder="Ex: 100% Coton Premium"
                          className="flex-1 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                        />
                        {formData.details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetail(index)}
                            className="w-12 h-12 rounded-xl border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDetail}
                      className="text-sm text-accent hover:underline"
                    >
                      + Ajouter un détail
                    </button>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Images</label>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="aspect-square relative rounded-xl overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {imageFiles.map((file, index) => (
                      <div key={`new-${index}`} className="aspect-square relative rounded-xl overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-secondary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                      <ImagePlus className="w-6 h-6 text-secondary/40 mb-1" />
                      <span className="text-xs text-secondary/40">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between py-3 px-4 bg-secondary/5 rounded-xl">
                  <span className="text-secondary">Produit actif (visible sur le site)</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                    className={`w-12 h-7 rounded-full transition-all ${
                      formData.is_active ? "bg-accent" : "bg-secondary/20"
                    }`}
                  >
                    <span 
                      className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                        formData.is_active ? "translate-x-6" : "translate-x-1"
                      }`} 
                    />
                  </button>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-6 py-3 border border-secondary/20 rounded-xl text-secondary hover:bg-secondary/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all disabled:opacity-50"
                  >
                    {saving ? "Enregistrement..." : editingProduct ? "Mettre à jour" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
