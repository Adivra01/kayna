import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  UserCircle
} from 'lucide-react';

interface Client {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients((data || []) as Client[]);
    }
    setLoading(false);
  };

  const filteredClients = clients.filter(client => 
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary">Clients</h1>
            <p className="text-secondary/60">Gestion des comptes clients</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-accent/20 text-accent rounded-xl">
            <Users className="w-5 h-5" />
            <span className="font-bold">{clients.length} clients</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
          <Input
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/5 border-secondary/10"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{clients.length}</p>
                <p className="text-secondary/50 text-sm">Total clients</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">
                  {clients.filter(c => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(c.created_at) > weekAgo;
                  }).length}
                </p>
                <p className="text-secondary/50 text-sm">Cette semaine</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">
                  {clients.filter(c => c.phone).length}
                </p>
                <p className="text-secondary/50 text-sm">Avec téléphone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-secondary/5 border border-secondary/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-20">
              <UserCircle className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
              <p className="text-secondary/50">
                {searchTerm ? 'Aucun client trouvé' : 'Aucun client inscrit'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-secondary/10 hover:bg-secondary/5">
                    <TableHead className="text-secondary/60">Client</TableHead>
                    <TableHead className="text-secondary/60">Email</TableHead>
                    <TableHead className="text-secondary/60">Téléphone</TableHead>
                    <TableHead className="text-secondary/60">Inscrit le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-secondary/10 hover:bg-secondary/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-accent font-bold">
                              {client.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-secondary">{client.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-secondary/70">
                          <Mail className="w-4 h-4" />
                          <span>{client.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.phone ? (
                          <div className="flex items-center gap-2 text-secondary/70">
                            <Phone className="w-4 h-4" />
                            <span>{client.phone}</span>
                          </div>
                        ) : (
                          <span className="text-secondary/40">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-secondary/60 text-sm">
                          {formatDate(client.created_at)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4">
          <p className="text-secondary/50 text-sm">
            🔒 <strong>Sécurité :</strong> Les mots de passe des clients sont chiffrés et ne sont jamais accessibles, même pour les administrateurs.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
