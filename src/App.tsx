import { Toaster } from "@/components/ui/toaster";
import Profile from "./pages/Profile";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@/hooks/useLocalization";
import Index from "./pages/Index";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfSale from "./pages/TermsOfSale";
import LegalNotice from "./pages/LegalNotice";
import FAQ from "./pages/FAQ";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import WhyThisPrice from "./pages/WhyThisPrice";
import CartDrawer from "./components/CartDrawer";
import ShopCountdownBanner from "./components/ShopCountdownBanner";
import ShopOpenCelebration from "./components/ShopOpenCelebration";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import AudioControl from "./components/AudioControl";
import NarrationControl from "./components/NarrationControl";

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
  // Site status is now only used by Shop page, not the whole site
  // The site remains accessible, only /shop is locked when status is "locked"
  
  return (
    <>
      <ShopCountdownBanner />
      <ShopOpenCelebration />
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
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfSale />} />
          <Route path="/legal" element={<LegalNotice />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/why-this-price" element={<WhyThisPrice />} />
          
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
      <NarrationControl />
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