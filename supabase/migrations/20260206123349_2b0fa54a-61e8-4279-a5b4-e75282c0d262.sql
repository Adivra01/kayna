
-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- Add hashed password column
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS lock_password_hash TEXT;

-- Create function to hash lock password on update
CREATE OR REPLACE FUNCTION public.hash_lock_password()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NEW.lock_password IS NOT NULL AND NEW.lock_password != '' THEN
    NEW.lock_password_hash := crypt(NEW.lock_password, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hash_lock_password_trigger ON public.admin_settings;
CREATE TRIGGER hash_lock_password_trigger
BEFORE INSERT OR UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.hash_lock_password();

-- Create server-side verification function
CREATE OR REPLACE FUNCTION public.verify_lock_password(input_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  stored_hash TEXT;
  stored_plain TEXT;
BEGIN
  IF input_password IS NULL OR length(input_password) = 0 OR length(input_password) > 100 THEN
    RETURN FALSE;
  END IF;

  SELECT lock_password_hash, lock_password 
  INTO stored_hash, stored_plain
  FROM public.admin_settings
  LIMIT 1;
  
  IF stored_hash IS NOT NULL THEN
    RETURN stored_hash = crypt(input_password, stored_hash);
  END IF;
  
  IF stored_plain IS NOT NULL THEN
    RETURN stored_plain = input_password;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Hash existing password
UPDATE public.admin_settings 
SET lock_password_hash = extensions.crypt(lock_password, extensions.gen_salt('bf'))
WHERE lock_password IS NOT NULL AND lock_password != '';
