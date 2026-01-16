import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Package, 
  Timer, 
  Settings, 
  LogOut,
  Home,
  Menu,
  X,
  ShoppingBag,
  Users,
  UserCircle
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Analytique", url: "/admin", icon: BarChart3 },
  { title: "Produits", url: "/admin/products", icon: Package },
  { title: "Commandes", url: "/admin/orders", icon: ShoppingBag },
  { title: "Clients", url: "/admin/clients", icon: UserCircle },
  { title: "Affiliés", url: "/admin/affiliates", icon: Users },
  { title: "Drop Time", url: "/admin/drop", icon: Timer },
  { title: "Paramètres", url: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  userEmail?: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (url: string) => {
    if (url === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(url);
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-secondary/10">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold italic text-secondary">KAYNA</span>
          <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full">ADMIN</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.url}
            to={item.url}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.url)
                ? "bg-accent text-primary font-medium"
                : "text-secondary/70 hover:bg-secondary/10 hover:text-secondary"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-secondary/10">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-secondary/50">Connecté en tant que</p>
          <p className="text-sm text-secondary truncate">{userEmail}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-secondary/20 text-secondary/70 hover:bg-secondary/10 transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-secondary/20 text-secondary/70 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-secondary/10 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold italic text-secondary">KAYNA</span>
          <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-bold rounded-full">ADMIN</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute top-14 left-0 bottom-0 w-72 bg-primary border-r border-secondary/10 flex flex-col animate-slide-in-right">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-primary border-r border-secondary/10 flex-col z-40">
        <NavContent />
      </aside>
    </>
  );
}
