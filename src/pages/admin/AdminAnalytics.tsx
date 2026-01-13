import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  ShoppingCart, 
  Eye, 
  TrendingUp,
  MapPin,
  Download,
  RefreshCw,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Link2,
} from "lucide-react";
import { showToast } from "@/lib/toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalPageViews: number;
  totalProductViews: number;
  totalAddToCart: number;
  totalPurchases: number;
  countryStats: { country: string; count: number }[];
  cityStats: { city: string; count: number }[];
  deviceStats: { device: string; count: number }[];
  browserStats: { browser: string; count: number }[];
  trafficSourceStats: { source: string; count: number }[];
  affiliateStats: { code: string; visits: number; conversions: number }[];
  recentEvents: { event_type: string; created_at: string; country: string | null; traffic_source: string | null }[];
  conversionRate: number;
  affiliateConversionRate: number;
  directConversionRate: number;
  dailyStats: { date: string; visitors: number; pageViews: number; purchases: number }[];
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'affiliate' | 'direct'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

  const fetchAnalytics = async () => {
    try {
      let query = (supabase as any)
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply date filter
      if (dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        if (dateRange === 'today') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (dateRange === 'week') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: events, error } = await query;

      if (error) throw error;

      // Filter by traffic source
      let filteredEvents = events || [];
      if (filter === 'affiliate') {
        filteredEvents = filteredEvents.filter((e: any) => e.affiliate_code);
      } else if (filter === 'direct') {
        filteredEvents = filteredEvents.filter((e: any) => !e.affiliate_code);
      }

      const today = new Date().toDateString();
      
      // Calculate stats
      const uniqueVisitors = new Set(filteredEvents.map((e: any) => e.visitor_id));
      const todayEvents = filteredEvents.filter((e: any) => new Date(e.created_at).toDateString() === today);
      const todayVisitors = new Set(todayEvents.map((e: any) => e.visitor_id));

      // Daily stats for charts
      const dailyMap: Record<string, { visitors: Set<string>; pageViews: number; purchases: number }> = {};
      filteredEvents.forEach((e: any) => {
        const dateKey = new Date(e.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { visitors: new Set(), pageViews: 0, purchases: 0 };
        }
        if (e.visitor_id) dailyMap[dateKey].visitors.add(e.visitor_id);
        if (e.event_type === 'page_view') dailyMap[dateKey].pageViews++;
        if (e.event_type === 'purchase') dailyMap[dateKey].purchases++;
      });

      const dailyStats = Object.entries(dailyMap)
        .map(([date, stats]) => ({
          date,
          visitors: stats.visitors.size,
          pageViews: stats.pageViews,
          purchases: stats.purchases,
        }))
        .reverse()
        .slice(-14); // Last 14 days

      // Country stats
      const countryCounts: Record<string, number> = {};
      filteredEvents.forEach((e: any) => {
        if (e.country) {
          countryCounts[e.country] = (countryCounts[e.country] || 0) + 1;
        }
      });
      const countryStats = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // City stats
      const cityCounts: Record<string, number> = {};
      filteredEvents.forEach((e: any) => {
        if (e.city) {
          cityCounts[e.city] = (cityCounts[e.city] || 0) + 1;
        }
      });
      const cityStats = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Device stats
      const deviceCounts: Record<string, number> = {};
      filteredEvents.forEach((e: any) => {
        const device = e.device_type || 'unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      const deviceStats = Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count);

      // Browser stats
      const browserCounts: Record<string, number> = {};
      filteredEvents.forEach((e: any) => {
        const browser = e.browser || 'unknown';
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });
      const browserStats = Object.entries(browserCounts)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count);

      // Traffic source stats
      const sourceCounts: Record<string, number> = {};
      filteredEvents.forEach((e: any) => {
        const source = e.traffic_source || 'direct';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });
      const trafficSourceStats = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);

      // Affiliate stats
      const affiliateCounts: Record<string, { visits: number; conversions: number }> = {};
      filteredEvents.forEach((e: any) => {
        if (e.affiliate_code) {
          if (!affiliateCounts[e.affiliate_code]) {
            affiliateCounts[e.affiliate_code] = { visits: 0, conversions: 0 };
          }
          if (e.event_type === 'page_view') {
            affiliateCounts[e.affiliate_code].visits++;
          }
          if (e.event_type === 'purchase') {
            affiliateCounts[e.affiliate_code].conversions++;
          }
        }
      });
      const affiliateStats = Object.entries(affiliateCounts)
        .map(([code, stats]) => ({ code, ...stats }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);

      // Conversion rates
      const totalPurchases = filteredEvents.filter((e: any) => e.event_type === 'purchase').length;
      const affiliateVisits = filteredEvents.filter((e: any) => e.affiliate_code && e.event_type === 'page_view').length;
      const affiliatePurchases = filteredEvents.filter((e: any) => e.affiliate_code && e.event_type === 'purchase').length;
      const directVisits = filteredEvents.filter((e: any) => !e.affiliate_code && e.event_type === 'page_view').length;
      const directPurchases = filteredEvents.filter((e: any) => !e.affiliate_code && e.event_type === 'purchase').length;

      setData({
        totalVisitors: uniqueVisitors.size,
        todayVisitors: todayVisitors.size,
        totalPageViews: filteredEvents.filter((e: any) => e.event_type === "page_view").length,
        totalProductViews: filteredEvents.filter((e: any) => e.event_type === "product_view").length,
        totalAddToCart: filteredEvents.filter((e: any) => e.event_type === "add_to_cart").length,
        totalPurchases,
        countryStats,
        cityStats,
        deviceStats,
        browserStats,
        trafficSourceStats,
        affiliateStats,
        recentEvents: filteredEvents.slice(0, 20),
        conversionRate: uniqueVisitors.size > 0 ? (totalPurchases / uniqueVisitors.size) * 100 : 0,
        affiliateConversionRate: affiliateVisits > 0 ? (affiliatePurchases / affiliateVisits) * 100 : 0,
        directConversionRate: directVisits > 0 ? (directPurchases / directVisits) * 100 : 0,
        dailyStats,
      });
    } catch (error: any) {
      showToast.error("Erreur lors du chargement des analytiques");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [filter, dateRange]);

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
      ["Taux de conversion global", data.conversionRate.toFixed(2) + "%"],
      ["Taux de conversion affiliés", data.affiliateConversionRate.toFixed(2) + "%"],
      ["Taux de conversion direct", data.directConversionRate.toFixed(2) + "%"],
      [""],
      ["Pays", "Visites"],
      ...data.countryStats.map(c => [c.country, c.count]),
      [""],
      ["Source de trafic", "Visites"],
      ...data.trafficSourceStats.map(s => [s.source, s.count]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kayna-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    showToast.success("Export téléchargé");
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    trend,
    suffix = ""
  }: { 
    icon: any; 
    label: string; 
    value: number | string; 
    trend?: string;
    suffix?: string;
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
      <p className="text-3xl font-bold text-secondary mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
      <p className="text-secondary/60 text-sm">{label}</p>
    </div>
  );

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-primary border border-accent/20 rounded-lg px-4 py-3 shadow-lg">
          <p className="text-secondary text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Analytique</h1>
            <p className="text-secondary/60">Vue en temps réel de votre activité</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Date Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-sm focus:outline-none focus:border-accent"
            >
              <option value="all">Tout</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">7 jours</option>
              <option value="month">30 jours</option>
            </select>
            
            {/* Source Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-sm focus:outline-none focus:border-accent"
            >
              <option value="all">Toutes sources</option>
              <option value="affiliate">Affiliés</option>
              <option value="direct">Direct</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-secondary/20 rounded-xl text-secondary/70 hover:bg-secondary/10 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-xl font-medium hover:shadow-gold transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              <StatCard icon={Users} label="Visiteurs total" value={data.totalVisitors} />
              <StatCard icon={Users} label="Aujourd'hui" value={data.todayVisitors} trend="Live" />
              <StatCard icon={Eye} label="Pages vues" value={data.totalPageViews} />
              <StatCard icon={ShoppingCart} label="Ajouts panier" value={data.totalAddToCart} />
              <StatCard icon={TrendingUp} label="Achats" value={data.totalPurchases} />
              <StatCard icon={TrendingUp} label="Conversion" value={data.conversionRate.toFixed(1)} suffix="%" />
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Visitors & Page Views Line Chart */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <h2 className="font-bold text-secondary mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Tendance des visites
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.dailyStats}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(40, 45%, 60%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(40, 45%, 60%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsla(60, 20%, 96%, 0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsla(60, 20%, 96%, 0.5)" 
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsla(60, 20%, 96%, 0.5)" 
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        name="Visiteurs"
                        stroke="hsl(40, 45%, 60%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorVisitors)"
                      />
                      <Line
                        type="monotone"
                        dataKey="pageViews"
                        name="Pages vues"
                        stroke="hsl(60, 20%, 70%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales Bar Chart */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <h2 className="font-bold text-secondary mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-accent" />
                  Ventes par jour
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsla(60, 20%, 96%, 0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsla(60, 20%, 96%, 0.5)" 
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsla(60, 20%, 96%, 0.5)" 
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="purchases"
                        name="Ventes"
                        fill="hsl(40, 45%, 60%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Conversion Comparison */}
            <div className="grid lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Link2 className="w-5 h-5 text-accent" />
                  <h2 className="font-bold text-secondary">Conversion par source</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-accent">{data.affiliateConversionRate.toFixed(1)}%</p>
                    <p className="text-secondary/60 text-sm">Affiliés</p>
                  </div>
                  <div className="bg-secondary/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-secondary">{data.directConversionRate.toFixed(1)}%</p>
                    <p className="text-secondary/60 text-sm">Direct</p>
                  </div>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-accent" />
                  <h2 className="font-bold text-secondary">Sources de trafic</h2>
                </div>
                {data.trafficSourceStats.length === 0 ? (
                  <p className="text-secondary/50 text-center py-4">Aucune donnée</p>
                ) : (
                  <div className="space-y-2">
                    {data.trafficSourceStats.slice(0, 5).map((stat) => (
                      <div key={stat.source} className="flex items-center justify-between">
                        <span className="text-secondary capitalize">{stat.source}</span>
                        <span className="text-secondary/60">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Country Stats */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h2 className="font-bold text-secondary">Pays</h2>
                </div>
                {data.countryStats.length === 0 ? (
                  <p className="text-secondary/50 text-center py-8">Aucune donnée</p>
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

              {/* Device Stats */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Monitor className="w-5 h-5 text-accent" />
                  <h2 className="font-bold text-secondary">Appareils</h2>
                </div>
                {data.deviceStats.length === 0 ? (
                  <p className="text-secondary/50 text-center py-8">Aucune donnée</p>
                ) : (
                  <div className="space-y-4">
                    {data.deviceStats.map((stat) => {
                      const Icon = getDeviceIcon(stat.device);
                      const total = data.deviceStats.reduce((sum, s) => sum + s.count, 0);
                      const percentage = total > 0 ? (stat.count / total) * 100 : 0;
                      
                      return (
                        <div key={stat.device} className="flex items-center gap-4">
                          <Icon className="w-5 h-5 text-secondary/60" />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-secondary capitalize">{stat.device}</span>
                              <span className="text-secondary/60">{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Affiliate Performance */}
              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Link2 className="w-5 h-5 text-accent" />
                  <h2 className="font-bold text-secondary">Top Affiliés</h2>
                </div>
                {data.affiliateStats.length === 0 ? (
                  <p className="text-secondary/50 text-center py-8">Aucune donnée</p>
                ) : (
                  <div className="space-y-3">
                    {data.affiliateStats.slice(0, 5).map((stat, index) => (
                      <div key={stat.code} className="flex items-center justify-between p-3 bg-secondary/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent font-bold">
                            {index + 1}
                          </span>
                          <code className="text-secondary text-sm">{stat.code}</code>
                        </div>
                        <div className="text-right">
                          <p className="text-secondary text-sm">{stat.visits} visites</p>
                          <p className="text-accent text-xs">{stat.conversions} ventes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="font-bold text-secondary">Activité récente</h2>
              </div>
              {data.recentEvents.length === 0 ? (
                <p className="text-secondary/50 text-center py-8">Aucune activité récente</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                  {data.recentEvents.map((event, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          event.event_type === "purchase" ? "bg-green-400" :
                          event.event_type === "add_to_cart" ? "bg-accent" :
                          event.event_type === "product_view" ? "bg-blue-400" :
                          "bg-secondary/30"
                        }`} />
                        <span className="text-sm text-secondary capitalize">
                          {event.event_type.replace("_", " ")}
                        </span>
                        {event.traffic_source === 'affiliate' && (
                          <span className="text-xs px-1.5 py-0.5 bg-accent/20 text-accent rounded">ref</span>
                        )}
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
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
