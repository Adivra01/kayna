
-- Create product_regional_prices table for per-product, per-region pricing
CREATE TABLE public.product_regional_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, region)
);

-- Enable RLS
ALTER TABLE public.product_regional_prices ENABLE ROW LEVEL SECURITY;

-- Everyone can read prices (needed for shop display)
CREATE POLICY "Everyone can view regional prices"
ON public.product_regional_prices
FOR SELECT
USING (true);

-- Only admins can manage prices
CREATE POLICY "Admins can manage regional prices"
ON public.product_regional_prices
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for fast lookups
CREATE INDEX idx_product_regional_prices_product_id ON public.product_regional_prices(product_id);
CREATE INDEX idx_product_regional_prices_region ON public.product_regional_prices(region);

-- Add trigger for updated_at
CREATE TRIGGER update_product_regional_prices_updated_at
BEFORE UPDATE ON public.product_regional_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
