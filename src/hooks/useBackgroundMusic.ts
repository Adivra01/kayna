import { useState, useRef, useEffect, useCallback } from "react";

const AMBIENT_MUSIC_URL = "https://cdn.pixabay.com/audio/2024/11/29/audio_5db2dfe3fb.mp3";

export const useBackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.15);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    const audio = new Audio(AMBIENT_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fadeIn = useCallback((targetVolume: number) => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.volume = 0;
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < targetVolume - 0.01) {
        audio.volume = Math.min(targetVolume, audio.volume + 0.01);
      } else {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }
    }, 50);
  }, []);

  const fadeOut = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!audioRef.current) {
        resolve();
        return;
      }

      const audio = audioRef.current;
      
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume = Math.max(0, audio.volume - 0.01);
        } else {
          audio.volume = 0;
          audio.pause();
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          resolve();
        }
      }, 30);
    });
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      fadeIn(volume);
      setIsPlaying(true);
    } catch (err) {
      console.warn("Background music autoplay blocked:", err);
    }
  }, [volume, fadeIn]);

  const pause = useCallback(async () => {
    await fadeOut();
    setIsPlaying(false);
  }, [fadeOut]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = clampedVolume;
    }
  }, [isPlaying]);

  return {
    isPlaying,
    volume,
    play,
    pause,
    toggle,
    setVolume,
  };
};
