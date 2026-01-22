import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, Phone, ChevronDown, Check, Search, Globe } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { countries } from "@/data/countries";

// Password must be 7-12 chars with uppercase, number, and special char
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,12}$/;

const loginSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide"),
  country: z.string().min(1, "Veuillez sélectionner un pays"),
  password: z.string().regex(passwordRegex, "7-12 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial"),
});

const ClientAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const navigate = useNavigate();

  // Password validation states
  const passwordChecks = useMemo(() => ({
    length: password.length >= 7 && password.length <= 12,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }), [password]);

  const allPasswordChecksPass = Object.values(passwordChecks).every(Boolean);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const search = countrySearch.toLowerCase();
    return countries.filter(c => 
      c.name.toLowerCase().includes(search) || 
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search)
    );
  }, [countrySearch]);

  const selectedCountry = countries.find(c => c.code === country);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Check if admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        if (roleData?.role === "admin") {
          navigate("/admin");
        } else {
          // Client - redirect to home page (shop)
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-country-dropdown]')) {
        setShowCountryDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }
    } else {
      const validation = signupSchema.safeParse({ 
        firstName, 
        lastName, 
        email, 
        phone, 
        country,
        password 
      });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie !");
      } else {
        const fullName = `${firstName} ${lastName}`;
        const countryData = countries.find(c => c.code === country);
        const fullPhone = countryData ? `${countryData.dial} ${phone}` : phone;

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              first_name: firstName,
              last_name: lastName,
              phone: fullPhone,
              country: countryData?.name || country,
            },
          },
        });
        if (signUpError) throw signUpError;

        // Create profile and affiliate for the new user
        if (authData.user) {
          // Create profile
          const { error: profileError } = await supabase.from("profiles").insert({
            user_id: authData.user.id,
            full_name: fullName,
            email: email,
            phone: fullPhone,
          });

          if (profileError && !profileError.message.includes("duplicate")) {
            console.error("Profile creation error:", profileError);
          }

          // Create affiliate automatically (DB trigger will auto-approve and generate code)
          const { error: affiliateError } = await supabase.from("affiliates").insert({
            user_id: authData.user.id,
            full_name: fullName,
            email: email,
            phone: fullPhone,
            commission_rate: 15,
          });

          if (affiliateError && !affiliateError.message.includes("duplicate")) {
            console.error("Affiliate creation error:", affiliateError);
          }
        }

        toast.success("Compte créé avec ton lien d'affiliation ! Connecte-toi.");
        setIsLogin(true);
        resetForm();
      }
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        toast.error("Cet email est déjà utilisé");
      } else if (error.message.includes("Invalid login")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setCountry("");
  };

  const PasswordCheck = ({ valid, label }: { valid: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors ${valid ? 'text-green-500' : 'text-secondary/40'}`}>
      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${valid ? 'bg-green-500 border-green-500' : 'border-secondary/30'}`}>
        {valid && <Check className="w-2 h-2 text-primary" />}
      </div>
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-secondary/60 hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au site</span>
        </Link>

        <div className="bg-secondary/5 border border-secondary/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold italic text-secondary mb-2">KAYNA</h1>
            <p className="text-secondary/60">{isLogin ? "Connexion" : "Créer un compte"}</p>
          </div>

          {/* Toggle only for signup indication */}
          <div className="flex gap-2 p-1 bg-secondary/10 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                isLogin ? "bg-accent text-primary" : "text-secondary/60 hover:text-secondary"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                !isLogin ? "bg-accent text-primary" : "text-secondary/60 hover:text-secondary"
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm"
                        placeholder="Prénom"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Nom</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm"
                        placeholder="Nom"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Country Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Pays</label>
                  <div className="relative" data-country-dropdown>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full flex items-center justify-between pl-4 pr-3 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary focus:outline-none focus:border-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-secondary/40" />
                        <span className={selectedCountry ? "text-secondary" : "text-secondary/40"}>
                          {selectedCountry ? `${selectedCountry.name} (${selectedCountry.dial})` : "Sélectionner un pays"}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-secondary/40 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-primary border border-secondary/20 rounded-xl shadow-2xl overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-secondary/10">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent text-sm"
                              placeholder="Rechercher un pays..."
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        
                        {/* Country list */}
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCountries.length === 0 ? (
                            <div className="p-4 text-center text-secondary/40 text-sm">Aucun pays trouvé</div>
                          ) : (
                            filteredCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setCountry(c.code);
                                  setShowCountryDropdown(false);
                                  setCountrySearch("");
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-secondary/10 transition-colors ${
                                  country === c.code ? 'bg-accent/10 text-accent' : 'text-secondary'
                                }`}
                              >
                                <span className="text-sm">{c.name}</span>
                                <span className="text-xs text-secondary/50">{c.dial}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm"
                      placeholder={selectedCountry ? `Ex: 6 12 34 56 78` : "Numéro de téléphone"}
                      required
                    />
                  </div>
                  {selectedCountry && (
                    <p className="text-xs text-secondary/40 mt-1">Indicatif: {selectedCountry.dial}</p>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm"
                  placeholder="ton@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password requirements (only for signup) */}
              {!isLogin && password.length > 0 && (
                <div className="mt-3 p-3 bg-secondary/5 rounded-lg space-y-2">
                  <PasswordCheck valid={passwordChecks.length} label="7 à 12 caractères" />
                  <PasswordCheck valid={passwordChecks.uppercase} label="1 lettre majuscule" />
                  <PasswordCheck valid={passwordChecks.number} label="1 chiffre" />
                  <PasswordCheck valid={passwordChecks.special} label="1 caractère spécial (!@#$...)" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (!isLogin && !allPasswordChecksPass)}
              className="w-full py-4 bg-accent text-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span>Chargement...</span>
              ) : (
                <>
                  <span>{isLogin ? "Se connecter" : "Créer mon compte"}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-secondary/40 text-sm mt-6">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button onClick={() => { setIsLogin(!isLogin); resetForm(); }} className="text-accent hover:underline">
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </p>

          <div className="mt-6 pt-6 border-t border-secondary/10 text-center">
            <p className="text-secondary/40 text-sm mb-2">Tu es affilié ?</p>
            <Link to="/affiliate/login" className="text-accent hover:underline text-sm font-medium">
              Connexion Affilié →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAuth;
