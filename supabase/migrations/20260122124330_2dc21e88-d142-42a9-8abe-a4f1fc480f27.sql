-- Create a trigger function to auto-create affiliate when a profile is created
CREATE OR REPLACE FUNCTION public.create_affiliate_on_profile_insert()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if affiliate already exists for this user
  IF NOT EXISTS (SELECT 1 FROM public.affiliates WHERE user_id = NEW.user_id) THEN
    INSERT INTO public.affiliates (user_id, full_name, email, phone, status, commission_rate, affiliate_code)
    VALUES (
      NEW.user_id,
      NEW.full_name,
      NEW.email,
      NEW.phone,
      'approved',
      15,
      public.generate_affiliate_code()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger on profiles table
DROP TRIGGER IF EXISTS trigger_create_affiliate_on_profile ON public.profiles;
CREATE TRIGGER trigger_create_affiliate_on_profile
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_affiliate_on_profile_insert();