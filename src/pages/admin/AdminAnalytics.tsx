import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  ShoppingCart, 
  Eye, 
  TrendingUp,
  MapPin,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalPageViews: number;
  totalProductViews: number;
  totalAddToCart: number;
  totalPurchases: number;
  countryStats: { country: string; count: number }[];
  recentEvents: { event_type: string; created_at: string; country: string | null }[];
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      // Get all analytics events
      const { data: events, error } = await supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const today = new Date().toDateString();
      
      // Calculate stats
      const uniqueVisitors = new Set(events?.map(e => e.visitor_id) || []);
      const todayEvents = events?.filter(e => new Date(e.created_at).toDateString() === today) || [];
      const todayVisitors = new Set(todayEvents.map(e => e.visitor_id));

      // Country stats
      const countryCounts: Record<string, number> = {};
      events?.forEach(e => {
        if (e.country) {
          countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;
        }
      });
      const countryStats = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setData({
        totalVisitors: uniqueVisitors.size,
        todayVisitors: todayVisitors.size,
        totalPageViews: events?.filter(e => e.event_type === "page_view").length || 0,
        totalProductViews: events?.filter(e => e.event_type === "product_view").length || 0,
        totalAddToCart: events?.filter(e => e.event_type === "add_to_cart").length || 0,
        totalPurchases: events?.filter(e => e.event_type === "purchase").length || 0,
        countryStats,
        recentEvents: events?.slice(0, 20) || [],
      });
    } catch (error: any) {
      toast.error("Erreur lors du chargement des analytiques");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const handleExport = () => {
    if (!data) return;
    
    const csvContent = [
      ["Métrique", "Valeur"],
      ["Visiteurs totaux", data.totalVisitors],
      ["Visiteurs aujourd'hui", data.todayVisitors],
      ["Pages vues", data.totalPageViews],
      ["Produits consultés", data.totalProductViews],
      ["Ajouts au panier", data.totalAddToCart],
      ["Achats", data.totalPurchases],
      [""],
      ["Pays", "Visites"],
      ...data.countryStats.map(c => [c.country, c.count]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kayna-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast.success("Export téléchargé");
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    trend 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    trend?: string;
  }) => (
    <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        {trend && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-secondary mb-1">{value.toLocaleString()}</p>
      <p className="text-secondary/60 text-sm">{label}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Analytique</h1>
            <p className="text-secondary/60">Vue en temps réel de votre activité</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-secondary/20 rounded-xl text-secondary/70 hover:bg-secondary/10 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Actualiser</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-xl font-medium hover:shadow-gold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : data ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              <StatCard icon={Users} label="Visiteurs total" value={data.totalVisitors} />
              <StatCard icon={Calendar} label="Visiteurs aujourd'hui" value={data.todayVisitors} trend="Live" />
              <StatCard icon={Eye} label="Pages vues" value={data.totalPageViews} />
              <StatCard icon={Eye} label="Produits consultés" value={data.totalProductViews} />
              <StatCard icon={ShoppingCart} label="Ajouts panier" value={data.totalAddToCart} />
              <StatCard icon={TrendingUp} label="Achats" value={data.totalPurchases} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Country Stats */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-secondary">Pays des visiteurs</h2>
                </div>
                {data.countryStats.length === 0 ? (
                  <p className="text-secondary/50 text-center py-8">Aucune donnée disponible</p>
                ) : (
                  <div className="space-y-3">
                    {data.countryStats.map((stat, index) => (
                      <div key={stat.country} className="flex items-center gap-3">
                        <span className="w-6 text-center text-secondary/50 text-sm">{index + 1}</span>
                        <div className="flex-1 h-8 bg-secondary/10 rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-accent/30 flex items-center px-3"
                            style={{ width: `${(stat.count / data.countryStats[0].count) * 100}%` }}
                          >
                            <span className="text-sm text-secondary truncate">{stat.country}</span>
                          </div>
                        </div>
                        <span className="text-secondary/70 text-sm w-12 text-right">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-secondary">Activité récente</h2>
                </div>
                {data.recentEvents.length === 0 ? (
                  <p className="text-secondary/50 text-center py-8">Aucune activité récente</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {data.recentEvents.map((event, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${
                            event.event_type === "purchase" ? "bg-green-400" :
                            event.event_type === "add_to_cart" ? "bg-accent" :
                            "bg-secondary/30"
                          }`} />
                          <span className="text-sm text-secondary capitalize">
                            {event.event_type.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-xs text-secondary/50">
                          {new Date(event.created_at).toLocaleTimeString("fr-FR", { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
