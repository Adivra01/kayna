import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Search, 
  CheckCircle, 
  XCircle,
  Eye,
  X,
  Clock,
  TrendingUp,
  DollarSign,
  Link as LinkIcon,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface Affiliate {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  affiliate_code: string;
  status: string;
  commission_rate: number;
  total_visits: number;
  total_sales: number;
  total_earnings: number;
  pending_earnings: number;
  created_at: string;
}

interface WithdrawalRequest {
  id: string;
  affiliate_id: string;
  amount: number;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'affiliates' | 'withdrawals'>('affiliates');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);

  useEffect(() => {
    fetchAffiliates();
    fetchWithdrawals();
  }, []);

  const fetchAffiliates = async () => {
    const { data, error } = await (supabase as any)
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement');
    } else {
      setAffiliates((data || []) as Affiliate[]);
    }
    setLoading(false);
  };

  const fetchWithdrawals = async () => {
    const { data, error } = await (supabase as any)
      .from('withdrawal_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setWithdrawals((data || []) as WithdrawalRequest[]);
    }
  };

  const updateAffiliateStatus = async (affiliateId: string, newStatus: string) => {
    const { error } = await (supabase as any)
      .from('affiliates')
      .update({ status: newStatus })
      .eq('id', affiliateId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success(newStatus === 'approved' ? 'Affilié approuvé !' : 'Affilié refusé');
      fetchAffiliates();
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approved' | 'rejected') => {
    if (action === 'rejected' && !rejectionReason.trim()) {
      toast.error('Le motif de refus est obligatoire');
      return;
    }

    const updateData: any = {
      status: action,
      processed_at: new Date().toISOString(),
    };

    if (action === 'rejected') {
      updateData.rejection_reason = rejectionReason;
    }

    const { error } = await (supabase as any)
      .from('withdrawal_requests')
      .update(updateData)
      .eq('id', withdrawalId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success(action === 'approved' ? 'Paiement approuvé' : 'Paiement refusé');
      fetchWithdrawals();
      setShowRejectionModal(null);
      setRejectionReason('');
    }
  };

  const copyAffiliateLink = (code: string) => {
    const link = `${window.location.origin}?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success('Lien copié !');
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = 
      affiliate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (affiliate.affiliate_code || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Affiliés</h1>
          <p className="text-secondary/60">
            {affiliates.filter(a => a.status === 'approved').length} affilié(s) actif(s) • 
            {pendingWithdrawals.length > 0 && (
              <span className="text-accent ml-1">{pendingWithdrawals.length} retrait(s) en attente</span>
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'affiliates'
                ? 'bg-accent text-primary'
                : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Affiliés
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
              activeTab === 'withdrawals'
                ? 'bg-accent text-primary'
                : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
            }`}
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Paiements
            {pendingWithdrawals.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'affiliates' && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, email ou code..."
                  className="w-full pl-12 pr-4 py-3 bg-secondary/5 border border-secondary/10 rounded-xl text-secondary focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-accent text-primary'
                        : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
                    }`}
                  >
                    {status === 'all' ? 'Tous' : status === 'pending' ? 'En attente' : status === 'approved' ? 'Approuvés' : 'Refusés'}
                  </button>
                ))}
              </div>
            </div>

            {/* Affiliates List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
              </div>
            ) : filteredAffiliates.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
                <p className="text-secondary/60">Aucun affilié trouvé</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAffiliates.map((affiliate) => (
                  <div
                    key={affiliate.id}
                    className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-secondary">{affiliate.full_name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            affiliate.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            affiliate.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {affiliate.status === 'approved' ? 'Approuvé' : 
                             affiliate.status === 'pending' ? 'En attente' : 'Refusé'}
                          </span>
                        </div>
                        <p className="text-secondary/60 text-sm">{affiliate.email}</p>
                        {affiliate.affiliate_code && (
                          <div className="flex items-center gap-2 mt-2">
                            <code className="px-2 py-1 bg-accent/20 text-accent text-sm rounded font-mono">
                              {affiliate.affiliate_code}
                            </code>
                            <button 
                              onClick={() => copyAffiliateLink(affiliate.affiliate_code)}
                              className="p-1.5 text-secondary/40 hover:text-accent transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {affiliate.status === 'approved' && (
                        <div className="grid grid-cols-3 gap-4 lg:gap-8">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-secondary">{affiliate.total_visits}</p>
                            <p className="text-secondary/50 text-xs">Visites</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-secondary">{affiliate.total_sales}</p>
                            <p className="text-secondary/50 text-xs">Ventes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-accent">{affiliate.total_earnings.toLocaleString()}</p>
                            <p className="text-secondary/50 text-xs">FCFA gagnés</p>
                          </div>
                        </div>
                      )}

                      {affiliate.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAffiliateStatus(affiliate.id, 'approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl font-medium hover:bg-green-500/30 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approuver
                          </button>
                          <button
                            onClick={() => updateAffiliateStatus(affiliate.id, 'rejected')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            {withdrawals.length === 0 ? (
              <div className="text-center py-20">
                <DollarSign className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
                <p className="text-secondary/60">Aucune demande de retrait</p>
              </div>
            ) : (
              withdrawals.map((withdrawal) => {
                const affiliate = affiliates.find(a => a.id === withdrawal.affiliate_id);
                return (
                  <div
                    key={withdrawal.id}
                    className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-secondary">{affiliate?.full_name || 'Affilié inconnu'}</p>
                        <p className="text-secondary/60 text-sm">{affiliate?.email}</p>
                        <p className="text-secondary/40 text-xs mt-1">
                          {new Date(withdrawal.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">{withdrawal.amount.toLocaleString()} FCFA</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          withdrawal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {withdrawal.status === 'approved' ? 'Payé' : 
                           withdrawal.status === 'pending' ? 'En attente' : 'Refusé'}
                        </span>
                      </div>

                      {withdrawal.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleWithdrawalAction(withdrawal.id, 'approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl font-medium hover:bg-green-500/30 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Payer
                          </button>
                          <button
                            onClick={() => setShowRejectionModal(withdrawal.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            Refuser
                          </button>
                        </div>
                      )}

                      {withdrawal.status === 'rejected' && withdrawal.rejection_reason && (
                        <p className="text-red-400 text-sm italic">
                          Motif: {withdrawal.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-secondary mb-4">Motif du refus</h3>
            <p className="text-secondary/60 text-sm mb-4">
              Veuillez indiquer la raison du refus de ce paiement.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Informations bancaires incorrectes..."
              className="w-full px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent resize-none h-24"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectionModal(null);
                  setRejectionReason('');
                }}
                className="flex-1 py-3 border border-secondary/20 text-secondary rounded-xl font-medium hover:bg-secondary/10 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => handleWithdrawalAction(showRejectionModal, 'rejected')}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
