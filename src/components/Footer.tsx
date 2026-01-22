import { Instagram, Mail, ArrowRight } from "lucide-react";
import { SiTiktok, SiX, SiThreads } from "react-icons/si";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocalization } from "@/hooks/useLocalization";

const Footer = () => {
  const { t, isRTL } = useLocalization();
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
    <footer className="bg-primary pt-16 sm:pt-20 pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Main Footer */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-16 border-b border-secondary/10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <h2 className="text-2xl sm:text-3xl font-bold italic text-secondary mb-3 sm:mb-4">KAYNA</h2>
            <p className="text-secondary/60 mb-4 sm:mb-6 text-sm sm:text-base max-w-xs">
              {t.hero.subtitle}
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="https://www.instagram.com/kayna.xxv" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@kayna.xxv" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <SiTiktok className="w-4 h-4" />
              </a>
              <a href="https://x.com/kayna20xxv" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-secondary/20 flex items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <SiX className="w-4 h-4" />
              </a>
              <a href="https://www.threads.com/@kayna.xxv" target="_blank" rel="noopener noreferrer" className="hidden sm:flex w-10 h-10 rounded-full border border-secondary/20 items-center justify-center text-secondary/60 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                <SiThreads className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h3 className="text-secondary font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t.nav.shop}</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li><Link to="/shop" className="text-secondary/60 hover:text-accent transition-colors">{t.shop.all}</Link></li>
              <li><Link to="/shop?category=tshirts" className="text-secondary/60 hover:text-accent transition-colors">{t.shop.tshirts}</Link></li>
              <li><Link to="/shop?category=hoodies" className="text-secondary/60 hover:text-accent transition-colors">{t.shop.hoodies}</Link></li>
              <li><Link to="/shop?category=sweaters" className="text-secondary/60 hover:text-accent transition-colors">{t.shop.sweaters}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-secondary font-bold mb-3 sm:mb-4 text-sm sm:text-base">Info</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li><Link to="/about" className="text-secondary/60 hover:text-accent transition-colors">{t.nav.about}</Link></li>
              <li><a href="#" className="text-secondary/60 hover:text-accent transition-colors">{t.footer.contact}</a></li>
              <li><a href="#" className="text-secondary/60 hover:text-accent transition-colors">{t.footer.faq}</a></li>
              <li><a href="#" className="text-secondary/60 hover:text-accent transition-colors">{t.footer.delivery}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-4">
            <h3 className="text-secondary font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t.footer.newsletter}</h3>
            <p className="text-secondary/60 mb-3 sm:mb-4 text-sm">
              {t.hero.subtitle}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-accent text-sm sm:text-base">
                <span className="text-xl">✓</span>
                <span className="font-medium">{t.footer.newsletterSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className={`absolute ${isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.footer.newsletterPlaceholder}
                    className={`w-full ${isRTL ? 'pr-10 sm:pr-11 pl-3 sm:pl-4' : 'pl-10 sm:pl-11 pr-3 sm:pr-4'} py-2.5 sm:py-3 bg-secondary/5 border border-secondary/20 rounded-full text-secondary text-sm placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors`}
                    required
                  />
                </div>
                <button type="submit" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-105 transition-all shadow-gold flex-shrink-0">
                  <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 sm:pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-secondary/40 text-xs sm:text-sm text-center lg:text-left">
            © 2025 KAYNA. {t.footer.allRights}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href="#" className="text-secondary/40 hover:text-secondary transition-colors">{t.footer.legalNotice}</a>
            <a href="#" className="text-secondary/40 hover:text-secondary transition-colors">{t.footer.terms}</a>
            <a href="#" className="text-secondary/40 hover:text-secondary transition-colors">{t.footer.privacy}</a>
            <Link to="/admin/auth" className="text-secondary/40 hover:text-accent transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;