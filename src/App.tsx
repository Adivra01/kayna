import { Toaster } from "@/components/ui/toaster";
import Profile from "./pages/Profile";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSiteStatus } from "@/hooks/useSiteStatus";
import { LocalizationProvider } from "@/hooks/useLocalization";
import Index from "./pages/Index";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import LockedSite from "./pages/LockedSite";
import Favorites from "./pages/Favorites";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import CartDrawer from "./components/CartDrawer";
import DropCountdownBanner from "./components/DropCountdownBanner";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import AudioControl from "./components/AudioControl";

// Admin pages
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAffiliates from "./pages/admin/AdminAffiliates";
import AdminDrop from "./pages/admin/AdminDrop";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminClients from "./pages/admin/AdminClients";
import AdminCoupons from "./pages/admin/AdminCoupons";

const queryClient = new QueryClient();

function AppContent() {
  const { status, isLoading } = useSiteStatus();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }
  
  // Show locked site if status is locked (except for admin routes)
  const isAdminRoute = window.location.pathname.startsWith("/admin") || window.location.pathname === "/auth";
  
  if (status === "locked" && !isAdminRoute) {
    return <LockedSite />;
  }
  
  return (
    <>
      <DropCountdownBanner />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAnalytics />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/affiliates" element={<AdminAffiliates />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/drop" element={<AdminDrop />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <CartDrawer />
      <AudioControl />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CustomCursor />
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LocalizationProvider>
  </QueryClientProvider>
);

export default App;