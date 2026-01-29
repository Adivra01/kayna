import { useNarration } from "@/hooks/useNarration";
import { Volume2, VolumeX, Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";

const NarrationControl = () => {
  const { isPlaying, isLoading, isLoaded, error, toggle, play } = useNarration();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Show prompt after narration is loaded
  useEffect(() => {
    if (isLoaded && !hasInteracted) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
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
      {/* Floating Control Button - More prominent */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-500 ${
          isPlaying
            ? "bg-accent text-primary shadow-gold"
            : "bg-primary/90 text-secondary border border-accent/40 backdrop-blur-xl hover:border-accent"
        } hover:scale-105 disabled:opacity-50`}
        aria-label={isPlaying ? "Couper la narration" : "Écouter l'histoire KAYNA"}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Chargement...</span>
          </>
        ) : isPlaying ? (
          <>
            <Volume2 className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">En écoute</span>
            {/* Audio wave animation */}
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-0.5 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              <span className="w-0.5 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
            </div>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">Écouter l'histoire</span>
          </>
        )}
        
        {/* Pulse effect when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20" />
        )}
      </button>

      {/* Prompt to enable sound - More compelling */}
      {showPrompt && !isPlaying && (
        <div 
          className="fixed bottom-20 right-6 z-50 bg-primary/95 backdrop-blur-xl border border-accent/50 rounded-2xl p-5 max-w-[240px] animate-fade-in shadow-gold cursor-pointer hover:border-accent transition-colors"
          onClick={handleClick}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-accent fill-accent" />
            </div>
            <div>
              <p className="text-secondary text-sm font-bold">Écoute l'histoire</p>
              <p className="text-accent text-xs">Expérience immersive</p>
            </div>
          </div>
          <p className="text-secondary/60 text-xs leading-relaxed">
            Découvre KAYNA comme jamais. Une voix, une histoire, une vision.
          </p>
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-primary/95 border-r border-b border-accent/50 rotate-45" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="fixed bottom-20 right-6 z-50 bg-red-500/20 border border-red-500/30 rounded-xl p-3 max-w-[220px]">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
    </>
  );
};

export default NarrationControl;
