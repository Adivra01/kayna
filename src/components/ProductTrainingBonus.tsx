import { GraduationCap, Rocket, Building2, ArrowRight, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ProductTrainingBonus = () => {
  return (
    <div className="mt-8 space-y-4">
      {/* Header Banner */}
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

          {/* Formation Cards */}
          <div className="grid gap-4">
            {/* Formation 1 - Digital */}
            <div className="group p-4 rounded-xl bg-secondary/5 border border-secondary/10 hover:border-accent/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-colors">
                  <Rocket className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-secondary">Produits Digitaux & Services</h4>
                    <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded-full uppercase tracking-wider">Choix 1</span>
                  </div>
                  <p className="text-secondary/60 text-sm leading-relaxed">
                    Apprends à <span className="text-secondary/80 font-medium">vendre tes compétences en ligne</span> — créer un produit digital, 
                    trouver tes clients, et générer des revenus avec ce que tu sais déjà faire.
                  </p>
                </div>
              </div>
            </div>

            {/* Formation 2 - Immobilier */}
            <div className="group p-4 rounded-xl bg-secondary/5 border border-secondary/10 hover:border-accent/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-colors">
                  <Building2 className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-secondary">Immobilier Locatif en Afrique</h4>
                    <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded-full uppercase tracking-wider">Choix 2</span>
                  </div>
                  <p className="text-secondary/60 text-sm leading-relaxed">
                    Découvre comment générer <span className="text-secondary/80 font-medium">400 000 FCFA/mois</span> grâce à l'immobilier locatif en Afrique — 
                    de la recherche du bien à la mise en location.
                  </p>
                </div>
              </div>
            </div>
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

export default ProductTrainingBonus;
