import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Audio track configurations for KAYNA identity
interface AudioTrack {
  id: string;
  name: string;
  prompt: string;
  duration: number;
  routes: string[];
}

const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'inner-certainty',
    name: 'Inner Certainty',
    prompt: 'Minimalist ambient piano, very slow tempo 60-70 BPM, deep grave piano notes, warm dark atmospheric pad, subtle sub-bass, controlled silence between notes, introspective Drake/Damso instrumental vibe without vocals, luxury fashion brand background music, cinematic calm dominant mastery',
    duration: 45,
    routes: ['/'],
  },
  {
    id: 'silent-battle',
    name: 'Silent Battle',
    prompt: 'Cinematic trap instrumental, muffled soft kick drums, dry sparse percussion, analog texture, constant subtle tension, no climax, inner battle lucidity mood, dark entrepreneur motivation without vocals, 75-80 BPM, minimal and sober',
    duration: 45,
    routes: ['/shop', '/product'],
  },
  {
    id: 'discipline-mode',
    name: 'Discipline Mode',
    prompt: 'Very discrete beat, repetitive hypnotic synth pattern, no dramatic moments, stable focus music, productive solitude vibe, nocturnal entrepreneur atmosphere, 70-75 BPM, ambient electronic minimal, routine effect loop',
    duration: 45,
    routes: ['/formation', '/community', '/cercle'],
  },
  {
    id: 'ascension',
    name: 'Ascension',
    prompt: 'Ethereal aerial strings, slow progression, ascending notes pattern, sense of space and elevation, discrete luxury achievement vibe, victoire silencieuse, 65-70 BPM, cinematic minimal, earned success feeling',
    duration: 45,
    routes: ['/checkout', '/success', '/confirmation'],
  },
  {
    id: 'legacy',
    name: 'Legacy',
    prompt: 'Ultra subtle african percussion, organic natural texture, breath sounds, natural reverb, spiritual modern timeless vibe, heritage transmission feeling, West Africa to world atmosphere, 60-65 BPM, ambient world music minimal',
    duration: 45,
    routes: ['/about', '/histoire', '/vision', '/brand'],
  },
];

const STORAGE_KEY = 'kayna-audio-muted';
const VOLUME_KEY = 'kayna-audio-volume';
const DEFAULT_VOLUME = 0.15; // Very low volume for luxury feel

export const useAudioIdentity = () => {
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem(VOLUME_KEY);
    return stored ? parseFloat(stored) : DEFAULT_VOLUME;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Determine which track to play based on current route
  const getCurrentTrack = useCallback((): AudioTrack | null => {
    const currentPath = location.pathname;
    
    for (const track of AUDIO_TRACKS) {
      for (const route of track.routes) {
        if (route === '/' && currentPath === '/') {
          return track;
        }
        if (route !== '/' && currentPath.startsWith(route)) {
          return track;
        }
      }
    }
    
    // Default to inner-certainty for unmatched routes
    return AUDIO_TRACKS[0];
  }, [location.pathname]);

  // Generate music via edge function
  const generateMusic = useCallback(async (track: AudioTrack): Promise<string | null> => {
    if (audioCache[track.id]) {
      return audioCache[track.id];
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-music`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            prompt: track.prompt,
            duration: track.duration,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to generate music: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.audioContent) {
        const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
        setAudioCache(prev => ({ ...prev, [track.id]: audioUrl }));
        return audioUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error generating music:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [audioCache]);

  // Fade out current audio
  const fadeOut = useCallback((onComplete?: () => void) => {
    if (!audioRef.current) {
      onComplete?.();
      return;
    }

    const audio = audioRef.current;
    const fadeStep = 0.01;
    const fadeInterval = 50;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > fadeStep) {
        audio.volume = Math.max(0, audio.volume - fadeStep);
      } else {
        audio.volume = 0;
        audio.pause();
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        onComplete?.();
      }
    }, fadeInterval);
  }, []);

  // Fade in audio
  const fadeIn = useCallback((targetVolume: number) => {
    if (!audioRef.current || isMuted) return;

    const audio = audioRef.current;
    audio.volume = 0;
    
    const fadeStep = 0.01;
    const fadeInterval = 50;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < targetVolume - fadeStep) {
        audio.volume = Math.min(targetVolume, audio.volume + fadeStep);
      } else {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      }
    }, fadeInterval);
  }, [isMuted]);

  // Play a track
  const playTrack = useCallback(async (track: AudioTrack) => {
    if (!hasInteracted) return;

    const audioUrl = await generateMusic(track);
    
    if (!audioUrl) return;

    fadeOut(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
      setCurrentTrackId(track.id);

      if (!isMuted) {
        audio.play().then(() => {
          fadeIn(volume);
        }).catch(console.error);
      }
    });
  }, [hasInteracted, generateMusic, fadeOut, fadeIn, isMuted, volume]);

  // Handle route changes
  useEffect(() => {
    const track = getCurrentTrack();
    if (track && track.id !== currentTrackId && hasInteracted) {
      playTrack(track);
    }
  }, [location.pathname, getCurrentTrack, currentTrackId, hasInteracted, playTrack]);

  // Handle user interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        const track = getCurrentTrack();
        if (track) {
          playTrack(track);
        }
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted, getCurrentTrack, playTrack]);

  // Handle mute state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isMuted));
    
    if (audioRef.current) {
      if (isMuted) {
        fadeOut();
      } else if (hasInteracted) {
        audioRef.current.play().then(() => {
          fadeIn(volume);
        }).catch(console.error);
      }
    }
  }, [isMuted, fadeOut, fadeIn, hasInteracted, volume]);

  // Handle volume changes
  useEffect(() => {
    localStorage.setItem(VOLUME_KEY, volume.toString());
    
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  return {
    isMuted,
    toggleMute,
    volume,
    updateVolume,
    isLoading,
    currentTrackId,
    hasInteracted,
    currentTrack: AUDIO_TRACKS.find(t => t.id === currentTrackId),
  };
};
