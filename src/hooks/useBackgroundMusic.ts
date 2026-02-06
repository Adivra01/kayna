import { useState, useEffect, useCallback } from "react";

// KAYNA — La Certitude Inébranlable (BO officielle)
const AMBIENT_MUSIC_URL = "/audio/kayna-bo.mp3";

// Singleton audio element — shared across all hook instances
let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = false;
let globalVolume = 0.15;
let globalError = false;
let fadeInterval: ReturnType<typeof setInterval> | null = null;

const getAudio = () => {
  if (!globalAudio) {
    globalAudio = new Audio(AMBIENT_MUSIC_URL);
    globalAudio.loop = true;
    globalAudio.volume = 0;
    globalAudio.preload = "auto";

    // Track loading errors
    globalAudio.addEventListener("error", () => {
      console.error("Background music: failed to load", AMBIENT_MUSIC_URL);
      globalError = true;
      globalIsPlaying = false;
      notify();
    });

    // Reset error state when audio can play
    globalAudio.addEventListener("canplaythrough", () => {
      globalError = false;
      notify();
    });
  }
  return globalAudio;
};

const fadeIn = (targetVolume: number) => {
  const audio = getAudio();
  audio.volume = 0;
  if (fadeInterval) clearInterval(fadeInterval);

  fadeInterval = setInterval(() => {
    if (audio.volume < targetVolume - 0.01) {
      audio.volume = Math.min(targetVolume, audio.volume + 0.01);
    } else {
      audio.volume = targetVolume;
      if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }
  }, 50);
};

const fadeOutAndPause = (): Promise<void> => {
  return new Promise((resolve) => {
    const audio = getAudio();
    if (fadeInterval) clearInterval(fadeInterval);

    fadeInterval = setInterval(() => {
      if (audio.volume > 0.01) {
        audio.volume = Math.max(0, audio.volume - 0.01);
      } else {
        audio.volume = 0;
        audio.pause();
        if (fadeInterval) {
          clearInterval(fadeInterval);
          fadeInterval = null;
        }
        resolve();
      }
    }, 30);
  });
};

// Listeners for state changes across hook instances
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

const startPlayback = async () => {
  const audio = getAudio();
  if (globalError) {
    // Try reloading the source
    audio.load();
    globalError = false;
    notify();
  }
  try {
    await audio.play();
    fadeIn(globalVolume);
    globalIsPlaying = true;
    globalError = false;
    notify();
  } catch (err) {
    console.warn("Background music play failed:", err);
    globalError = true;
    notify();
  }
};

const stopPlayback = async () => {
  await fadeOutAndPause();
  globalIsPlaying = false;
  notify();
};

// Initialize audio element eagerly so it preloads
if (typeof window !== "undefined") {
  getAudio();
}

export const useBackgroundMusic = () => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const update = () => forceUpdate((n) => n + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const play = useCallback(async () => {
    await startPlayback();
  }, []);

  const pause = useCallback(async () => {
    await stopPlayback();
  }, []);

  const toggle = useCallback(async () => {
    if (globalIsPlaying) {
      await stopPlayback();
    } else {
      await startPlayback();
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    globalVolume = clamped;
    if (globalAudio && globalIsPlaying) {
      globalAudio.volume = clamped;
    }
    notify();
  }, []);

  return {
    isPlaying: globalIsPlaying,
    hasError: globalError,
    volume: globalVolume,
    play,
    pause,
    toggle,
    setVolume,
  };
};
