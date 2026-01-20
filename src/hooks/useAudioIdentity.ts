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
    url: 'https://cdn.pixabay.com/audio/2024/11/29/audio_5db2dfe3fb.mp3',
    routes: ['/'],
  },
  {
    id: 'silent-battle',
    name: 'Silent Battle',
    url: 'https://cdn.pixabay.com/audio/2024/08/11/audio_e67a796d37.mp3',
    routes: ['/shop', '/product'],
  },
  {
    id: 'discipline-mode',
    name: 'Discipline Mode',
    url: 'https://cdn.pixabay.com/audio/2023/10/08/audio_6e5f696901.mp3',
    routes: ['/formation', '/community', '/cercle'],
  },
  {
    id: 'ascension',
    name: 'Ascension',
    url: 'https://cdn.pixabay.com/audio/2024/04/18/audio_5e3c76e06d.mp3',
    routes: ['/checkout', '/success', '/confirmation'],
  },
  {
    id: 'legacy',
    name: 'Legacy',
    url: 'https://cdn.pixabay.com/audio/2024/09/16/audio_e4efec9401.mp3',
    routes: ['/about', '/histoire', '/vision', '/brand'],
  },
];

const STORAGE_KEY = 'kayna-audio-muted';
const VOLUME_KEY = 'kayna-audio-volume';
const DEFAULT_VOLUME = 0.15;

export const useAudioIdentity = () => {
  const location = useLocation();
  
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    try {
      const storedMuted = localStorage.getItem(STORAGE_KEY);
      const storedVolume = localStorage.getItem(VOLUME_KEY);
      
      if (storedMuted !== null) {
        setIsMuted(JSON.parse(storedMuted));
      }
      if (storedVolume !== null) {
        setVolume(parseFloat(storedVolume));
      }
    } catch (e) {
      console.warn('Failed to read audio settings from localStorage');
    }
  }, []);

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
    
    return AUDIO_TRACKS[0];
  }, [location.pathname]);

  // Clear fade interval helper
  const clearFadeInterval = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  // Fade out current audio
  const fadeOut = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!audioRef.current) {
        resolve();
        return;
      }

      const audio = audioRef.current;
      clearFadeInterval();

      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.02) {
          audio.volume = Math.max(0, audio.volume - 0.02);
        } else {
          audio.volume = 0;
          audio.pause();
          clearFadeInterval();
          resolve();
        }
      }, 30);
    });
  }, [clearFadeInterval]);

  // Fade in audio
  const fadeIn = useCallback((targetVolume: number) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0;
    clearFadeInterval();

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < targetVolume - 0.02) {
        audio.volume = Math.min(targetVolume, audio.volume + 0.02);
      } else {
        audio.volume = targetVolume;
        clearFadeInterval();
      }
    }, 30);
  }, [clearFadeInterval]);

  // Play a track
  const playTrack = useCallback(async (track: AudioTrack) => {
    setIsLoading(true);

    await fadeOut();
    
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
      audio.play().then(() => {
        fadeIn(volume);
      }).catch((err) => {
        console.warn('Audio play failed:', err);
        setIsLoading(false);
      });
    };

    const handleError = () => {
      console.warn('Audio load error');
      setIsLoading(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
    audio.addEventListener('error', handleError, { once: true });

    audio.src = track.url;
    audio.load();
  }, [fadeOut, fadeIn, volume]);

  // Effect to handle shouldPlay state changes
  useEffect(() => {
    if (shouldPlay && hasInteracted && !isMuted) {
      const track = getCurrentTrack();
      if (track) {
        playTrack(track);
      }
      setShouldPlay(false);
    }
  }, [shouldPlay, hasInteracted, isMuted, getCurrentTrack, playTrack]);

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
        fadeOut();
      } else {
        setShouldPlay(true);
      }
      
      return newMuted;
    });
  }, [fadeOut]);

  // Persist mute state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isMuted));
    } catch (e) {
      console.warn('Failed to save mute state');
    }
  }, [isMuted]);

  // Handle volume changes
  useEffect(() => {
    try {
      localStorage.setItem(VOLUME_KEY, volume.toString());
    } catch (e) {
      console.warn('Failed to save volume');
    }
    
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFadeInterval();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [clearFadeInterval]);

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
