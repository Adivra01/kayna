import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const AffiliateLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in as an approved affiliate
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        if (affiliate?.status === "approved") {
          navigate("/affiliate/dashboard");
        }
      }
    };
    
    checkExistingSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      // First check if this email is registered as an affiliate
      const { data: affiliateCheck } = await supabase
        .from("affiliates")
        .select("id, status, user_id")
        .eq("email", email)
        .maybeSingle();

      if (!affiliateCheck) {
        toast.error("Aucun compte affilié trouvé avec cet email");
        setLoading(false);
        return;
      }

      // Check affiliate status
      if (affiliateCheck.status === "pending") {
        toast.error("Compte en attente de validation. Tu seras notifié par email dès que ta demande sera traitée.");
        setLoading(false);
        return;
      }

      if (affiliateCheck.status === "rejected") {
        toast.error("Ta demande d'affiliation a été refusée.");
        setLoading(false);
        return;
      }

      // Now attempt to login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast.success("Connexion réussie !");
      navigate("/affiliate/dashboard");
    } catch (error: any) {
      if (error.message.includes("Invalid login")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-secondary/60 hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au site</span>
        </Link>

        <div className="bg-secondary/5 border border-secondary/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold italic text-secondary mb-2">KAYNA</h1>
            <p className="text-secondary/60">Espace Affilié</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                  placeholder="ton@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Connexion...</span>
              ) : (
                <>
                  <span>Accéder au dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-secondary/10 text-center space-y-4">
            <div>
              <p className="text-secondary/40 text-sm mb-2">Pas encore affilié ?</p>
              <Link to="/affiliate" className="text-accent hover:underline text-sm font-medium">
                Rejoindre le programme d'affiliation →
              </Link>
            </div>
            
            <div className="pt-4 border-t border-secondary/10">
              <p className="text-secondary/40 text-sm mb-2">Tu es un client ?</p>
              <Link to="/auth" className="text-secondary/60 hover:text-secondary text-sm">
                Connexion Client →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLogin;
