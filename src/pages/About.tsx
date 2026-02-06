import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Shield, Target, Flame, BookOpen, Users, Crown } from "lucide-react";
import logo from "@/assets/logo.png";
import SEOHead, { generateBreadcrumbJsonLd } from "@/components/SEOHead";
import chapterPhilosophy from "@/assets/chapter-philosophy.jpg";
import chapterBattle from "@/assets/chapter-battle.jpg";
import chapterChoice from "@/assets/chapter-choice.jpg";
import chapterTransmission from "@/assets/chapter-transmission.jpg";
import chapterCommunity from "@/assets/chapter-community.jpg";
import chapterHeritage from "@/assets/chapter-heritage.jpg";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax images
      gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
        gsap.to(img, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Fade up elements
      gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Stagger text reveals
      gsap.utils.toArray<HTMLElement>(".stagger-text").forEach((container) => {
        const items = container.querySelectorAll(".stagger-item");
        gsap.from(items, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Scale in elements
      gsap.utils.toArray<HTMLElement>(".scale-in").forEach((el) => {
        gsap.from(el, {
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-primary min-h-screen">
      <SEOHead
        title="À Propos de KAYNA — Notre Histoire & Philosophie | Développement Personnel"
        description="Découvrez l'histoire de KAYNA : en Songhaï, KAYNA signifie certitude. Notre philosophie mêle confiance, dépassement et persévérance. Marque de vêtements streetwear née en Afrique de l'Ouest."
        canonicalUrl="/about"
        keywords="histoire KAYNA, philosophie KAYNA, marque africaine, développement personnel, confiance en soi, Songhaï, certitude, streetwear Afrique, about KAYNA brand"
        jsonLd={generateBreadcrumbJsonLd([{ name: "Accueil", url: "/" }, { name: "À Propos", url: "/about" }])}
      />
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-secondary/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour</span>
          </Link>
          <Link to="/">
            <img src={logo} alt="KAYNA" className="h-8 brightness-0 invert" />
          </Link>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img 
            src={chapterPhilosophy} 
            alt="KAYNA Philosophy" 
            className="w-full h-full object-cover parallax-img opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-primary" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="fade-up mb-8">
            <span className="text-accent text-sm tracking-[0.3em] uppercase">La Marque</span>
          </div>
          <h1 className="fade-up text-[4rem] sm:text-[6rem] lg:text-[8rem] font-bold text-secondary leading-none mb-6">
            KAYNA
          </h1>
          <p className="fade-up text-2xl sm:text-3xl lg:text-4xl text-accent italic font-light">
            La Certitude Inébranlable
          </p>
          <div className="fade-up mt-12 w-px h-24 bg-gradient-to-b from-accent/0 via-accent to-accent/0 mx-auto" />
        </div>
      </section>

      {/* Chapter 1: La Philosophie */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="fade-up mb-16">
              <span className="text-accent text-xs tracking-[0.3em] uppercase">Chapitre 1</span>
              <h2 className="text-5xl lg:text-7xl font-bold text-primary mt-4 leading-tight">
                Plus qu'un mot,
                <span className="block italic text-accent">une Philosophie</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 fade-up">
                <p className="text-xl text-primary/80 leading-relaxed">
                  En Songhaï, <span className="font-bold text-primary">KAYNA</span> est un mot qui dépasse le langage.
                </p>
                <div className="space-y-4 text-lg text-primary/70">
                  <p>Ce n'est pas seulement la certitude.</p>
                  <p>C'est un état intérieur.</p>
                  <p>Une décision silencieuse.</p>
                  <p className="font-medium text-primary">Un point de non-retour.</p>
                </div>
                <p className="text-xl text-primary/80 leading-relaxed">
                  KAYNA est la convergence de trois forces fondamentales :
                </p>
              </div>

              <div className="stagger-text space-y-6">
                <div className="stagger-item p-6 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all">
                      <Shield className="w-6 h-6 text-accent group-hover:text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">La Confiance</h3>
                  </div>
                  <p className="text-primary/70 pl-16">La fondation invisible de chaque action que tu entreprends.</p>
                </div>

                <div className="stagger-item p-6 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all">
                      <Target className="w-6 h-6 text-accent group-hover:text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">Le Dépassement</h3>
                  </div>
                  <p className="text-primary/70 pl-16">L'état d'esprit de ceux qui refusent les plafonds imposés.</p>
                </div>

                <div className="stagger-item p-6 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all">
                      <Flame className="w-6 h-6 text-accent group-hover:text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">La Persévérance</h3>
                  </div>
                  <p className="text-primary/70 pl-16">La seule issue acceptable face à un objectif assumé.</p>
                </div>
              </div>
            </div>

            <div className="fade-up mt-16 p-8 bg-primary rounded-3xl text-center max-w-3xl mx-auto">
              <p className="text-lg text-secondary/70 mb-4">Avant toute réussite visible, il y a cette victoire invisible :</p>
              <p className="text-2xl text-accent font-medium">👉 la certitude intérieure que tu iras jusqu'au bout.</p>
              <p className="text-secondary/60 mt-4 italic">C'est là que tout commence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: La Bataille Silencieuse */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
            <div className="scale-in relative rounded-3xl overflow-hidden aspect-square lg:aspect-[4/5]">
              <img 
                src={chapterBattle} 
                alt="La Bataille Silencieuse" 
                className="w-full h-full object-cover parallax-img"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-accent text-xs tracking-[0.3em] uppercase">Chapitre 2</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="fade-up">
                <h2 className="text-5xl lg:text-6xl font-bold text-secondary leading-tight">
                  La Bataille
                  <span className="block italic text-accent">Silencieuse</span>
                </h2>
              </div>

              <div className="fade-up space-y-6 text-lg text-secondary/70">
                <p>Tu connais cette bataille. <span className="text-secondary">Nous l'avons tous menée.</span></p>
                <p>Ce n'est pas la difficulté du chemin qui épuise. C'est la voix intérieure qui s'élève dans le silence.</p>
                
                <div className="pl-6 border-l-2 border-accent/30 space-y-2 text-secondary/60 italic">
                  <p>Celle qui parle de fatigue.</p>
                  <p>De doutes.</p>
                  <p>Du regard des autres.</p>
                  <p>De l'échec passé qui voudrait devenir une excuse.</p>
                </div>

                <p className="text-secondary font-medium">Le véritable ennemi n'a jamais été le manque de talent.</p>
                <p>C'est l'absence de structure. C'est l'esprit livré à lui-même.</p>
              </div>

              <div className="fade-up p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                <p className="text-secondary/60 text-lg">
                  Dans cette solitude du combat, beaucoup reculent. Ils attendent. Ils espèrent. Ils abandonnent.
                </p>
                <p className="text-accent font-bold text-xl mt-4">Mais certains font un choix différent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Le Choix Inébranlable */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="fade-up text-accent text-xs tracking-[0.3em] uppercase block mb-4">Chapitre 3</span>
              <h2 className="fade-up text-5xl lg:text-7xl font-bold text-primary leading-tight">
                Le Choix
                <span className="block italic text-accent">Inébranlable</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 space-y-8">
                <p className="fade-up text-xl text-primary/80 font-medium">
                  C'est pour ce moment précis que KAYNA existe.
                </p>

                <div className="fade-up space-y-4 text-lg text-primary/70">
                  <p>KAYNA est née pour ceux qui refusent la fuite.</p>
                  <p>Pour ceux qui transforment le doute en discipline.</p>
                  <p>Pour ceux qui comprennent que la motivation passe, <span className="text-primary font-medium">mais que la structure reste.</span></p>
                </div>

                <div className="fade-up p-6 bg-primary rounded-2xl">
                  <p className="text-secondary/80 text-lg mb-4">Le vêtement que tu enfiles n'est pas un style.</p>
                  <p className="text-accent font-bold text-xl">C'est un rappel physique.</p>
                </div>

                <div className="stagger-text space-y-4">
                  <div className="stagger-item flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-3 flex-shrink-0" />
                    <p className="text-primary/70">Le doute devient un bruit de fond parce que ta <span className="text-primary font-medium">Confiance</span> est la base de ton action.</p>
                  </div>
                  <div className="stagger-item flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-3 flex-shrink-0" />
                    <p className="text-primary/70">La fatigue devient une étape parce que le <span className="text-primary font-medium">Dépassement</span> est ton mode de vie.</p>
                  </div>
                  <div className="stagger-item flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-3 flex-shrink-0" />
                    <p className="text-primary/70">L'objectif devient non négociable parce que la <span className="text-primary font-medium">Persévérance</span> est ta seule issue.</p>
                  </div>
                </div>

                <p className="fade-up text-2xl text-primary font-bold">
                  Ce n'est pas un vêtement que tu portes.<br/>
                  <span className="text-accent">C'est une armure mentale.</span>
                </p>
              </div>

              <div className="order-1 lg:order-2 scale-in relative rounded-3xl overflow-hidden aspect-[3/4]">
                <img 
                  src={chapterChoice} 
                  alt="Le Choix Inébranlable" 
                  className="w-full h-full object-cover parallax-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 4: Une Transmission */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="fade-up text-accent text-xs tracking-[0.3em] uppercase block mb-4">Chapitre 4</span>
              <h2 className="fade-up text-5xl lg:text-7xl font-bold text-secondary leading-tight">
                Plus qu'un vêtement.
                <span className="block italic text-accent">Une Transmission.</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
              <div className="scale-in relative rounded-3xl overflow-hidden aspect-square">
                <img 
                  src={chapterTransmission} 
                  alt="Une Transmission" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              </div>

              <div className="space-y-8">
                <p className="fade-up text-xl text-secondary/80">
                  KAYNA ne s'arrête pas à ce que tu portes.
                </p>

                <div className="fade-up space-y-4 text-lg text-secondary/70">
                  <p>Chaque pièce est une porte d'entrée.</p>
                  <p>Une initiation.</p>
                  <p className="text-secondary font-medium">Un passage.</p>
                </div>

                <div className="fade-up p-6 bg-accent/10 rounded-2xl border border-accent/20">
                  <p className="text-secondary/80 mb-2">Car nous savons une chose essentielle :</p>
                  <p className="text-accent font-bold text-xl">👉 la mentalité sans compétence est incomplète.</p>
                </div>

                <p className="fade-up text-lg text-secondary/70">
                  C'est pourquoi chaque achat KAYNA est relié à quelque chose de plus profond :
                </p>

                <div className="stagger-text grid grid-cols-2 gap-4">
                  <div className="stagger-item p-4 bg-secondary/5 rounded-xl text-center">
                    <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-secondary font-medium">Un accès</p>
                  </div>
                  <div className="stagger-item p-4 bg-secondary/5 rounded-xl text-center">
                    <Target className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-secondary font-medium">Une formation</p>
                  </div>
                  <div className="stagger-item p-4 bg-secondary/5 rounded-xl text-center">
                    <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-secondary font-medium">Une structure</p>
                  </div>
                  <div className="stagger-item p-4 bg-secondary/5 rounded-xl text-center">
                    <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-secondary font-medium">Une communauté</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-up max-w-4xl mx-auto">
              <p className="text-xl text-secondary/70 text-center mb-8">Selon ton moment de vie, KAYNA t'accompagne :</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                  <p className="text-secondary/80">Pour certains, c'est apprendre à créer des revenus, comprendre les mécanismes, <span className="text-accent font-medium">bâtir une base.</span></p>
                </div>
                <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                  <p className="text-secondary/80">Pour d'autres, c'est structurer, investir, sécuriser, et <span className="text-accent font-medium">préparer la transmission.</span></p>
                </div>
              </div>
              <p className="text-center text-secondary/60 mt-8 text-lg">
                KAYNA n'impose pas un chemin unique.<br/>
                <span className="text-accent font-medium">Elle offre des fondations solides.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 5: La Communauté */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8">
                <div className="fade-up">
                  <span className="text-accent text-xs tracking-[0.3em] uppercase block mb-4">Chapitre 5</span>
                  <h2 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                    La Communauté
                    <span className="block italic text-accent">de la Certitude</span>
                  </h2>
                </div>

                <div className="fade-up space-y-6 text-lg text-primary/70">
                  <p className="text-xl text-primary font-medium">En rejoignant KAYNA, tu n'es pas seul.</p>
                  <p>Tu entres dans un cercle. Une communauté de personnes qui ont fait le même choix : <span className="text-primary font-medium">celui de ne plus subir.</span></p>
                </div>

                <div className="fade-up p-6 bg-primary rounded-2xl">
                  <p className="text-secondary/70 mb-4">Ici, on ne vend pas du rêve.</p>
                  <div className="space-y-2 text-secondary">
                    <p>On partage des <span className="text-accent font-medium">outils</span>.</p>
                    <p>On transmet une <span className="text-accent font-medium">vision</span>.</p>
                    <p>On avance <span className="text-accent font-medium">ensemble</span>.</p>
                  </div>
                </div>

                <div className="fade-up">
                  <p className="text-lg text-primary/70 mb-6">Parce que l'objectif de KAYNA va au-delà du vêtement :</p>
                  <div className="space-y-3">
                    <p className="text-xl text-primary">👉 Former des <span className="text-accent font-bold">esprits libres</span>.</p>
                    <p className="text-xl text-primary">👉 Créer des <span className="text-accent font-bold">bâtisseurs</span>.</p>
                    <p className="text-xl text-primary">👉 Éveiller une génération d'<span className="text-accent font-bold">entrepreneurs africains conscients</span>.</p>
                  </div>
                </div>
              </div>

              <div className="scale-in relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img 
                  src={chapterCommunity} 
                  alt="La Communauté" 
                  className="w-full h-full object-cover parallax-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 6: Ton Héritage */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={chapterHeritage} 
            alt="Ton Héritage" 
            className="w-full h-full object-cover parallax-img opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/80 to-primary" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="fade-up text-accent text-xs tracking-[0.3em] uppercase block mb-4">Chapitre 6</span>
            <h2 className="fade-up text-5xl lg:text-7xl font-bold text-secondary leading-tight mb-8">
              Ton Uniforme.
              <span className="block italic text-accent">Ton Héritage.</span>
            </h2>

            <div className="fade-up space-y-8 text-lg text-secondary/70 max-w-3xl mx-auto">
              <p className="text-xl text-secondary">
                KAYNA est l'uniforme de ceux qui construisent en silence.
              </p>
              
              <p>
                Inspirée par ceux qui, de l'Afrique de l'Ouest aux capitales du monde, ont bâti leur réussite sans raccourci, par la discipline, la patience et la vision.
              </p>

              <div className="p-6 bg-secondary/10 rounded-2xl border border-secondary/20">
                <p className="text-secondary/70 mb-2">Le véritable héritage n'est pas ce que l'on reçoit.</p>
                <p className="text-accent font-bold text-xl">C'est ce que l'on construit et ce que l'on transmet.</p>
              </div>

              <p>
                En portant KAYNA, tu ne représentes pas une marque.<br/>
                <span className="text-secondary font-medium">Tu représentes une intention.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="fade-up mb-12">
              <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
              <p className="text-2xl lg:text-3xl text-primary font-medium mb-4">
                Porte la certitude.
              </p>
              <p className="text-2xl lg:text-3xl text-primary font-medium mb-4">
                Entre dans le cercle.
              </p>
              <p className="text-2xl lg:text-3xl text-primary font-medium">
                Construis ton héritage.
              </p>
            </div>

            <h3 className="fade-up text-6xl lg:text-8xl font-bold text-primary mb-8">
              Ceci est KAYNA.
            </h3>

            <div className="fade-up space-y-2 text-xl text-primary/80 mb-12">
              <p>Ta décision.</p>
              <p>Ton engagement.</p>
              <p className="font-bold text-primary">Ta victoire.</p>
            </div>

            <Link 
              to="/shop" 
              className="fade-up inline-flex px-12 py-5 rounded-full bg-primary text-secondary font-bold text-lg hover:scale-105 transition-all items-center gap-3 shadow-2xl"
            >
              <span>Découvrir la Collection</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
