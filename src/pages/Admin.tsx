import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Plus, Edit, Trash2, LogOut, Package, ImagePlus, X, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
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
  details: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    category: "tshirts",
    tag: "",
    sizes: ["S", "M", "L", "XL"],
    details: [""],
    is_active: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      } else {
        setLoading(false);
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setLoading(false);
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    if (data) {
      setIsAdmin(true);
      fetchProducts();
    } else {
      toast.error("Accès refusé. Vous n'êtes pas administrateur.");
      navigate("/");
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Erreur lors du chargement des produits");
      return;
    }
    
    setProducts(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
        sizes: product.sizes || ["S", "M", "L", "XL"],
        details: product.details?.length ? product.details : [""],
        is_active: product.is_active,
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
        sizes: ["S", "M", "L", "XL"],
        details: [""],
        is_active: true,
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
        details: formData.details.filter(d => d.trim()),
        images: uploadedUrls,
        is_active: formData.is_active,
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
    if (!confirm("Supprimer ce produit ?")) return;

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

    toast.success(currentStatus ? "Produit masqué" : "Produit activé");
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary/90 backdrop-blur-md border-b border-secondary/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl sm:text-2xl font-bold italic text-secondary">KAYNA</Link>
            <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full">ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-secondary/60 text-sm">{user?.email}</span>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Actions */}
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

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
            <p className="text-secondary/60 mb-4">Aucun produit pour le moment</p>
            <button
              onClick={() => openForm()}
              className="text-accent hover:underline"
            >
              Créer votre premier produit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-secondary/5 border border-secondary/10 rounded-2xl overflow-hidden group ${
                  !product.is_active ? "opacity-50" : ""
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
                      {product.is_active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {product.tag && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-primary text-xs font-bold rounded-full">
                      {product.tag}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-secondary mb-1 truncate">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-accent font-bold">{product.price}€</span>
                    <span className="text-secondary/40 text-sm capitalize">{product.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-primary/90 backdrop-blur-sm overflow-y-auto">
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

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Slug URL</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    placeholder="auto-generated"
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Prix (€) *</label>
                    <input
                      type="number"
                      step="0.01"
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
                      <option value="sweaters">Sweaters</option>
                      <option value="jackets">Jackets</option>
                    </select>
                  </div>
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Tag (optionnel)</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    placeholder="NEW, BESTSELLER, etc."
                  />
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
                  <label className="block text-sm font-medium text-secondary mb-2">Tailles</label>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`w-12 h-12 rounded-lg font-bold transition-all ${
                          formData.sizes.includes(size)
                            ? "bg-accent text-primary"
                            : "bg-secondary/10 text-secondary/60"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
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
                          className="flex-1 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary focus:outline-none focus:border-accent"
                          placeholder="Ex: 100% Coton bio"
                        />
                        {formData.details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetail(index)}
                            className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDetail}
                      className="text-accent text-sm hover:underline"
                    >
                      + Ajouter un détail
                    </button>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Images</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {imageFiles.map((file, index) => (
                      <div key={`new-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-secondary/30 flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <ImagePlus className="w-6 h-6 text-secondary/40" />
                    </label>
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between py-3 px-4 bg-secondary/10 rounded-xl">
                  <span className="text-secondary font-medium">Produit actif</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      formData.is_active ? "bg-accent" : "bg-secondary/30"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                        formData.is_active ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-4 border border-secondary/20 text-secondary rounded-xl font-bold hover:bg-secondary/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-4 bg-accent text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <span>Sauvegarde...</span>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{editingProduct ? "Mettre à jour" : "Créer"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
