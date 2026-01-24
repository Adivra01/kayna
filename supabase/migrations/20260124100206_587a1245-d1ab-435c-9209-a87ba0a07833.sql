-- Add columns for dual countdown system (opening & closing)
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS drop_opening_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS drop_closing_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS drop_closing_duration_hours integer DEFAULT 24,
ADD COLUMN IF NOT EXISTS shop_just_opened boolean DEFAULT false;

-- Update lock_message default
UPDATE public.site_settings 
SET lock_message = 'La collection exclusive arrive bientôt. Inscrivez-vous pour être parmi les premiers à découvrir nos pièces.'
WHERE lock_message IS NULL OR lock_message = 'La boutique est actuellement fermée. Inscrivez-vous pour être notifié de la prochaine ouverture.';