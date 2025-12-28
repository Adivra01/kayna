-- Add full_name column to subscribers table
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Enable realtime for site_settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;