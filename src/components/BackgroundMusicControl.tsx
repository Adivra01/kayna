import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { Music, VolumeX, AlertCircle } from "lucide-react";

const BackgroundMusicControl = () => {
  const { isPlaying, hasError, toggle } = useBackgroundMusic();

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 backdrop-blur-xl ${
        hasError
          ? "bg-red-500/20 text-red-400 border border-red-500/50"
          : isPlaying
            ? "bg-accent/20 text-accent border border-accent/50"
            : "bg-primary/80 text-accent border border-accent/40 hover:border-accent hover:text-accent"
      }`}
      aria-label={isPlaying ? "Couper la musique" : "Activer la musique"}
    >
      {hasError ? (
        <AlertCircle className="w-5 h-5" />
      ) : isPlaying ? (
        <Music className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5 animate-bounce" />
      )}

      {/* Attention-grabbing ring when NOT playing and no error */}
      {!isPlaying && !hasError && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-accent/60 animate-ping" />
          <span className="absolute inset-[-4px] rounded-full border border-accent/30 animate-pulse" />
        </>
      )}

      {/* Subtle pulse when playing */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full border border-accent animate-pulse opacity-40" />
      )}
    </button>
  );
};

export default BackgroundMusicControl;
