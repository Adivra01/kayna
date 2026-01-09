import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Users, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import gsap from 'gsap';

export default function AffiliateSignup() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [existingAffiliate, setExistingAffiliate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    checkAuth();
    
    gsap.fromTo('.benefit-card', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setIsAuthenticated(true);
      setFormData(prev => ({
        ...prev,
        email: session.user.email || '',
      }));

      // Check if already affiliate
      const { data: affiliate } = await (supabase as any)
        .from('affiliates')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (affiliate) {
        setExistingAffiliate(affiliate);
      }
    }
    setLoading(false);
  };

  const generateAffiliateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'KAYNA';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Connecte-toi d\'abord pour postuler');
      navigate('/auth');
      return;
    }

    if (!formData.full_name.trim()) {
      toast.error('Le nom complet est requis');
      return;
    }

    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Session expirée');
      navigate('/auth');
      return;
    }

    const { error } = await (supabase as any).from('affiliates').insert({
      user_id: session.user.id,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || null,
      status: 'pending',
      commission_rate: 15,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('Tu as déjà une demande en cours');
      } else {
        toast.error('Erreur lors de l\'inscription');
        console.error(error);
      }
    } else {
      toast.success('Demande envoyée ! Tu seras notifié par email.');
      checkAuth();
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-primary/80 border-b border-secondary/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link to="/" className="text-2xl font-bold italic text-secondary">KAYNA</Link>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Programme d'affiliation
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-secondary mb-4">
              Deviens ambassadeur<br />
              <span className="text-accent">KAYNA</span>
            </h1>
            <p className="text-lg text-secondary/60 max-w-xl mx-auto">
              Partage ta passion pour KAYNA et gagne 15% de commission sur chaque vente générée.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            <div className="benefit-card bg-secondary/5 border border-secondary/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-secondary mb-2">15% de commission</h3>
              <p className="text-secondary/60 text-sm">Sur chaque vente générée par ton lien unique</p>
            </div>
            <div className="benefit-card bg-secondary/5 border border-secondary/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-secondary mb-2">Dashboard en temps réel</h3>
              <p className="text-secondary/60 text-sm">Suis tes visites, ventes et commissions</p>
            </div>
            <div className="benefit-card bg-secondary/5 border border-secondary/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-secondary mb-2">Paiements rapides</h3>
              <p className="text-secondary/60 text-sm">Demande un retrait à tout moment</p>
            </div>
          </div>

          {/* Form or Status */}
          {existingAffiliate ? (
            <div className="max-w-md mx-auto bg-secondary/5 border border-secondary/10 rounded-3xl p-8 text-center">
              {existingAffiliate.status === 'pending' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h2 className="text-xl font-bold text-secondary mb-2">Demande en cours</h2>
                  <p className="text-secondary/60 mb-6">
                    Ta candidature est en attente de validation. Tu recevras un email dès qu'elle sera traitée.
                  </p>
                </>
              )}
              {existingAffiliate.status === 'approved' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-secondary mb-2">Tu es affilié !</h2>
                  <p className="text-secondary/60 mb-6">
                    Accède à ton dashboard pour voir tes statistiques et ton lien unique.
                  </p>
                  <Link 
                    to="/affiliate/dashboard"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-full font-bold shadow-gold hover:shadow-gold-glow transition-all"
                  >
                    Voir mon dashboard
                  </Link>
                </>
              )}
              {existingAffiliate.status === 'rejected' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-secondary mb-2">Candidature refusée</h2>
                  <p className="text-secondary/60">
                    Malheureusement, ta candidature n'a pas été retenue. Tu peux nous contacter pour plus d'informations.
                  </p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-secondary/5 border border-secondary/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-secondary mb-6 text-center">Rejoins le programme</h2>
              
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl text-center">
                  <p className="text-secondary/80 text-sm mb-3">
                    Tu dois être connecté pour postuler
                  </p>
                  <Link 
                    to="/auth"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-primary rounded-full font-medium text-sm"
                  >
                    Se connecter
                  </Link>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Nom complet *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    placeholder="john@example.com"
                    required
                    disabled={isAuthenticated}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent"
                    placeholder="+33 6 00 00 00 00"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isAuthenticated || submitting}
                className="w-full mt-6 py-4 bg-accent text-primary rounded-xl font-bold shadow-gold hover:shadow-gold-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Envoi...' : 'Envoyer ma candidature'}
              </button>

              <p className="text-secondary/40 text-xs text-center mt-4">
                En postulant, tu acceptes les conditions du programme d'affiliation.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
