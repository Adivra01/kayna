-- Create admin_settings table for sensitive data (password)
-- This keeps sensitive admin data private from public access

CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lock_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view and modify admin_settings
CREATE POLICY "Only admins can view admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update admin settings" 
ON public.admin_settings 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Migrate password from site_settings to admin_settings
INSERT INTO public.admin_settings (lock_password)
SELECT lock_password FROM public.site_settings LIMIT 1;

-- Remove lock_password from site_settings (security fix)
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS lock_password;

-- Trigger for admin_settings updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();