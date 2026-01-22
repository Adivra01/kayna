-- Create discount coupons table
CREATE TABLE public.discount_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Discount type and value
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  
  -- Scope: 'all' for site-wide, 'specific' for specific products
  scope TEXT NOT NULL DEFAULT 'all' CHECK (scope IN ('all', 'specific')),
  product_ids UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Usage limits
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  
  -- Validity period
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- Minimum order amount
  min_order_amount NUMERIC DEFAULT 0,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;

-- Admins can manage coupons
CREATE POLICY "Admins can manage coupons"
ON public.discount_coupons FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can read active coupons (for validation)
CREATE POLICY "Everyone can view active coupons"
ON public.discount_coupons FOR SELECT
USING (is_active = true);

-- Index for fast code lookup
CREATE INDEX idx_discount_coupons_code ON public.discount_coupons(code);

-- Trigger for updated_at
CREATE TRIGGER update_discount_coupons_updated_at
BEFORE UPDATE ON public.discount_coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add video_url to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add printful sync fields to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS printful_sync_product_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS printful_variants JSONB DEFAULT '[]'::jsonb;