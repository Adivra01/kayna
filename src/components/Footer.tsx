import { Instagram, Mail, ArrowRight } from "lucide-react";
import { SiTiktok, SiX, SiThreads } from "react-icons/si";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-primary pt-20 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-secondary/10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold italic text-secondary mb-4">KAYNA</h2>
            <p className="text-secondary/60 mb-6 max-w-xs">
              Vêtements pour ceux qui refusent l'ordinaire.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/kayna.xxv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@kayna.xxv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <SiTiktok className="w-4 h-4" />
              </a>
              <a href="https://x.com/kayna20xxv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <SiX className="w-4 h-4" />
              </a>
              <a href="https://www.threads.com/@kayna.xxv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <SiThreads className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h3 className="text-secondary font-bold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-secondary/60 hover:text-accent transition-colors">Tous les produits</Link></li>
              <li><Link to="/shop?category=tshirts" className="text-secondary/60 hover:text-accent transition-colors">T-Shirts</Link></li>
              <li><Link to="/shop?category=hoodies" className="text-secondary/60 hover:text-accent transition-colors">Hoodies</Link></li>
              <li><Link to="/shop?category=sweaters" className="text-secondary/60 hover:text-accent transition-colors">Sweaters</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-secondary font-bold mb-4">Infos</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-secondary/60 hover:text-accent transition-colors">Notre histoire</Link></li>
              <li><a href="#" className="text-secondary/60 hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="text-secondary/60 hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="text-secondary/60 hover:text-accent transition-colors">Livraison</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="text-secondary font-bold mb-4">Newsletter</h3>
            <p className="text-secondary/60 mb-4 text-sm">
              Rejoins la communauté KAYNA. Nouveautés et offres exclusives.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-accent">
                <span className="text-xl">✓</span>
                <span className="font-medium">Bienvenue dans la famille KAYNA</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ton email"
                    className="w-full pl-11 pr-4 py-3 bg-secondary/5 border border-secondary/20 rounded-full text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                    required
                  />
                </div>
                <button type="submit" className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-105 transition-all shadow-gold">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-secondary/40 text-sm">
            © 2025 KAYNA. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-secondary/40 hover:text-secondary transition-colors">Mentions légales</a>
            <a href="#" className="text-secondary/40 hover:text-secondary transition-colors">CGV</a>
            <a href="#" className="text-secondary/40 hover:text-secondary transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
