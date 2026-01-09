-- Create affiliates table
CREATE TABLE IF NOT EXISTS public.affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  affiliate_code TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  commission_rate NUMERIC DEFAULT 15,
  total_earnings NUMERIC DEFAULT 0,
  pending_earnings NUMERIC DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate_visits table
CREATE TABLE IF NOT EXISTS public.affiliate_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  page_url TEXT,
  converted BOOLEAN DEFAULT false,
  order_id uuid,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  rejection_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Affiliates policies
CREATE POLICY "Users can view their own affiliate data" ON public.affiliates
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate application" ON public.affiliates
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage affiliates" ON public.affiliates
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Affiliate visits policies
CREATE POLICY "Affiliates can view their own visits" ON public.affiliate_visits
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.affiliates WHERE id = affiliate_id AND user_id = auth.uid())
);

CREATE POLICY "Anyone can create affiliate visits" ON public.affiliate_visits
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage affiliate visits" ON public.affiliate_visits
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Withdrawal requests policies
CREATE POLICY "Affiliates can view their own withdrawals" ON public.withdrawal_requests
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.affiliates WHERE id = affiliate_id AND user_id = auth.uid())
);

CREATE POLICY "Affiliates can create withdrawal requests" ON public.withdrawal_requests
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.affiliates WHERE id = affiliate_id AND user_id = auth.uid() AND status = 'approved')
);

CREATE POLICY "Admins can manage withdrawals" ON public.withdrawal_requests
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add tracking fields to analytics_events
ALTER TABLE public.analytics_events 
ADD COLUMN IF NOT EXISTS affiliate_code TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS age_range TEXT,
ADD COLUMN IF NOT EXISTS traffic_source TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_affiliate_code ON public.analytics_events(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_analytics_traffic_source ON public.analytics_events(traffic_source);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON public.affiliates(status);

-- Function to generate affiliate code
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to auto-generate affiliate code when status changes to approved
CREATE OR REPLACE FUNCTION public.on_affiliate_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    IF NEW.affiliate_code IS NULL THEN
      NEW.affiliate_code := public.generate_affiliate_code();
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS on_affiliate_status_change ON public.affiliates;
CREATE TRIGGER on_affiliate_status_change
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.on_affiliate_approved();

-- Function to update affiliate stats
CREATE OR REPLACE FUNCTION public.update_affiliate_visit_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.affiliate_code IS NOT NULL THEN
    IF NEW.event_type = 'page_view' THEN
      UPDATE public.affiliates 
      SET total_visits = total_visits + 1
      WHERE affiliate_code = NEW.affiliate_code;
    ELSIF NEW.event_type = 'purchase' THEN
      UPDATE public.affiliates 
      SET total_sales = total_sales + 1
      WHERE affiliate_code = NEW.affiliate_code;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS on_analytics_event_affiliate_update ON public.analytics_events;
CREATE TRIGGER on_analytics_event_affiliate_update
AFTER INSERT ON public.analytics_events
FOR EACH ROW
EXECUTE FUNCTION public.update_affiliate_visit_stats();