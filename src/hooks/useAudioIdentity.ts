import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Audio track configurations for KAYNA identity
interface AudioTrack {
  id: string;
  name: string;
  url: string; // Static audio URL
  routes: string[];
}

// Using royalty-free ambient music URLs (placeholders - replace with actual hosted files)
const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'inner-certainty',
    name: 'Inner Certainty',
    url: 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3', // Replace with actual ambient track
    routes: ['/'],
  },
  {
    id: 'silent-battle',
    name: 'Silent Battle',
    url: 'https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3', // Replace with actual ambient track
    routes: ['/shop', '/product'],
  },
  {
    id: 'discipline-mode',
    name: 'Discipline Mode',
    url: 'https://assets.mixkit.co/music/preview/mixkit-deep-meditation-109.mp3', // Replace with actual ambient track  
    routes: ['/formation', '/community', '/cercle'],
  },
  {
    id: 'ascension',
    name: 'Ascension',
    url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3', // Replace with actual ambient track
    routes: ['/checkout', '/success', '/confirmation'],
  },
  {
    id: 'legacy',
    name: 'Legacy',
    url: 'https://assets.mixkit.co/music/preview/mixkit-spirit-in-the-woods-139.mp3', // Replace with actual ambient track
    routes: ['/about', '/histoire', '/vision', '/brand'],
  },
];

const STORAGE_KEY = 'kayna-audio-muted';
const VOLUME_KEY = 'kayna-audio-volume';
const DEFAULT_VOLUME = 0.12; // Very low volume for luxury feel

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

    setIsLoading(true);

    fadeOut(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      const audio = new Audio(track.url);
      audio.loop = true;
      audio.volume = 0;
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
      setCurrentTrackId(track.id);

      audio.addEventListener('canplaythrough', () => {
        setIsLoading(false);
        if (!isMuted) {
          audio.play().then(() => {
            fadeIn(volume);
          }).catch(console.error);
        }
      }, { once: true });

      audio.addEventListener('error', () => {
        setIsLoading(false);
        console.error('Audio load error');
      }, { once: true });

      audio.load();
    });
  }, [hasInteracted, fadeOut, fadeIn, isMuted, volume]);

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