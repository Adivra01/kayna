import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Copy, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag,
  ExternalLink,
  Wallet,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Affiliate {
  id: string;
  affiliate_code: string;
  total_visits: number;
  total_sales: number;
  total_earnings: number;
  pending_earnings: number;
  commission_rate: number;
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
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: affiliateData, error } = await (supabase as any)
      .from('affiliates')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'approved')
      .maybeSingle();

    if (error || !affiliateData) {
      navigate('/affiliate');
      return;
    }

    setAffiliate(affiliateData as Affiliate);

    // Fetch withdrawals
    const { data: withdrawalsData } = await (supabase as any)
      .from('withdrawal_requests')
      .select('*')
      .eq('affiliate_id', affiliateData.id)
      .order('created_at', { ascending: false });

    setWithdrawals((withdrawalsData || []) as WithdrawalRequest[]);
    setLoading(false);
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

  const requestWithdrawal = async () => {
    if (!affiliate) return;
    
    const amount = parseInt(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Montant invalide');
      return;
    }

    if (amount > affiliate.pending_earnings) {
      toast.error('Solde insuffisant');
      return;
    }

    setRequestingWithdrawal(true);

    const { error } = await (supabase as any).from('withdrawal_requests').insert({
      affiliate_id: affiliate.id,
      amount: amount,
      status: 'pending',
    });

    if (error) {
      toast.error('Erreur lors de la demande');
    } else {
      toast.success('Demande de retrait envoyée !');
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      checkAffiliateStatus();
    }

    setRequestingWithdrawal(false);
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

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-primary/80 border-b border-secondary/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link to="/" className="text-2xl font-bold italic text-secondary">KAYNA</Link>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-2">
              Dashboard Affilié
            </h1>
            <p className="text-secondary/60">Bienvenue dans ton espace affilié KAYNA</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary">{affiliate.total_visits}</p>
              <p className="text-secondary/50 text-sm">Visites</p>
            </div>
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary">{affiliate.total_sales}</p>
              <p className="text-secondary/50 text-sm">Ventes</p>
            </div>
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-accent">{affiliate.total_earnings.toLocaleString()}</p>
              <p className="text-secondary/50 text-sm">FCFA gagnés</p>
            </div>
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-accent" />
                </div>
              </div>
              <p className="text-3xl font-bold text-accent">{affiliate.pending_earnings.toLocaleString()}</p>
              <p className="text-secondary/50 text-sm">FCFA disponibles</p>
            </div>
          </div>

          {/* Affiliate Link */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6 mb-8">
            <h2 className="font-bold text-secondary mb-4">Ton lien d'affiliation</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 bg-secondary/10 rounded-xl px-4 py-3">
                <ExternalLink className="w-5 h-5 text-secondary/40 flex-shrink-0" />
                <span className="text-secondary truncate text-sm">{affiliateLink}</span>
              </div>
              <button 
                onClick={copyLink}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all"
              >
                <Copy className="w-4 h-4" />
                Copier
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-secondary/60 text-sm">Code promo:</span>
              <code className="px-3 py-1.5 bg-accent/20 text-accent font-mono rounded-lg text-sm">
                {affiliate.affiliate_code}
              </code>
              <button onClick={copyCode} className="text-accent hover:underline text-sm">
                Copier
              </button>
            </div>
            <p className="text-secondary/40 text-xs mt-4">
              Commission: {affiliate.commission_rate}% sur chaque vente
            </p>
          </div>

          {/* Withdrawal Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-secondary">Retrait</h2>
                <button
                  onClick={() => setShowWithdrawalModal(true)}
                  disabled={affiliate.pending_earnings <= 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DollarSign className="w-4 h-4" />
                  Demander un retrait
                </button>
              </div>
              <div className="text-center py-8">
                <p className="text-4xl font-bold text-accent mb-2">
                  {affiliate.pending_earnings.toLocaleString()} FCFA
                </p>
                <p className="text-secondary/50">Solde disponible</p>
              </div>
            </div>

            {/* Withdrawal History */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
              <h2 className="font-bold text-secondary mb-4">Historique des retraits</h2>
              {withdrawals.length === 0 ? (
                <p className="text-secondary/50 text-center py-8">Aucun retrait</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 bg-secondary/5 rounded-xl">
                      <div>
                        <p className="font-medium text-secondary">{w.amount.toLocaleString()} FCFA</p>
                        <p className="text-secondary/40 text-xs">
                          {new Date(w.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {w.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                         w.status === 'pending' ? <Clock className="w-3 h-3" /> :
                         <XCircle className="w-3 h-3" />}
                        {w.status === 'approved' ? 'Payé' : w.status === 'pending' ? 'En attente' : 'Refusé'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-secondary mb-4">Demande de retrait</h3>
            <p className="text-secondary/60 text-sm mb-4">
              Solde disponible: <span className="text-accent font-bold">{affiliate.pending_earnings.toLocaleString()} FCFA</span>
            </p>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              placeholder="Montant en FCFA"
              className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent mb-4"
              max={affiliate.pending_earnings}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="flex-1 py-3 border border-secondary/20 text-secondary rounded-xl font-medium hover:bg-secondary/10 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={requestWithdrawal}
                disabled={requestingWithdrawal}
                className="flex-1 py-3 bg-accent text-primary rounded-xl font-bold hover:shadow-gold transition-all disabled:opacity-50"
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
