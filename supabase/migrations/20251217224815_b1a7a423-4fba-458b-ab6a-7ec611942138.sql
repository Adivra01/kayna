-- Enum for site status
CREATE TYPE public.site_status AS ENUM ('open', 'locked', 'maintenance');

-- Site settings table for drop time and lock mode
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_status site_status NOT NULL DEFAULT 'open',
  lock_password TEXT,
  lock_message TEXT DEFAULT 'Le site est actuellement fermé. Inscrivez-vous pour être notifié de la prochaine ouverture.',
  drop_end_time TIMESTAMP WITH TIME ZONE,
  drop_duration_hours INTEGER DEFAULT 24,
  free_shipping_threshold INTEGER DEFAULT 100000,
  cart_timeout_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Analytics tracking table
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'page_view', 'product_view', 'add_to_cart', 'purchase'
  page_url TEXT,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  visitor_id TEXT, -- anonymous visitor tracking
  country TEXT,
  city TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email subscribers (for locked mode)
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin action logs
CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product colors table
CREATE TABLE public.product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  color_name TEXT NOT NULL, -- 'noir', 'blanc', 'beige'
  color_hex TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add color column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT ARRAY['noir', 'blanc', 'beige']::TEXT[];

-- Enable RLS on all new tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Everyone can read site settings" ON public.site_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for analytics_events (insert allowed for everyone, select for admins only)
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON public.analytics_events
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for subscribers
CREATE POLICY "Anyone can subscribe" ON public.subscribers
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.subscribers
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage subscribers" ON public.subscribers
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for admin_logs
CREATE POLICY "Admins can view and create logs" ON public.admin_logs
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for product_colors
CREATE POLICY "Everyone can view product colors" ON public.product_colors
FOR SELECT USING (true);

CREATE POLICY "Admins can manage product colors" ON public.product_colors
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default site settings
INSERT INTO public.site_settings (id, site_status, free_shipping_threshold, cart_timeout_minutes)
VALUES (gen_random_uuid(), 'open', 100000, 10);

-- Create trigger for site_settings updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();