import { useNarration } from "@/hooks/useNarration";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const NarrationControl = () => {
  const { isPlaying, isLoading, isLoaded, error, toggle, play } = useNarration();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Show prompt after narration is loaded
  useEffect(() => {
    if (isLoaded && !hasInteracted) {
      const timer = setTimeout(() => setShowPrompt(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasInteracted]);

  const handleClick = () => {
    setHasInteracted(true);
    setShowPrompt(false);
    toggle();
  };

  // Auto-play after first interaction on the page
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (isLoaded && !hasInteracted) {
        try {
          await play();
          setHasInteracted(true);
          setShowPrompt(false);
        } catch {
          // User hasn't interacted yet, show prompt
        }
      }
    };

    // Try to autoplay on scroll
    const handleScroll = () => {
      if (isLoaded && !hasInteracted) {
        handleFirstInteraction();
      }
    };

    window.addEventListener("scroll", handleScroll, { once: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoaded, hasInteracted, play]);

  if (!isLoaded && !isLoading) return null;

  return (
    <>
      {/* Floating Control Button */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
          isPlaying
            ? "bg-accent text-primary shadow-gold"
            : "bg-primary/80 text-secondary border border-secondary/20 backdrop-blur-xl"
        } hover:scale-110 disabled:opacity-50`}
        aria-label={isPlaying ? "Couper la narration" : "Écouter l'histoire KAYNA"}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
        
        {/* Pulse effect when playing */}
        {isPlaying && (
          <>
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />
            <span className="absolute inset-0 rounded-full bg-accent animate-pulse opacity-20" />
          </>
        )}
      </button>

      {/* Prompt to enable sound */}
      {showPrompt && !isPlaying && (
        <div 
          className="fixed bottom-24 right-6 z-50 bg-primary/95 backdrop-blur-xl border border-accent/30 rounded-2xl p-4 max-w-[200px] animate-fade-in shadow-gold"
          onClick={handleClick}
        >
          <p className="text-secondary text-sm font-medium mb-1">Écoute l'histoire</p>
          <p className="text-secondary/50 text-xs">Clique pour une expérience immersive</p>
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-primary/95 border-r border-b border-accent/30 rotate-45" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="fixed bottom-24 right-6 z-50 bg-red-500/20 border border-red-500/30 rounded-xl p-3 max-w-[200px]">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
    </>
  );
};

export default NarrationControl;
