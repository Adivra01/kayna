// Home page translations for all supported languages
import type { Language } from './translations';

export interface HomeTranslations {
  // Hero
  heroTagline: string;
  heroValues: string[];
  heroDiscover: string;
  heroOurStory: string;
  heroSince: string;
  heroScroll: string;

  // Story Section
  storyLabel: string;
  storyTitle1: string;
  storyTitle2: string;
  chapters: {
    number: string;
    title: string;
    subtitle: string;
    keywords: string[];
  }[];
  storyCTA1: string;
  storyCTA2: string;
  storyCTA3: string;

  // About Section
  aboutLabel: string;
  aboutTitle1: string;
  aboutTitle2: string;
  aboutValues: { word: string; meaning: string }[];
  aboutQuote: string;
  aboutBadge: string;

  // Categories Section
  catLabel: string;
  catTitle1: string;
  catTitle2: string;
  catDescriptions: Record<string, string>;
  catActiveCollection: string;
  catArticles: string;
  catSee: string;

  // Quality Section
  qualLabel: string;
  qualTitle1: string;
  qualTitle2: string;
  qualItems: { number: string; unit: string; label: string }[];
  qualMessage: string;

  // Collection CTA Section
  collTitle1: string;
  collTitle2: string;
  collSubtitle: string;
  collCTA: string;
  collQuote: string;

  // Brand Promise Section
  promiseShipping: string;
  promiseReturns: string;
  promisePayment: string;
  promiseTitle1: string;
  promiseTitle2: string;
  promiseCTA: string;

  // Shop Page extras
  shopFilter: string;
  shopOutOfStock: string;
  shopNoProducts: string;
}

export const homeTranslations: Record<Language, HomeTranslations> = {
  fr: {
    heroTagline: "La certitude inébranlable",
    heroValues: ["Certitude", "Dépassement", "Persévérance"],
    heroDiscover: "Découvrir",
    heroOurStory: "Notre Histoire",
    heroSince: "Depuis 2024",
    heroScroll: "Scroll",

    storyLabel: "Notre Histoire",
    storyTitle1: "KAYNA.",
    storyTitle2: "La certitude inébranlable.",
    chapters: [
      { number: "01", title: "Philosophie", subtitle: "Plus qu'un mot", keywords: ["Confiance", "Dépassement", "Persévérance"] },
      { number: "02", title: "La Bataille", subtitle: "Silencieuse", keywords: ["Doute", "Combat", "Résilience"] },
      { number: "03", title: "Le Choix", subtitle: "Inébranlable", keywords: ["Discipline", "Structure", "Armure"] },
      { number: "04", title: "Transmission", subtitle: "Plus qu'un vêtement", keywords: ["Formation", "Accès", "Évolution"] },
      { number: "05", title: "Communauté", subtitle: "Le Cercle", keywords: ["Ensemble", "Vision", "Force"] },
      { number: "06", title: "Héritage", subtitle: "Ton uniforme", keywords: ["Bâtir", "Transmettre", "Léguer"] },
    ],
    storyCTA1: "Porte la certitude.",
    storyCTA2: "Entre dans le cercle.",
    storyCTA3: "Construis ton héritage.",

    aboutLabel: "Philosophie",
    aboutTitle1: "Trois forces.",
    aboutTitle2: "Une certitude.",
    aboutValues: [
      { word: "Confiance", meaning: "La fondation de chaque action" },
      { word: "Dépassement", meaning: "Refuser les plafonds imposés" },
      { word: "Persévérance", meaning: "La seule issue acceptable" },
    ],
    aboutQuote: "Avant toute réussite visible, il y a cette victoire invisible : la certitude intérieure.",
    aboutBadge: "240 GSM",

    catLabel: "Explorer",
    catTitle1: "Par",
    catTitle2: "catégorie",
    catDescriptions: {
      tshirts: "L'essentiel KAYNA",
      hoodies: "Le confort d'un guerrier",
      sweaters: "L'élégance discrète",
    },
    catActiveCollection: "Collection Active",
    catArticles: "articles",
    catSee: "Voir les",

    qualLabel: "Qualité",
    qualTitle1: "L'excellence.",
    qualTitle2: "Sans compromis.",
    qualItems: [
      { number: "240", unit: "GSM", label: "Poids premium" },
      { number: "100", unit: "%", label: "Coton bio" },
      { number: "∞", unit: "", label: "Garantie" },
    ],
    qualMessage: "Chaque pièce est conçue pour durer. Production éthique, matériaux premium.",

    collTitle1: "Ce n'est pas un vêtement que tu portes.",
    collTitle2: "C'est une armure mentale.",
    collSubtitle: "Pour ceux qui refusent la fuite. Pour ceux qui transforment le doute en discipline.",
    collCTA: "Découvrir la Collection",
    collQuote: "Portez la confiance. Devenez la certitude. Ceci est KAYNA.",

    promiseShipping: "Livraison incluse",
    promiseReturns: "Ventes définitives",
    promisePayment: "Paiement sécurisé",
    promiseTitle1: "Prêt à porter ta",
    promiseTitle2: "confiance",
    promiseCTA: "Découvrir",

    shopFilter: "Filtrer",
    shopOutOfStock: "Rupture de stock",
    shopNoProducts: "Aucun produit disponible pour le moment",
  },

  en: {
    heroTagline: "Unshakeable certainty",
    heroValues: ["Certainty", "Transcendence", "Perseverance"],
    heroDiscover: "Discover",
    heroOurStory: "Our Story",
    heroSince: "Since 2024",
    heroScroll: "Scroll",

    storyLabel: "Our Story",
    storyTitle1: "KAYNA.",
    storyTitle2: "The unshakeable certainty.",
    chapters: [
      { number: "01", title: "Philosophy", subtitle: "More than a word", keywords: ["Confidence", "Transcendence", "Perseverance"] },
      { number: "02", title: "The Battle", subtitle: "Silent", keywords: ["Doubt", "Fight", "Resilience"] },
      { number: "03", title: "The Choice", subtitle: "Unshakeable", keywords: ["Discipline", "Structure", "Armor"] },
      { number: "04", title: "Transmission", subtitle: "More than clothing", keywords: ["Training", "Access", "Evolution"] },
      { number: "05", title: "Community", subtitle: "The Circle", keywords: ["Together", "Vision", "Strength"] },
      { number: "06", title: "Heritage", subtitle: "Your uniform", keywords: ["Build", "Transmit", "Legacy"] },
    ],
    storyCTA1: "Wear certainty.",
    storyCTA2: "Join the circle.",
    storyCTA3: "Build your legacy.",

    aboutLabel: "Philosophy",
    aboutTitle1: "Three forces.",
    aboutTitle2: "One certainty.",
    aboutValues: [
      { word: "Confidence", meaning: "The foundation of every action" },
      { word: "Transcendence", meaning: "Refusing imposed ceilings" },
      { word: "Perseverance", meaning: "The only acceptable outcome" },
    ],
    aboutQuote: "Before any visible success, there is this invisible victory: inner certainty.",
    aboutBadge: "240 GSM",

    catLabel: "Explore",
    catTitle1: "By",
    catTitle2: "category",
    catDescriptions: {
      tshirts: "The KAYNA essential",
      hoodies: "A warrior's comfort",
      sweaters: "Subtle elegance",
    },
    catActiveCollection: "Active Collection",
    catArticles: "items",
    catSee: "See",

    qualLabel: "Quality",
    qualTitle1: "Excellence.",
    qualTitle2: "No compromise.",
    qualItems: [
      { number: "240", unit: "GSM", label: "Premium weight" },
      { number: "100", unit: "%", label: "Organic cotton" },
      { number: "∞", unit: "", label: "Guarantee" },
    ],
    qualMessage: "Every piece is designed to last. Ethical production, premium materials.",

    collTitle1: "It's not just clothing you wear.",
    collTitle2: "It's mental armor.",
    collSubtitle: "For those who refuse to flee. For those who turn doubt into discipline.",
    collCTA: "Discover the Collection",
    collQuote: "Wear confidence. Become certainty. This is KAYNA.",

    promiseShipping: "Shipping included",
    promiseReturns: "All sales final",
    promisePayment: "Secure payment",
    promiseTitle1: "Ready to wear your",
    promiseTitle2: "confidence",
    promiseCTA: "Discover",

    shopFilter: "Filter",
    shopOutOfStock: "Out of stock",
    shopNoProducts: "No products available at the moment",
  },

  es: {
    heroTagline: "La certeza inquebrantable",
    heroValues: ["Certeza", "Superación", "Perseverancia"],
    heroDiscover: "Descubrir",
    heroOurStory: "Nuestra Historia",
    heroSince: "Desde 2024",
    heroScroll: "Scroll",

    storyLabel: "Nuestra Historia",
    storyTitle1: "KAYNA.",
    storyTitle2: "La certeza inquebrantable.",
    chapters: [
      { number: "01", title: "Filosofía", subtitle: "Más que una palabra", keywords: ["Confianza", "Superación", "Perseverancia"] },
      { number: "02", title: "La Batalla", subtitle: "Silenciosa", keywords: ["Duda", "Lucha", "Resiliencia"] },
      { number: "03", title: "La Elección", subtitle: "Inquebrantable", keywords: ["Disciplina", "Estructura", "Armadura"] },
      { number: "04", title: "Transmisión", subtitle: "Más que ropa", keywords: ["Formación", "Acceso", "Evolución"] },
      { number: "05", title: "Comunidad", subtitle: "El Círculo", keywords: ["Juntos", "Visión", "Fuerza"] },
      { number: "06", title: "Herencia", subtitle: "Tu uniforme", keywords: ["Construir", "Transmitir", "Legar"] },
    ],
    storyCTA1: "Viste la certeza.",
    storyCTA2: "Entra en el círculo.",
    storyCTA3: "Construye tu herencia.",

    aboutLabel: "Filosofía",
    aboutTitle1: "Tres fuerzas.",
    aboutTitle2: "Una certeza.",
    aboutValues: [
      { word: "Confianza", meaning: "La base de cada acción" },
      { word: "Superación", meaning: "Rechazar los techos impuestos" },
      { word: "Perseverancia", meaning: "El único resultado aceptable" },
    ],
    aboutQuote: "Antes de cualquier éxito visible, existe esta victoria invisible: la certeza interior.",
    aboutBadge: "240 GSM",

    catLabel: "Explorar",
    catTitle1: "Por",
    catTitle2: "categoría",
    catDescriptions: {
      tshirts: "Lo esencial KAYNA",
      hoodies: "La comodidad de un guerrero",
      sweaters: "La elegancia discreta",
    },
    catActiveCollection: "Colección Activa",
    catArticles: "artículos",
    catSee: "Ver",

    qualLabel: "Calidad",
    qualTitle1: "La excelencia.",
    qualTitle2: "Sin compromiso.",
    qualItems: [
      { number: "240", unit: "GSM", label: "Peso premium" },
      { number: "100", unit: "%", label: "Algodón orgánico" },
      { number: "∞", unit: "", label: "Garantía" },
    ],
    qualMessage: "Cada pieza está diseñada para durar. Producción ética, materiales premium.",

    collTitle1: "No es solo ropa lo que llevas.",
    collTitle2: "Es una armadura mental.",
    collSubtitle: "Para quienes se niegan a huir. Para quienes transforman la duda en disciplina.",
    collCTA: "Descubrir la Colección",
    collQuote: "Viste la confianza. Conviértete en certeza. Esto es KAYNA.",

    promiseShipping: "Envío incluido",
    promiseReturns: "Ventas definitivas",
    promisePayment: "Pago seguro",
    promiseTitle1: "¿Listo para vestir tu",
    promiseTitle2: "confianza",
    promiseCTA: "Descubrir",

    shopFilter: "Filtrar",
    shopOutOfStock: "Agotado",
    shopNoProducts: "No hay productos disponibles por el momento",
  },

  ar: {
    heroTagline: "اليقين الراسخ",
    heroValues: ["يقين", "تجاوز", "مثابرة"],
    heroDiscover: "اكتشف",
    heroOurStory: "قصتنا",
    heroSince: "منذ 2024",
    heroScroll: "تمرير",

    storyLabel: "قصتنا",
    storyTitle1: "KAYNA.",
    storyTitle2: "اليقين الراسخ.",
    chapters: [
      { number: "01", title: "الفلسفة", subtitle: "أكثر من كلمة", keywords: ["ثقة", "تجاوز", "مثابرة"] },
      { number: "02", title: "المعركة", subtitle: "الصامتة", keywords: ["شك", "قتال", "صمود"] },
      { number: "03", title: "الاختيار", subtitle: "الراسخ", keywords: ["انضباط", "بنية", "درع"] },
      { number: "04", title: "التوريث", subtitle: "أكثر من ملابس", keywords: ["تكوين", "وصول", "تطور"] },
      { number: "05", title: "المجتمع", subtitle: "الحلقة", keywords: ["معاً", "رؤية", "قوة"] },
      { number: "06", title: "الإرث", subtitle: "زيك الموحد", keywords: ["بناء", "نقل", "توريث"] },
    ],
    storyCTA1: "ارتدِ اليقين.",
    storyCTA2: "انضم إلى الحلقة.",
    storyCTA3: "ابنِ إرثك.",

    aboutLabel: "الفلسفة",
    aboutTitle1: "ثلاث قوى.",
    aboutTitle2: "يقين واحد.",
    aboutValues: [
      { word: "ثقة", meaning: "أساس كل فعل" },
      { word: "تجاوز", meaning: "رفض السقوف المفروضة" },
      { word: "مثابرة", meaning: "النتيجة الوحيدة المقبولة" },
    ],
    aboutQuote: "قبل أي نجاح مرئي، هناك هذا الانتصار الخفي: اليقين الداخلي.",
    aboutBadge: "240 GSM",

    catLabel: "استكشف",
    catTitle1: "حسب",
    catTitle2: "الفئة",
    catDescriptions: {
      tshirts: "أساسيات KAYNA",
      hoodies: "راحة المحارب",
      sweaters: "الأناقة الهادئة",
    },
    catActiveCollection: "المجموعة النشطة",
    catArticles: "منتجات",
    catSee: "عرض",

    qualLabel: "الجودة",
    qualTitle1: "التميز.",
    qualTitle2: "بدون تنازل.",
    qualItems: [
      { number: "240", unit: "GSM", label: "وزن متميز" },
      { number: "100", unit: "%", label: "قطن عضوي" },
      { number: "∞", unit: "", label: "ضمان" },
    ],
    qualMessage: "كل قطعة مصممة لتدوم. إنتاج أخلاقي، مواد متميزة.",

    collTitle1: "ليست مجرد ملابس ترتديها.",
    collTitle2: "إنها درع ذهني.",
    collSubtitle: "لمن يرفض الهروب. لمن يحول الشك إلى انضباط.",
    collCTA: "اكتشف المجموعة",
    collQuote: "ارتدِ الثقة. كن اليقين. هذا هو KAYNA.",

    promiseShipping: "الشحن مشمول",
    promiseReturns: "جميع المبيعات نهائية",
    promisePayment: "دفع آمن",
    promiseTitle1: "مستعد لارتداء",
    promiseTitle2: "ثقتك",
    promiseCTA: "اكتشف",

    shopFilter: "تصفية",
    shopOutOfStock: "نفذت الكمية",
    shopNoProducts: "لا توجد منتجات متاحة حالياً",
  },

  pt: {
    heroTagline: "A certeza inabalável",
    heroValues: ["Certeza", "Superação", "Perseverança"],
    heroDiscover: "Descobrir",
    heroOurStory: "Nossa História",
    heroSince: "Desde 2024",
    heroScroll: "Scroll",

    storyLabel: "Nossa História",
    storyTitle1: "KAYNA.",
    storyTitle2: "A certeza inabalável.",
    chapters: [
      { number: "01", title: "Filosofia", subtitle: "Mais que uma palavra", keywords: ["Confiança", "Superação", "Perseverança"] },
      { number: "02", title: "A Batalha", subtitle: "Silenciosa", keywords: ["Dúvida", "Luta", "Resiliência"] },
      { number: "03", title: "A Escolha", subtitle: "Inabalável", keywords: ["Disciplina", "Estrutura", "Armadura"] },
      { number: "04", title: "Transmissão", subtitle: "Mais que roupa", keywords: ["Formação", "Acesso", "Evolução"] },
      { number: "05", title: "Comunidade", subtitle: "O Círculo", keywords: ["Juntos", "Visão", "Força"] },
      { number: "06", title: "Herança", subtitle: "Seu uniforme", keywords: ["Construir", "Transmitir", "Legar"] },
    ],
    storyCTA1: "Vista a certeza.",
    storyCTA2: "Entre no círculo.",
    storyCTA3: "Construa sua herança.",

    aboutLabel: "Filosofia",
    aboutTitle1: "Três forças.",
    aboutTitle2: "Uma certeza.",
    aboutValues: [
      { word: "Confiança", meaning: "A base de cada ação" },
      { word: "Superação", meaning: "Recusar tetos impostos" },
      { word: "Perseverança", meaning: "O único resultado aceitável" },
    ],
    aboutQuote: "Antes de qualquer sucesso visível, existe esta vitória invisível: a certeza interior.",
    aboutBadge: "240 GSM",

    catLabel: "Explorar",
    catTitle1: "Por",
    catTitle2: "categoria",
    catDescriptions: {
      tshirts: "O essencial KAYNA",
      hoodies: "O conforto de um guerreiro",
      sweaters: "A elegância discreta",
    },
    catActiveCollection: "Coleção Ativa",
    catArticles: "artigos",
    catSee: "Ver",

    qualLabel: "Qualidade",
    qualTitle1: "A excelência.",
    qualTitle2: "Sem compromisso.",
    qualItems: [
      { number: "240", unit: "GSM", label: "Peso premium" },
      { number: "100", unit: "%", label: "Algodão orgânico" },
      { number: "∞", unit: "", label: "Garantia" },
    ],
    qualMessage: "Cada peça é projetada para durar. Produção ética, materiais premium.",

    collTitle1: "Não é apenas roupa que você veste.",
    collTitle2: "É uma armadura mental.",
    collSubtitle: "Para quem recusa fugir. Para quem transforma dúvida em disciplina.",
    collCTA: "Descobrir a Coleção",
    collQuote: "Vista a confiança. Torne-se certeza. Isso é KAYNA.",

    promiseShipping: "Frete incluído",
    promiseReturns: "Vendas definitivas",
    promisePayment: "Pagamento seguro",
    promiseTitle1: "Pronto para vestir sua",
    promiseTitle2: "confiança",
    promiseCTA: "Descobrir",

    shopFilter: "Filtrar",
    shopOutOfStock: "Esgotado",
    shopNoProducts: "Nenhum produto disponível no momento",
  },
};
