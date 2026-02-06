// Narration hook - DEPRECATED
// ElevenLabs narration has been replaced by custom background music.
// This hook is kept as a no-op to avoid breaking imports.

export const useNarration = () => {
  return {
    isPlaying: false,
    isLoading: false,
    isLoaded: false,
    error: null as string | null,
    play: async () => {},
    pause: () => {},
    toggle: () => {},
    setVolume: (_v: number) => {},
  };
};
