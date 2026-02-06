import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { Music, VolumeX } from "lucide-react";

const BackgroundMusicControl = () => {
  const { isPlaying, toggle } = useBackgroundMusic();

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        isPlaying
          ? "bg-accent/20 text-accent border border-accent/50"
          : "bg-primary/80 text-secondary/60 border border-secondary/20 hover:border-accent/50 hover:text-accent"
      } backdrop-blur-xl`}
      aria-label={isPlaying ? "Couper la musique" : "Activer la musique"}
    >
      {isPlaying ? (
        <Music className="w-5 h-5 animate-pulse" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
      
      {isPlaying && (
        <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-30" />
      )}
    </button>
  );
};

export default BackgroundMusicControl;
