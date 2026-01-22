-- Create affiliate_sales table to track commissions on purchases
CREATE TABLE public.affiliate_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  visitor_id TEXT,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 15,
  commission_amount NUMERIC NOT NULL,
  order_total NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;

-- Affiliates can view their own sales
CREATE POLICY "Affiliates can view their own sales" 
ON public.affiliate_sales 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM affiliates 
  WHERE affiliates.id = affiliate_sales.affiliate_id 
  AND affiliates.user_id = auth.uid()
));

-- Admins can manage all sales
CREATE POLICY "Admins can manage affiliate sales" 
ON public.affiliate_sales 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow insert for tracking (needed for edge functions or service role)
CREATE POLICY "Allow insert affiliate sales for tracking" 
ON public.affiliate_sales 
FOR INSERT 
WITH CHECK (true);

-- Function to update affiliate earnings when a sale is recorded
CREATE OR REPLACE FUNCTION public.update_affiliate_earnings_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the affiliate's earnings
  UPDATE public.affiliates 
  SET 
    total_earnings = total_earnings + NEW.commission_amount,
    pending_earnings = pending_earnings + NEW.commission_amount,
    total_sales = total_sales + 1
  WHERE id = NEW.affiliate_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to automatically update earnings when a sale is recorded
CREATE TRIGGER trigger_update_affiliate_earnings
AFTER INSERT ON public.affiliate_sales
FOR EACH ROW
EXECUTE FUNCTION public.update_affiliate_earnings_on_sale();