import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  Search, 
  Eye, 
  X,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postal_code: string | null;
  status: string;
  total_amount: number;
  affiliate_code: string | null;
  created_at: string;
}

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'bg-blue-500/20 text-blue-400', icon: CheckCircle },
  shipped: { label: 'Expédiée', color: 'bg-purple-500/20 text-purple-400', icon: Truck },
  delivered: { label: 'Livrée', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await (supabase as any)
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des commandes');
      console.error(error);
    } else {
      setOrders((data || []) as Order[]);
    }
    setLoading(false);
  };

  const fetchOrderDetails = async (orderId: string) => {
    setLoadingDetails(true);
    const { data, error } = await (supabase as any)
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      toast.error('Erreur lors du chargement des détails');
    } else {
      setOrderItems((data || []) as OrderItem[]);
    }
    setLoadingDetails(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await (supabase as any)
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success('Statut mis à jour');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Commandes</h1>
          <p className="text-secondary/60">{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email ou ID..."
              className="w-full pl-12 pr-4 py-3 bg-secondary/5 border border-secondary/10 rounded-xl text-secondary focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-accent text-primary'
                    : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
                }`}
              >
                {status === 'all' ? 'Toutes' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
            <p className="text-secondary/60">
              {searchQuery || statusFilter !== 'all' 
                ? 'Aucune commande trouvée' 
                : 'Aucune commande pour le moment'}
            </p>
          </div>
        ) : (
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-secondary/60">Commande</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-secondary/60">Client</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-secondary/60">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-secondary/60">Statut</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-secondary/60">Total</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {filteredOrders.map((order) => {
                    const StatusIcon = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.icon || Clock;
                    return (
                      <tr key={order.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-secondary font-mono text-sm">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          {order.affiliate_code && (
                            <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                              {order.affiliate_code}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-secondary font-medium">
                              {order.customer_first_name} {order.customer_last_name}
                            </p>
                            <p className="text-secondary/50 text-sm">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-secondary/70 text-sm">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.color || 'bg-secondary/10'}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.label || order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-accent font-bold">
                            {order.total_amount.toLocaleString()} FCFA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary/70 hover:bg-accent hover:text-primary transition-all"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto bg-secondary/5 border border-secondary/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-secondary">
                    Commande #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h2>
                  <p className="text-secondary/60 text-sm mt-1">
                    {formatDate(selectedOrder.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-secondary/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Customer Info */}
                <div className="bg-secondary/5 rounded-2xl p-5">
                  <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" />
                    Client
                  </h3>
                  <div className="space-y-3 text-secondary/80">
                    <p className="font-medium">
                      {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-secondary/40" />
                      {selectedOrder.customer_email}
                    </p>
                    {selectedOrder.customer_phone && (
                      <p className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-secondary/40" />
                        {selectedOrder.customer_phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-secondary/5 rounded-2xl p-5">
                  <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    Livraison
                  </h3>
                  <div className="text-secondary/80 text-sm space-y-1">
                    <p>{selectedOrder.shipping_address}</p>
                    <p>
                      {selectedOrder.shipping_postal_code && `${selectedOrder.shipping_postal_code}, `}
                      {selectedOrder.shipping_city}
                    </p>
                    <p>{selectedOrder.shipping_country}</p>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-8">
                <h3 className="font-bold text-secondary mb-4">Statut de la commande</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => updateOrderStatus(selectedOrder.id, key)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedOrder.status === key
                            ? 'bg-accent text-primary'
                            : 'bg-secondary/10 text-secondary/70 hover:bg-secondary/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-secondary mb-4">Articles</h3>
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-secondary/5 rounded-xl p-4">
                        <div className="w-16 h-16 rounded-lg bg-secondary/10 overflow-hidden flex-shrink-0">
                          {item.product_image && (
                            <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-secondary truncate">{item.product_name}</p>
                          <p className="text-secondary/60 text-sm">
                            Taille: {item.size} • Couleur: {item.color} • Qté: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent">
                            {(item.unit_price * item.quantity).toLocaleString()} FCFA
                          </p>
                          <p className="text-secondary/50 text-sm">
                            {item.unit_price.toLocaleString()} FCFA / unité
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-secondary/10 flex justify-between items-center">
                  <span className="text-lg font-medium text-secondary">Total</span>
                  <span className="text-2xl font-bold text-accent">
                    {selectedOrder.total_amount.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
