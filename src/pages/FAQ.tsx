import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, ChevronDown, Package, Truck, CreditCard, RotateCcw, Shield, Mail } from "lucide-react";
import Footer from "@/components/Footer";
import { useLocalization } from "@/hooks/useLocalization";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const faqCategories = [
  {
    title: "Commandes & Paiement",
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        question: "Comment passer une commande ?",
        answer: "Pour passer une commande, ajoutez simplement les articles souhaités à votre panier, sélectionnez votre taille et couleur, puis procédez au paiement. Vous recevrez un email de confirmation une fois votre commande validée.",
        icon: <Package className="w-4 h-4" />
      },
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), le mobile money, et d'autres moyens de paiement locaux selon votre région. Tous les paiements sont sécurisés.",
        icon: <CreditCard className="w-4 h-4" />
      },
      {
        question: "Ma commande est-elle sécurisée ?",
        answer: "Oui, absolument. Nous utilisons le protocole SSL pour chiffrer toutes vos données. Vos informations de paiement ne sont jamais stockées sur nos serveurs.",
        icon: <Shield className="w-4 h-4" />
      },
      {
        question: "Puis-je modifier ou annuler ma commande ?",
        answer: "Une fois la commande validée et payée, elle ne peut plus être modifiée ou annulée car nos produits sont fabriqués à la demande. Veuillez vérifier attentivement votre commande avant de payer.",
        icon: <Package className="w-4 h-4" />
      }
    ]
  },
  {
    title: "Livraison",
    icon: <Truck className="w-5 h-5" />,
    items: [
      {
        question: "Quel est le délai de livraison ?",
        answer: "La livraison est effectuée entre 3 et 15 jours ouvrés selon votre pays de destination. Les commandes sont expédiées dans les 24 à 48 heures suivant la confirmation du paiement.",
        icon: <Truck className="w-4 h-4" />
      },
      {
        question: "Livrez-vous dans mon pays ?",
        answer: "Nous livrons dans la plupart des pays du monde ! Les frais et délais de livraison varient selon la destination. Vous verrez les options disponibles lors du passage de commande.",
        icon: <Truck className="w-4 h-4" />
      },
      {
        question: "Comment suivre ma commande ?",
        answer: "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pourrez suivre votre colis en temps réel sur le site du transporteur.",
        icon: <Package className="w-4 h-4" />
      },
      {
        question: "Que faire si je ne suis pas disponible lors de la livraison ?",
        answer: "Le transporteur vous contactera pour convenir d'une nouvelle date de livraison ou vous proposera un retrait en point relais. Assurez-vous de fournir un numéro de téléphone valide.",
        icon: <Truck className="w-4 h-4" />
      }
    ]
  },
  {
    title: "Retours & Remboursements",
    icon: <RotateCcw className="w-5 h-5" />,
    items: [
      {
        question: "Puis-je retourner un article ?",
        answer: "Non, nous n'acceptons pas les retours. Nos produits sont fabriqués à la demande, ce qui rend les retours impossibles. Nous vous conseillons de bien vérifier votre taille et couleur avant de commander.",
        icon: <RotateCcw className="w-4 h-4" />
      },
      {
        question: "Puis-je obtenir un remboursement ?",
        answer: "Non, aucun remboursement n'est effectué après confirmation de la commande. Toutes les ventes sont définitives. Seuls les produits présentant un défaut de fabrication peuvent faire l'objet d'un échange.",
        icon: <CreditCard className="w-4 h-4" />
      },
      {
        question: "Que faire si mon article est défectueux ?",
        answer: "Si vous recevez un article présentant un défaut de fabrication (couture défectueuse, impression incorrecte), contactez-nous dans les 48 heures avec des photos du défaut. Nous procéderons à un échange.",
        icon: <Package className="w-4 h-4" />
      },
      {
        question: "Pourquoi n'acceptez-vous pas les retours ?",
        answer: "Nos produits sont fabriqués à la demande spécifiquement pour vous, ce qui nous permet de réduire le gaspillage et de proposer des pièces uniques. Cette politique nous permet également de maintenir des prix accessibles.",
        icon: <RotateCcw className="w-4 h-4" />
      }
    ]
  },
  {
    title: "Produits & Tailles",
    icon: <Package className="w-5 h-5" />,
    items: [
      {
        question: "Comment choisir ma taille ?",
        answer: "Consultez notre guide des tailles disponible sur chaque page produit. Si vous hésitez entre deux tailles, nous recommandons généralement de prendre la taille supérieure pour un confort optimal.",
        icon: <Package className="w-4 h-4" />
      },
      {
        question: "Les couleurs sont-elles fidèles aux photos ?",
        answer: "Nous faisons notre maximum pour que les photos soient représentatives, mais les couleurs peuvent légèrement varier selon votre écran. Chaque article est unique !",
        icon: <Package className="w-4 h-4" />
      },
      {
        question: "Quelle est la qualité de vos produits ?",
        answer: "Nous utilisons uniquement des matériaux premium : coton bio, tissus de haute qualité, et des techniques d'impression durables. Nos produits sont conçus pour durer.",
        icon: <Shield className="w-4 h-4" />
      },
      {
        question: "Comment entretenir mes vêtements KAYNA ?",
        answer: "Pour préserver vos vêtements, nous recommandons un lavage à 30°C, retourné sur l'envers. Évitez le sèche-linge et repassez sur l'envers à basse température.",
        icon: <Package className="w-4 h-4" />
      }
    ]
  },
  {
    title: "Confidentialité & Données",
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        question: "Quelles données collectez-vous ?",
        answer: "Nous collectons uniquement les données nécessaires au traitement de votre commande (nom, email, adresse) et votre adresse IP pour déterminer votre pays et adapter la langue/devise du site.",
        icon: <Shield className="w-4 h-4" />
      },
      {
        question: "Mes données sont-elles vendues à des tiers ?",
        answer: "Jamais. Vos données personnelles ne sont ni vendues, ni partagées avec des tiers sans votre autorisation préalable. Elles sont utilisées uniquement pour traiter vos commandes et améliorer notre service.",
        icon: <Shield className="w-4 h-4" />
      },
      {
        question: "Comment puis-je supprimer mes données ?",
        answer: "Vous pouvez nous contacter à tout moment à contact@kayna.store pour demander la suppression de vos données personnelles conformément au RGPD.",
        icon: <Mail className="w-4 h-4" />
      }
    ]
  }
];

const FAQ = () => {
  const { isRTL } = useLocalization();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-background/80 border-b border-border">
        <Link to="/" className="text-2xl font-bold italic text-foreground">KAYNA</Link>
        <Link 
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </header>

      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trouvez rapidement des réponses à vos questions. Si vous ne trouvez pas ce que vous cherchez, 
              n'hésitez pas à nous contacter.
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-card rounded-2xl p-6 border border-border text-center">
              <Truck className="w-8 h-8 text-accent mx-auto mb-3" />
              <p className="font-bold text-foreground">Livraison 3-15 jours</p>
              <p className="text-sm text-muted-foreground">Selon votre pays</p>
            </div>
            <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20 text-center">
              <RotateCcw className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="font-bold text-foreground">Pas de retours</p>
              <p className="text-sm text-muted-foreground">Ventes définitives</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border text-center">
              <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
              <p className="font-bold text-foreground">Paiement sécurisé</p>
              <p className="text-sm text-muted-foreground">SSL / Chiffrement</p>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <section key={categoryIndex} className="bg-card rounded-3xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 p-6 border-b border-border bg-muted/30">
                  <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    {category.icon}
                  </span>
                  <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
                </div>
                
                <div className="divide-y divide-border">
                  {category.items.map((item, itemIndex) => {
                    const itemId = `${categoryIndex}-${itemIndex}`;
                    const isOpen = openItems.includes(itemId);
                    
                    return (
                      <div key={itemIndex}>
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-accent">{item.icon}</span>
                            <span className="font-medium text-foreground">{item.question}</span>
                          </div>
                          <ChevronDown 
                            className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 -mt-2">
                            <p className="text-muted-foreground leading-relaxed pl-7">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Section */}
          <section className="mt-12 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-8 border border-accent/20 text-center">
            <HelpCircle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Vous n'avez pas trouvé votre réponse ?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter, nous répondons généralement sous 24h.
            </p>
            <a 
              href="mailto:contact@kayna.store"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all"
            >
              <Mail className="w-5 h-5" />
              Nous contacter
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
