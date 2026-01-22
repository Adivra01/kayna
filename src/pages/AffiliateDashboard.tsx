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
  User,
  Award,
  Percent,
  Eye,
  Package,
  ChevronDown,
  ChevronUp,
  CreditCard
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
  processed_at: string | null;
}

interface AffiliateSale {
  id: string;
  product_name: string;
  product_price: number;
  commission_rate: number;
  commission_amount: number;
  created_at: string;
}

interface AffiliateProductView {
  id: string;
  product_id: string;
  created_at: string;
}

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [sales, setSales] = useState<AffiliateSale[]>([]);
  const [productViews, setProductViews] = useState<AffiliateProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingWithdrawal, setRequestingWithdrawal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'withdrawals'>('overview');
  const [showSalesDetails, setShowSalesDetails] = useState(false);

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

      // Fetch sales
      const { data: salesData } = await (supabase as any)
        .from('affiliate_sales')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false });

      setSales((salesData || []) as AffiliateSale[]);

      // Fetch product views
      const { data: viewsData } = await supabase
        .from('affiliate_product_views')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setProductViews((viewsData || []) as AffiliateProductView[]);
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
    if (amount <= 0) {
      toast.error('Le montant doit être supérieur à 0');
      return;
    }
    if (amount > affiliate.pending_earnings) {
      toast.error('Montant supérieur au solde disponible');
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

      toast.success('Demande de retrait envoyée avec succès !');
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
  const avgCommission = sales.length > 0 
    ? Math.round(sales.reduce((sum, s) => sum + s.commission_amount, 0) / sales.length)
    : 0;

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved');
  const totalWithdrawn = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
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
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-1 md:mb-2">
              Mon Espace Affilié
            </h1>
            <p className="text-secondary/60 text-sm md:text-base">
              Actif depuis {daysSinceCreation} jour{daysSinceCreation > 1 ? 's' : ''} • Commission: {affiliate.commission_rate}%
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-accent text-primary'
                  : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all relative ${
                activeTab === 'sales'
                  ? 'bg-accent text-primary'
                  : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Mes ventes
              {sales.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                  {sales.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all relative ${
                activeTab === 'withdrawals'
                  ? 'bg-accent text-primary'
                  : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Retraits
              {pendingWithdrawals.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-primary text-xs rounded-full flex items-center justify-center">
                  {pendingWithdrawals.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Main Stats */}
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
                    <Percent className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  </div>
                  <p className="text-2xl md:text-4xl font-bold text-secondary">{conversionRate}%</p>
                  <p className="text-secondary/50 text-xs md:text-sm mt-1">Conversion</p>
                </div>
              </div>

              {/* Affiliate Link */}
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

              {/* Balance & Withdrawal */}
              <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Balance */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="font-bold text-secondary flex items-center gap-2 text-sm md:text-base">
                      <Wallet className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                      Solde disponible
                    </h2>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Disponible
                    </span>
                  </div>
                  
                  <div className="text-center py-4 md:py-6">
                    <p className="text-4xl md:text-6xl font-bold text-green-400 mb-1 md:mb-2">
                      {affiliate.pending_earnings.toLocaleString()}
                    </p>
                    <p className="text-secondary/50 text-base md:text-lg">FCFA</p>
                  </div>

                  <button
                    onClick={() => setShowWithdrawalModal(true)}
                    disabled={affiliate.pending_earnings <= 0}
                    className="w-full flex items-center justify-center gap-2 py-3 md:py-4 bg-green-500 text-primary rounded-xl font-bold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                    Demander un retrait
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>

                {/* Stats Summary */}
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h2 className="font-bold text-secondary mb-4 flex items-center gap-2 text-sm md:text-base">
                    <Award className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                    Résumé
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-secondary/70 text-sm">Produits vus</span>
                      </div>
                      <span className="font-bold text-secondary">{productViews.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Package className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-secondary/70 text-sm">Commission moyenne</span>
                      </div>
                      <span className="font-bold text-accent">{avgCommission.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-secondary/70 text-sm">Total retiré</span>
                      </div>
                      <span className="font-bold text-green-400">{totalWithdrawn.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sales Preview */}
              {sales.length > 0 && (
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-secondary flex items-center gap-2 text-sm md:text-base">
                      <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                      Dernières commissions
                    </h2>
                    <button 
                      onClick={() => setActiveTab('sales')}
                      className="text-accent text-sm hover:underline"
                    >
                      Voir tout
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {sales.slice(0, 3).map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-secondary/5 rounded-xl">
                        <div>
                          <p className="font-medium text-secondary text-sm">{sale.product_name}</p>
                          <p className="text-secondary/40 text-xs">
                            {new Date(sale.created_at).toLocaleDateString('fr-FR')} • {sale.commission_rate}% de {sale.product_price.toLocaleString()} FCFA
                          </p>
                        </div>
                        <span className="font-bold text-accent text-sm">+{sale.commission_amount.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How it works */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-6">
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
                      <p className="text-secondary/50 text-[10px] md:text-xs">Automatiquement crédité</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'sales' && (
            <div className="space-y-4">
              {/* Sales Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-secondary">{sales.length}</p>
                  <p className="text-secondary/50 text-xs">Ventes totales</p>
                </div>
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-accent">{affiliate.total_earnings.toLocaleString()}</p>
                  <p className="text-secondary/50 text-xs">FCFA gagnés</p>
                </div>
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-secondary">{avgCommission.toLocaleString()}</p>
                  <p className="text-secondary/50 text-xs">FCFA/vente</p>
                </div>
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-secondary">{affiliate.commission_rate}%</p>
                  <p className="text-secondary/50 text-xs">Commission</p>
                </div>
              </div>

              {/* Sales List */}
              {sales.length === 0 ? (
                <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-8 md:p-16 text-center">
                  <ShoppingBag className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-secondary mb-2">Aucune vente encore</h3>
                  <p className="text-secondary/60 text-sm mb-4">
                    Partage ton lien d'affiliation pour commencer à gagner des commissions !
                  </p>
                  <button 
                    onClick={copyLink}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copier mon lien
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sales.map((sale) => (
                    <div 
                      key={sale.id}
                      className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 md:p-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-secondary">{sale.product_name}</p>
                          <p className="text-secondary/40 text-sm">
                            {new Date(sale.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 md:gap-8">
                          <div className="text-right">
                            <p className="text-secondary/60 text-xs">Prix produit</p>
                            <p className="font-medium text-secondary">{sale.product_price.toLocaleString()} FCFA</p>
                          </div>
                          <div className="text-right">
                            <p className="text-secondary/60 text-xs">Commission ({sale.commission_rate}%)</p>
                            <p className="font-bold text-accent text-lg">+{sale.commission_amount.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-6">
              {/* Withdrawal Action */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-secondary text-lg mb-1">Solde disponible</h3>
                    <p className="text-4xl md:text-5xl font-bold text-green-400">
                      {affiliate.pending_earnings.toLocaleString()} <span className="text-lg">FCFA</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWithdrawalModal(true)}
                    disabled={affiliate.pending_earnings <= 0}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-primary rounded-xl font-bold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DollarSign className="w-5 h-5" />
                    Demander un retrait
                  </button>
                </div>
              </div>

              {/* Withdrawals List */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h2 className="font-bold text-secondary mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Historique des demandes
                </h2>
                
                {withdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-secondary/20 mx-auto mb-3" />
                    <p className="text-secondary/50">Aucune demande de retrait</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((w) => (
                      <div key={w.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-secondary/5 rounded-xl gap-3">
                        <div>
                          <p className="font-bold text-secondary text-lg">{w.amount.toLocaleString()} FCFA</p>
                          <p className="text-secondary/40 text-sm">
                            Demandé le {new Date(w.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          {w.status === 'approved' && w.processed_at && (
                            <p className="text-green-400 text-xs mt-1">
                              Payé le {new Date(w.processed_at).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                          {w.status === 'rejected' && w.rejection_reason && (
                            <p className="text-red-400 text-xs mt-1 italic">
                              Raison: {w.rejection_reason}
                            </p>
                          )}
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                          w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {w.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                           w.status === 'pending' ? <Clock className="w-4 h-4" /> :
                           <XCircle className="w-4 h-4" />}
                          {w.status === 'approved' ? 'Payé' : w.status === 'pending' ? 'En attente' : 'Refusé'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5 md:p-6 max-w-md w-full">
            <h3 className="text-lg md:text-xl font-bold text-secondary mb-1 md:mb-2">Demander un retrait</h3>
            <p className="text-secondary/60 text-xs md:text-sm mb-4 md:mb-6">
              Solde disponible: <span className="text-green-400 font-bold">{affiliate.pending_earnings.toLocaleString()} FCFA</span>
            </p>
            
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">Montant à retirer (FCFA)</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Ex: 5000"
                max={affiliate.pending_earnings}
                className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent text-base md:text-lg font-bold"
              />
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => setWithdrawalAmount((affiliate.pending_earnings * 0.5).toString())}
                  className="px-3 py-1.5 bg-secondary/10 text-secondary/70 rounded-lg text-sm hover:bg-secondary/20"
                >
                  50%
                </button>
                <button 
                  onClick={() => setWithdrawalAmount((affiliate.pending_earnings * 0.75).toString())}
                  className="px-3 py-1.5 bg-secondary/10 text-secondary/70 rounded-lg text-sm hover:bg-secondary/20"
                >
                  75%
                </button>
                <button 
                  onClick={() => setWithdrawalAmount(affiliate.pending_earnings.toString())}
                  className="px-3 py-1.5 bg-accent/20 text-accent rounded-lg text-sm hover:bg-accent/30"
                >
                  Tout
                </button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
              <p className="text-yellow-400 text-xs">
                ⚠️ Votre demande sera traitée sous 24-48h. Le paiement sera effectué par virement mobile.
              </p>
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
                disabled={requestingWithdrawal || !withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > affiliate.pending_earnings}
                className="flex-1 py-3 bg-green-500 text-primary rounded-xl font-bold hover:bg-green-600 transition-all disabled:opacity-50 text-sm md:text-base"
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