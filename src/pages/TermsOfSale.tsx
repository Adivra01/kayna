import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Package, CreditCard, Truck, XCircle, AlertTriangle, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import { useLocalization } from "@/hooks/useLocalization";

const TermsOfSale = () => {
  const { isRTL } = useLocalization();

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
              <FileText className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Conditions Générales de Vente
            </h1>
            <p className="text-muted-foreground text-lg">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Préambule */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Préambule</h2>
              <p className="text-muted-foreground leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits effectuées sur le site 
                KAYNA. Toute commande passée sur notre site implique l'acceptation sans réserve des présentes CGV. 
                Nous vous invitons à les lire attentivement avant toute commande.
              </p>
            </section>

            {/* Article 1 - Produits */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-accent" />
                Article 1 - Produits
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Les produits proposés à la vente sont ceux qui figurent sur le site KAYNA, dans la limite des stocks disponibles. 
                  Chaque produit est accompagné d'un descriptif établi par nos soins.
                </p>
                <p>
                  Les photographies des produits sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite 
                  avec le produit proposé, notamment en ce qui concerne les couleurs qui peuvent varier selon les écrans.
                </p>
                <p>
                  KAYNA se réserve le droit de modifier à tout moment l'assortiment de produits. Les produits sont fournis 
                  tels que décrits sur le site et conformes à la législation française en vigueur.
                </p>
              </div>
            </section>

            {/* Article 2 - Prix */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-accent" />
                Article 2 - Prix et Paiement
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Les prix de nos produits sont indiqués en Francs CFA (XOF) et sont adaptés automatiquement selon votre 
                  localisation géographique. Les prix sont susceptibles d'être modifiés à tout moment, mais les produits 
                  seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
                </p>
                <p>
                  Le paiement s'effectue en ligne au moment de la commande. Nous acceptons les moyens de paiement suivants : 
                  cartes bancaires (Visa, Mastercard), mobile money, et autres moyens de paiement locaux selon votre région.
                </p>
                <p>
                  La commande est considérée comme définitive après confirmation du paiement. Un email de confirmation 
                  vous sera envoyé dès réception du paiement.
                </p>
              </div>
            </section>

            {/* Article 3 - Livraison */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 text-accent" />
                Article 3 - Livraison
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <div className="p-4 bg-accent/10 rounded-xl border border-accent/20 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="font-bold text-foreground">Délai de livraison : 3 à 15 jours ouvrés</span>
                  </div>
                  <p className="text-sm">
                    Le délai de livraison varie selon votre pays de destination. Les commandes sont expédiées dans les 
                    24 à 48 heures suivant la confirmation du paiement.
                  </p>
                </div>
                <p>
                  Les produits sont livrés à l'adresse indiquée par le client lors de la commande. Il est de la responsabilité 
                  du client de fournir une adresse de livraison exacte et complète.
                </p>
                <p>
                  Les frais de livraison sont calculés en fonction du pays de destination et du poids de la commande. 
                  Ils sont indiqués avant la validation finale de la commande.
                </p>
                <p>
                  En cas d'absence lors de la livraison, le client sera contacté par le transporteur pour convenir d'une 
                  nouvelle date de livraison ou d'un retrait en point relais.
                </p>
              </div>
            </section>

            {/* Article 4 - Retours et Remboursements - IMPORTANT */}
            <section className="bg-red-500/10 rounded-3xl p-8 border border-red-500/30">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" />
                Article 4 - Politique de Retour et Remboursement
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground mb-2">POLITIQUE DE NON-RETOUR ET NON-REMBOURSEMENT</p>
                      <p className="text-muted-foreground text-sm">
                        En raison de la nature de nos produits et de notre processus de fabrication à la demande, 
                        <strong className="text-red-400"> toutes les ventes sont définitives</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p><strong className="text-foreground">4.1 Aucun retour accepté</strong></p>
                  <p>
                    Une fois la commande validée et payée, aucun retour de produit ne sera accepté, quelle que soit la raison 
                    (changement d'avis, erreur de taille, couleur non conforme aux attentes, etc.).
                  </p>
                  
                  <p><strong className="text-foreground">4.2 Aucun remboursement</strong></p>
                  <p>
                    Aucun remboursement ne sera effectué après confirmation de la commande. Nous vous recommandons de 
                    vérifier attentivement votre commande (taille, couleur, quantité) avant de procéder au paiement.
                  </p>
                  
                  <p><strong className="text-foreground">4.3 Exceptions</strong></p>
                  <p>
                    Seuls les produits présentant un défaut de fabrication avéré (couture défectueuse, impression incorrecte, 
                    erreur de notre part) pourront faire l'objet d'un échange. Dans ce cas, le client devra nous contacter 
                    dans les 48 heures suivant la réception du colis avec des photos du défaut.
                  </p>
                </div>
              </div>
            </section>

            {/* Article 5 - Garantie */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Article 5 - Garantie</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, 
                  conformément aux dispositions légales en vigueur.
                </p>
                <p>
                  En cas de défaut de conformité, le client peut choisir entre le remplacement ou l'échange du produit, 
                  sous réserve des conditions de coût prévues par la loi.
                </p>
              </div>
            </section>

            {/* Article 6 - Propriété intellectuelle */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Article 6 - Propriété Intellectuelle</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Tous les éléments du site KAYNA (textes, images, logos, designs, vidéos) sont la propriété exclusive 
                  de KAYNA et sont protégés par les lois relatives à la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments 
                  du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
                </p>
              </div>
            </section>

            {/* Article 7 - Responsabilité */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Article 7 - Responsabilité</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  KAYNA ne pourra être tenu responsable des dommages indirects subis par le client. Notre responsabilité 
                  est limitée au montant de la commande.
                </p>
                <p>
                  KAYNA ne saurait être tenu responsable des retards de livraison dus au transporteur ou à des événements 
                  indépendants de notre volonté (grèves, intempéries, etc.).
                </p>
              </div>
            </section>

            {/* Article 8 - Droit applicable */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Article 8 - Droit Applicable et Litiges</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée 
                  avant toute action judiciaire. À défaut d'accord amiable, les tribunaux français seront seuls compétents.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-8 border border-accent/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">Questions sur nos CGV ?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Si vous avez des questions concernant nos conditions générales de vente, contactez-nous.
              </p>
              <a 
                href="mailto:contact@kayna.store"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all"
              >
                Nous contacter
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfSale;
