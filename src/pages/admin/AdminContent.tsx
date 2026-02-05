import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Save, FileText, Image, Video, RefreshCw, Search, ChevronDown, ChevronRight } from "lucide-react";
import { showToast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SiteContent {
  id: string;
  page_name: string;
  section_name: string;
  content_key: string;
  content_type: string;
  content_value: string;
  updated_at: string;
}

interface GroupedContent {
  [page: string]: {
    [section: string]: SiteContent[];
  };
}

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPages, setExpandedPages] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("page_name")
      .order("section_name")
      .order("content_key");

    if (error) {
      showToast.error("Erreur lors du chargement du contenu");
      return;
    }

    setContent(data || []);
    // Expand first page by default
    if (data && data.length > 0) {
      const firstPage = data[0].page_name;
      setExpandedPages([firstPage]);
    }
    setLoading(false);
  };

  const handleSave = async (item: SiteContent) => {
    const newValue = editedContent[item.id] ?? item.content_value;
    setSaving(item.id);

    const { error } = await supabase
      .from("site_content")
      .update({ content_value: newValue })
      .eq("id", item.id);

    if (error) {
      showToast.error("Erreur lors de la sauvegarde");
    } else {
      showToast.success("Contenu mis à jour");
      setEditedContent((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
      fetchContent();
    }
    setSaving(null);
  };

  const groupContent = (): GroupedContent => {
    const filtered = searchQuery
      ? content.filter(
          (c) =>
            c.content_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.content_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.page_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.section_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : content;

    return filtered.reduce((acc, item) => {
      if (!acc[item.page_name]) acc[item.page_name] = {};
      if (!acc[item.page_name][item.section_name]) acc[item.page_name][item.section_name] = [];
      acc[item.page_name][item.section_name].push(item);
      return acc;
    }, {} as GroupedContent);
  };

  const togglePage = (page: string) => {
    setExpandedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4 text-blue-400" />;
      case "video":
        return <Video className="w-4 h-4 text-purple-400" />;
      case "rich_text":
        return <FileText className="w-4 h-4 text-green-400" />;
      default:
        return <FileText className="w-4 h-4 text-secondary/50" />;
    }
  };

  const formatKey = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatPage = (page: string) => {
    const names: Record<string, string> = {
      home: "Page d'accueil",
      about: "Page À propos",
      legal: "Pages légales",
      faq: "FAQ",
    };
    return names[page] || page;
  };

  const formatSection = (section: string) => {
    const names: Record<string, string> = {
      hero: "Section Hero",
      story: "Section Histoire",
      about: "Section À propos",
      collection: "Section Collection",
      brand_promise: "Promesses de marque",
      privacy: "Politique de confidentialité",
      terms: "CGV",
      notice: "Mentions légales",
      header: "En-tête",
    };
    return names[section] || section;
  };

  const grouped = groupContent();

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Gestion du contenu</h1>
            <p className="text-secondary/60">Modifiez les textes et médias de votre site</p>
          </div>
          <button
            onClick={fetchContent}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-secondary/20 rounded-xl text-secondary/70 hover:bg-secondary/10 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher du contenu..."
            className="pl-12 bg-secondary/5 border-secondary/10 text-secondary"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([page, sections]) => (
              <div key={page} className="bg-secondary/5 border border-secondary/10 rounded-2xl overflow-hidden">
                {/* Page Header */}
                <button
                  onClick={() => togglePage(page)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedPages.includes(page) ? (
                      <ChevronDown className="w-5 h-5 text-accent" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-secondary/50" />
                    )}
                    <span className="font-bold text-secondary">{formatPage(page)}</span>
                    <span className="text-xs text-secondary/40 bg-secondary/10 px-2 py-1 rounded-full">
                      {Object.values(sections).flat().length} éléments
                    </span>
                  </div>
                </button>

                {/* Sections */}
                {expandedPages.includes(page) && (
                  <div className="border-t border-secondary/10">
                    {Object.entries(sections).map(([section, items]) => {
                      const sectionKey = `${page}-${section}`;
                      return (
                        <div key={sectionKey} className="border-b border-secondary/5 last:border-0">
                          {/* Section Header */}
                          <button
                            onClick={() => toggleSection(sectionKey)}
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-secondary/5 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {expandedSections.includes(sectionKey) ? (
                                <ChevronDown className="w-4 h-4 text-accent" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-secondary/40" />
                              )}
                              <span className="text-secondary/80">{formatSection(section)}</span>
                            </div>
                            <span className="text-xs text-secondary/30">{items.length}</span>
                          </button>

                          {/* Content Items */}
                          {expandedSections.includes(sectionKey) && (
                            <div className="px-6 pb-4 space-y-4">
                              {items.map((item) => {
                                const currentValue = editedContent[item.id] ?? item.content_value;
                                const hasChanges = editedContent[item.id] !== undefined;

                                return (
                                  <div key={item.id} className="bg-primary/50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        {getContentIcon(item.content_type)}
                                        <span className="text-sm font-medium text-secondary">
                                          {formatKey(item.content_key)}
                                        </span>
                                      </div>
                                      <span className="text-xs text-secondary/30 capitalize">
                                        {item.content_type}
                                      </span>
                                    </div>

                                    {item.content_type === "rich_text" ? (
                                      <Textarea
                                        value={currentValue}
                                        onChange={(e) =>
                                          setEditedContent((prev) => ({
                                            ...prev,
                                            [item.id]: e.target.value,
                                          }))
                                        }
                                        className="bg-secondary/10 border-secondary/20 text-secondary min-h-[150px]"
                                        placeholder="Contenu..."
                                      />
                                    ) : item.content_type === "image" || item.content_type === "video" ? (
                                      <div className="space-y-2">
                                        <Input
                                          value={currentValue}
                                          onChange={(e) =>
                                            setEditedContent((prev) => ({
                                              ...prev,
                                              [item.id]: e.target.value,
                                            }))
                                          }
                                          className="bg-secondary/10 border-secondary/20 text-secondary"
                                          placeholder={`URL ${item.content_type}...`}
                                        />
                                        {currentValue && item.content_type === "image" && (
                                          <img
                                            src={currentValue}
                                            alt="Preview"
                                            className="w-32 h-20 object-cover rounded-lg"
                                          />
                                        )}
                                      </div>
                                    ) : (
                                      <Input
                                        value={currentValue}
                                        onChange={(e) =>
                                          setEditedContent((prev) => ({
                                            ...prev,
                                            [item.id]: e.target.value,
                                          }))
                                        }
                                        className="bg-secondary/10 border-secondary/20 text-secondary"
                                        placeholder="Texte..."
                                      />
                                    )}

                                    {hasChanges && (
                                      <button
                                        onClick={() => handleSave(item)}
                                        disabled={saving === item.id}
                                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-lg font-medium text-sm hover:shadow-gold transition-all disabled:opacity-50"
                                      >
                                        {saving === item.id ? (
                                          <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Save className="w-4 h-4" />
                                        )}
                                        Sauvegarder
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}