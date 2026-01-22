-- Create trigger to auto-set out_of_stock when quantity reaches 0
CREATE OR REPLACE FUNCTION public.update_out_of_stock_on_quantity_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If stock_quantity is set and reaches 0, auto-set out_of_stock to true
  IF NEW.stock_quantity IS NOT NULL AND NEW.stock_quantity = 0 THEN
    NEW.out_of_stock := true;
  END IF;
  
  -- If stock_quantity increases from 0, auto-set out_of_stock to false (unless manually set)
  IF NEW.stock_quantity IS NOT NULL AND NEW.stock_quantity > 0 AND OLD.stock_quantity = 0 THEN
    NEW.out_of_stock := false;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on products table
DROP TRIGGER IF EXISTS trigger_auto_out_of_stock ON public.products;
CREATE TRIGGER trigger_auto_out_of_stock
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_out_of_stock_on_quantity_change();

-- Make stock_quantity nullable (optional field)
ALTER TABLE public.products ALTER COLUMN stock_quantity DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN stock_quantity SET DEFAULT NULL;