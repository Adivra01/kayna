-- Create CMS content table for storing all editable site content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name text NOT NULL,
  section_name text NOT NULL,
  content_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text', -- 'text', 'rich_text', 'image', 'video'
  content_value text NOT NULL DEFAULT '',
  content_metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_name, section_name, content_key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read site content
CREATE POLICY "Everyone can read site content"
  ON public.site_content FOR SELECT
  USING (true);

-- Only admins can manage site content
CREATE POLICY "Admins can manage site content"
  ON public.site_content FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content for all pages
INSERT INTO public.site_content (page_name, section_name, content_key, content_type, content_value) VALUES
-- Hero Section
('home', 'hero', 'main_title', 'text', 'KAYNA'),
('home', 'hero', 'subtitle', 'text', 'La certitude inébranlable'),
('home', 'hero', 'cta_primary', 'text', 'Découvrir'),
('home', 'hero', 'cta_secondary', 'text', 'Notre Histoire'),
('home', 'hero', 'video_url', 'video', ''),
('home', 'hero', 'value_1', 'text', 'Certitude'),
('home', 'hero', 'value_2', 'text', 'Dépassement'),
('home', 'hero', 'value_3', 'text', 'Persévérance'),

-- Story Section
('home', 'story', 'chapter_1_title', 'text', 'La Philosophie'),
('home', 'story', 'chapter_1_text', 'text', 'KAYNA représente trois forces interconnectées qui définissent notre philosophie: la Confiance absolue en soi, le Dépassement constant de ses limites, et la Persévérance face à l''adversité.'),
('home', 'story', 'chapter_2_title', 'text', 'La Bataille Silencieuse'),
('home', 'story', 'chapter_2_text', 'text', 'Chaque jour est une bataille intérieure. Le doute qui surgit à l''aube, cette voix qui cherche la fuite. KAYNA est né de cette lutte, pour ceux qui choisissent de se battre.'),
('home', 'story', 'chapter_3_title', 'text', 'Le Choix Inébranlable'),
('home', 'story', 'chapter_3_text', 'text', 'Porter KAYNA, c''est faire un choix. Celui de ne jamais abandonner. Chaque vêtement est une ancre mentale, un rappel physique de ton engagement envers toi-même.'),

-- About Section
('home', 'about', 'title', 'text', 'Notre Histoire'),
('home', 'about', 'description', 'text', 'KAYNA est née d''une vision simple : créer des vêtements qui incarnent la force mentale et la persévérance.'),
('home', 'about', 'image', 'image', ''),

-- Collection Section
('home', 'collection', 'title', 'text', 'Ce n''est pas un vêtement que tu portes.'),
('home', 'collection', 'highlight', 'text', 'C''est une armure mentale.'),
('home', 'collection', 'subtitle', 'text', 'Pour ceux qui refusent la fuite. Pour ceux qui transforment le doute en discipline.'),
('home', 'collection', 'cta', 'text', 'Découvrir la Collection'),
('home', 'collection', 'quote', 'text', 'Portez la confiance. Devenez la certitude. Ceci est KAYNA.'),

-- Brand Promise
('home', 'brand_promise', 'title', 'text', 'Prêt à porter ta'),
('home', 'brand_promise', 'highlight', 'text', 'confiance'),
('home', 'brand_promise', 'cta', 'text', 'Découvrir'),
('home', 'brand_promise', 'promise_1', 'text', 'Livraison offerte dès 75€'),
('home', 'brand_promise', 'promise_2', 'text', 'Retours gratuits 30j'),
('home', 'brand_promise', 'promise_3', 'text', 'Paiement sécurisé'),

-- About Page
('about', 'hero', 'title', 'text', 'Notre Histoire'),
('about', 'hero', 'subtitle', 'text', 'Née de la bataille intérieure, forgée pour la victoire.'),

-- Legal Pages
('legal', 'privacy', 'title', 'text', 'Politique de Confidentialité'),
('legal', 'privacy', 'content', 'rich_text', ''),
('legal', 'terms', 'title', 'text', 'Conditions Générales de Vente'),
('legal', 'terms', 'content', 'rich_text', ''),
('legal', 'notice', 'title', 'text', 'Mentions Légales'),
('legal', 'notice', 'content', 'rich_text', ''),

-- FAQ
('faq', 'header', 'title', 'text', 'Questions Fréquentes'),
('faq', 'header', 'subtitle', 'text', 'Tout ce que vous devez savoir sur KAYNA');