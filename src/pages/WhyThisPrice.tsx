import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Heart, Sparkles, Users, GraduationCap } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";
import Footer from "@/components/Footer";

const WhyThisPrice = () => {
  const { isRTL, language } = useLocalization();

  const content = {
    fr: {
      title: "Pourquoi ce prix ?",
      intro: "KAYNA n'est pas une marque destinée à tout le monde.",
      introSub: "Et c'est un choix assumé.",
      philosophy: "Chaque pièce KAYNA est conçue comme une armure mentale : un rappel de la discipline, de la persévérance et de la confiance que l'on construit jour après jour.",
      ourPricesReflect: "Nos prix reflètent :",
      points: [
        { icon: Shield, text: "Une production responsable" },
        { icon: Sparkles, text: "Une livraison incluse, sans surprise" },
        { icon: Heart, text: "Un design porteur de sens" },
        { icon: GraduationCap, text: "L'accès à une formation" },
        { icon: Users, text: "L'entrée dans une communauté engagée" },
      ],
      conclusion1: "KAYNA ne vend pas un simple vêtement.",
      conclusion2: "Nous proposons une expérience, une intention, un engagement envers soi-même.",
      closing1: "Ce prix n'est pas une barrière.",
      closing2: "C'est un choix.",
      closing3: "Celui de ceux qui savent que la valeur commence à l'intérieur.",
      back: "Retour",
    },
    en: {
      title: "Why This Price?",
      intro: "KAYNA is not a brand for everyone.",
      introSub: "And that's a conscious choice.",
      philosophy: "Each KAYNA piece is designed as mental armor: a reminder of the discipline, perseverance, and confidence we build day after day.",
      ourPricesReflect: "Our prices reflect:",
      points: [
        { icon: Shield, text: "Responsible production" },
        { icon: Sparkles, text: "Shipping included, no surprises" },
        { icon: Heart, text: "Meaningful design" },
        { icon: GraduationCap, text: "Access to training" },
        { icon: Users, text: "Entry into an engaged community" },
      ],
      conclusion1: "KAYNA doesn't sell just clothing.",
      conclusion2: "We offer an experience, an intention, a commitment to yourself.",
      closing1: "This price is not a barrier.",
      closing2: "It's a choice.",
      closing3: "The choice of those who know that value starts from within.",
      back: "Back",
    },
    ar: {
      title: "لماذا هذا السعر؟",
      intro: "KAYNA ليست علامة تجارية للجميع.",
      introSub: "وهذا اختيار واعٍ.",
      philosophy: "كل قطعة من KAYNA مصممة كدرع ذهني: تذكير بالانضباط والمثابرة والثقة التي نبنيها يوماً بعد يوم.",
      ourPricesReflect: "أسعارنا تعكس:",
      points: [
        { icon: Shield, text: "إنتاج مسؤول" },
        { icon: Sparkles, text: "شحن مشمول، بدون مفاجآت" },
        { icon: Heart, text: "تصميم ذو معنى" },
        { icon: GraduationCap, text: "الوصول إلى التدريب" },
        { icon: Users, text: "الدخول إلى مجتمع ملتزم" },
      ],
      conclusion1: "KAYNA لا تبيع مجرد ملابس.",
      conclusion2: "نحن نقدم تجربة، نية، التزاماً تجاه نفسك.",
      closing1: "هذا السعر ليس حاجزاً.",
      closing2: "إنه اختيار.",
      closing3: "اختيار أولئك الذين يعرفون أن القيمة تبدأ من الداخل.",
      back: "رجوع",
    },
    es: {
      title: "¿Por qué este precio?",
      intro: "KAYNA no es una marca para todos.",
      introSub: "Y es una elección consciente.",
      philosophy: "Cada pieza KAYNA está diseñada como una armadura mental: un recordatorio de la disciplina, la perseverancia y la confianza que construimos día a día.",
      ourPricesReflect: "Nuestros precios reflejan:",
      points: [
        { icon: Shield, text: "Producción responsable" },
        { icon: Sparkles, text: "Envío incluido, sin sorpresas" },
        { icon: Heart, text: "Diseño con significado" },
        { icon: GraduationCap, text: "Acceso a formación" },
        { icon: Users, text: "Entrada a una comunidad comprometida" },
      ],
      conclusion1: "KAYNA no vende solo ropa.",
      conclusion2: "Ofrecemos una experiencia, una intención, un compromiso contigo mismo.",
      closing1: "Este precio no es una barrera.",
      closing2: "Es una elección.",
      closing3: "La de quienes saben que el valor comienza por dentro.",
      back: "Volver",
    },
    pt: {
      title: "Por que este preço?",
      intro: "KAYNA não é uma marca para todos.",
      introSub: "E essa é uma escolha consciente.",
      philosophy: "Cada peça KAYNA é projetada como uma armadura mental: um lembrete da disciplina, perseverança e confiança que construímos dia após dia.",
      ourPricesReflect: "Nossos preços refletem:",
      points: [
        { icon: Shield, text: "Produção responsável" },
        { icon: Sparkles, text: "Frete incluído, sem surpresas" },
        { icon: Heart, text: "Design com significado" },
        { icon: GraduationCap, text: "Acesso a treinamento" },
        { icon: Users, text: "Entrada em uma comunidade engajada" },
      ],
      conclusion1: "KAYNA não vende apenas roupas.",
      conclusion2: "Oferecemos uma experiência, uma intenção, um compromisso consigo mesmo.",
      closing1: "Este preço não é uma barreira.",
      closing2: "É uma escolha.",
      closing3: "A escolha de quem sabe que o valor começa por dentro.",
      back: "Voltar",
    },
  };

  const t = content[language] || content.fr;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground tracking-wider">
            KAYNA
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-foreground font-medium mb-2">
              {t.intro}
            </p>
            <p className="text-xl md:text-2xl text-accent font-bold">
              {t.introSub}
            </p>
          </div>

          {/* Philosophy */}
          <div className="bg-card rounded-3xl border border-border p-8 md:p-12 mb-12">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
              {t.philosophy}
            </p>
          </div>

          {/* Points */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {t.ourPricesReflect}
            </h2>
            <div className="space-y-4">
              {t.points.map((point, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-lg text-foreground font-medium">{point.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="text-center mb-12">
            <p className="text-xl text-foreground font-medium mb-2">
              {t.conclusion1}
            </p>
            <p className="text-lg text-muted-foreground">
              {t.conclusion2}
            </p>
          </div>

          {/* Closing */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl border border-accent/20 p-8 md:p-12 text-center">
            <p className="text-xl md:text-2xl text-foreground mb-4">
              {t.closing1}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-accent mb-4">
              {t.closing2}
            </p>
            <p className="text-lg text-muted-foreground italic">
              {t.closing3}
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-full font-bold text-lg shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all"
            >
              {language === 'ar' ? 'اكتشف المجموعة' : language === 'en' ? 'Discover the Collection' : language === 'es' ? 'Descubrir la Colección' : language === 'pt' ? 'Descobrir a Coleção' : 'Découvrir la Collection'}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhyThisPrice;
