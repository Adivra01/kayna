import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  UserCircle,
  Download,
  ShoppingBag,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  source: 'account' | 'guest';
  order_count?: number;
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);

    // Fetch profiles (registered users)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch unique guest emails from orders that don't have a profile
    const { data: orders } = await supabase
      .from('orders')
      .select('email, customer_name, phone, created_at')
      .order('created_at', { ascending: false });

    const profileEmails = new Set((profiles || []).map(p => p.email.toLowerCase()));

    // Build client list from profiles
    const profileClients: Client[] = (profiles || []).map(p => ({
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      phone: p.phone,
      created_at: p.created_at,
      source: 'account' as const,
    }));

    // Add unique guest clients from orders
    const guestEmailsAdded = new Set<string>();
    const guestClients: Client[] = [];

    for (const order of (orders || [])) {
      const email = order.email.toLowerCase();
      if (!profileEmails.has(email) && !guestEmailsAdded.has(email)) {
        guestEmailsAdded.add(email);
        guestClients.push({
          id: `guest-${email}`,
          full_name: order.customer_name,
          email: order.email,
          phone: order.phone,
          created_at: order.created_at,
          source: 'guest',
        });
      }
    }

    // Count orders per email
    const orderCounts: Record<string, number> = {};
    for (const order of (orders || [])) {
      const email = order.email.toLowerCase();
      orderCounts[email] = (orderCounts[email] || 0) + 1;
    }

    const allClients = [...profileClients, ...guestClients].map(c => ({
      ...c,
      order_count: orderCounts[c.email.toLowerCase()] || 0,
    }));

    setClients(allClients);
    setLoading(false);
  };

  const filteredClients = clients.filter(client => 
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  const registeredCount = clients.filter(c => c.source === 'account').length;
  const guestCount = clients.filter(c => c.source === 'guest').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (filteredClients.length === 0) {
      toast.error("Aucun client à exporter");
      return;
    }

    const headers = ['Nom complet', 'Email', 'Téléphone', 'Type', 'Commandes', 'Date'];
    const rows = filteredClients.map(client => [
      client.full_name,
      client.email,
      client.phone || '',
      client.source === 'account' ? 'Inscrit' : 'Invité',
      (client.order_count || 0).toString(),
      formatDate(client.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_kayna_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filteredClients.length} clients exportés !`);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-0">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-secondary">Clients</h1>
              <p className="text-sm md:text-base text-secondary/60">Tous les clients (inscrits + commandes invités)</p>
            </div>
            <div className="flex items-center gap-3 px-3 md:px-4 py-2 bg-accent/20 text-accent rounded-xl w-fit">
              <Users className="w-4 md:w-5 h-4 md:h-5" />
              <span className="font-bold text-sm md:text-base">{clients.length} clients</span>
            </div>
          </div>
          
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-primary rounded-xl font-bold hover:shadow-gold hover:scale-[1.02] transition-all w-full sm:w-auto sm:self-start"
          >
            <Download className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-secondary/40" />
          <Input
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/5 border-secondary/10 text-sm md:text-base"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-secondary">{clients.length}</p>
                <p className="text-secondary/50 text-xs md:text-sm truncate">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-secondary">{registeredCount}</p>
                <p className="text-secondary/50 text-xs md:text-sm truncate">Inscrits</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 md:w-5 h-4 md:h-5 text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-secondary">{guestCount}</p>
                <p className="text-secondary/50 text-xs md:text-sm truncate">Invités</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 md:w-5 h-4 md:h-5 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-secondary">
                  {clients.filter(c => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(c.created_at) > weekAgo;
                  }).length}
                </p>
                <p className="text-secondary/50 text-xs md:text-sm truncate">Cette semaine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-secondary/5 border border-secondary/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <UserCircle className="w-12 md:w-16 h-12 md:h-16 text-secondary/20 mx-auto mb-4" />
              <p className="text-secondary/50 text-sm md:text-base">
                {searchTerm ? 'Aucun client trouvé' : 'Aucun client'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="block md:hidden divide-y divide-secondary/10">
                {filteredClients.map((client) => (
                  <div key={client.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        client.source === 'account' ? 'bg-accent/20' : 'bg-orange-500/20'
                      }`}>
                        <span className={`font-bold ${
                          client.source === 'account' ? 'text-accent' : 'text-orange-400'
                        }`}>
                          {client.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-secondary truncate">{client.full_name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            client.source === 'account' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {client.source === 'account' ? 'Inscrit' : 'Invité'}
                          </span>
                        </div>
                        <p className="text-secondary/50 text-xs">{formatDate(client.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </a>
                      {client.phone ? (
                        <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </a>
                      ) : (
                        <span className="text-secondary/40 flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          Non renseigné
                        </span>
                      )}
                      {(client.order_count || 0) > 0 && (
                        <span className="text-secondary/60 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                          {client.order_count} commande{(client.order_count || 0) > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary/10 bg-secondary/5">
                      <th className="text-left text-secondary/60 font-medium px-4 py-3">Client</th>
                      <th className="text-left text-secondary/60 font-medium px-4 py-3">Email</th>
                      <th className="text-left text-secondary/60 font-medium px-4 py-3">Téléphone</th>
                      <th className="text-left text-secondary/60 font-medium px-4 py-3">Type</th>
                      <th className="text-left text-secondary/60 font-medium px-4 py-3">Commandes</th>
                      <th className="text-left text-secondary/60 font-medium px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              client.source === 'account' ? 'bg-accent/20' : 'bg-orange-500/20'
                            }`}>
                              <span className={`font-bold ${
                                client.source === 'account' ? 'text-accent' : 'text-orange-400'
                              }`}>
                                {client.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-secondary">{client.full_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors">
                            <Mail className="w-4 h-4" />
                            <span>{client.email}</span>
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          {client.phone ? (
                            <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-secondary/70 hover:text-accent transition-colors">
                              <Phone className="w-4 h-4" />
                              <span>{client.phone}</span>
                            </a>
                          ) : (
                            <span className="text-secondary/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            client.source === 'account' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {client.source === 'account' ? 'Inscrit' : 'Invité'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-secondary/60">{client.order_count || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-secondary/60 text-sm">
                            {formatDate(client.created_at)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Security Note */}
        <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-3 md:p-4">
          <p className="text-secondary/50 text-xs md:text-sm">
            🔒 <strong>Sécurité :</strong> Les mots de passe des clients sont chiffrés et ne sont jamais accessibles, même pour les administrateurs.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}