-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Customer info
  customer_name TEXT NOT NULL,
  
  -- Shipping address
  shipping_address_1 TEXT NOT NULL,
  shipping_address_2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT,
  shipping_country TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  
  -- Order totals
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  
  -- Discount code used
  discount_code TEXT,
  
  -- Affiliate tracking
  affiliate_id UUID REFERENCES public.affiliates(id),
  affiliate_code TEXT,
  
  -- Printful integration
  printful_order_id TEXT,
  printful_status TEXT DEFAULT 'pending',
  printful_shipping_carrier TEXT,
  printful_tracking_number TEXT,
  printful_tracking_url TEXT,
  printful_estimated_delivery TIMESTAMP WITH TIME ZONE,
  
  -- Order status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled', 'refunded', 'failed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  
  -- Product info (snapshot at time of order)
  product_title TEXT NOT NULL,
  product_image TEXT,
  
  -- Variant info
  size TEXT,
  color TEXT,
  
  -- Printful sync
  printful_variant_id TEXT,
  printful_sync_product_id TEXT,
  
  -- Pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order status history for tracking
CREATE TABLE public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  printful_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create printful webhook logs for debugging
CREATE TABLE public.printful_webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printful_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Order items policies
CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND (orders.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
));

CREATE POLICY "Admins can manage order items"
ON public.order_items FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Order status history policies
CREATE POLICY "Users can view their order history"
ON public.order_status_history FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_status_history.order_id 
  AND (orders.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
));

CREATE POLICY "Admins can manage order history"
ON public.order_status_history FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Webhook logs - admin only
CREATE POLICY "Admins can view webhook logs"
ON public.printful_webhook_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert webhook logs"
ON public.printful_webhook_logs FOR INSERT
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_printful_order_id ON public.orders(printful_order_id);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Format: KY-YYYYMMDD-XXXX (e.g., KY-20260122-0042)
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 'KY-[0-9]+-([0-9]+)') AS INTEGER)
  ), 0) + 1
  INTO counter
  FROM public.orders
  WHERE order_number LIKE 'KY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%';
  
  new_number := 'KY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_order_number();

-- Trigger to update updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to log status changes
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status OR OLD.printful_status IS DISTINCT FROM NEW.printful_status THEN
    INSERT INTO public.order_status_history (order_id, status, printful_status, message)
    VALUES (NEW.id, NEW.status, NEW.printful_status, 
      CASE 
        WHEN NEW.status = 'shipped' THEN 'Commande expédiée via ' || COALESCE(NEW.printful_shipping_carrier, 'transporteur')
        WHEN NEW.status = 'delivered' THEN 'Commande livrée'
        WHEN NEW.status = 'canceled' THEN 'Commande annulée'
        ELSE 'Statut mis à jour: ' || NEW.status
      END
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_order_status
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.log_order_status_change();