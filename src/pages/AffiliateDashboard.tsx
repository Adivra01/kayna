import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Copy, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Wallet,
  ArrowRight,
  LogOut,
  User
} from 'lucide-react';

interface Affiliate {
  id: string;
  affiliate_code: string;
  total_visits: number;
  total_sales: number;
  total_earnings: number;
  pending_earnings: number;
  commission_rate: number;
  created_at: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingWithdrawal, setRequestingWithdrawal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  useEffect(() => {
    checkAffiliateStatus();
  }, []);

  const checkAffiliateStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: affiliateData, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error || !affiliateData) {
        toast.error("Aucun compte affilié trouvé");
        navigate('/');
        return;
      }

      setAffiliate(affiliateData as Affiliate);

      // Fetch withdrawals
      const { data: withdrawalsData } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false });

      setWithdrawals((withdrawalsData || []) as WithdrawalRequest[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!affiliate) return;
    const link = `${window.location.origin}?ref=${affiliate.affiliate_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Lien copié !');
  };

  const copyCode = () => {
    if (!affiliate) return;
    navigator.clipboard.writeText(affiliate.affiliate_code);
    toast.success('Code copié !');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const requestWithdrawal = async () => {
    if (!affiliate || !withdrawalAmount) return;
    
    const amount = parseFloat(withdrawalAmount);
    if (amount <= 0 || amount > affiliate.pending_earnings) {
      toast.error('Montant invalide');
      return;
    }

    setRequestingWithdrawal(true);

    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          affiliate_id: affiliate.id,
          amount: amount,
          status: 'pending'
        });

      if (error) throw error;

      // Update local state
      setAffiliate(prev => prev ? { ...prev, pending_earnings: prev.pending_earnings - amount } : null);
      
      toast.success('Demande de retrait envoyée !');
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      checkAffiliateStatus();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRequestingWithdrawal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!affiliate) return null;

  const affiliateLink = `${window.location.origin}?ref=${affiliate.affiliate_code}`;
  const conversionRate = affiliate.total_visits > 0 
    ? ((affiliate.total_sales / affiliate.total_visits) * 100).toFixed(1) 
    : '0';
  const daysSinceCreation = Math.floor((Date.now() - new Date(affiliate.created_at).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-primary">
      {/* Header - Responsive */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 lg:px-12 py-4 md:py-5 flex items-center justify-between backdrop-blur-md bg-primary/80 border-b border-secondary/10">
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/" className="text-xl md:text-2xl font-bold italic text-secondary">KAYNA</Link>
          <span className="px-2 md:px-3 py-1 bg-accent/20 text-accent text-[10px] md:text-xs font-medium rounded-full">Affilié</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link 
            to="/profile"
            className="w-9 h-9 md:w-auto md:h-auto md:px-4 md:py-2 flex items-center justify-center text-secondary/60 hover:text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/5 transition-all text-sm"
          >
            <User className="w-4 h-4 md:hidden" />
            <span className="hidden md:inline">Mon profil</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-9 h-9 md:w-auto md:h-auto md:px-4 md:py-2 flex items-center justify-center text-secondary/60 hover:text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/5 transition-all text-sm"
          >
            <LogOut className="w-4 h-4 md:hidden" />
            <span className="hidden md:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <main className="pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-1 md:mb-2">
              Mon Espace Affilié
            </h1>
            <p className="text-secondary/60 text-sm md:text-base">
              Actif depuis {daysSinceCreation} jour{daysSinceCreation > 1 ? 's' : ''} • Commission: {affiliate.commission_rate}%
            </p>
          </div>

          {/* Main Stats - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 md:mb-4">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <p className="text-2xl md:text-4xl font-bold text-secondary">{affiliate.total_visits}</p>
              <p className="text-secondary/50 text-xs md:text-sm mt-1">Visites totales</p>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 md:mb-4">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <p className="text-2xl md:text-4xl font-bold text-secondary">{affiliate.total_sales}</p>
              <p className="text-secondary/50 text-xs md:text-sm mt-1">Achats générés</p>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-green-500/20 flex items-center justify-center mb-3 md:mb-4">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
              <p className="text-xl md:text-4xl font-bold text-accent break-all">{affiliate.total_earnings.toLocaleString()}</p>
              <p className="text-secondary/50 text-xs md:text-sm mt-1">FCFA gagnés</p>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3 md:mb-4">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
              </div>
              <p className="text-2xl md:text-4xl font-bold text-secondary">{conversionRate}%</p>
              <p className="text-secondary/50 text-xs md:text-sm mt-1">Conversion</p>
            </div>
          </div>

          {/* Affiliate Link - Responsive */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="font-bold text-secondary mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              Ton lien d'affiliation
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 md:gap-3 bg-primary/50 rounded-xl px-3 md:px-4 py-3 border border-secondary/10 overflow-hidden">
                <span className="text-secondary truncate text-xs md:text-sm flex-1">{affiliateLink}</span>
              </div>
              <button 
                onClick={copyLink}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all text-sm md:text-base"
              >
                <Copy className="w-4 h-4" />
                Copier le lien
              </button>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-secondary/60 text-xs md:text-sm">Code promo:</span>
              <div className="flex items-center gap-3">
                <code className="px-3 py-1.5 bg-accent/20 text-accent font-mono rounded-lg text-xs md:text-sm font-bold">
                  {affiliate.affiliate_code}
                </code>
                <button onClick={copyCode} className="text-accent hover:underline text-xs md:text-sm">
                  Copier
                </button>
              </div>
            </div>
            <p className="text-secondary/40 text-[10px] md:text-xs mt-3 md:mt-4">
              Partage ce lien et gagne {affiliate.commission_rate}% sur chaque vente !
            </p>
          </div>

          {/* Withdrawal Section - Responsive Grid */}
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            {/* Balance & Request */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="font-bold text-secondary flex items-center gap-2 text-sm md:text-base">
                  <Wallet className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Solde disponible
                </h2>
              </div>
              
              <div className="text-center py-4 md:py-6">
                <p className="text-3xl md:text-5xl font-bold text-accent mb-1 md:mb-2">
                  {affiliate.pending_earnings.toLocaleString()}
                </p>
                <p className="text-secondary/50 text-base md:text-lg">FCFA</p>
              </div>

              <button
                onClick={() => setShowWithdrawalModal(true)}
                disabled={affiliate.pending_earnings <= 0}
                className="w-full flex items-center justify-center gap-2 py-3 md:py-4 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                Demander un retrait
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>

            {/* Withdrawal History */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h2 className="font-bold text-secondary mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                Historique des retraits
              </h2>
              
              {withdrawals.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <DollarSign className="w-10 h-10 md:w-12 md:h-12 text-secondary/20 mx-auto mb-2 md:mb-3" />
                  <p className="text-secondary/50 text-xs md:text-sm">Aucun retrait effectué</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3 max-h-[250px] md:max-h-[300px] overflow-y-auto">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 md:p-4 bg-secondary/5 rounded-xl">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-secondary text-sm md:text-base">{w.amount.toLocaleString()} FCFA</p>
                        <p className="text-secondary/40 text-[10px] md:text-xs">
                          {new Date(w.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        {w.status === 'rejected' && w.rejection_reason && (
                          <p className="text-red-400 text-[10px] md:text-xs mt-1 italic truncate">
                            {w.rejection_reason}
                          </p>
                        )}
                      </div>
                      <span className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium flex-shrink-0 ${
                        w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {w.status === 'approved' ? <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> :
                         w.status === 'pending' ? <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> :
                         <XCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                        <span className="hidden sm:inline">
                          {w.status === 'approved' ? 'Payé' : w.status === 'pending' ? 'En attente' : 'Refusé'}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Card - Responsive */}
          <div className="mt-6 md:mt-8 bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="font-bold text-secondary mb-3 text-sm md:text-base">Comment ça marche ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold text-xs md:text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-secondary text-xs md:text-sm">Partage ton lien</p>
                  <p className="text-secondary/50 text-[10px] md:text-xs">Sur tes réseaux sociaux...</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold text-xs md:text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-secondary text-xs md:text-sm">Tes contacts achètent</p>
                  <p className="text-secondary/50 text-[10px] md:text-xs">Ils utilisent ton code promo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold text-xs md:text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-secondary text-xs md:text-sm">Tu gagnes {affiliate.commission_rate}%</p>
                  <p className="text-secondary/50 text-[10px] md:text-xs">Sur chaque vente générée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Withdrawal Modal - Responsive */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5 md:p-6 max-w-md w-full">
            <h3 className="text-lg md:text-xl font-bold text-secondary mb-1 md:mb-2">Demander un retrait</h3>
            <p className="text-secondary/60 text-xs md:text-sm mb-4 md:mb-6">
              Solde disponible: <span className="text-accent font-bold">{affiliate.pending_earnings.toLocaleString()} FCFA</span>
            </p>
            
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">Montant (FCFA)</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Ex: 5000"
                max={affiliate.pending_earnings}
                className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent text-base md:text-lg font-bold"
              />
              <button 
                onClick={() => setWithdrawalAmount(affiliate.pending_earnings.toString())}
                className="text-accent text-xs md:text-sm mt-2 hover:underline"
              >
                Retirer tout le solde
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWithdrawalModal(false);
                  setWithdrawalAmount('');
                }}
                className="flex-1 py-3 border border-secondary/20 text-secondary rounded-xl font-medium hover:bg-secondary/10 transition-all text-sm md:text-base"
              >
                Annuler
              </button>
              <button
                onClick={requestWithdrawal}
                disabled={requestingWithdrawal || !withdrawalAmount}
                className="flex-1 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all disabled:opacity-50 text-sm md:text-base"
              >
                {requestingWithdrawal ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
