-- Add stock management fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS out_of_stock boolean DEFAULT false;

-- Update existing products to have some default stock
UPDATE public.products SET stock_quantity = 100 WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- Create index for fast out of stock queries
CREATE INDEX IF NOT EXISTS idx_products_out_of_stock ON public.products(out_of_stock);

-- Fix affiliates RLS: Allow service role to insert affiliates on signup
-- First drop existing policy that might block inserts
DROP POLICY IF EXISTS "Users can create their own affiliate application" ON public.affiliates;

-- Create new policy that allows users to insert their own affiliate record
CREATE POLICY "Users can create their own affiliate application" 
ON public.affiliates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also allow users to update their own affiliate data  
DROP POLICY IF EXISTS "Users can update their own affiliate data" ON public.affiliates;
CREATE POLICY "Users can update their own affiliate data" 
ON public.affiliates 
FOR UPDATE 
USING (auth.uid() = user_id);