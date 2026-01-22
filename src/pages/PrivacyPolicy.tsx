import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Database, Lock, Globe, Mail } from "lucide-react";
import Footer from "@/components/Footer";
import { useLocalization } from "@/hooks/useLocalization";

const PrivacyPolicy = () => {
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
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-muted-foreground text-lg">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Introduction */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-accent" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Chez KAYNA, nous accordons une importance capitale à la protection de vos données personnelles. 
                Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations 
                lorsque vous visitez notre site web et effectuez des achats. En utilisant notre site, vous acceptez 
                les pratiques décrites dans cette politique.
              </p>
            </section>

            {/* Données collectées */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-accent" />
                Données Collectées
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Informations personnelles</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Lors de votre commande, nous collectons : votre nom complet, adresse email, numéro de téléphone, 
                    et adresse de livraison. Ces informations sont nécessaires pour traiter et livrer votre commande.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Adresse IP et données de navigation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nous collectons votre adresse IP <strong>uniquement dans le but de déterminer votre pays d'origine</strong>. 
                    Cette information nous permet de :
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                    <li>Afficher automatiquement le site dans votre langue</li>
                    <li>Adapter la devise à votre région</li>
                    <li>Analyser quels pays visitent le plus notre site</li>
                    <li>Optimiser nos futures campagnes publicitaires en ciblant les régions les plus pertinentes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Données de paiement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Les informations de paiement sont traitées de manière sécurisée par nos partenaires de paiement. 
                    KAYNA ne stocke jamais vos données bancaires sur ses serveurs.
                  </p>
                </div>
              </div>
            </section>

            {/* Utilisation des données */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-accent" />
                Utilisation des Données
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Vos données sont utilisées <strong>exclusivement</strong> pour les finalités suivantes :
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm font-bold">1</span>
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Traitement des commandes :</strong> Livrer vos produits à l'adresse indiquée 
                      et vous envoyer les confirmations de commande et de livraison.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm font-bold">2</span>
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Communication client :</strong> Vous contacter individuellement concernant 
                      votre commande ou répondre à vos questions.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm font-bold">3</span>
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Amélioration du service :</strong> Analyser les données géographiques 
                      pour optimiser notre présence dans les régions les plus actives.
                    </span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <p className="text-foreground font-semibold mb-2">⚠️ Important</p>
                  <p className="text-muted-foreground text-sm">
                    Aucune utilisation de vos données personnelles à des fins commerciales tierces, de revente ou de partage 
                    avec des tiers n'est effectuée sans votre autorisation préalable explicite.
                  </p>
                </div>
              </div>
            </section>

            {/* Protection des données */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-accent" />
                Protection des Données
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour 
                  protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
                </p>
                <p>
                  Nos serveurs sont sécurisés et toutes les transmissions de données sont chiffrées via le protocole SSL/TLS.
                </p>
              </div>
            </section>

            {/* Vos droits */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Mail className="w-6 h-6 text-accent" />
                Vos Droits
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Conformément à la réglementation en vigueur, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification de vos données</li>
                  <li>Droit à l'effacement de vos données</li>
                  <li>Droit d'opposition au traitement de vos données</li>
                  <li>Droit à la portabilité de vos données</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@kayna.store" className="text-accent hover:underline">contact@kayna.store</a>
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Notre site utilise des cookies essentiels pour son fonctionnement (panier, session utilisateur, préférences de langue). 
                Ces cookies sont nécessaires et ne peuvent pas être désactivés. Nous n'utilisons pas de cookies publicitaires 
                ou de tracking tiers.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-8 border border-accent/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">Questions ?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Si vous avez des questions concernant notre politique de confidentialité, n'hésitez pas à nous contacter.
              </p>
              <a 
                href="mailto:contact@kayna.store"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all"
              >
                <Mail className="w-5 h-5" />
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

export default PrivacyPolicy;
