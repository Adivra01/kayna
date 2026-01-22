// Complete translations for all supported languages
export type Language = 'fr' | 'en' | 'es' | 'ar' | 'pt';

export interface Translations {
  // Navigation
  nav: {
    shop: string;
    about: string;
    favorites: string;
    cart: string;
    myAccount: string;
    login: string;
    logout: string;
    profile: string;
    admin: string;
    affiliateLink: string;
  };
  // Hero
  hero: {
    tagline: string;
    title1: string;
    title2: string;
    subtitle: string;
    cta: string;
    newCollection: string;
  };
  // Product
  product: {
    addToCart: string;
    added: string;
    outOfStock: string;
    selectSize: string;
    color: string;
    size: string;
    quantity: string;
    description: string;
    details: string;
    shipping: string;
    returns: string;
    quality: string;
    reviews: string;
    relatedProducts: string;
    freeShipping: string;
    freeReturns: string;
    premiumQuality: string;
    shippingTitle: string;
    deliveryTime: string;
    deliveryNote: string;
    noReturns: string;
    noReturnsNote: string;
    seeTerms: string;
  };
  // Cart
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    clear: string;
    freeShippingProgress: string;
    freeShippingReached: string;
    expiresIn: string;
    item: string;
    items: string;
  };
  // Shop
  shop: {
    title: string;
    all: string;
    tshirts: string;
    hoodies: string;
    sweaters: string;
    noProducts: string;
    filters: string;
  };
  // About
  about: {
    title: string;
    heritage: string;
    philosophy: string;
    ourStory: string;
    discoverMore: string;
  };
  // Footer
  footer: {
    newsletter: string;
    newsletterPlaceholder: string;
    newsletterSuccess: string;
    allRights: string;
    legalNotice: string;
    terms: string;
    privacy: string;
    delivery: string;
    contact: string;
    faq: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    back: string;
    continue: string;
    save: string;
    cancel: string;
    close: string;
    search: string;
    seeAll: string;
    currency: string;
  };
  // Auth
  auth: {
    login: string;
    signup: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    loginSuccess: string;
    signupSuccess: string;
  };
  // Affiliate
  affiliate: {
    dashboard: string;
    myLink: string;
    copyLink: string;
    linkCopied: string;
    stats: string;
    visits: string;
    sales: string;
    earnings: string;
    pendingEarnings: string;
    commissionRate: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      shop: "Boutique",
      about: "Notre Histoire",
      favorites: "Favoris",
      cart: "Panier",
      myAccount: "Mon Compte",
      login: "Connexion",
      logout: "Déconnexion",
      profile: "Profil",
      admin: "Administration",
      affiliateLink: "Mon lien affilié",
    },
    hero: {
      tagline: "COLLECTION EXCLUSIVE",
      title1: "PORTEZ",
      title2: "VOTRE CONFIANCE",
      subtitle: "Vêtements pour ceux qui refusent l'ordinaire.",
      cta: "Découvrir la collection",
      newCollection: "Nouvelle collection",
    },
    product: {
      addToCart: "Ajouter au panier",
      added: "Ajouté !",
      outOfStock: "Rupture de stock",
      selectSize: "Veuillez sélectionner une taille",
      color: "Couleur",
      size: "Taille",
      quantity: "Quantité",
      description: "Description",
      details: "Détails",
      shipping: "Livraison 3-15 jours",
      returns: "Pas de retours",
      quality: "Qualité premium",
      reviews: "avis",
      relatedProducts: "Produits similaires",
      freeShipping: "Livraison offerte à partir de",
      freeReturns: "Pas de retours ni remboursements",
      premiumQuality: "Qualité premium garantie",
      shippingTitle: "Livraison & Politique",
      deliveryTime: "Livraison : 3 à 15 jours ouvrés",
      deliveryNote: "Le délai varie selon votre pays de destination",
      noReturns: "Pas de retours ni remboursements",
      noReturnsNote: "Toutes les ventes sont définitives. Vérifiez bien votre taille avant de commander.",
      seeTerms: "Voir les conditions générales de vente",
    },
    cart: {
      title: "Votre Panier",
      empty: "Votre panier est vide",
      total: "Total",
      checkout: "Commander",
      clear: "Vider le panier",
      freeShippingProgress: "Plus que {amount} pour la livraison gratuite !",
      freeShippingReached: "Livraison gratuite !",
      expiresIn: "Expire dans",
      item: "article",
      items: "articles",
    },
    shop: {
      title: "Boutique",
      all: "Tous",
      tshirts: "T-Shirts",
      hoodies: "Hoodies",
      sweaters: "Sweaters",
      noProducts: "Aucun produit trouvé",
      filters: "Filtres",
    },
    about: {
      title: "Notre Histoire",
      heritage: "Héritage",
      philosophy: "Philosophie",
      ourStory: "Notre histoire",
      discoverMore: "Découvrir notre histoire",
    },
    footer: {
      newsletter: "Newsletter",
      newsletterPlaceholder: "Ton email",
      newsletterSuccess: "Bienvenue dans la famille KAYNA",
      allRights: "Tous droits réservés.",
      legalNotice: "Mentions légales",
      terms: "CGV",
      privacy: "Confidentialité",
      delivery: "Livraison",
      contact: "Contact",
      faq: "FAQ",
    },
    common: {
      loading: "Chargement...",
      error: "Une erreur est survenue",
      success: "Succès !",
      back: "Retour",
      continue: "Continuer",
      save: "Enregistrer",
      cancel: "Annuler",
      close: "Fermer",
      search: "Rechercher",
      seeAll: "Voir tout",
      currency: "FCFA",
    },
    auth: {
      login: "Se connecter",
      signup: "S'inscrire",
      email: "Email",
      password: "Mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      phone: "Téléphone",
      country: "Pays",
      forgotPassword: "Mot de passe oublié ?",
      noAccount: "Pas encore de compte ?",
      hasAccount: "Déjà un compte ?",
      loginSuccess: "Connexion réussie !",
      signupSuccess: "Inscription réussie !",
    },
    affiliate: {
      dashboard: "Tableau de bord affilié",
      myLink: "Mon lien",
      copyLink: "Copier le lien",
      linkCopied: "Lien copié !",
      stats: "Statistiques",
      visits: "Visites",
      sales: "Ventes",
      earnings: "Gains",
      pendingEarnings: "Gains en attente",
      commissionRate: "Taux de commission",
    },
  },
  en: {
    nav: {
      shop: "Shop",
      about: "Our Story",
      favorites: "Favorites",
      cart: "Cart",
      myAccount: "My Account",
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      admin: "Admin",
      affiliateLink: "My affiliate link",
    },
    hero: {
      tagline: "EXCLUSIVE COLLECTION",
      title1: "WEAR",
      title2: "YOUR CONFIDENCE",
      subtitle: "Clothing for those who refuse the ordinary.",
      cta: "Discover the collection",
      newCollection: "New collection",
    },
    product: {
      addToCart: "Add to cart",
      added: "Added!",
      outOfStock: "Out of stock",
      selectSize: "Please select a size",
      color: "Color",
      size: "Size",
      quantity: "Quantity",
      description: "Description",
      details: "Details",
      shipping: "Delivery 3-15 days",
      returns: "No returns",
      quality: "Premium quality",
      reviews: "reviews",
      relatedProducts: "Related products",
      freeShipping: "Free shipping from",
      freeReturns: "No returns or refunds",
      premiumQuality: "Premium quality guaranteed",
      shippingTitle: "Shipping & Policy",
      deliveryTime: "Delivery: 3 to 15 business days",
      deliveryNote: "Delivery time varies by destination country",
      noReturns: "No returns or refunds",
      noReturnsNote: "All sales are final. Please check your size before ordering.",
      seeTerms: "See terms and conditions",
    },
    cart: {
      title: "Your Cart",
      empty: "Your cart is empty",
      total: "Total",
      checkout: "Checkout",
      clear: "Clear cart",
      freeShippingProgress: "Only {amount} left for free shipping!",
      freeShippingReached: "Free shipping!",
      expiresIn: "Expires in",
      item: "item",
      items: "items",
    },
    shop: {
      title: "Shop",
      all: "All",
      tshirts: "T-Shirts",
      hoodies: "Hoodies",
      sweaters: "Sweaters",
      noProducts: "No products found",
      filters: "Filters",
    },
    about: {
      title: "Our Story",
      heritage: "Heritage",
      philosophy: "Philosophy",
      ourStory: "Our story",
      discoverMore: "Discover our story",
    },
    footer: {
      newsletter: "Newsletter",
      newsletterPlaceholder: "Your email",
      newsletterSuccess: "Welcome to the KAYNA family",
      allRights: "All rights reserved.",
      legalNotice: "Legal notice",
      terms: "Terms",
      privacy: "Privacy",
      delivery: "Delivery",
      contact: "Contact",
      faq: "FAQ",
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!",
      back: "Back",
      continue: "Continue",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      search: "Search",
      seeAll: "See all",
      currency: "USD",
    },
    auth: {
      login: "Login",
      signup: "Sign up",
      email: "Email",
      password: "Password",
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone",
      country: "Country",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      loginSuccess: "Login successful!",
      signupSuccess: "Sign up successful!",
    },
    affiliate: {
      dashboard: "Affiliate dashboard",
      myLink: "My link",
      copyLink: "Copy link",
      linkCopied: "Link copied!",
      stats: "Statistics",
      visits: "Visits",
      sales: "Sales",
      earnings: "Earnings",
      pendingEarnings: "Pending earnings",
      commissionRate: "Commission rate",
    },
  },
  es: {
    nav: {
      shop: "Tienda",
      about: "Nuestra Historia",
      favorites: "Favoritos",
      cart: "Carrito",
      myAccount: "Mi Cuenta",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      profile: "Perfil",
      admin: "Admin",
      affiliateLink: "Mi enlace de afiliado",
    },
    hero: {
      tagline: "COLECCIÓN EXCLUSIVA",
      title1: "VISTE",
      title2: "TU CONFIANZA",
      subtitle: "Ropa para quienes rechazan lo ordinario.",
      cta: "Descubrir la colección",
      newCollection: "Nueva colección",
    },
    product: {
      addToCart: "Añadir al carrito",
      added: "¡Añadido!",
      outOfStock: "Agotado",
      selectSize: "Por favor selecciona una talla",
      color: "Color",
      size: "Talla",
      quantity: "Cantidad",
      description: "Descripción",
      details: "Detalles",
      shipping: "Envío 3-15 días",
      returns: "Sin devoluciones",
      quality: "Calidad premium",
      reviews: "reseñas",
      relatedProducts: "Productos relacionados",
      freeShipping: "Envío gratis a partir de",
      freeReturns: "Sin devoluciones ni reembolsos",
      premiumQuality: "Calidad premium garantizada",
      shippingTitle: "Envío y Política",
      deliveryTime: "Entrega: 3 a 15 días hábiles",
      deliveryNote: "El tiempo varía según el país de destino",
      noReturns: "Sin devoluciones ni reembolsos",
      noReturnsNote: "Todas las ventas son definitivas. Verifica tu talla antes de pedir.",
      seeTerms: "Ver términos y condiciones",
    },
    cart: {
      title: "Tu Carrito",
      empty: "Tu carrito está vacío",
      total: "Total",
      checkout: "Finalizar compra",
      clear: "Vaciar carrito",
      freeShippingProgress: "¡Solo {amount} para envío gratis!",
      freeShippingReached: "¡Envío gratis!",
      expiresIn: "Expira en",
      item: "artículo",
      items: "artículos",
    },
    shop: {
      title: "Tienda",
      all: "Todos",
      tshirts: "Camisetas",
      hoodies: "Sudaderas",
      sweaters: "Suéteres",
      noProducts: "No se encontraron productos",
      filters: "Filtros",
    },
    about: {
      title: "Nuestra Historia",
      heritage: "Herencia",
      philosophy: "Filosofía",
      ourStory: "Nuestra historia",
      discoverMore: "Descubre nuestra historia",
    },
    footer: {
      newsletter: "Boletín",
      newsletterPlaceholder: "Tu email",
      newsletterSuccess: "Bienvenido a la familia KAYNA",
      allRights: "Todos los derechos reservados.",
      legalNotice: "Aviso legal",
      terms: "Términos",
      privacy: "Privacidad",
      delivery: "Envío",
      contact: "Contacto",
      faq: "FAQ",
    },
    common: {
      loading: "Cargando...",
      error: "Ocurrió un error",
      success: "¡Éxito!",
      back: "Volver",
      continue: "Continuar",
      save: "Guardar",
      cancel: "Cancelar",
      close: "Cerrar",
      search: "Buscar",
      seeAll: "Ver todo",
      currency: "EUR",
    },
    auth: {
      login: "Iniciar sesión",
      signup: "Registrarse",
      email: "Email",
      password: "Contraseña",
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Teléfono",
      country: "País",
      forgotPassword: "¿Olvidaste tu contraseña?",
      noAccount: "¿No tienes cuenta?",
      hasAccount: "¿Ya tienes cuenta?",
      loginSuccess: "¡Sesión iniciada!",
      signupSuccess: "¡Registro exitoso!",
    },
    affiliate: {
      dashboard: "Panel de afiliado",
      myLink: "Mi enlace",
      copyLink: "Copiar enlace",
      linkCopied: "¡Enlace copiado!",
      stats: "Estadísticas",
      visits: "Visitas",
      sales: "Ventas",
      earnings: "Ganancias",
      pendingEarnings: "Ganancias pendientes",
      commissionRate: "Tasa de comisión",
    },
  },
  ar: {
    nav: {
      shop: "المتجر",
      about: "قصتنا",
      favorites: "المفضلة",
      cart: "السلة",
      myAccount: "حسابي",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      profile: "الملف الشخصي",
      admin: "الإدارة",
      affiliateLink: "رابط الإحالة",
    },
    hero: {
      tagline: "مجموعة حصرية",
      title1: "ارتدِ",
      title2: "ثقتك",
      subtitle: "ملابس لمن يرفض العادي.",
      cta: "اكتشف المجموعة",
      newCollection: "مجموعة جديدة",
    },
    product: {
      addToCart: "أضف إلى السلة",
      added: "تمت الإضافة!",
      outOfStock: "نفذت الكمية",
      selectSize: "الرجاء اختيار المقاس",
      color: "اللون",
      size: "المقاس",
      quantity: "الكمية",
      description: "الوصف",
      details: "التفاصيل",
      shipping: "التوصيل 3-15 يوم",
      returns: "لا إرجاع",
      quality: "جودة متميزة",
      reviews: "تقييمات",
      relatedProducts: "منتجات مشابهة",
      freeShipping: "شحن مجاني ابتداءً من",
      freeReturns: "لا إرجاع ولا استرداد",
      premiumQuality: "جودة متميزة مضمونة",
      shippingTitle: "التوصيل والسياسة",
      deliveryTime: "التوصيل: 3 إلى 15 يوم عمل",
      deliveryNote: "يختلف الوقت حسب بلد الوجهة",
      noReturns: "لا إرجاع ولا استرداد",
      noReturnsNote: "جميع المبيعات نهائية. تحقق من مقاسك قبل الطلب.",
      seeTerms: "عرض الشروط والأحكام",
    },
    cart: {
      title: "سلتك",
      empty: "سلتك فارغة",
      total: "المجموع",
      checkout: "إتمام الشراء",
      clear: "إفراغ السلة",
      freeShippingProgress: "باقي {amount} للشحن المجاني!",
      freeShippingReached: "شحن مجاني!",
      expiresIn: "تنتهي في",
      item: "منتج",
      items: "منتجات",
    },
    shop: {
      title: "المتجر",
      all: "الكل",
      tshirts: "تيشيرتات",
      hoodies: "هوديات",
      sweaters: "سويترات",
      noProducts: "لا توجد منتجات",
      filters: "التصفية",
    },
    about: {
      title: "قصتنا",
      heritage: "التراث",
      philosophy: "الفلسفة",
      ourStory: "قصتنا",
      discoverMore: "اكتشف قصتنا",
    },
    footer: {
      newsletter: "النشرة البريدية",
      newsletterPlaceholder: "بريدك الإلكتروني",
      newsletterSuccess: "مرحباً بك في عائلة KAYNA",
      allRights: "جميع الحقوق محفوظة.",
      legalNotice: "إشعار قانوني",
      terms: "الشروط",
      privacy: "الخصوصية",
      delivery: "التوصيل",
      contact: "اتصل بنا",
      faq: "الأسئلة الشائعة",
    },
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      success: "نجاح!",
      back: "رجوع",
      continue: "متابعة",
      save: "حفظ",
      cancel: "إلغاء",
      close: "إغلاق",
      search: "بحث",
      seeAll: "عرض الكل",
      currency: "FCFA",
    },
    auth: {
      login: "تسجيل الدخول",
      signup: "التسجيل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      phone: "الهاتف",
      country: "البلد",
      forgotPassword: "نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب؟",
      hasAccount: "لديك حساب بالفعل؟",
      loginSuccess: "تم تسجيل الدخول!",
      signupSuccess: "تم التسجيل بنجاح!",
    },
    affiliate: {
      dashboard: "لوحة الإحالة",
      myLink: "رابطي",
      copyLink: "نسخ الرابط",
      linkCopied: "تم النسخ!",
      stats: "الإحصائيات",
      visits: "الزيارات",
      sales: "المبيعات",
      earnings: "الأرباح",
      pendingEarnings: "أرباح معلقة",
      commissionRate: "نسبة العمولة",
    },
  },
  pt: {
    nav: {
      shop: "Loja",
      about: "Nossa História",
      favorites: "Favoritos",
      cart: "Carrinho",
      myAccount: "Minha Conta",
      login: "Entrar",
      logout: "Sair",
      profile: "Perfil",
      admin: "Admin",
      affiliateLink: "Meu link de afiliado",
    },
    hero: {
      tagline: "COLEÇÃO EXCLUSIVA",
      title1: "VISTA",
      title2: "SUA CONFIANÇA",
      subtitle: "Roupas para quem recusa o ordinário.",
      cta: "Descobrir a coleção",
      newCollection: "Nova coleção",
    },
    product: {
      addToCart: "Adicionar ao carrinho",
      added: "Adicionado!",
      outOfStock: "Esgotado",
      selectSize: "Por favor selecione um tamanho",
      color: "Cor",
      size: "Tamanho",
      quantity: "Quantidade",
      description: "Descrição",
      details: "Detalhes",
      shipping: "Entrega 3-15 dias",
      returns: "Sem devoluções",
      quality: "Qualidade premium",
      reviews: "avaliações",
      relatedProducts: "Produtos relacionados",
      freeShipping: "Frete grátis a partir de",
      freeReturns: "Sem devoluções ou reembolsos",
      premiumQuality: "Qualidade premium garantida",
      shippingTitle: "Entrega e Política",
      deliveryTime: "Entrega: 3 a 15 dias úteis",
      deliveryNote: "O prazo varia conforme o país de destino",
      noReturns: "Sem devoluções ou reembolsos",
      noReturnsNote: "Todas as vendas são definitivas. Verifique seu tamanho antes de pedir.",
      seeTerms: "Ver termos e condições",
    },
    cart: {
      title: "Seu Carrinho",
      empty: "Seu carrinho está vazio",
      total: "Total",
      checkout: "Finalizar",
      clear: "Limpar carrinho",
      freeShippingProgress: "Faltam {amount} para frete grátis!",
      freeShippingReached: "Frete grátis!",
      expiresIn: "Expira em",
      item: "item",
      items: "itens",
    },
    shop: {
      title: "Loja",
      all: "Todos",
      tshirts: "Camisetas",
      hoodies: "Moletons",
      sweaters: "Suéteres",
      noProducts: "Nenhum produto encontrado",
      filters: "Filtros",
    },
    about: {
      title: "Nossa História",
      heritage: "Herança",
      philosophy: "Filosofia",
      ourStory: "Nossa história",
      discoverMore: "Descubra nossa história",
    },
    footer: {
      newsletter: "Newsletter",
      newsletterPlaceholder: "Seu email",
      newsletterSuccess: "Bem-vindo à família KAYNA",
      allRights: "Todos os direitos reservados.",
      legalNotice: "Aviso legal",
      terms: "Termos",
      privacy: "Privacidade",
      delivery: "Entrega",
      contact: "Contato",
      faq: "FAQ",
    },
    common: {
      loading: "Carregando...",
      error: "Ocorreu um erro",
      success: "Sucesso!",
      back: "Voltar",
      continue: "Continuar",
      save: "Salvar",
      cancel: "Cancelar",
      close: "Fechar",
      search: "Buscar",
      seeAll: "Ver tudo",
      currency: "BRL",
    },
    auth: {
      login: "Entrar",
      signup: "Cadastrar",
      email: "Email",
      password: "Senha",
      firstName: "Nome",
      lastName: "Sobrenome",
      phone: "Telefone",
      country: "País",
      forgotPassword: "Esqueceu a senha?",
      noAccount: "Não tem conta?",
      hasAccount: "Já tem conta?",
      loginSuccess: "Login realizado!",
      signupSuccess: "Cadastro realizado!",
    },
    affiliate: {
      dashboard: "Painel de afiliado",
      myLink: "Meu link",
      copyLink: "Copiar link",
      linkCopied: "Link copiado!",
      stats: "Estatísticas",
      visits: "Visitas",
      sales: "Vendas",
      earnings: "Ganhos",
      pendingEarnings: "Ganhos pendentes",
      commissionRate: "Taxa de comissão",
    },
  },
};
