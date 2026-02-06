import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@/hooks/useLocalization";
import Index from "./pages/Index";
import CartDrawer from "./components/CartDrawer";
import ShopCountdownBanner from "./components/ShopCountdownBanner";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import BackgroundMusicControl from "./components/BackgroundMusicControl";

// Lazy-loaded pages
const About = lazy(() => import("./pages/About"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Profile = lazy(() => import("./pages/Profile"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfSale = lazy(() => import("./pages/TermsOfSale"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const WhyThisPrice = lazy(() => import("./pages/WhyThisPrice"));

// Admin pages (lazy)
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminAffiliates = lazy(() => import("./pages/admin/AdminAffiliates"));
const AdminDrop = lazy(() => import("./pages/admin/AdminDrop"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-primary flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      <span className="text-secondary/40 text-sm tracking-widest uppercase">KAYNA</span>
    </div>
  </div>
);

function AppContent() {
  return (
    <>
      <ShopCountdownBanner />
      <PageTransition>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/admin/content" element={<AdminContent />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <CartDrawer />
      <BackgroundMusicControl />
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
