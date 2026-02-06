import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Building, Globe, Shield } from "lucide-react";
import Footer from "@/components/Footer";
import { useLocalization } from "@/hooks/useLocalization";

const LegalNotice = () => {
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
              <Scale className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Mentions Légales
            </h1>
            <p className="text-muted-foreground text-lg">
              Informations légales obligatoires
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Éditeur du site */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Building className="w-6 h-6 text-accent" />
                Éditeur du Site
              </h2>
              <div className="grid gap-4 text-muted-foreground">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="font-medium text-foreground">Nom de la marque</span>
                  <span>KAYNA</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="font-medium text-foreground">Forme juridique</span>
                  <span>Entreprise individuelle</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="font-medium text-foreground">Email de contact</span>
                  <a href="mailto:contact@kayna.store" className="text-accent hover:underline">contact@kayna.store</a>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="font-medium text-foreground">Activité</span>
                  <span>Vente de vêtements en ligne</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-medium text-foreground">Directeur de publication</span>
                  <span>KAYNA</span>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-accent" />
                Propriété Intellectuelle
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  L'ensemble de ce site relève de la législation malienne et internationale sur le droit d'auteur et 
                  la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les
                  documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                  formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <p>
                  Les marques, logos, et autres signes distinctifs reproduits sur ce site sont la propriété exclusive 
                  de KAYNA. Toute utilisation non autorisée de ces éléments engage la responsabilité de leurs auteurs.
                </p>
              </div>
            </section>

            {/* Données personnelles */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-accent" />
                Protection des Données Personnelles
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Conformément à la réglementation applicable en matière de protection des données personnelles, 
                  vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de 
                  vos données personnelles.
                </p>
                <p>
                  Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous pouvez nous 
                  contacter à l'adresse : <a href="mailto:contact@kayna.store" className="text-accent hover:underline">contact@kayna.store</a>
                </p>
                <p>
                  Pour plus de détails sur notre politique de confidentialité, consultez notre{" "}
                  <Link to="/privacy" className="text-accent hover:underline">Politique de Confidentialité</Link>.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Ces cookies ne collectent 
                  pas d'informations à des fins publicitaires.
                </p>
                <p>
                  Les cookies utilisés permettent de :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Mémoriser le contenu de votre panier</li>
                  <li>Maintenir votre session active</li>
                  <li>Adapter l'affichage du site à votre langue et devise</li>
                  <li>Mémoriser vos préférences de navigation</li>
                </ul>
              </div>
            </section>

            {/* Limitation de responsabilité */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitation de Responsabilité</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  KAYNA s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations diffusées sur ce 
                  site, dont elle se réserve le droit de corriger le contenu à tout moment et sans préavis.
                </p>
                <p>
                  KAYNA décline toute responsabilité en cas d'impossibilité d'accéder au site, de dommages pouvant 
                  résulter de l'utilisation du site, ou de l'impossibilité de l'utiliser.
                </p>
                <p>
                  KAYNA ne peut être tenu responsable du contenu des sites externes vers lesquels ce site pourrait 
                  contenir des liens hypertextes.
                </p>
              </div>
            </section>

            {/* Droit applicable */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Droit Applicable</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Les présentes mentions légales sont régies par le droit malien. En cas de litige et à défaut d'un 
                  accord amiable, les tribunaux compétents de Bamako (Mali) seront seuls compétents.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-8 border border-accent/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter par email.
              </p>
              <a 
                href="mailto:contact@kayna.store"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all"
              >
                contact@kayna.store
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalNotice;
