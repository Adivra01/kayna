import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// KAYNA Brand Story - Emotional narration script
const KAYNA_STORY = `KAYNA. La certitude inébranlable.

En Songhaï, KAYNA dépasse le langage. C'est un état intérieur. Une décision silencieuse. Un point de non-retour.

La Confiance. La fondation invisible de chaque action.
Le Dépassement. L'état d'esprit de ceux qui refusent les plafonds imposés.
La Persévérance. La seule issue acceptable.

Tu connais cette bataille. Ce n'est pas la difficulté qui épuise. C'est la voix intérieure qui parle de doutes. D'échecs. Du regard des autres.

Mais certains font un choix différent.

KAYNA est née pour ceux qui refusent la fuite. Pour ceux qui transforment le doute en discipline. Ce n'est pas un vêtement que tu portes. C'est une armure mentale.

Porte la certitude. Entre dans le cercle. Construis ton héritage.

Ceci est KAYNA.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    // Use a deep, emotional French voice - Daniel (French male voice)
    const voiceId = "onwK4e9ZLuTAKqWW03F9"; // Daniel - warm, deep voice

    console.log("Generating KAYNA narration...");

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
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.4,
            use_speaker_boost: true,
            speed: 0.85, // Slower for emotional impact
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

    console.log("KAYNA narration generated successfully");

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        duration: "approximately 90 seconds"
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
