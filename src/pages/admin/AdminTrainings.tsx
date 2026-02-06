import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GraduationCap, ExternalLink, Rocket, Building2, Link2 } from "lucide-react";
import { showToast } from "@/lib/toast";

interface Training {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  url: string | null;
  is_active: boolean;
  created_at: string;
}

const ICON_OPTIONS = [
  { value: "Rocket", label: "Rocket", Icon: Rocket },
  { value: "Building2", label: "Immobilier", Icon: Building2 },
  { value: "GraduationCap", label: "Graduation", Icon: GraduationCap },
];

export default function AdminTrainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIcon, setFormIcon] = useState("GraduationCap");
  const [formUrl, setFormUrl] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTrainings = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("trainings")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTrainings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormIcon("GraduationCap");
    setFormUrl("");
    setFormActive(true);
    setEditingTraining(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (training: Training) => {
    setEditingTraining(training);
    setFormName(training.name);
    setFormDescription(training.description || "");
    setFormIcon(training.icon || "GraduationCap");
    setFormUrl(training.url || "");
    setFormActive(training.is_active);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      showToast.error("Le nom est obligatoire");
      return;
    }

    setSaving(true);

    const payload = {
      name: formName.trim(),
      description: formDescription.trim() || null,
      icon: formIcon,
      url: formUrl.trim() || null,
      is_active: formActive,
    };

    if (editingTraining) {
      const { error } = await (supabase as any)
        .from("trainings")
        .update(payload)
        .eq("id", editingTraining.id);

      if (error) {
        showToast.error("Erreur lors de la mise à jour");
      } else {
        showToast.success("Formation mise à jour");
      }
    } else {
      const { error } = await (supabase as any)
        .from("trainings")
        .insert(payload);

      if (error) {
        showToast.error("Erreur lors de la création");
      } else {
        showToast.success("Formation créée");
      }
    }

    setSaving(false);
    setShowForm(false);
    resetForm();
    fetchTrainings();
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await (supabase as any)
      .from("trainings")
      .delete()
      .eq("id", deleteId);

    if (error) {
      showToast.error("Erreur lors de la suppression");
    } else {
      showToast.success("Formation supprimée");
    }

    setDeleteId(null);
    fetchTrainings();
  };

  const toggleActive = async (training: Training) => {
    const { error } = await (supabase as any)
      .from("trainings")
      .update({ is_active: !training.is_active })
      .eq("id", training.id);

    if (!error) {
      fetchTrainings();
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-secondary flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-accent" />
              Formations
            </h1>
            <p className="text-secondary/60 mt-1">Gérer les formations offertes avec chaque achat</p>
          </div>
          <Button onClick={openCreate} className="bg-accent text-primary hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une formation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/10">
            <p className="text-secondary/60 text-sm">Total</p>
            <p className="text-2xl font-bold text-secondary">{trainings.length}</p>
          </div>
          <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/10">
            <p className="text-secondary/60 text-sm">Actives</p>
            <p className="text-2xl font-bold text-accent">{trainings.filter(t => t.is_active).length}</p>
          </div>
          <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/10">
            <p className="text-secondary/60 text-sm">Avec lien</p>
            <p className="text-2xl font-bold text-secondary">{trainings.filter(t => t.url).length}</p>
          </div>
        </div>

        {/* Trainings List */}
        {loading ? (
          <div className="text-center py-12 text-secondary/50">Chargement...</div>
        ) : trainings.length === 0 ? (
          <div className="text-center py-16 bg-secondary/5 rounded-2xl border border-secondary/10">
            <GraduationCap className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
            <p className="text-secondary/60 mb-4">Aucune formation</p>
            <Button onClick={openCreate} className="bg-accent text-primary">
              <Plus className="w-4 h-4 mr-2" /> Créer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {trainings.map((training) => {
              const IconOption = ICON_OPTIONS.find(i => i.value === training.icon);
              const IconComponent = IconOption?.Icon || GraduationCap;

              return (
                <div
                  key={training.id}
                  className={`bg-secondary/5 rounded-2xl border p-6 transition-all ${
                    training.is_active ? "border-secondary/10" : "border-secondary/5 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-secondary text-lg">{training.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          training.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-secondary/20 text-secondary/50"
                        }`}>
                          {training.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {training.description && (
                        <p className="text-secondary/60 text-sm mb-2 line-clamp-2">{training.description}</p>
                      )}
                      {training.url && (
                        <a
                          href={training.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-accent text-sm hover:underline"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          {training.url.length > 50 ? training.url.slice(0, 50) + "..." : training.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {!training.url && (
                        <span className="text-secondary/40 text-sm italic">Aucun lien configuré</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={training.is_active}
                        onCheckedChange={() => toggleActive(training)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(training)}
                        className="text-secondary/60 hover:text-accent"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(training.id)}
                        className="text-secondary/60 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); resetForm(); } }}>
        <DialogContent className="bg-primary border-secondary/20 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-secondary">
              {editingTraining ? "Modifier la formation" : "Nouvelle formation"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-secondary">Nom *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Produits Digitaux & Services"
                className="bg-secondary/5 border-secondary/20 text-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-secondary">Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Description de la formation..."
                className="bg-secondary/5 border-secondary/20 text-secondary min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-secondary">Icône</Label>
              <div className="flex gap-3">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormIcon(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                      formIcon === opt.value
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-secondary/20 text-secondary/60 hover:border-accent/40"
                    }`}
                  >
                    <opt.Icon className="w-4 h-4" />
                    <span className="text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-secondary">URL de la formation</Label>
              <Input
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://..."
                className="bg-secondary/5 border-secondary/20 text-secondary"
              />
              <p className="text-secondary/40 text-xs">
                Ce lien sera joint à la facture du client après paiement
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-xl">
              <div>
                <Label className="text-secondary">Active</Label>
                <p className="text-secondary/50 text-xs">Visible par les clients</p>
              </div>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}
              className="border-secondary/20 text-secondary">
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-accent text-primary hover:bg-accent/90">
              {saving ? "Enregistrement..." : editingTraining ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-primary border-secondary/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-secondary">Supprimer cette formation ?</DialogTitle>
          </DialogHeader>
          <p className="text-secondary/60 text-sm">
            Cette action est irréversible. Les commandes existantes garderont la référence.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-secondary/20 text-secondary">
              Annuler
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
