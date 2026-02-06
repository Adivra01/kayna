
-- Create trainings table
CREATE TABLE public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'GraduationCap',
  url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view active trainings"
ON public.trainings FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage trainings"
ON public.trainings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add training_id to orders
ALTER TABLE public.orders ADD COLUMN training_id UUID REFERENCES public.trainings(id);

-- Trigger for updated_at
CREATE TRIGGER update_trainings_updated_at
BEFORE UPDATE ON public.trainings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial trainings
INSERT INTO public.trainings (name, description, icon, url, is_active) VALUES
('Produits Digitaux & Services', 'Apprends à vendre tes compétences en ligne — créer un produit digital, trouver tes clients, et générer des revenus avec ce que tu sais déjà faire.', 'Rocket', NULL, true),
('Immobilier Locatif en Afrique', 'Découvre comment générer 400 000 FCFA/mois grâce à l''immobilier locatif en Afrique — de la recherche du bien à la mise en location.', 'Building2', NULL, true);
