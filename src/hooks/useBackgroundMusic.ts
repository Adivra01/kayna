import { useState, useEffect, useCallback } from "react";

// Ambient music URL - Replace with your own hosted MP3 file
// To use your Google Drive file, make it publicly accessible or upload it directly
const AMBIENT_MUSIC_URL = "https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/UPMRtBayPwgGp1Fhxq0qjji2EHiTbpGT7l3MDBFN.mp3";

// Singleton audio element — shared across all hook instances
let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = false;
let globalVolume = 0.15;
let hasAutoPlayed = false;
let fadeInterval: ReturnType<typeof setInterval> | null = null;

const getAudio = () => {
  if (!globalAudio) {
    globalAudio = new Audio(AMBIENT_MUSIC_URL);
    globalAudio.loop = true;
    globalAudio.volume = 0;
    globalAudio.preload = "auto";
    globalAudio.crossOrigin = "anonymous";
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
  try {
    await audio.play();
    fadeIn(globalVolume);
    globalIsPlaying = true;
    hasAutoPlayed = true;
    notify();
  } catch (err) {
    console.warn("Background music autoplay blocked:", err);
  }
};

const stopPlayback = async () => {
  await fadeOutAndPause();
  globalIsPlaying = false;
  notify();
};

// Auto-play on first user interaction (required by all browsers)
if (typeof window !== "undefined") {
  const triggerAutoplay = () => {
    if (!hasAutoPlayed) {
      startPlayback();
    }
    window.removeEventListener("click", triggerAutoplay, true);
    window.removeEventListener("touchstart", triggerAutoplay, true);
    window.removeEventListener("keydown", triggerAutoplay, true);
    window.removeEventListener("scroll", triggerAutoplay, true);
  };

  window.addEventListener("click", triggerAutoplay, { capture: true });
  window.addEventListener("touchstart", triggerAutoplay, { capture: true });
  window.addEventListener("keydown", triggerAutoplay, { capture: true });
  window.addEventListener("scroll", triggerAutoplay, { capture: true });
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
    volume: globalVolume,
    play,
    pause,
    toggle,
    setVolume,
  };
};
