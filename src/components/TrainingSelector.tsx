import { useState, useEffect } from "react";
import { GraduationCap, Rocket, Building2, Gift, Sparkles, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";

interface Training {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  url: string | null;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Rocket,
  Building2,
  GraduationCap,
};

const TrainingSelector = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedTrainingId, setSelectedTraining } = useCart();

  useEffect(() => {
    const fetchTrainings = async () => {
      const { data, error } = await supabase
        .from("trainings")
        .select("id, name, description, icon, url")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setTrainings(data);
        // Auto-select first if none selected
        if (!selectedTrainingId && data.length > 0) {
          setSelectedTraining(data[0].id);
        }
      }
      setLoading(false);
    };

    fetchTrainings();
  }, []);

  if (loading || trainings.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="relative overflow-hidden rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
              <Gift className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-secondary text-lg">Formation offerte avec ton achat</h3>
              <p className="text-accent text-sm font-medium">Choisis ta formation gratuite 🎁</p>
            </div>
          </div>

          <p className="text-secondary/70 text-sm mb-6 leading-relaxed">
            Chaque achat KAYNA t'offre <span className="text-accent font-semibold">une formation complète</span> pour passer à l'action. 
            Parce que porter KAYNA, c'est s'engager à se dépasser — pas seulement en style, mais dans la vie.
          </p>

          {/* Training Cards */}
          <div className="grid gap-4">
            {trainings.map((training, index) => {
              const IconComponent = ICON_MAP[training.icon || "GraduationCap"] || GraduationCap;
              const isSelected = selectedTrainingId === training.id;

              return (
                <button
                  key={training.id}
                  type="button"
                  onClick={() => setSelectedTraining(training.id)}
                  className={`group p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-accent/15 border-2 border-accent/50 shadow-gold"
                      : "bg-secondary/5 border-2 border-transparent hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? "bg-accent/30" : "bg-accent/15 group-hover:bg-accent/25"
                    }`}>
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-secondary">{training.name}</h4>
                        <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Choix {index + 1}
                        </span>
                      </div>
                      {training.description && (
                        <p className="text-secondary/60 text-sm leading-relaxed">
                          {training.description}
                        </p>
                      )}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                      isSelected
                        ? "border-accent bg-accent"
                        : "border-secondary/30"
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Justification */}
          <div className="mt-5 pt-5 border-t border-secondary/10">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-secondary/70 text-sm leading-relaxed">
                  <span className="text-secondary font-semibold">C'est ça, la mission KAYNA</span> — t'inciter à passer à l'action. 
                  Tu n'achètes pas qu'un vêtement. Tu investis dans ta transformation. Le prix reflète 
                  un <span className="text-accent font-medium">vêtement premium</span> + une <span className="text-accent font-medium">formation concrète</span> pour 
                  commencer à construire ta liberté financière.
                </p>
              </div>
            </div>
            <Link 
              to="/why-this-price" 
              className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:underline mt-3 ml-8"
            >
              Pourquoi ce prix ?
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSelector;
