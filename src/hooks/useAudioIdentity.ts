import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Audio track configurations for KAYNA identity
interface AudioTrack {
  id: string;
  name: string;
  url: string;
  routes: string[];
}

// Using reliable public domain ambient audio
const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'inner-certainty',
    name: 'Inner Certainty',
    url: 'https://cdn.pixabay.com/audio/2024/11/29/audio_5db2dfe3fb.mp3', // Ambient meditation
    routes: ['/'],
  },
  {
    id: 'silent-battle',
    name: 'Silent Battle',
    url: 'https://cdn.pixabay.com/audio/2024/08/11/audio_e67a796d37.mp3', // Dark ambient
    routes: ['/shop', '/product'],
  },
  {
    id: 'discipline-mode',
    name: 'Discipline Mode',
    url: 'https://cdn.pixabay.com/audio/2023/10/08/audio_6e5f696901.mp3', // Focus ambient
    routes: ['/formation', '/community', '/cercle'],
  },
  {
    id: 'ascension',
    name: 'Ascension',
    url: 'https://cdn.pixabay.com/audio/2024/04/18/audio_5e3c76e06d.mp3', // Uplifting ambient
    routes: ['/checkout', '/success', '/confirmation'],
  },
  {
    id: 'legacy',
    name: 'Legacy',
    url: 'https://cdn.pixabay.com/audio/2024/09/16/audio_e4efec9401.mp3', // Cinematic ambient
    routes: ['/about', '/histoire', '/vision', '/brand'],
  },
];

const STORAGE_KEY = 'kayna-audio-muted';
const VOLUME_KEY = 'kayna-audio-volume';
const DEFAULT_VOLUME = 0.15;

export const useAudioIdentity = () => {
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : true; // Start muted by default
  });
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem(VOLUME_KEY);
    return stored ? parseFloat(stored) : DEFAULT_VOLUME;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Fade out current audio
  const fadeOut = useCallback((onComplete?: () => void) => {
    if (!audioRef.current) {
      onComplete?.();
      return;
    }

    const audio = audioRef.current;
    const fadeStep = 0.02;
    const fadeInterval = 30;

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
    
    const fadeStep = 0.02;
    const fadeInterval = 30;

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
    if (!hasInteracted || isMuted) return;

    setIsLoading(true);

    // Fade out current track if playing
    fadeOut(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }

      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.volume = 0;
      audio.preload = 'auto';
      
      audioRef.current = audio;
      setCurrentTrackId(track.id);

      const handleCanPlay = () => {
        setIsLoading(false);
        if (!isMuted && hasInteracted) {
          audio.play().then(() => {
            fadeIn(volume);
          }).catch((err) => {
            console.warn('Audio play failed:', err);
            setIsLoading(false);
          });
        }
      };

      const handleError = (e: Event) => {
        console.warn('Audio load error:', e);
        setIsLoading(false);
      };

      audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
      audio.addEventListener('error', handleError, { once: true });

      // Set source and load
      audio.src = track.url;
      audio.load();
    });
  }, [hasInteracted, isMuted, fadeOut, fadeIn, volume]);

  // Handle route changes
  useEffect(() => {
    const track = getCurrentTrack();
    if (track && track.id !== currentTrackId && hasInteracted && !isMuted) {
      playTrack(track);
    }
  }, [location.pathname, getCurrentTrack, currentTrackId, hasInteracted, isMuted, playTrack]);

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    setHasInteracted(true);
    
    setIsMuted(prev => {
      const newMuted = !prev;
      
      if (newMuted) {
        // Muting - fade out
        fadeOut();
      } else {
        // Unmuting - play current track
        const track = getCurrentTrack();
        if (track) {
          playTrack(track);
        }
      }
      
      return newMuted;
    });
  }, [fadeOut, getCurrentTrack, playTrack]);

  // Persist mute state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isMuted));
  }, [isMuted]);

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
