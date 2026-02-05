import { useState, useRef, useEffect, useCallback } from "react";

export const useNarration = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const [hasAttempted, setHasAttempted] = useState(false);

  // Load narration on mount
  useEffect(() => {
    const loadNarration = async () => {
      if (isLoaded || isLoading || hasAttempted) return;
      
      setIsLoading(true);
      setError(null);
      setHasAttempted(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-narration`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to load narration: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Create audio from base64
        const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
        audioUrlRef.current = audioUrl;
        
        const audio = new Audio(audioUrl);
        audio.loop = true;
        audio.volume = 0.7;
        audioRef.current = audio;

        // Handle audio events
        audio.onended = () => {
          // Loop is enabled, this shouldn't fire
        };

        audio.onerror = () => {
          setError("Erreur de lecture audio");
          setIsPlaying(false);
        };

        setIsLoaded(true);
        console.log("KAYNA narration loaded successfully");
      } catch (err) {
        // Silently fail - ElevenLabs API may be unavailable
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    // Delay loading to not block initial render
    // Disabled: ElevenLabs API requires valid paid key
    // const timer = setTimeout(loadNarration, 3000);
    // return () => clearTimeout(timer);
    const timer = setTimeout(() => {
      // Only attempt once, don't spam console with errors
      if (!hasAttempted) {
        loadNarration();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoaded, isLoading, hasAttempted]);

  const play = useCallback(async () => {
    if (!audioRef.current || !isLoaded) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing narration:", err);
      setError("Cliquez pour activer le son");
    }
  }, [isLoaded]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    isLoaded,
    error,
    play,
    pause,
    toggle,
    setVolume,
  };
};
