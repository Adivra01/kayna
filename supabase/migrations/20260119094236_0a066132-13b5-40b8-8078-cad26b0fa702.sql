-- 1. Create affiliate_trophies table for gamification
CREATE TABLE public.affiliate_trophies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  required_sales INTEGER NOT NULL,
  reward_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_trophies ENABLE ROW LEVEL SECURITY;

-- Anyone can view trophies
CREATE POLICY "Trophies are viewable by everyone" 
ON public.affiliate_trophies 
FOR SELECT 
USING (true);

-- 2. Create affiliate_earned_trophies table
CREATE TABLE public.affiliate_earned_trophies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  trophy_id UUID NOT NULL REFERENCES public.affiliate_trophies(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(affiliate_id, trophy_id)
);

-- Enable RLS
ALTER TABLE public.affiliate_earned_trophies ENABLE ROW LEVEL SECURITY;

-- Affiliates can view their own trophies
CREATE POLICY "Affiliates can view their earned trophies" 
ON public.affiliate_earned_trophies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_earned_trophies.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

-- 3. Create affiliate_product_views table to track products viewed by referred visitors
CREATE TABLE public.affiliate_product_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  visitor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_product_views ENABLE ROW LEVEL SECURITY;

-- Affiliates can view their product views
CREATE POLICY "Affiliates can view their product views" 
ON public.affiliate_product_views 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_product_views.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

-- Allow inserts for tracking
CREATE POLICY "Allow insert product views for tracking" 
ON public.affiliate_product_views 
FOR INSERT 
WITH CHECK (true);

-- 4. Insert default trophies
INSERT INTO public.affiliate_trophies (name, description, icon, required_sales, reward_description) VALUES
('Étoile Montante', 'Premier pas dans l''aventure KAYNA', 'star', 1, '10% de réduction sur ta prochaine commande'),
('Ambassadeur Bronze', '5 ventes réalisées - Tu fais partie de l''élite', 'award', 5, 'T-shirt KAYNA gratuit'),
('Ambassadeur Argent', '15 ventes - Tu inspires la communauté', 'trophy', 15, 'Hoodie KAYNA gratuit + 20% commission'),
('Ambassadeur Or', '30 ventes - Tu es une légende', 'crown', 30, 'Collection complète + 25% commission'),
('Ambassadeur Diamant', '50 ventes - Tu es au sommet', 'gem', 50, 'Voyage + rencontre avec le fondateur + 30% commission');

-- 5. Create function to auto-check and award trophies
CREATE OR REPLACE FUNCTION public.check_and_award_trophies()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trophy_record RECORD;
BEGIN
  -- Check all trophies for this affiliate
  FOR trophy_record IN 
    SELECT t.id, t.required_sales 
    FROM public.affiliate_trophies t
    WHERE NOT EXISTS (
      SELECT 1 FROM public.affiliate_earned_trophies et 
      WHERE et.affiliate_id = NEW.id AND et.trophy_id = t.id
    )
  LOOP
    IF NEW.total_sales >= trophy_record.required_sales THEN
      INSERT INTO public.affiliate_earned_trophies (affiliate_id, trophy_id)
      VALUES (NEW.id, trophy_record.id)
      ON CONFLICT (affiliate_id, trophy_id) DO NOTHING;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- 6. Create trigger to check trophies when sales update
CREATE TRIGGER check_trophies_on_sales_update
AFTER UPDATE OF total_sales ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.check_and_award_trophies();

-- 7. Modify on_affiliate_approved trigger to auto-approve with code
CREATE OR REPLACE FUNCTION public.on_affiliate_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-approve and generate code on creation
  NEW.status := 'approved';
  NEW.affiliate_code := public.generate_affiliate_code();
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_affiliate_approved_trigger ON public.affiliates;

-- Create new trigger for auto-approval on insert
CREATE TRIGGER on_affiliate_created_trigger
BEFORE INSERT ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.on_affiliate_created();