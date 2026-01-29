import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// KAYNA Brand Story - Motivational narration script (YouTube motivation style)
// Designed with dramatic pauses, powerful phrasing, and emotional crescendo
const KAYNA_STORY = `Écoute-moi bien.

Ce que tu ressens en ce moment... ce doute... cette fatigue... cette voix qui te dit que c'est trop dur...

Je connais cette voix. Nous la connaissons tous.

Mais laisse-moi te dire quelque chose.

KAYNA.

En Songhaï, ce mot dépasse le langage. C'est un état intérieur. Une décision silencieuse. Un point de non-retour.

La Confiance... c'est la fondation invisible de chaque action que tu entreprends.

Le Dépassement... c'est l'état d'esprit de ceux qui refusent les plafonds imposés.

La Persévérance... c'est la seule issue acceptable face à un objectif assumé.

Tu connais cette bataille. Celle qui se mène dans le silence. Celle que personne ne voit.

Ce n'est pas la difficulté du chemin qui t'épuise. C'est la voix intérieure. Celle qui parle de fatigue. De doutes. Du regard des autres. De l'échec passé qui voudrait devenir une excuse.

Mais toi... tu es différent.

Tu fais partie de ceux qui font un choix différent.

KAYNA est née pour toi. Pour ceux qui refusent la fuite. Pour ceux qui transforment le doute en discipline.

Ce que tu portes n'est pas un simple vêtement. C'est une armure mentale. C'est un rappel physique de qui tu es vraiment.

En portant KAYNA, tu ne représentes pas une marque. Tu représentes une intention.

Alors maintenant... écoute bien.

Porte la certitude. Entre dans le cercle. Construis ton héritage.

Ceci est KAYNA. Ta décision. Ton engagement. Ta victoire.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    // Use Laura - French female voice, warm and powerful
    // Alternative voices to try: Sarah (EXAVITQu4vr4xnSDxMaL), Alice (Xb7hH8MSUJpSbSDYk0k2)
    const voiceId = "FGY2WhTYpPnrIDTdsKH5"; // Laura - warm, inspiring female voice

    console.log("Generating KAYNA narration with motivational voice...");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: KAYNA_STORY,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.35, // Lower stability = more expressive, emotional
            similarity_boost: 0.85, // High similarity for consistent voice
            style: 0.75, // Higher style = more dramatic, motivational
            use_speaker_boost: true,
            speed: 0.80, // Slower for dramatic pauses and impact
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = base64Encode(audioBuffer);

    console.log("KAYNA motivational narration generated successfully");

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        duration: "approximately 120 seconds"
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error generating narration:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
